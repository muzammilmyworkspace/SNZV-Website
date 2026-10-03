"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * `useReducedMotion`, without the hydration mismatch.
 *
 * THE BUG IT FIXES. Motion's own hook cannot know the media query on the
 * server, so it returns `null` there and the real answer on the client. Every
 * component in this codebase then does `reduced ? a : b`, which means the
 * server renders branch `b` and a reader who has asked for reduced motion
 * hydrates into branch `a` — a different style attribute on the same element.
 * React reports a hydration mismatch and throws away the whole tree:
 *
 *     + style={{height:"100%",transform:"none"}}
 *     - style={{height:"100%",transform:"scaleY(0)"}}
 *
 * It only happens for readers with the OS setting on, which is exactly why it
 * survived — the people most likely to be affected by a broken animation are
 * the ones whose render path is least often looked at.
 *
 * HOW. The first client render deliberately agrees with the server by
 * answering `false`, and the real preference arrives one effect later. That is
 * one frame of the full animation's initial state for somebody who asked for
 * less motion, which is not ideal — but the alternative is React discarding
 * and re-rendering the tree, which is strictly worse and also still animates.
 *
 * WHY NOT `suppressHydrationWarning`. Because that silences the report without
 * fixing the mismatch; React still regenerates the subtree on the client.
 *
 * USE THIS EVERYWHERE instead of importing `useReducedMotion` directly, in any
 * component whose RENDER OUTPUT depends on the answer. A component that only
 * consults it inside an event handler or an effect is unaffected either way,
 * and using this one there costs nothing.
 */
export function useSafeReducedMotion(): boolean {
  const preference = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted && Boolean(preference);
}
