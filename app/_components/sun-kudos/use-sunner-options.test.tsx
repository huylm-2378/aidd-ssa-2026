import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useSunnerOptions } from "./use-sunner-options";
import type { SunnerOption } from "../../_lib/write-kudo-content";

// Browser supabase client mocked: the hook must fetch REAL sunners rows when
// no server-provided options exist (the homepage-FAB path that used to fall
// back to mock "sunner-N" ids and break createKudo's uuid insert).
const mockOrder = vi.fn();
vi.mock("../../_lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({ select: () => ({ order: mockOrder }) }),
  }),
}));

function Probe({ provided, open }: { provided?: readonly SunnerOption[]; open: boolean }) {
  const options = useSunnerOptions(provided, open);
  return <div data-testid="ids">{options.map((o) => o.id).join(",")}</div>;
}

describe("useSunnerOptions (mock-id uuid bug fix)", () => {
  beforeEach(() => mockOrder.mockReset());

  it("returns server-provided options untouched and never fetches", () => {
    const provided = [{ id: "real-uuid-1", name: "A", role: "CEVC01" }];
    render(<Probe provided={provided} open />);
    expect(screen.getByTestId("ids").textContent).toBe("real-uuid-1");
    expect(mockOrder).not.toHaveBeenCalled();
  });

  it("fetches real sunners rows on first open when no options are provided", async () => {
    mockOrder.mockResolvedValue({
      data: [
        { id: "6f1a2b3c-0000-0000-0000-000000000001", name: "Trần Minh Anh", role_code: "CEVC19", department: "CEVC", tier: null, avatar_url: null },
      ],
    });
    render(<Probe open />);
    await waitFor(() =>
      expect(screen.getByTestId("ids").textContent).toBe("6f1a2b3c-0000-0000-0000-000000000001"),
    );
    expect(mockOrder).toHaveBeenCalledTimes(1);
  });

  it("does not fetch while closed and degrades to empty on missing data", async () => {
    // Supabase returns { data: null } rather than throwing on RLS/table errors.
    mockOrder.mockResolvedValue({ data: null });
    const { rerender } = render(<Probe open={false} />);
    expect(mockOrder).not.toHaveBeenCalled();

    rerender(<Probe open />);
    await waitFor(() => expect(mockOrder).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("ids").textContent).toBe("");
  });
});
