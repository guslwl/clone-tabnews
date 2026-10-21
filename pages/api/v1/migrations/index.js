import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method == "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    response.status(200).json(pendingMigrations);
  }

  if (request.method == "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    const statusCode = migratedMigrations.length > 0 ? 201 : 200;
    response.status(statusCode).json(migratedMigrations);
  }

  return response.status(405);
}

export default migrations;
