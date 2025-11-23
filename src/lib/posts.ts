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

/**
 * Determina se um post está pronto para ser exibido (publicado imediatamente ou agenda vencida).
 */
export const isPostReadyToShow = (post: Post, now: Date = new Date()): boolean => {
  const status = post.status ?? "published";
  if (status === "published") return true;
  if (status === "scheduled" && post.scheduledFor) {
    return new Date(post.scheduledFor) <= now;
  }
  return false;
};

/**
 * Retorna metadados de publicação para ser exibido nos cartões de post.
 */
export const getPostPublicationMeta = (post: Post, now: Date = new Date()) => {
  const scheduledDate = post.scheduledFor ? new Date(post.scheduledFor) : null;
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;
  const isScheduledFuture = (post.status === "scheduled" && scheduledDate && scheduledDate > now) || false;
  const isReady = isPostReadyToShow(post, now);
  const effectivePublishedAt = isReady
    ? publishedDate || scheduledDate || new Date(post.createdAt)
    : null;

  return {
    isScheduledFuture,
    isReady,
    scheduledDate,
    effectivePublishedAt,
  };
};
