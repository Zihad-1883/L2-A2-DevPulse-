import { pool } from "../../db";
import bcrypt from "bcrypt";
import type { TCreateUserInput, TJwtPayload, TSafeUser } from "./auth.types";
import jwt from "jsonwebtoken";
import config from "../../config";
import { sendError } from "../../utilities/response";

const createUserIntoDB = async (payload: TCreateUserInput) => {
  //   console.log(payload);
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  //   console.log(hashPassword);
  const result = await pool.query(
    `
    INSERT INTO users (name , email , password , role)
            VALUES ($1 , $2 , $3 , COALESCE($4 , 'contributor'))
            RETURNING *
    `,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken: string; user: TSafeUser }> => {
  const { email, password } = payload;
  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  const user = userData.rows[0];
  //   console.log(user);

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!user || !matchPassword) {
    throw new Error("Invalid Email or Password");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } as TJwtPayload;

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
    expiresIn: "10d",
  });

  delete user.password;

  return { accessToken, refreshToken, user };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized Access");
  }

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as TJwtPayload;

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1   
        `,
    [decoded.email],
  );

  if (userData.rowCount === 0) {
    throw new Error("User not found");
  }

  const user = userData.rows[0];

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } as TJwtPayload;

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "15m",
  });

  return { accessToken };
};

export const authService = {
  createUserIntoDB,
  loginUserIntoDB,
  generateRefreshToken,
};
