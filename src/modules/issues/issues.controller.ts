import type { Request, Response } from "express";
import { sendError } from "../../utilities/response";

const createIssues = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, error, 400);
    }
  }
};


export const issuesController = {
    createIssues
}