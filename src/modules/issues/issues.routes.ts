import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth.middleware";
import { UserRole } from "../../types";


const router = Router();

router.post("/", auth(), issuesController.createIssues);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.patch("/:id", auth(), issuesController.updateIssue);
router.delete("/:id", auth(UserRole.maintainer) , issuesController.deleteIssue);

export const issueRouter = router;
