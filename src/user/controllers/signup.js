import { UserService } from "../service/user.service.js";
import { ConflictError } from "../../core/errors/conflictError.js";
import { sanitizeUser } from "../../core/utils/sanitize.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import Auth from "../../auth/model/auth.model.js";



export class UserController {
  static async signup(req, res, next) {
    try {

        const user = await UserService.createUser(req.body);


      return res.status(HttpStatus.CREATED).json({
        message: "User created successfully",
        data: sanitizeUser(user),
      });
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new InternalServerError(error.message)
      );
    }
  }

}
