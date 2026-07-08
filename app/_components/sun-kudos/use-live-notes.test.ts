import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLiveNotes, LIVE_TTL_MS } from "./use-live-notes";

describe("useLiveNotes (F008 live-recipient toast — fix: 15s TTL + stacking)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.restoreAllMocks());

  it("starts empty", () => {
    const { result } = renderHook(() => useLiveNotes());
    expect(result.current.notes).toEqual([]);
  });

  it("prepends each new note so the newest is on top (older pushed down)", () => {
    const { result } = renderHook(() => useLiveNotes());
    act(() => result.current.push("a", "An"));
    act(() => result.current.push("b", "Bình"));
    expect(result.current.notes.map((n) => n.name)).toEqual(["Bình", "An"]);
  });

  it("keeps overlapping notes on screen while inside the window", () => {
    const { result } = renderHook(() => useLiveNotes());
    act(() => result.current.push("a", "An"));
    act(() => vi.advanceTimersByTime(LIVE_TTL_MS - 1_000)); // 14s
    act(() => result.current.push("b", "Bình"));
    expect(result.current.notes).toHaveLength(2);
  });

  it("auto-dismisses a note after ~15s", () => {
    const { result } = renderHook(() => useLiveNotes());
    act(() => result.current.push("a", "An"));
    act(() => vi.advanceTimersByTime(LIVE_TTL_MS));
    expect(result.current.notes).toEqual([]);
  });

  it("expires each note on its own timer, not all at once", () => {
    const { result } = renderHook(() => useLiveNotes());
    act(() => result.current.push("a", "An"));
    act(() => vi.advanceTimersByTime(5_000));
    act(() => result.current.push("b", "Bình"));
    // First note hits its 15s mark; second (5s younger) survives.
    act(() => vi.advanceTimersByTime(LIVE_TTL_MS - 5_000));
    expect(result.current.notes.map((n) => n.name)).toEqual(["Bình"]);
    act(() => vi.advanceTimersByTime(5_000));
    expect(result.current.notes).toEqual([]);
  });

  it("clears pending timers on unmount (no setState after teardown)", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result, unmount } = renderHook(() => useLiveNotes());
    act(() => result.current.push("a", "An"));
    unmount();
    act(() => vi.advanceTimersByTime(LIVE_TTL_MS));
    expect(errSpy).not.toHaveBeenCalled();
  });
});
