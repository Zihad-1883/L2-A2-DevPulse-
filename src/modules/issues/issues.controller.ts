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

export const issuesController = {
  createIssues,
};
