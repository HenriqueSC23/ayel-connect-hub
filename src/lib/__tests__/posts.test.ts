import { filterPostsByAdminSelectors, filterPostsForMobileView, getImportantPosts } from "@/lib/posts";
import { Post } from "@/types";
import { describe, expect, it } from "vitest";

const posts: Post[] = [
  {
    id: "1",
    authorId: "admin",
    authorName: "Admin",
    title: "Comunicado geral",
    content: "Para todos",
    roleTarget: "all",
    companyTarget: "all",
    isImportant: true,
    likes: [],
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    authorId: "admin",
    authorName: "Admin",
    title: "Vendas C1",
    content: "Somente vendedores C1",
    roleTarget: "vendedor",
    companyTarget: "c1",
    isImportant: false,
    likes: [],
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    authorId: "admin",
    authorName: "Admin",
    title: "RH C2",
    content: "Somente RH C2",
    roleTarget: "rh",
    companyTarget: "c2",
    isImportant: true,
    likes: [],
    createdAt: "2024-01-03",
  },
];

describe("post helpers", () => {
  it("returns only important posts", () => {
    const important = getImportantPosts(posts);
    expect(important.map((post) => post.id)).toEqual(["1", "3"]);
  });

  it("filters posts with admin selectors", () => {
    const filtered = filterPostsByAdminSelectors(posts, "vendedor", "c1");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("2");
  });

  it("respects mobile filter mode", () => {
    const importantOnly = filterPostsForMobileView(posts, "important");
    expect(importantOnly.map((post) => post.id)).toEqual(["1", "3"]);

    const allPosts = filterPostsForMobileView(posts, "all");
    expect(allPosts).toEqual(posts);
  });
});
