export type TIssue = {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
};

export type TCreateIssueInput = Omit<
  TIssue,
  "id" | "status" | "created_at" | "updated_at"
>;




