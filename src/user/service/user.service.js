import User from "../models/user.model.js";
import { UnProcessableError } from "../../core/errors/unProcessableError.js";
import { ConflictError } from "../../core/errors/conflictError.js";
import { hashPassword } from "../../core/utils/bcrypt.js";
import Auth from "../../auth/model/auth.model.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";

export class UserService {
  static async createUser(user) {
      try {
          const { password, ...rest } = user;
          const hashedPassword = await hashPassword(password);
          const userExists = await this.getUserByEmail(user.email);

          if (userExists) {
              throw new ConflictError("User with email already exists");
          }

          const newUser = await User.create({ password: hashedPassword, ...rest });

          await Auth.create({ userId: newUser.id, email: newUser.email });

          return newUser;
      } catch (error) {
          if (error instanceof ConflictError) {
              throw error;
          } else {
              throw new InternalServerError(error.message);
          }
      }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new UnProcessableError(error.message);
    }
  }
}
