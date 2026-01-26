import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("PUT /api/v1/migrations", () => {
  describe("Anonymous User", () => {
    test("Sending an unauthorized method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "PUT",
      });

      const responseBody = await response.json();

      expect(response.status).toBe(405);
      expect(responseBody.status_code).toBe(405);
      expect(responseBody).toEqual({
        message: "Method not allowed for this endpoint",
        name: "MethodNotAllowedError",
        action: "Make sure the HTTP method sent is valid for this endpoint",
        status_code: 405,
      });
    });
  });
});
