/**
 * Photos for the Home page hero carousel. `src` is left empty until real
 * photos are uploaded — the carousel renders an honest "photo coming soon"
 * placeholder instead of a fake stock image when it's missing.
 *
 * To add a real photo: drop the file in /public/hero/ and fill in `src`
 * (e.g. "/hero/step-show.jpg") and a real, specific `alt` description of
 * that photo. Once every entry has a photo, this file (and this comment)
 * can just be trimmed down — nothing else needs to change.
 */

export type HeroPhoto = {
  id: string;
  src: string | null;
  alt: string;
  caption: string;
  /** Tailwind gradient classes used only while `src` is null, so the
   * rotation is still visible even without real photos yet. */
  placeholderGradient: string;
};

export const HERO_PHOTOS: HeroPhoto[] = [
  {
    id: "scholarship",
    src: null,
    alt: "",
    caption: "Scholarship",
    placeholderGradient: "from-brand via-black/40 to-brand",
  },
  {
    id: "service",
    src: null,
    alt: "",
    caption: "Service",
    placeholderGradient: "from-accent/70 via-brand to-black/60",
  },
  {
    id: "sisterhood-brotherhood",
    src: null,
    alt: "",
    caption: "Sisterhood & Brotherhood",
    placeholderGradient: "from-black/70 via-brand to-accent/60",
  },
  {
    id: "unity",
    src: null,
    alt: "",
    caption: "Unity",
    placeholderGradient: "from-brand via-accent/50 to-black/50",
  },
];
