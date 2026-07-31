export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export async function preloadImages(sources: string[]): Promise<void> {
  await Promise.all(sources.map(preloadImage));
}
