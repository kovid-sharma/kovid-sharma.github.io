interface HazeColor {
  hue: number;
  saturation: number;
  lightness: number;
}

interface HazeBlob {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  color: HazeColor;
  opacity: number;
  midpoint: number;
  blendMode: GlobalCompositeOperation;
}

type RandomFunction = () => number;

const dataUrlCache = new Map<string, Promise<string>>();
const MAX_CACHE_ENTRIES = 32;

export function stableHazeSeed(value: string): string {
  return [0, 1, 2, 3]
    .map((part) => hashSeed(`${part}:${value}`).toString(16).padStart(8, '0'))
    .join('');
}

export function hazePlaceholderColor(seed: string): string {
  const random = createSeededRandom(seed);
  const hue = randomBetween(random, 0, 360);
  return `hsl(${hue} 62% 58%)`;
}

export function getHazeThumbnailDataUrl(
  seed: string,
  width = 640,
  height = 400,
): Promise<string> {
  const key = `${seed}:${width}:${height}`;
  const cached = dataUrlCache.get(key);
  if (cached) return cached;

  const rendered = Promise.resolve().then(() =>
    generateHazeThumbnail(seed, width, height),
  );

  if (dataUrlCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = dataUrlCache.keys().next().value;
    if (oldestKey) dataUrlCache.delete(oldestKey);
  }
  dataUrlCache.set(key, rendered);
  return rendered;
}

function generateHazeThumbnail(
  seed: string,
  width: number,
  height: number,
): string {
  const random = createSeededRandom(seed);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create 2D canvas context.');

  const palette = generatePalette(random);
  const blobs = generateBlobs(random, palette, width, height);

  drawBackground(context, width, height, palette, random);
  drawBlurredBlobs(context, width, height, blobs, random);
  drawLightLeak(context, width, height, palette, random);
  drawVignette(context, width, height, random);
  drawGrain(context, width, height, random);

  return canvas.toDataURL('image/webp', 0.86);
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: string): RandomFunction {
  let state = hashSeed(seed);
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(
  random: RandomFunction,
  minimum: number,
  maximum: number,
): number {
  return minimum + random() * (maximum - minimum);
}

function randomInteger(
  random: RandomFunction,
  minimum: number,
  maximum: number,
): number {
  return Math.floor(randomBetween(random, minimum, maximum + 1));
}

function randomItem<T>(random: RandomFunction, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)];
}

function generatePalette(random: RandomFunction): HazeColor[] {
  const baseHue = randomBetween(random, 0, 360);
  const paletteTypes = [
    [-35, -12, 10, 38],
    [-25, 0, 25, 50],
    [-45, -10, 20, 75],
    [-20, 8, 35, 160],
  ] as const;
  const hueOffsets = randomItem(random, paletteTypes);
  return hueOffsets.map((offset, index) => ({
    hue: normalizeHue(baseHue + offset),
    saturation: randomBetween(random, 65, 96),
    lightness:
      index === 1
        ? randomBetween(random, 70, 88)
        : randomBetween(random, 45, 76),
  }));
}

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

function hsl(color: HazeColor, alpha = 1): string {
  return `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${alpha})`;
}

function generateBlobs(
  random: RandomFunction,
  palette: HazeColor[],
  width: number,
  height: number,
): HazeBlob[] {
  const blobCount = randomInteger(random, 5, 9);
  const minimumDimension = Math.min(width, height);
  const blendModes: GlobalCompositeOperation[] = [
    'source-over',
    'screen',
    'soft-light',
    'lighter',
  ];

  return Array.from({ length: blobCount }, () => ({
    x: randomBetween(random, -width * 0.15, width * 1.15),
    y: randomBetween(random, -height * 0.15, height * 1.15),
    radiusX: randomBetween(
      random,
      minimumDimension * 0.25,
      minimumDimension * 0.85,
    ),
    radiusY: randomBetween(
      random,
      minimumDimension * 0.2,
      minimumDimension * 0.75,
    ),
    rotation: randomBetween(random, -Math.PI, Math.PI),
    color: randomItem(random, palette),
    opacity: randomBetween(random, 0.45, 0.95),
    midpoint: randomBetween(random, 0.3, 0.7),
    blendMode: randomItem(random, blendModes),
  }));
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: HazeColor[],
  random: RandomFunction,
): void {
  const angle = randomBetween(random, 0, Math.PI * 2);
  const centerX = width / 2;
  const centerY = height / 2;
  const vectorX = Math.cos(angle) * width;
  const vectorY = Math.sin(angle) * height;
  const gradient = context.createLinearGradient(
    centerX - vectorX / 2,
    centerY - vectorY / 2,
    centerX + vectorX / 2,
    centerY + vectorY / 2,
  );
  gradient.addColorStop(0, hsl(palette[0]));
  gradient.addColorStop(0.5, hsl(palette[1]));
  gradient.addColorStop(1, hsl(palette[2]));
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawBlurredBlobs(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  blobs: HazeBlob[],
  random: RandomFunction,
): void {
  const blobCanvas = document.createElement('canvas');
  blobCanvas.width = width;
  blobCanvas.height = height;
  const blobContext = blobCanvas.getContext('2d');
  if (!blobContext) throw new Error('Unable to create blob canvas context.');

  for (const blob of blobs) {
    blobContext.save();
    blobContext.globalCompositeOperation = blob.blendMode;
    blobContext.translate(blob.x, blob.y);
    blobContext.rotate(blob.rotation);
    blobContext.scale(blob.radiusX, blob.radiusY);
    const gradient = blobContext.createRadialGradient(0, 0, 0, 0, 0, 1);
    gradient.addColorStop(0, hsl(blob.color, blob.opacity));
    gradient.addColorStop(blob.midpoint, hsl(blob.color, blob.opacity * 0.55));
    gradient.addColorStop(1, hsl(blob.color, 0));
    blobContext.fillStyle = gradient;
    blobContext.beginPath();
    blobContext.arc(0, 0, 1, 0, Math.PI * 2);
    blobContext.fill();
    blobContext.restore();
  }

  const blurAmount =
    Math.min(width, height) * randomBetween(random, 0.055, 0.11);
  context.save();
  context.filter = `blur(${blurAmount}px) saturate(115%)`;
  context.drawImage(blobCanvas, 0, 0);
  context.restore();
}

function drawLightLeak(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: HazeColor[],
  random: RandomFunction,
): void {
  const x = randomBetween(random, width * 0.15, width * 0.85);
  const y = randomBetween(random, height * 0.1, height * 0.9);
  const radius = Math.min(width, height) * randomBetween(random, 0.35, 0.85);
  const lightColor: HazeColor = {
    hue: palette[1].hue,
    saturation: randomBetween(random, 25, 55),
    lightness: randomBetween(random, 88, 97),
  };
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, hsl(lightColor, 0.55));
  gradient.addColorStop(0.4, hsl(lightColor, 0.2));
  gradient.addColorStop(1, hsl(lightColor, 0));
  context.save();
  context.globalCompositeOperation = 'screen';
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function drawVignette(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  random: RandomFunction,
): void {
  const centerX = randomBetween(random, width * 0.35, width * 0.65);
  const centerY = randomBetween(random, height * 0.35, height * 0.65);
  const radius = Math.max(width, height) * 0.8;
  const gradient = context.createRadialGradient(
    centerX,
    centerY,
    radius * 0.15,
    centerX,
    centerY,
    radius,
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
  context.save();
  context.globalCompositeOperation = 'multiply';
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function drawGrain(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  random: RandomFunction,
): void {
  const noiseSize = 128;
  const noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = noiseSize;
  noiseCanvas.height = noiseSize;
  const noiseContext = noiseCanvas.getContext('2d');
  if (!noiseContext) throw new Error('Unable to create noise canvas context.');
  const imageData = noiseContext.createImageData(noiseSize, noiseSize);
  const pixels = imageData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    const value = randomInteger(random, 0, 255);
    pixels[index] = value;
    pixels[index + 1] = value;
    pixels[index + 2] = value;
    pixels[index + 3] = randomInteger(random, 12, 35);
  }
  noiseContext.putImageData(imageData, 0, 0);
  const pattern = context.createPattern(noiseCanvas, 'repeat');
  if (!pattern) return;
  context.save();
  context.globalAlpha = 0.12;
  context.globalCompositeOperation = 'soft-light';
  context.fillStyle = pattern;
  context.fillRect(0, 0, width, height);
  context.restore();
}
