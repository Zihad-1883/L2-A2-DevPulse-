// export type User = {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   role: "contributor" | "maintainer";
//   created_at: Date;
//   updated_at: Date;
// };

// export type RUser = Omit<User, "id" | "created_at" | "updated_at" | "password">;

export type Issue = {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
};
