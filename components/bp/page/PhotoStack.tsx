"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";

/**
 * Real photographs, fanned like prints on a desk.
 *
 * Three licensed photos (all in data/image-manifest.json) in thin paper
 * frames with a mono caption, dealt in on load and drifting apart a little
 * under the pointer. It is the "real things" counterweight to the drawn
 * line work: actual campuses, actual cities, actual students.
 */

export type StackPhoto = { src: string; alt: string; caption: string };

const LAYOUT = [
  { x: "-6%", y: "8%", r: -8, z: 1, w: "58%" },
  { x: "38%", y: "0%", r: 6, z: 2, w: "56%" },
  { x: "16%", y: "40%", r: -2, z: 3, w: "62%" },
];

export function PhotoStack({ photos, badge }: { photos: StackPhoto[]; badge?: React.ReactNode }) {
  const reduce = useReduced();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });

  return (
    <div
      className="relative mx-auto aspect-[1/1] w-full max-w-[560px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {photos.slice(0, 3).map((p, i) => (
        <Print key={p.src} p={p} i={i} sx={sx} sy={sy} reduce={reduce} />
      ))}
      {badge && <div className="absolute bottom-[4%] right-[2%] z-10">{badge}</div>}
    </div>
  );
}

function Print({
  p,
  i,
  sx,
  sy,
  reduce,
}: {
  p: StackPhoto;
  i: number;
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  reduce: boolean;
}) {
  const L = LAYOUT[i];
  const depth = (i + 1) * 10;
  const tx = useTransform(sx, (v) => v * depth);
  const ty = useTransform(sy, (v) => v * depth);
  return (
    <motion.div
      className="absolute"
      style={{ left: L.x, top: L.y, width: L.w, zIndex: L.z, x: reduce ? 0 : tx, y: reduce ? 0 : ty }}
    >
      <motion.figure
        className="rounded-[6px] bg-[var(--color-ticket)] p-[3.5%] pb-[2.5%] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.85)]"
        initial={reduce ? false : { opacity: 0, y: 60, rotate: L.r * 2 }}
        animate={{ opacity: 1, y: 0, rotate: L.r }}
        transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 80, damping: 15 }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[3px]">
          <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 340px, 60vw" className="object-cover" priority={i === 0} />
        </div>
        <figcaption className="mt-[3%] font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[#3F4757]">{p.caption}</figcaption>
      </motion.figure>
    </motion.div>
  );
}
