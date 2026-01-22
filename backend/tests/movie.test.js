const request = require("supertest");
const app = require("../server");

describe("Movies API", () => {
  it("should fetch all movies", async () => {
    const res = await request(app).get("/api/movies");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
