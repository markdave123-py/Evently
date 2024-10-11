import jwt from "jsonwebtoken";
import { config } from "../../core/config/env.js";
import { encrypt, decrypt } from "../../auth/services/encryptor.js";
import { logger } from "../../core/loggers/logger.js";
import { UnAuthorizedError } from "../../core/errors/unAuthorizedError.js";
import { AppMessages } from "../../core/common/appmessages.js";


const generateToken = ({ data, secret, expiresIn }) => {
  return jwt.sign(data, secret, { expiresIn });
};


const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.error("token expired");
      throw new UnAuthorizedError(AppMessages.FAILURE.TOKEN_EXPIRED);
    } else {
      logger.error(error);
      throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED);
    }
  }
};


const getTokens = async (data) => {
  return await Promise.all([
    generateAccessToken(data),
    generateRefreshToken(data),
  ]);
};


const generateAccessToken = (data) => {
  const { accessTokenExpTime, accessTokenSecret } = config.auth;
  const accessToken = generateToken({
    data,
    secret: accessTokenSecret,
    expiresIn: accessTokenExpTime,
  });
  return encrypt(accessToken);
};


const generateRefreshToken = (data) => {
  const { refreshTokenExpTime, refreshTokenSecret } = config.auth;
  const refreshToken = generateToken({
    data,
    secret: refreshTokenSecret,
    expiresIn: refreshTokenExpTime,
  });
  return encrypt(refreshToken);
};


const extractTokenDetails = async (encryptedToken, secret) => {
  const token = decrypt(encryptedToken);
  const tokenDetails = verifyToken(token, secret);
  return tokenDetails;
};



export { getTokens, extractTokenDetails };
