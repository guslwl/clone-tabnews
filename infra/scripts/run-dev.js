const { spawn } = require("child_process");

let activeProcess;
let devProcess;
let exiting = false;

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    activeProcess = spawn(command, args, { stdio: "inherit" });

    activeProcess.once("exit", (code, signal) => {
      activeProcess = undefined;

      if (exiting) {
        resolve();
      } else if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Command failed with code ${code ?? 1}${signal ? `, signal ${signal}` : ""}`,
          ),
        );
      }
    });

    activeProcess.once("error", reject);
  });
}

async function runDev() {
  await runCommand("npm", ["run", "services:up"]);
  await runCommand("npm", ["run", "services:wait:database"]);
  await runCommand("npm", ["run", "migrations:up"]);

  devProcess = spawn("next", ["dev"], { stdio: "inherit" });

  devProcess.once("exit", (code, signal) => {
    devProcess = undefined;

    if (!exiting) {
      process.exitCode = code ?? (signal ? 1 : 0);
    }
  });

  devProcess.once("error", (error) => {
    console.error(error);
    process.exit(1);
  });
}

async function stopServices() {
  if (devProcess) {
    devProcess.kill("SIGINT");
  }

  if (activeProcess) {
    activeProcess.kill("SIGINT");
  }

  await runCommand("npm", ["run", "services:stop"]);
}

async function handleExit(exitCode) {
  if (exiting) return;

  exiting = true;
  console.log(`\n\n🔴 ${exitCode} received. Shutting down`);
  console.log("\nStopping Services");

  stopServices()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

process.on("SIGINT", () => {
  handleExit("SIGINT");
});

process.on("SIGTERM", () => {
  handleExit("SIGTERM");
});

runDev().catch((error) => {
  if (!exiting) {
    console.error(error);
    process.exit(1);
  }
});
