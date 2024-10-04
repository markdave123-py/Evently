import { UserService } from "../src/user/service/user.service.js";
import User from "../src/user/models/user.model.js";
import Auth from "../src/auth/model/auth.model.js";
import { sequelizeConn } from "../src/core/config/database.js";
import { ConflictError } from "../src/core/errors/conflictError.js";

describe("UserService - signup", () => {
  beforeAll(async () => {
    await sequelizeConn.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelizeConn.query("PRAGMA foreign_keys = OFF");
    await sequelizeConn.models.Auth.destroy({
      truncate: true,
    });
    await sequelizeConn.models.User.destroy({
      truncate: true,
    });

    await sequelizeConn.query("PRAGMA foreign_keys = ON");
  });

  it("should create a new user and auth record", async () => {
    const userData = {
      email: "newuser@example.com",
      password: "password123",
    };

    const user = await UserService.createUser(userData);

    expect(user.email).toBe(userData.email);

    expect(user.password).not.toBe(userData.password);

    const authRecord = await Auth.findOne({ where: { userId: user.id } });
    expect(authRecord).not.toBeNull();
    expect(authRecord.email).toBe(userData.email);
  });

});
