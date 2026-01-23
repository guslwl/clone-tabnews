import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const postgresVersionResult = await database.query("SHOW server_version;");
    const postgresVersionValue =
      postgresVersionResult.rows.at(0).server_version;

    const postgresMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const postgresMaxConnectionsValue = parseInt(
      postgresMaxConnectionsResult.rows[0].max_connections,
    );

    const databaseName = process.env.POSTGRES_DB;
    const postgresOpenConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
      values: [databaseName],
    });

    const postgresOpenConnectionsValue =
      postgresOpenConnectionsResult.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: postgresVersionValue,
          max_connections: postgresMaxConnectionsValue,
          open_connections: postgresOpenConnectionsValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Error inside controller catch");
    console.error(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}

export default status;
