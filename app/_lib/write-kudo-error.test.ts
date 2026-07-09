import { describe, it, expect } from "vitest";
import { resolveComposerError } from "./write-kudo-error";

/** Stand-in `t()` — echoes the key so assertions can check which key was resolved. */
const echoT = (key: string) => `[${key}]`;

describe("resolveComposerError (F014 round 4)", () => {
  it("translates the missing_fields code", () => {
    expect(resolveComposerError(echoT, "missing_fields")).toBe("[composer.error.missingFields]");
  });

  it("translates the auth_required code", () => {
    expect(resolveComposerError(echoT, "auth_required")).toBe("[composer.error.authRequired]");
  });

  it("translates the unknown code", () => {
    expect(resolveComposerError(echoT, "unknown")).toBe("[composer.error.unknown]");
  });

  it("passes a dynamic (non-code) message through raw", () => {
    expect(resolveComposerError(echoT, "duplicate key value violates unique constraint")).toBe(
      "duplicate key value violates unique constraint",
    );
  });

  it("falls back to the generic send-failed message when error is undefined", () => {
    expect(resolveComposerError(echoT, undefined)).toBe("[composer.error.sendFailed]");
  });
});
