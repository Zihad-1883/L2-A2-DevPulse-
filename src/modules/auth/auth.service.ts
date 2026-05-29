import { pool } from "../../db";
import bcrypt from "bcrypt";
import type { TCreateUserInput } from "./auth.types";
import jwt from "jsonwebtoken";
import { resolve } from "node:dns";
import config from "../../config";

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
}) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  const user = userData.rows[0];
  //   console.log(user);
  if (!user) {
    throw new Error("Invalid Email");
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Password");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "7d",
  });

  return { accessToken };
};

export const authService = {
  createUserIntoDB,
  loginUserIntoDB,
};
