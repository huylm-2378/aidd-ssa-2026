import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const insert = vi.fn();
const deleteEq2 = vi.fn();
const maybeSingle = vi.fn();
const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

vi.mock("../_lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    from: vi.fn(() => ({
      insert: (...args: unknown[]) => insert(...args),
      delete: () => ({ eq: () => ({ eq: (...args: unknown[]) => deleteEq2(...args) }) }),
      select: () => ({ eq: () => ({ maybeSingle }) }),
    })),
  })),
}));

// Imported after mocks so the mocked modules are wired up first.
import { toggleHeart } from "./actions";

describe("toggleHeart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns auth_required when signed out, without attempting an insert", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const result = await toggleHeart("kudo-1");

    expect(result).toEqual({ ok: false, error: "auth_required" });
    expect(insert).not.toHaveBeenCalled();
  });

  it("likes a kudo on first tap (insert succeeds)", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insert.mockResolvedValue({ error: null });
    maybeSingle.mockResolvedValue({ data: { like_count: 6 } });

    const result = await toggleHeart("kudo-1");

    expect(insert).toHaveBeenCalledWith({ kudo_id: "kudo-1", user_id: "user-1" });
    expect(deleteEq2).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: true, liked: true, likeCount: 6 });
    expect(revalidatePath).toHaveBeenCalledWith("/sun-kudos");
    expect(revalidatePath).toHaveBeenCalledWith("/profile");
  });

  it("un-likes on second tap (insert 23505 -> delete)", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insert.mockResolvedValue({ error: { code: "23505" } });
    deleteEq2.mockResolvedValue({ error: null });
    maybeSingle.mockResolvedValue({ data: { like_count: 5 } });

    const result = await toggleHeart("kudo-1");

    expect(deleteEq2).toHaveBeenCalled();
    expect(result).toEqual({ ok: true, liked: false, likeCount: 5 });
  });

  it("passes through an unexpected db error message", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insert.mockResolvedValue({ error: { code: "XX000", message: "boom" } });

    const result = await toggleHeart("kudo-1");

    expect(result).toEqual({ ok: false, error: "boom" });
  });

  it("returns unknown for an empty kudoId without calling the client", async () => {
    const result = await toggleHeart("");

    expect(result).toEqual({ ok: false, error: "unknown" });
    expect(getUser).not.toHaveBeenCalled();
  });

  it("passes through a delete error when 23505 triggers delete but delete fails (AC-6)", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insert.mockResolvedValue({ error: { code: "23505" } });
    deleteEq2.mockResolvedValue({ error: { message: "delete failed" } });

    const result = await toggleHeart("kudo-1");

    expect(result).toEqual({ ok: false, error: "delete failed" });
  });
});
