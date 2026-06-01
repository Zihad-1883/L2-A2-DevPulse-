export const UserRole = {
  maintainer: "maintainer",
  contributor: "contributor",
} as const;

export type TUserRole = "contributor" | "maintainer";
