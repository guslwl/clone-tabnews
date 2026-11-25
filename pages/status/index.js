import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />

      <h2>Dependencies</h2>
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText =
    isLoading && !data
      ? "loading..."
      : new Date(data.updated_at).toLocaleString("pt-BR");

  return <div> Last Update: {updatedAtText} </div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const databaseVersionText = isLoading
    ? ""
    : data.dependencies.database.version;

  const databaseMaxConnectionsText = isLoading
    ? ""
    : data.dependencies.database.max_connections;

  const databaseOpenedConnectionsText = isLoading
    ? ""
    : data.dependencies.database.opened_connections;

  return (
    <div>
      <h3> Database </h3>
      <ul>
        <li>Version: {databaseVersionText} </li>
        <li>Max Connections: {databaseMaxConnectionsText} </li>
        <li>Opened Connections: {databaseOpenedConnectionsText}</li>
      </ul>
    </div>
  );
}
