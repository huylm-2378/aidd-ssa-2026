import { describe, it, expect } from "vitest";
import { canSubmit, missingRequired, EMPTY_FORM, MAX_HASHTAGS, MAX_IMAGES, type WriteKudoForm } from "./write-kudo-form";

const RECIPIENT = { id: "sunner-1", name: "Trần Minh Anh", role: "CEVC19" };

function fullForm(overrides: Partial<WriteKudoForm> = {}): WriteKudoForm {
  return {
    recipient: RECIPIENT,
    award: "Người truyền động lực cho tôi",
    body: "Cảm ơn bạn rất nhiều",
    hashtags: ["#Dedicated"],
    images: [],
    anonymous: false,
    ...overrides,
  };
}

describe("canSubmit (F006 FR-011, SC-002)", () => {
  it("is false for the empty form", () => {
    expect(canSubmit(EMPTY_FORM)).toBe(false);
  });

  it("is false when recipient is missing", () => {
    expect(canSubmit(fullForm({ recipient: null }))).toBe(false);
  });

  it("is false when award (danh hiệu) is missing or whitespace-only", () => {
    expect(canSubmit(fullForm({ award: "" }))).toBe(false);
    expect(canSubmit(fullForm({ award: "   " }))).toBe(false);
  });

  it("is false when body (content) is missing or whitespace-only", () => {
    expect(canSubmit(fullForm({ body: "" }))).toBe(false);
    expect(canSubmit(fullForm({ body: "   " }))).toBe(false);
  });

  it("is false when there are no hashtags", () => {
    expect(canSubmit(fullForm({ hashtags: [] }))).toBe(false);
  });

  it("is true when recipient, award, body, and >=1 hashtag are all set", () => {
    expect(canSubmit(fullForm())).toBe(true);
    expect(canSubmit(fullForm({ hashtags: ["#A", "#B"] }))).toBe(true);
  });
});

describe("missingRequired (drives the 'what's missing' hint)", () => {
  it("lists every required field (as i18n catalog keys) for the empty form, in order", () => {
    expect(missingRequired(EMPTY_FORM)).toEqual([
      "composer.field.recipient",
      "composer.field.award",
      "composer.field.content",
      "composer.field.hashtag",
    ]);
  });

  it("reports only Hashtag when recipient + award + body are filled (the reported bug)", () => {
    expect(missingRequired(fullForm({ hashtags: [] }))).toEqual(["composer.field.hashtag"]);
  });

  it("is empty exactly when canSubmit is true", () => {
    expect(missingRequired(fullForm())).toEqual([]);
    expect(canSubmit(fullForm())).toBe(true);
  });
});

describe("caps", () => {
  it("MAX_HASHTAGS and MAX_IMAGES are both 5", () => {
    expect(MAX_HASHTAGS).toBe(5);
    expect(MAX_IMAGES).toBe(5);
  });
});
