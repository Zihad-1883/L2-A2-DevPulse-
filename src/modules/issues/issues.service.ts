import { pool } from "../../db";
import { sendError } from "../../utilities/response";
import type { TSafeUser } from "../auth/auth.types";
import type { TCreateIssueInput, TIssue, TUpdateIssue } from "./issues.types";

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
      const { id, title, description, type, status, created_at, updated_at } =
        issue;
      return {
        id,
        title,
        description,
        type,
        status,
        reporter: reporterResult.rows[0] ?? null,
        created_at,
        updated_at,
      };
    }),
  );
  return issuesWithReporter;
};

const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id = $1
    `,
    [id],
  );
  if (!issueResult.rows[0]) {
    throw new Error("Issue Not Found");
  }

  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issueResult.rows[0].reporter_id],
  );
  const { title, description, type, status, created_at, updated_at } =
    issueResult.rows[0];
  return {
    id,
    title,
    description,
    type,
    status,
    reporter: reporterResult.rows[0] ?? null,
    created_at,
    updated_at,
  };
};

const updateIssueIntoDB = async (
  id: string,
  payload: TUpdateIssue,
  user: TSafeUser,
) => {
  const { title, description, type } = payload;
  const { role, id: userId } = user;
  // console.log(payload);

  const selectedIssue = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [id],
  );

  if (selectedIssue.rowCount === 0) {
    throw new Error("Issue Not Found");
  }

  const updatedIssue = await pool.query(
    `
    UPDATE issues SET title=$1 , description=$2 , type=$3
    WHERE id=$4 RETURNING *
    `,
    [title, description, type, id],
  );

  if (role === "contributor") {
    if (updatedIssue.rows[0].reporter_id !== userId) {
      throw new Error("You can only update your own issues");
    }
    if (updatedIssue.rows[0].status !== "open") {
      throw new Error("You can only update open issues");
    }
  }
  // console.log(updatedIssue.rows[0])
  return updatedIssue.rows[0];
};

const deleteIssueFromDB = async (id: string) => {
  const selectedIssue = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [id],
  );
  // console.log(selectedIssue.rows[0]);

  if (selectedIssue.rowCount === 0) {
    throw new Error("Issue Not Found");
  }

  const deleteIssue = await pool.query(
    `
    DELETE FROM issues WHERE id=$1
    `,
    [id],
  );

  // console.log(deleteIssue);
  return deleteIssue.rows[0];
};

export const issuesService = {
  createIssueIntoDB,
  getIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
