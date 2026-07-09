import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WriteKudoModal from "./write-kudo-modal";
import { renderWithLang } from "../../_lib/i18n/test-utils";

vi.mock("../../sun-kudos/actions", () => ({
  createKudo: vi.fn(async () => ({ ok: false, error: "auth_required" })),
}));

// Real recipient rows are server-fetched (or via useSunnerOptions) since the
// mock-id uuid bugfix — tests supply an explicit directory with a real-shaped id.
const SUNNERS = [
  { id: "6f1a2b3c-0000-0000-0000-000000000001", name: "Trần Minh Anh", role: "CEVC19" },
];

describe("WriteKudoModal (F014 round 4 — composer i18n)", () => {
  it("renders the title, cancel, and submit in VI by default (no provider)", () => {
    render(<WriteKudoModal open onClose={vi.fn()} />);

    expect(screen.getByText("Gửi lời cám ơn và ghi nhận đến đồng đội")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hủy/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Gửi/ })).toBeInTheDocument();
  });

  it("shows the VI missing-field hint, joining the untranslated field names, for the empty form", () => {
    render(<WriteKudoModal open onClose={vi.fn()} />);

    expect(
      screen.getByText("Cần điền để gửi: Người nhận, Danh hiệu, Nội dung, ít nhất 1 Hashtag"),
    ).toBeInTheDocument();
  });

  it("renders the title, cancel, submit, and missing-field hint in EN when the active locale is EN", () => {
    renderWithLang(<WriteKudoModal open onClose={vi.fn()} />, "en");

    expect(screen.getByText("Send thanks and recognition to a teammate")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Send$/ })).toBeInTheDocument();
    expect(
      screen.getByText("Required to send: Recipient, Award, Content, at least 1 Hashtag"),
    ).toBeInTheDocument();
  });

  it("maps a known server-action error code (auth_required) to the EN message on submit", async () => {
    renderWithLang(<WriteKudoModal open onClose={vi.fn()} sunnerOptions={SUNNERS} />, "en");

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("button", { name: /Trần Minh Anh/ }));

    fireEvent.change(screen.getByPlaceholderText("Give your teammate an award"), {
      target: { value: "Motivator" },
    });
    fireEvent.change(screen.getByPlaceholderText("Share your thanks and recognition for your teammate here!"), {
      target: { value: "Thanks a lot" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Hashtag/ }));
    fireEvent.click(screen.getByRole("list").querySelectorAll("button")[0]);

    fireEvent.click(screen.getByRole("button", { name: /^Send$/ }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("You need to sign in to send a Kudos.");
    });
  });
});
