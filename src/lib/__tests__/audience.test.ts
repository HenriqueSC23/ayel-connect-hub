import { filterBySelectors, filterItemsForUser } from "@/lib/audience";
import { CompanyTarget, PostRoleTarget, User } from "@/types";
import { describe, expect, it } from "vitest";

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  username: "user",
  email: "user@example.com",
  password: "secret",
  fullName: "Usuário Teste",
  role: "user",
  category: "vendedor",
  companyId: "c1",
  createdAt: new Date().toISOString(),
  ...overrides,
});

type TestItem = {
  id: string;
  roleTarget: PostRoleTarget;
  companyTarget: CompanyTarget;
};

const items: TestItem[] = [
  { id: "1", roleTarget: "all", companyTarget: "all" },
  { id: "2", roleTarget: "vendedor", companyTarget: "c1" },
  { id: "3", roleTarget: "tecnico", companyTarget: "c1" },
  { id: "4", roleTarget: "vendedor", companyTarget: "c2" },
];

describe("filterItemsForUser", () => {
  it("returns every item for admins", () => {
    const admin = makeUser({ role: "admin" });
    expect(filterItemsForUser(items, admin)).toHaveLength(items.length);
  });

  it("filters by role and company for regular users", () => {
    const vendedor = makeUser({ category: "vendedor", companyId: "c1" });
    const visible = filterItemsForUser(items, vendedor);
    expect(visible.map((item) => item.id)).toEqual(["1", "2"]);
  });

  it("still matches when user belongs to another company", () => {
    const otherCompany = makeUser({ companyId: "c2" });
    const visible = filterItemsForUser(items, otherCompany);
    expect(visible.map((item) => item.id)).toEqual(["1", "4"]);
  });
});

describe("filterBySelectors", () => {
  it("applies manual role/company filters", () => {
    const filtered = filterBySelectors(items, "vendedor", "c1");
    expect(filtered.map((item) => item.id)).toEqual(["2"]);
  });

  it("returns all items when filters are 'all'", () => {
    expect(filterBySelectors(items, "all", "all")).toEqual(items);
  });
});
