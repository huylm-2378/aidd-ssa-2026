import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const maybeSingle = vi.fn();
const kudosEq = vi.fn();
const badgesEq = vi.fn();

vi.mock("../supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    from: vi.fn((table: string) => {
      if (table === "sunners") {
        return { select: () => ({ eq: () => ({ maybeSingle }) }) };
      }
      if (table === "kudos") {
        return { select: () => ({ eq: (...args: unknown[]) => kudosEq(...args) }) };
      }
      return { select: () => ({ eq: (...args: unknown[]) => badgesEq(...args) }) };
    }),
  })),
}));

// Imported after mocks so the mocked module is wired up first.
import { getSecretBoxState } from "./queries";

describe("getSecretBoxState (F016 FR-004 / BR-001 — display entitlement)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the anon zero state when signed out", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    expect(await getSecretBoxState()).toEqual({
      authState: "anon",
      unopened: 0,
      opened: 0,
    });
    expect(maybeSingle).not.toHaveBeenCalled();
  });

  it("treats an authed-but-unlinked user as zero entitlement, not an error", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-9" } } });
    maybeSingle.mockResolvedValue({ data: null });

    expect(await getSecretBoxState()).toEqual({
      authState: "authed",
      unopened: 0,
      opened: 0,
    });
    expect(kudosEq).not.toHaveBeenCalled();
  });

  it("computes unopened = floor(hearts/5) - opened from received kudos", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-9" } } });
    maybeSingle.mockResolvedValue({ data: { id: "sunner-9" } });
    // 7 + 12 + 4 = 23 hearts → floor(23/5) = 4 boxes earned; 1 already opened.
    kudosEq.mockResolvedValue({
      data: [{ like_count: 7 }, { like_count: 12 }, { like_count: null }, { like_count: 4 }],
    });
    badgesEq.mockResolvedValue({ count: 1 });

    expect(await getSecretBoxState()).toEqual({
      authState: "authed",
      unopened: 3,
      opened: 1,
    });
  });

  it("floors at zero when more boxes were opened than are currently earned (BR-001)", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-9" } } });
    maybeSingle.mockResolvedValue({ data: { id: "sunner-9" } });
    kudosEq.mockResolvedValue({ data: [{ like_count: 5 }] }); // 1 earned
    badgesEq.mockResolvedValue({ count: 3 }); // 3 opened

    expect(await getSecretBoxState()).toEqual({
      authState: "authed",
      unopened: 0,
      opened: 3,
    });
  });

  it("fails safe to the anon zero state on any thrown error", async () => {
    getUser.mockRejectedValue(new Error("db down"));

    expect(await getSecretBoxState()).toEqual({
      authState: "anon",
      unopened: 0,
      opened: 0,
    });
  });
});
