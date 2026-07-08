import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMounted } from "./use-mounted";

describe("useMounted", () => {
  it("reports mounted (true) once rendered on the client", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });

  it("stays true across re-renders", () => {
    const { result, rerender } = renderHook(() => useMounted());
    rerender();
    expect(result.current).toBe(true);
  });

  it("unmounts cleanly without throwing (noop subscribe teardown)", () => {
    const { unmount } = renderHook(() => useMounted());
    expect(() => unmount()).not.toThrow();
  });
});
