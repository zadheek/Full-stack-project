const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  it("should reject login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "fake@mail.com", password: "123456" });

    expect(res.statusCode).toBe(401);
  });
});
