import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HeartButton from "./heart-button";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import { toggleHeart } from "../../sun-kudos/actions";

vi.mock("../../sun-kudos/actions", () => ({
  toggleHeart: vi.fn(),
}));

const mockedToggleHeart = toggleHeart as ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockedToggleHeart.mockReset();
});

describe("HeartButton (F015 P03)", () => {
  it("shows the optimistic +1 and aria-pressed=true before the action resolves", async () => {
    let resolvePromise: (value: { ok: boolean; liked: boolean; likeCount: number }) => void =
      () => {};
    mockedToggleHeart.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<HeartButton kudoId="k1" initialLiked={false} initialCount={5} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");

    resolvePromise({ ok: true, liked: true, likeCount: 6 });
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  it("rolls back to the initial state and shows the VI generic error on an unknown failure (AC-6)", async () => {
    mockedToggleHeart.mockResolvedValue({ ok: false, error: "unknown" });

    render(<HeartButton kudoId="k1" initialLiked={false} initialCount={5} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Không thể cập nhật. Vui lòng thử lại.",
      );
    });
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("shows the translated sign-in prompt and leaves the count unchanged on auth_required (AC-3)", async () => {
    mockedToggleHeart.mockResolvedValue({ ok: false, error: "auth_required" });

    render(<HeartButton kudoId="k1" initialLiked={false} initialCount={5} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Đăng nhập để thả tim.");
    });
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows the EN sign-in prompt when the active locale is EN", async () => {
    mockedToggleHeart.mockResolvedValue({ ok: false, error: "auth_required" });

    renderWithLang(<HeartButton kudoId="k1" initialLiked={false} initialCount={5} />, "en");
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Sign in to heart this Kudos.");
    });
  });

  it("reconciles the count with the server's authoritative likeCount", async () => {
    mockedToggleHeart.mockResolvedValue({ ok: true, liked: true, likeCount: 9 });

    render(<HeartButton kudoId="k1" initialLiked={false} initialCount={5} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(screen.getByText("9")).toBeInTheDocument());
  });

  it("reflects initialLiked in aria-pressed and toggles the aria-label between like/unlike (AC-7)", async () => {
    mockedToggleHeart.mockResolvedValue({ ok: true, liked: false, likeCount: 4 });

    render(<HeartButton kudoId="k1" initialLiked={true} initialCount={5} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    // aria-label folds the visible count in (it overrides button text for SRs).
    expect(button).toHaveAttribute("aria-label", "Bỏ tim — 5 lượt thích");

    fireEvent.click(button);

    await waitFor(() => expect(button).toHaveAttribute("aria-pressed", "false"));
    expect(button).toHaveAttribute("aria-label", "Thả tim — 4 lượt thích");
  });

  it("resyncs from fresh props delivered by a soft refresh (duplicate-instance desync fix)", () => {
    // The same kudo renders in Highlight + All Kudos + Profile at once; after a
    // toggle elsewhere, revalidatePath re-renders this instance with new props.
    const { rerender } = render(
      <HeartButton kudoId="k1" initialLiked={false} initialCount={5} />,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

    rerender(<HeartButton kudoId="k1" initialLiked={true} initialCount={6} />);

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("ignores a second click while the toggle is pending (double-fire guard)", async () => {
    let resolvePromise: (value: { ok: boolean; liked: boolean; likeCount: number }) => void =
      () => {};
    mockedToggleHeart.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<HeartButton kudoId="k1" initialLiked={false} initialCount={5} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockedToggleHeart).toHaveBeenCalledTimes(1);

    resolvePromise({ ok: true, liked: true, likeCount: 6 });
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
