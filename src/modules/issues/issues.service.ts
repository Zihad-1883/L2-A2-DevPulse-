import { pool } from "../../db";
import type { TCreateIssueInput, TIssue } from "./issues.types";

const createIssueIntoDB = async (
  payload: TCreateIssueInput,
  reporter_id: number,
) => {
  const { title, description, type } = payload;
  // console.log(payload);
  if (type !== "bug" && type !== "feature_request") {
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

const getIssuesFromDB = async (query: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  const { sort, type, status } = query;

  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const order = sort === "oldest" ? "ASC" : "DESC";

  const issuesResult = await pool.query<TIssue>(
    `
    SELECT * FROM issues ${where} ORDER BY created_at ${order}`,
    values,
  );

  const issues = issuesResult.rows;
  if (issues.length === 0) return [];

  const issuesWithReporter = await Promise.all(
    issues.map(async (issue) => {
      const reporterResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id],
      );
      const { reporter_id, ...rest } = issue;
      return {
        ...rest,
        reporter: reporterResult.rows[0] ?? null,
      };
    }),
  );
  return issuesWithReporter;
};

export const issuesService = {
  createIssueIntoDB,
  getIssuesFromDB,
};
