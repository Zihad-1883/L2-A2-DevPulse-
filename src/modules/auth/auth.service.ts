import { pool } from "../../db";

import bcrypt from "bcrypt";
import type { TUser } from "./auth.types";

const createUserIntoDB = async (payload: TUser) => {
  console.log(payload);
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);
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

export const authService = {
  createUserIntoDB,
};

// const createUserIntoDB = async (user: RUser & { password: string }) => {
//   const { name, email, role, password } = user;
//   const hashPassword = await bcrypt.hash(password, 10);

//   const result = await pool.query(
//     `
//     INSERT INTO users (name , email , password , role)
//             VALUES ($1 , $2 , $3 , COALESCE($4 , 'contributor'))
//             RETURNING *
//     `,
//     [name, email, hashPassword, role],
//   );
//   delete result.rows[0].password;
//   return result.rows[0];
// };

// export const authService = {
//   createUserIntoDB,
// };
