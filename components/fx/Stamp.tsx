import Image from "next/image";
import { useId } from "react";

/**
 * The turning stamp: a round badge with its words running around the rim and
 * the SnZ mark in the middle (app/skin.css, `.sk-stamp`). Decorative only.
 */
export function Stamp({
  text = "Study · Work · Build · In Europe · ",
  className,
}: {
  text?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <span aria-hidden className={`sk-stamp ${className ?? ""}`}>
      <svg viewBox="0 0 132 132">
        <defs>
          <path id={`r${id}`} d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
        </defs>
        <text>
          <textPath href={`#r${id}`} textLength="312">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="sk-stamp-core">
        <Image src="/brand/snz-mark.png" alt="" width={40} height={40} />
      </span>
    </span>
  );
}
