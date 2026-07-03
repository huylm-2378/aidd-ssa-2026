import { describe, it, expect } from "vitest";
import { sanitizeNext } from "./redirect-guard";

describe("sanitizeNext (F005 open-redirect guard, SC-004)", () => {
  it("keeps a same-origin absolute path", () => {
    expect(sanitizeNext("/foo")).toBe("/foo");
    expect(sanitizeNext("/")).toBe("/");
    expect(sanitizeNext("/awards-information?tab=1")).toBe("/awards-information?tab=1");
  });

  it("rejects a protocol-relative URL (the //evil.com bypass)", () => {
    // "//evil.com" starts with "/" but the browser resolves it off-site — must fall back to "/".
    expect(sanitizeNext("//evil.com")).toBe("/");
  });

  it("rejects absolute off-site URLs", () => {
    expect(sanitizeNext("https://evil.com")).toBe("/");
    expect(sanitizeNext("http://evil.com/path")).toBe("/");
  });

  it("falls back to / for null, empty, or non-path input", () => {
    expect(sanitizeNext(null)).toBe("/");
    expect(sanitizeNext("")).toBe("/");
    expect(sanitizeNext("foo")).toBe("/");
  });
});
