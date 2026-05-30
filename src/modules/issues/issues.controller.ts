import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utilities/response";
import { issuesService } from "./issues.service";

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

export const issuesController = {
  createIssues,
  getAllIssues,
};
