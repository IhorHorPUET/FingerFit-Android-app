export function rectangle(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, stage: number, isContentMode: boolean = false) {
  const width = innerWidth * 0.8 * (1 - 0.2 * stage);
  const height = width * 0.6 * (1 - 0.2 * stage);
  const canvasHeight = innerHeight - 60;
  const y = canvasHeight / 2 - height / 2;
  const x = innerWidth / 2 - width / 2;
  const contourPoints: Map<string, { x: number; y: number; }> = new Map<string, { x: number; y: number }>();

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.lineWidth = 5;
  ctx.strokeStyle = isContentMode ? '#3131316F' : 'rgba(128, 0, 128, 0.5)';
  ctx.stroke();

  for (let i = 0; i <= Math.max(width, height); i += 3) {

    if (i <= width) {
      const top = {x: x + i, y};
      contourPoints.set(JSON.stringify(top), top);
    }

    if (i <= height) {
      const right = {x: x + width, y: y + i};
      contourPoints.set(JSON.stringify(right), right);
    }

    if (i <= width) {
      const bottom = {x: x + width - i, y: y + height};
      contourPoints.set(JSON.stringify(bottom), bottom);
    }

    if (i <= height) {
      const left = {x, y: y + height - i};
      contourPoints.set(JSON.stringify(left), left);
    }
  }
  return contourPoints;
}
