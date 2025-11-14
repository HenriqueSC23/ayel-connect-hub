import { Post, CompanyTarget, PostRoleTarget } from "@/types";
import { filterBySelectors } from "./audience";

export const getImportantPosts = (posts: Post[]): Post[] => posts.filter((post) => post.isImportant);

export const filterPostsByAdminSelectors = (
  posts: Post[],
  roleFilter: PostRoleTarget,
  companyFilter: CompanyTarget,
): Post[] => filterBySelectors(posts, roleFilter, companyFilter);

export const filterPostsForMobileView = (posts: Post[], mode: "all" | "important"): Post[] => {
  if (mode === "important") {
    return getImportantPosts(posts);
  }
  return posts;
};
