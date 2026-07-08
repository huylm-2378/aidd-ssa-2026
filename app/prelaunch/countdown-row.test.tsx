import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CountdownRow from "./countdown-row";

describe("CountdownRow (F011 prelaunch countdown wiring)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv("NEXT_PUBLIC_SAA_EVENT_START", "2025-12-26T18:30:00Z");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("renders DAYS / HOURS / MINUTES labels", () => {
    vi.setSystemTime(new Date("2025-12-20T12:00:00Z"));
    render(<CountdownRow />);

    expect(screen.getByText("DAYS")).toBeInTheDocument();
    expect(screen.getByText("HOURS")).toBeInTheDocument();
    expect(screen.getByText("MINUTES")).toBeInTheDocument();
  });

  it("renders live digits for a known target once mounted (FR-004)", () => {
    // From Dec 20 12:00 to Dec 26 18:30 -> 06 days, 06 hours, 30 minutes.
    vi.setSystemTime(new Date("2025-12-20T12:00:00Z"));
    render(<CountdownRow />);

    // Each CountdownTile renders one tile per digit: days="06", hours="06", minutes="30".
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(screen.getAllByText("6")).toHaveLength(2); // days' "6" + hours' "6"
    expect(screen.getByText("3")).toBeInTheDocument(); // minutes' "3"
  });

  it("falls back to zeroed digits when the target is elapsed (FR-006)", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    render(<CountdownRow />);

    const zeros = screen.getAllByText("0");
    // Three tiles (DAYS/HOURS/MINUTES) x 2 digits each = 6 zero digits.
    expect(zeros).toHaveLength(6);
  });

  it("falls back to zeroed digits when the env target is missing (FR-006)", () => {
    vi.stubEnv("NEXT_PUBLIC_SAA_EVENT_START", "");
    vi.setSystemTime(new Date("2025-12-20T12:00:00Z"));
    render(<CountdownRow />);

    const zeros = screen.getAllByText("0");
    expect(zeros).toHaveLength(6);
  });
});
