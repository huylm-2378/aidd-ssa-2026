"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MIN_SCALE = 0.6;
export const MAX_SCALE = 2.5;
const KEY_PAN_STEP = 24;
const KEY_ZOOM_STEP = 0.1;

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

interface PanZoomState {
  x: number;
  y: number;
  scale: number;
}

const ARROW_MOVES: Record<string, [number, number]> = {
  ArrowUp: [0, KEY_PAN_STEP],
  ArrowDown: [0, -KEY_PAN_STEP],
  ArrowLeft: [KEY_PAN_STEP, 0],
  ArrowRight: [-KEY_PAN_STEP, 0],
};

/**
 * Pan/zoom transform state for the Spotlight constellation canvas (FR-004):
 * drag (Pointer Events) or arrow keys to pan, wheel or `+`/`-` to zoom
 * (clamped to [MIN_SCALE, MAX_SCALE]) — plain DOM APIs + CSS `transform`, no
 * dependency. Consumers apply `transform` to the inner constellation layer.
 */
export function usePanZoom() {
  const [state, setState] = useState<PanZoomState>({ x: 0, y: 0, scale: 1 });
  const dragOrigin = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Wheel-zoom needs preventDefault to stop the page scrolling, but React's
  // synthetic onWheel binds a PASSIVE listener (preventDefault is a no-op +
  // console error). Attach a native non-passive listener instead.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setState((s) => ({ ...s, scale: clamp(s.scale - e.deltaY * 0.001, MIN_SCALE, MAX_SCALE) }));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragOrigin.current = { x: e.clientX - state.x, y: e.clientY - state.y };
      (e.target as Element).setPointerCapture(e.pointerId);
    },
    [state.x, state.y],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragOrigin.current) return;
    const origin = dragOrigin.current;
    setState((s) => ({ ...s, x: e.clientX - origin.x, y: e.clientY - origin.y }));
  }, []);

  const onPointerUp = useCallback(() => {
    dragOrigin.current = null;
  }, []);

  const zoomBy = useCallback((delta: number) => {
    setState((s) => ({ ...s, scale: clamp(s.scale + delta, MIN_SCALE, MAX_SCALE) }));
  }, []);

  const reset = useCallback(() => setState({ x: 0, y: 0, scale: 1 }), []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const move = ARROW_MOVES[e.key];
      if (move) {
        e.preventDefault();
        const [dx, dy] = move;
        setState((s) => ({ ...s, x: s.x + dx, y: s.y + dy }));
        return;
      }
      if (e.key === "+" || e.key === "=") zoomBy(KEY_ZOOM_STEP);
      if (e.key === "-") zoomBy(-KEY_ZOOM_STEP);
    },
    [zoomBy],
  );

  return {
    containerRef,
    transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})`,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
    zoomBy,
    reset,
  };
}
