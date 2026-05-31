import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utilities/response";
import { issuesService } from "./issues.service";
import type { TSafeUser } from "../auth/auth.types";
import type { TUpdateIssue } from "./issues.types";

const createIssues = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, "Unauthorized", null, 401);
    }
    const issue = await issuesService.createIssueIntoDB(req.body, req.user.id);
    sendSuccess(res, "Issue created successfully", issue, 201);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, error, 400);
    }
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;
    const issues = await issuesService.getIssuesFromDB({
      sort,
      type,
      status,
    } as {
      sort?: string;
      type?: string;
      status?: string;
    });

    return sendSuccess(res, "Issues retrieved successfully", issues, 200);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, error, 400);
    }
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const issue = await issuesService.getSingleIssueFromDB(id as string);
    sendSuccess(res, "Issue retrived successfully", issue, 200);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, error, 400);
    }
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // console.log(req.user);
    const issue = await issuesService.updateIssueIntoDB(
      id as string,
      req.body as TUpdateIssue,
      req.user as TSafeUser,
    );
    // console.log("controller", issue);
    sendSuccess(res, "Issue updated successfully", issue, 200);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, error, 400);
    }
  }
};

export const issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssue,
  updateIssue,
};
