/** Exact colours sampled from the client's existing website screenshot. */
export const C = {
  forest: "#43952D", // header + hero background
  forestDeep: "#2F681F", // pressed / deeper accents
  cream: "#F1E9D4", // primary button on green
  paper: "#F8F5EC", // light section background
  white: "#FFFFFF",
  ink: "#1C3D2C", // headings on light sections
  inkSoft: "rgba(28,61,44,0.68)", // body text on light sections
  line: "rgba(28,61,44,0.14)", // hairlines on light sections
  onForestSoft: "rgba(241,233,212,0.72)", // body text on green
  onForestLine: "rgba(241,233,212,0.22)",
  chip: "#616161", // grey chip / label
  danger: "#9B2C2C",
  ok: "#2F7D4F",
} as const;

/** Wide-screen helper values. */
export const MAX_CONTENT = 720; // forms / text screens
export const MAX_WIDE = 1100; // grids
