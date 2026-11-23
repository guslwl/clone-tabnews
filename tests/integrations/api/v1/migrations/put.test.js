import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("PUT /api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Makes a request with a non allowed method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "PUT",
      });

      expect(response.status).toBe(405);
    });
  });
});
