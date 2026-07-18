import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const rpc = vi.fn();
const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

vi.mock("../_lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    rpc: (...args: unknown[]) => rpc(...args),
  })),
}));

// Imported after mocks so the mocked modules are wired up first.
import { openSecretBox } from "./secret-box-actions";

describe("openSecretBox (F016 FR-005/FR-008 — RPC-only open path)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns auth_required when signed out, without calling the RPC", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const result = await openSecretBox();

    expect(result).toEqual({ ok: false, error: "auth_required" });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("returns the badge and remaining count on success, revalidating both pages", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-9" } } });
    rpc.mockResolvedValue({
      data: [{ badge_code: "STAY_GOLD", remaining: 3 }],
      error: null,
    });

    const result = await openSecretBox();

    expect(rpc).toHaveBeenCalledWith("open_secret_box");
    expect(result).toEqual({ ok: true, badgeCode: "STAY_GOLD", remaining: 3 });
    expect(revalidatePath).toHaveBeenCalledWith("/sun-kudos");
    expect(revalidatePath).toHaveBeenCalledWith("/profile");
  });

  it("maps the RPC's no_boxes exception to the stable code (DEC-001)", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-9" } } });
    rpc.mockResolvedValue({ data: null, error: { message: "no_boxes" } });

    const result = await openSecretBox();

    expect(result).toEqual({ ok: false, error: "no_boxes" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("maps the RPC's auth_required exception (unlinked sunner) to the stable code", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-9" } } });
    rpc.mockResolvedValue({ data: null, error: { message: "auth_required" } });

    const result = await openSecretBox();

    expect(result).toEqual({ ok: false, error: "auth_required" });
  });

  it("passes through unknown RPC error messages verbatim", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-9" } } });
    rpc.mockResolvedValue({ data: null, error: { message: "boom" } });

    const result = await openSecretBox();

    expect(result).toEqual({ ok: false, error: "boom" });
  });

  it("returns unknown when the RPC yields no row", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-9" } } });
    rpc.mockResolvedValue({ data: [], error: null });

    const result = await openSecretBox();

    expect(result).toEqual({ ok: false, error: "unknown" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns the thrown message when createClient/rpc throws", async () => {
    getUser.mockRejectedValue(new Error("network down"));

    const result = await openSecretBox();

    expect(result).toEqual({ ok: false, error: "network down" });
  });
});
