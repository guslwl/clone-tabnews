import database from "infra/database.js";

async function status(request, response) {
  const queryResult = await database.query("SELECT 1 + 1;");
  console.log(queryResult.rows);
  response.status(200).json({ chave: "em tempo real" });
}

export default status;
