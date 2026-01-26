import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { createRouter } from "next-connect";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await migrations(true);
  response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrations(false);
  const responseStatusCode = migratedMigrations.length > 0 ? 201 : 200;
  response.status(responseStatusCode).json(migratedMigrations);
}

async function migrations(dryRun) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOptions = {
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      dryRun,
    };

    const migrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun,
    });

    return migrations;
  } finally {
    await dbClient?.end();
  }
}
