import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { zeroPad2, parseEventStart, useCountdown } from "./use-countdown";

describe("zeroPad2", () => {
  it("should zero-pad single digit values (0-9)", () => {
    expect(zeroPad2(0)).toBe("00");
    expect(zeroPad2(1)).toBe("01");
    expect(zeroPad2(5)).toBe("05");
    expect(zeroPad2(9)).toBe("09");
  });

  it("should return two-digit values as-is (10-99)", () => {
    expect(zeroPad2(10)).toBe("10");
    expect(zeroPad2(23)).toBe("23");
    expect(zeroPad2(59)).toBe("59");
    expect(zeroPad2(99)).toBe("99");
  });

  it("should pass through 3+ digit values without truncation (>= 100)", () => {
    expect(zeroPad2(100)).toBe("100");
    expect(zeroPad2(365)).toBe("365");
    expect(zeroPad2(999)).toBe("999");
  });
});

describe("parseEventStart", () => {
  it("should parse valid ISO-8601 datetime strings", () => {
    const result = parseEventStart("2025-12-26T18:30:00Z");
    expect(result).toBeInstanceOf(Date);
    expect(result?.getUTCFullYear()).toBe(2025);
    expect(result?.getUTCMonth()).toBe(11); // December (0-indexed)
    expect(result?.getUTCDate()).toBe(26);
  });

  it("should return null for missing/undefined values (BR-003)", () => {
    expect(parseEventStart(undefined)).toBeNull();
    expect(parseEventStart(null)).toBeNull();
    expect(parseEventStart("")).toBeNull();
  });

  it("should return null for malformed ISO-8601 strings (BR-003)", () => {
    expect(parseEventStart("not-a-date")).toBeNull();
    expect(parseEventStart("not-iso-8601-format")).toBeNull();
    expect(parseEventStart("12345-invalid")).toBeNull();
  });

  it("should never throw, always returning null or Date (BR-003)", () => {
    const invalidInputs = [
      "invalid",
      "12345",
      "2025-",
      "T18:30:00Z",
      "not-a-date-string",
      "random text",
    ];

    invalidInputs.forEach((input) => {
      expect(() => parseEventStart(input as string)).not.toThrow();
      const result = parseEventStart(input as string);
      expect(result === null || result instanceof Date).toBe(true);
    });
  });
});

describe("useCountdown hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should compute correct countdown from a future date (SC-001, BR-002)", () => {
    const now = new Date("2025-12-20T12:00:00Z").getTime();
    vi.setSystemTime(now);

    const eventStart = "2025-12-26T18:30:00Z";
    const { result } = renderHook(() => useCountdown(eventStart));

    // From Dec 20 12:00 to Dec 26 18:30
    // ~6 days, 6.5 hours, 30 minutes
    expect(result.current.isPending).toBe(true);
    expect(result.current.days).toBe("06");
    expect(result.current.hours).toBe("06");
    expect(result.current.minutes).toBe("30");
  });

  it("should advance countdown after each 60-second tick (SC-001, BR-004)", () => {
    const now = new Date("2025-12-20T12:00:00Z").getTime();
    vi.setSystemTime(now);

    const eventStart = "2025-12-26T18:30:00Z";
    const { result, rerender } = renderHook(() => useCountdown(eventStart));

    const initialMinutes = result.current.minutes;

    // Advance 60 seconds
    vi.advanceTimersByTime(60_000);
    rerender();

    // Minutes should have decreased by 1
    expect(result.current.minutes).toBe(String(parseInt(initialMinutes) - 1).padStart(2, "0"));
    expect(result.current.isPending).toBe(true);
  });

  it("should freeze at 00 and hide isPending once event-start is reached (SC-002, BR-001)", () => {
    const eventStart = "2025-12-26T18:30:00Z";
    const now = new Date("2025-12-26T18:30:00Z").getTime();
    vi.setSystemTime(now);

    const { result } = renderHook(() => useCountdown(eventStart));

    expect(result.current.days).toBe("00");
    expect(result.current.hours).toBe("00");
    expect(result.current.minutes).toBe("00");
    expect(result.current.isPending).toBe(false);
  });

  it("should freeze at 00 if event-start is in the past (SC-002, BR-001)", () => {
    const eventStart = "2025-01-01T00:00:00Z";
    const now = new Date("2026-01-01T00:00:00Z").getTime();
    vi.setSystemTime(now);

    const { result } = renderHook(() => useCountdown(eventStart));

    expect(result.current.days).toBe("00");
    expect(result.current.hours).toBe("00");
    expect(result.current.minutes).toBe("00");
    expect(result.current.isPending).toBe(false);
  });

  it("should return elapsed state when event-start is missing (SC-003, BR-003)", () => {
    vi.setSystemTime(new Date("2025-12-20T12:00:00Z").getTime());

    const { result } = renderHook(() => useCountdown(undefined));

    expect(result.current.days).toBe("00");
    expect(result.current.hours).toBe("00");
    expect(result.current.minutes).toBe("00");
    expect(result.current.isPending).toBe(false);
  });

  it("should return elapsed state when event-start is malformed (SC-003, BR-003)", () => {
    vi.setSystemTime(new Date("2025-12-20T12:00:00Z").getTime());

    const { result } = renderHook(() => useCountdown("invalid-date"));

    expect(result.current.days).toBe("00");
    expect(result.current.hours).toBe("00");
    expect(result.current.minutes).toBe("00");
    expect(result.current.isPending).toBe(false);
  });

  it("should never emit negative values (BR-001)", () => {
    const now = new Date("2025-12-20T12:00:00Z").getTime();
    vi.setSystemTime(now);

    const eventStart = "2025-12-26T18:30:00Z";
    const { result } = renderHook(() => useCountdown(eventStart));

    // Advance to past the event
    vi.setSystemTime(new Date("2025-12-27T00:00:00Z").getTime());

    const state = result.current;
    const days = parseInt(state.days);
    const hours = parseInt(state.hours);
    const minutes = parseInt(state.minutes);

    expect(days).toBeGreaterThanOrEqual(0);
    expect(hours).toBeGreaterThanOrEqual(0);
    expect(minutes).toBeGreaterThanOrEqual(0);
  });

  it("should handle empty string env value as falsy (BR-003)", () => {
    vi.setSystemTime(new Date("2025-12-20T12:00:00Z").getTime());

    const { result } = renderHook(() => useCountdown(""));

    expect(result.current.days).toBe("00");
    expect(result.current.hours).toBe("00");
    expect(result.current.minutes).toBe("00");
    expect(result.current.isPending).toBe(false);
  });

  it("should properly handle very large day counts (3+ digit passthrough, BR-002)", () => {
    const now = new Date("2020-01-01T00:00:00Z").getTime();
    vi.setSystemTime(now);

    const eventStart = "2026-12-31T23:59:59Z"; // ~7 years away
    const { result } = renderHook(() => useCountdown(eventStart));

    const days = parseInt(result.current.days);
    expect(days).toBeGreaterThan(99);
    expect(result.current.days).toMatch(/^\d{3,}$/); // 3+ digits
  });
})
