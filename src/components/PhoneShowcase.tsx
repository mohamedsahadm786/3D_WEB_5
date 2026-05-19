import { motion, useTransform, type MotionValue } from 'motion/react';

/*
 * PhoneShowcase — the scroll-driven "hand holding a phone" act.
 *
 * Fitting model (matches the reference site exactly):
 *  - hand-phone.webp is a transparent cut-out — the phone's glass is a
 *    transparent HOLE. The photo sits ON TOP; the 3 screens sit BEHIND it and
 *    show through the hole, so the phone's real rounded corners frame them.
 *  - The screen box is sized to that hole (measured from the image's alpha
 *    channel) with a black backing; screens use object-fit: contain so the
 *    whole UI is visible undistorted, the tiny aspect gap reading as bezel.
 *  - overflow-hidden clips the screens so they "slide" in and out of the phone.
 *
 * The screens SLIDE (no crossfade), scrubbed to the parent chapter progress:
 *  lock screen sits → slides up → home screen revealed →
 *  dashboard slides in from the right (home nudges slightly left).
 * Keyframes are verbatim from hand/instruction.md.
 */

/* transparent glass hole — centre + size as % of hand-phone.webp,
   measured from its alpha channel (phone is upright, 0° tilt).
   `radius` rounds the screen box to the phone's screen corners (the % pair
   keeps the corners circular on the box's w:h ratio). */
const GLASS = {
  cx: '30.26%',
  cy: '33.52%',
  w: '42.94%',
  h: '64.85%',
  radius: '13.5% / 6.7%',
};

interface Props {
  /** parent chapter progress, 0→1 */
  progress: MotionValue<number>;
  /** [start, end] slice of chapter progress this act occupies */
  range: [number, number];
}

export default function PhoneShowcase({ progress, range }: Props) {
  const [start, end] = range;

  /* crossfade in over the 0.12 before the act starts (glob fades out here) */
  const opacity = useTransform(progress, [start - 0.12, start], [0, 1]);

  /* internal phone progress 0→1 across the act */
  const p = useTransform(progress, [start, end], [0, 1]);

  /* instruction.md keyframes, in phone-progress space */
  const lockY = useTransform(p, [0, 0.24, 0.42], ['0%', '0%', '-100%']);
  const dashX = useTransform(p, [0, 0.42, 0.57], ['100%', '100%', '0%']);
  const homeX = useTransform(p, [0, 0.42, 0.57], ['0%', '0%', '-10%']);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      aria-hidden
    >
      <div className="relative w-[min(440px,80vw)]">
        {/* screens — BEHIND the photo, clipped, shown through the glass hole */}
        <div
          className="absolute overflow-hidden bg-black"
          style={{
            left: GLASS.cx,
            top: GLASS.cy,
            width: GLASS.w,
            height: GLASS.h,
            borderRadius: GLASS.radius,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* stacking: home (bottom) → dashboard → lock (top) */}
          <motion.img
            src="/hand/home-screen.png"
            alt=""
            style={{ x: homeX }}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <motion.img
            src="/hand/dashboard.png"
            alt=""
            style={{ x: dashX }}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <motion.img
            src="/hand/lock-screen.jpg"
            alt=""
            style={{ y: lockY }}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>

        {/* hand+phone photo ON TOP — transparent glass hole reveals the screens */}
        <img
          src="/hand/hand-phone.webp"
          alt=""
          className="relative z-10 block w-full select-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
