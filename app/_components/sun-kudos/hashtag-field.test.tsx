import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import HashtagField from "./hashtag-field";
import { HASHTAG_OPTIONS } from "../../_lib/write-kudo-content";

/** Open the dropdown and return its option list (a `<ul>`, implicit role "list"). */
function openDropdown() {
  fireEvent.click(screen.getByRole("button", { name: /Hashtag/ }));
  return screen.getByRole("list");
}

const optionIn = (list: HTMLElement, tag: string) =>
  within(list).getByRole("button", { name: new RegExp(tag) });

describe("HashtagField (F006 FR-008, SC-002)", () => {
  it("opens the dropdown and lists every catalog hashtag", () => {
    render(<HashtagField value={[]} onChange={vi.fn()} />);
    const list = openDropdown();
    for (const tag of HASHTAG_OPTIONS) {
      expect(optionIn(list, tag)).toBeInTheDocument();
    }
  });

  it("selecting an option calls onChange with the tag added", () => {
    const onChange = vi.fn();
    render(<HashtagField value={[]} onChange={onChange} />);
    const list = openDropdown();

    fireEvent.click(optionIn(list, HASHTAG_OPTIONS[0]));

    expect(onChange).toHaveBeenCalledWith([HASHTAG_OPTIONS[0]]);
  });

  it("marks a selected option with aria-pressed", () => {
    render(<HashtagField value={[HASHTAG_OPTIONS[0]]} onChange={vi.fn()} />);
    const list = openDropdown();

    expect(optionIn(list, HASHTAG_OPTIONS[0])).toHaveAttribute("aria-pressed", "true");
    expect(optionIn(list, HASHTAG_OPTIONS[1])).toHaveAttribute("aria-pressed", "false");
  });

  it("clicking an already-selected option removes it", () => {
    const onChange = vi.fn();
    render(<HashtagField value={[HASHTAG_OPTIONS[0]]} onChange={onChange} />);
    const list = openDropdown();

    fireEvent.click(optionIn(list, HASHTAG_OPTIONS[0]));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("disables unselected options once 5 are chosen (cap)", () => {
    const value = HASHTAG_OPTIONS.slice(0, 5);
    render(<HashtagField value={value} onChange={vi.fn()} />);
    const list = openDropdown();

    // A chosen option stays enabled (so it can be toggled off)...
    expect(optionIn(list, value[0])).toBeEnabled();
    // ...but an unselected one is disabled.
    expect(optionIn(list, HASHTAG_OPTIONS[5])).toBeDisabled();
  });

  it("closes the dropdown on outside click", () => {
    render(<HashtagField value={[]} onChange={vi.fn()} />);
    openDropdown();
    expect(screen.getByRole("list")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("closes the dropdown on Escape", () => {
    render(<HashtagField value={[]} onChange={vi.fn()} />);
    openDropdown();
    expect(screen.getByRole("list")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("clicking a chip's x calls onChange without that tag", () => {
    const onChange = vi.fn();
    render(<HashtagField value={[HASHTAG_OPTIONS[0], HASHTAG_OPTIONS[1]]} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: `Xóa hashtag ${HASHTAG_OPTIONS[0]}` }));

    expect(onChange).toHaveBeenCalledWith([HASHTAG_OPTIONS[1]]);
  });
});
