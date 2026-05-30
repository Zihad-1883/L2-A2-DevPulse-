import { pool } from "../../db";
import type { TCreateIssueInput } from "./issues.types";

const createIssueIntoDB = async (
  payload: TCreateIssueInput,
  reporter_id: number,
) => {
  const { title, description, type } = payload;
  if (type === "bug" || type === "feature_request") {
    throw new Error("Incorrect Issue Type");
  }
  const result = await pool.query(
    `
        INSERT INTO issues (title , description , type , reporter_id )
                VALUES ($1 , $2 , $3 , $4)
                RETURNING *
        `,
    [title, description, type, reporter_id],
  );
  return result.rows[0];
};

export const issuesService = {
  createIssueIntoDB,
};
