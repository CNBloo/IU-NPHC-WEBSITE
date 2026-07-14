"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { HERO_PHOTOS } from "@/data/heroPhotos";

const ROTATE_MS = 5000;

export function HeroCarousel({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  // Two separate concerns, deliberately not one shared boolean: hover/focus
  // pausing is transient and reverses itself (mouse leaves, focus moves on),
  // while the pause/play button's state is an explicit, sticky user choice.
  // Merging them caused a real bug — focusing the pause button (which
  // bubbles a container `onFocus`) and clicking it landed in the same
  // render batch, so the focus-triggered "pause" and the click's toggle
  // cancelled each other out and the button's first click after any focus
  // change silently did nothing.
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = query.matches;
    const onChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isHoverPaused || isManuallyPaused || prefersReducedMotionRef.current) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_PHOTOS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
    // Re-running this effect whenever `index` changes resets the timer on
    // every manual prev/next click too, so auto-advance always waits a
    // full ROTATE_MS after the last interaction rather than firing early.
  }, [isHoverPaused, isManuallyPaused, index]);

  const goTo = (i: number) => setIndex((i + HERO_PHOTOS.length) % HERO_PHOTOS.length);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Photo highlights"
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      onFocus={() => setIsHoverPaused(true)}
      onBlur={() => setIsHoverPaused(false)}
    >
      {HERO_PHOTOS.map((photo, i) => (
        <div
          key={photo.id}
          role="group"
          aria-hidden={i !== index}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${HERO_PHOTOS.length}: ${photo.caption}`}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />
          ) : (
            // No centered text here on purpose — this sits directly behind
            // the title/tagline overlay, so any centered caption would
            // visually collide with it. The gradient itself just needs to
            // look distinct enough per slide for the rotation to be visible.
            <div
              className={`h-full w-full bg-gradient-to-br ${photo.placeholderGradient}`}
            />
          )}
        </div>
      ))}

      {/* Scrim: guarantees the overlaid title stays readable regardless of
          how bright any given photo (or placeholder) is. */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative flex h-full items-center justify-center px-4 text-center">
        {children}
      </div>

      {/* Hidden below sm: at narrow widths the centered text spans nearly
          edge-to-edge, leaving no room for these without overlapping it.
          The dot indicators below remain available at every width. */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous photo"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 sm:block"
      >
        <span aria-hidden="true">&#8249;</span>
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next photo"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 sm:block"
      >
        <span aria-hidden="true">&#8250;</span>
      </button>

      {/* Each control is a 24px+ hit target (WCAG 2.2 target size); the
          visible dot is a smaller span inside the button. */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/30 px-2 py-0.5">
        {HERO_PHOTOS.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsManuallyPaused((p) => !p)}
          aria-pressed={isManuallyPaused}
          aria-label={isManuallyPaused ? "Play slideshow" : "Pause slideshow"}
          className="ml-1 flex h-6 w-6 items-center justify-center text-xs text-white"
        >
          {isManuallyPaused ? "▶" : "❚❚"}
        </button>
      </div>
    </div>
  );
}
