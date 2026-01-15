import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <h1>Dependencies</h1>
      <Database />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAtText =
    !isLoading && data
      ? new Date(data.updated_at).toLocaleString("pt-BR")
      : "Loading";
  return <div>Last update at: {updatedAtText}</div>;
}

function Database() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (!isLoading && data) {
    return (
      <>
        <p>Version: {data.dependencies.database.version}</p>
        <p>Max Connections: {data.dependencies.database.max_connections}</p>
        <p>Open Connections: {data.dependencies.database.open_connections}</p>
      </>
    );
  }

  return "Loading";
}
