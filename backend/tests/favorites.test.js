const request = require("supertest");
const app = require("../server");

describe("Favorites API", () => {
  it("should block adding favorite without auth", async () => {
    const res = await request(app)
      .post("/api/favorites")
      .send({ movieId: "123" });

    expect(res.statusCode).toBe(401);
  });
});
