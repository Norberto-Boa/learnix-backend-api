export default async function () {
  const postgres = (global as any).__POSTGRES_CONTAINER__;

  if (postgres) {
    await postgres.stop();
  }
}
