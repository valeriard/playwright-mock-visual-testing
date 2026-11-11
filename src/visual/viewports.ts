export const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  mobile: { width: 375, height: 812 },
} as const;

export type ViewportName = keyof typeof VIEWPORTS;

/** "desktop-1280x720": goes into every baseline file name so the image says how it was taken. */
export function viewportLabel(name: ViewportName): string {
  const { width, height } = VIEWPORTS[name];
  return `${name}-${width}x${height}`;
}
