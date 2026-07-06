import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HashtagField from "./hashtag-field";

describe("HashtagField (F006 FR-008, SC-002)", () => {
  it("adding a tag calls onChange with the new array", () => {
    const onChange = vi.fn();
    render(<HashtagField value={[]} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "+ Hashtag" }));
    const input = screen.getByPlaceholderText("#hashtag");
    fireEvent.change(input, { target: { value: "Teamwork" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(["#Teamwork"]);
  });

  it("hides the '+ Hashtag' button once 5 tags are set (cap)", () => {
    const onChange = vi.fn();
    render(
      <HashtagField
        value={["#A", "#B", "#C", "#D", "#E"]}
        onChange={onChange}
      />,
    );

    expect(screen.queryByRole("button", { name: "+ Hashtag" })).not.toBeInTheDocument();
  });

  it("clicking a chip's x calls onChange without that tag", () => {
    const onChange = vi.fn();
    render(<HashtagField value={["#A", "#B"]} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Xóa hashtag #A" }));

    expect(onChange).toHaveBeenCalledWith(["#B"]);
  });
});
