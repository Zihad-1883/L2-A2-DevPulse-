export type TUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
  created_at: Date;
  updated_at: Date;
};

export type TCreateUserInput = Omit<
  TUser,
  "id" | "created_at" | "updated_at" | "password"
>;

export type TSafeUser = Omit<TUser, "password">;
