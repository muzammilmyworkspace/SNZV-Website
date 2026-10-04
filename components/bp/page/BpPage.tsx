import { MotionRoot } from "../MotionRoot";
import { LineField } from "../LineField";
import { Spotlight } from "../Spotlight";

/**
 * The shell every Boarding Pass page sits in: the themed `.bp` surface, the
 * living line field behind it, the pointer spotlight, and the reduced-motion
 * config. One wrapper so an inner page cannot drift from the homepage's
 * ground.
 */
export function BpPage({ children }: { children: React.ReactNode }) {
  return (
    <MotionRoot>
      <div className="bp relative isolate">
        <LineField />
        <Spotlight />
        {children}
      </div>
    </MotionRoot>
  );
}
