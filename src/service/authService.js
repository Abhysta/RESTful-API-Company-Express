import dotenv from "dotenv/config";
import {
  loginValidation,
  registrationValidation,
} from "../validation/authValidation.js";
import { validates } from "../validation/validation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../database/prisma.js";
import { ResponseError } from "../error/responseError.js";
import { v4 as uuidv4 } from "uuid";

const registrationModel = async (req) => {
  const user = validates(registrationValidation, req);

  const findUser = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });

  if (findUser) {
    throw new ResponseError("User already exists", 409);
  }

  // const findAll = await prisma.user.count();
  // const id = (findAll + 1).toString();

  const id = uuidv4();

  user.password = await bcrypt.hash(user.password, 10);
  return await prisma.user.create({
    data: {
      id: id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

const loginModel = async (req) => {
  const user = validates(loginValidation, req);
  const findUser = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!findUser) {
    throw new ResponseError("User not found", 404);
  }

  const password = await bcrypt.compare(user.password, findUser.password);
  if (!password) {
    throw new ResponseError("username or password incorrect", 401);
  } else {
  }
  const token = jwt.sign(findUser, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(findUser, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return {
    data: {
      id: findUser.id,
      email: findUser.email,
      name: findUser.name,
    },
    token,
    refreshToken,
  };
};

const refreshToken = async (req) => {
  let refreshToken = req;

  if (!refreshToken) {
    throw new ResponseError("Refresh token not found", 401);
  }

  const result = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        throw new ResponseError("Unauthorized", 401);
      } else {
        return user;
      }
    }
  );

  const newAccessToken = jwt.sign(
    { id: result.id, name: result.name, email: result.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  const newRefreshToken = jwt.sign(
    { id: result.id, name: result.name, email: result.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = (req) => {};

export default { registrationModel, loginModel, refreshToken, logout };
