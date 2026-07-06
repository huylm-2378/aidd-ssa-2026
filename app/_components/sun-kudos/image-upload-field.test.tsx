import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageUploadField from "./image-upload-field";
import type { KudoImage } from "../../_lib/write-kudo-form";

function makeImages(n: number): KudoImage[] {
  return Array.from({ length: n }, (_, i) => ({ id: `img-${i}`, url: `blob:mock-${i}` }));
}

describe("ImageUploadField (F006 FR-009, SC-002)", () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();
  });

  it("hides the '+ Image' button once 5 images are set (cap)", () => {
    render(<ImageUploadField value={makeImages(5)} onChange={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "+ Image" })).not.toBeInTheDocument();
  });

  it("removing an image revokes its object URL then calls onChange without it", () => {
    const onChange = vi.fn();
    const images = makeImages(2);
    render(<ImageUploadField value={images} onChange={onChange} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Xóa ảnh" })[0]);

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-0");
    expect(onChange).toHaveBeenCalledWith([images[1]]);
  });
});
