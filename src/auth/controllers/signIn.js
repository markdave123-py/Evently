import { UserService } from "../../user/service/user.service.js";
import { BadRequestError } from "../../core/errors/badRequestError.js";
import { comparePassword } from "../../core/utils/bcrypt.js";
import { AppMessages } from "../../core/common/appmessages.js";
import { getTokens } from "../services/token.js";
import Auth from "../model/auth.model.js";
import { logger } from "../../core/loggers/logger.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { sanitizeUser } from "../../core/utils/sanitize.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { config } from "../../core/config/env.js";

const refreshTokenExpTime = config.auth.refreshTokenExpTime;

export class AuthController {
  static async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserService.getUserByEmail(email);

      if (!user) {
        throw new BadRequestError(AppMessages.FAILURE.INVALID_CREDENTIALS);
      }

      const isMatch = await comparePassword(password, user.password);


      if (!isMatch) {
        throw new BadRequestError(AppMessages.FAILURE.INVALID_CREDENTIALS);
      }

      const [accessToken, refreshToken] = await getTokens({
        id: user.id,
        email: user.email,
      });

      let RefreshExpireAt = new Date();
      RefreshExpireAt.setSeconds(
        RefreshExpireAt.getSeconds() +
          parseInt(refreshTokenExpTime.slice(0, -1)) * 60
      );

      await Auth.update(
        { refreshToken: refreshToken, refreshTokenExp: RefreshExpireAt },
        { where: { userId: user.id } }
      );

      logger.info(`User ${user.email} signed in successfully`);

      return res.status(HttpStatus.OK).json({
        message: AppMessages.SUCCESS.LOGIN,
        data: {
          user: sanitizeUser(user),
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          :  new InternalServerError(error.message)
      );
    }
  }
}
