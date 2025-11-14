import { CompanyTarget, PostRoleTarget, User } from "@/types";

type TargetedEntity = {
  roleTarget: PostRoleTarget;
  companyTarget: CompanyTarget;
};

export const matchesUserAudience = <T extends TargetedEntity>(item: T, user: User | null): boolean => {
  if (!user) return true;
  if (user.role === "admin" || user.role === "superadmin") return true;

  const matchesRole = item.roleTarget === "all" || item.roleTarget === user.category;
  const matchesCompany =
    item.companyTarget === "all" || (user.companyId ? item.companyTarget === user.companyId : false);

  return matchesRole && matchesCompany;
};

export const filterItemsForUser = <T extends TargetedEntity>(items: T[], user: User | null): T[] => {
  if (!user || user.role === "admin" || user.role === "superadmin") {
    return items;
  }
  return items.filter((item) => matchesUserAudience(item, user));
};

export const filterBySelectors = <T extends TargetedEntity>(
  items: T[],
  roleFilter: PostRoleTarget,
  companyFilter: CompanyTarget,
): T[] => {
  return items.filter(
    (item) =>
      (roleFilter === "all" || item.roleTarget === roleFilter) &&
      (companyFilter === "all" || item.companyTarget === companyFilter),
  );
};
