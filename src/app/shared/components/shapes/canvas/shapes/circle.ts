export function circle(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, stage: number, isContMode: boolean = false) {
  const centerX =  innerWidth / 2;
  const centerY = canvas.height / 2;
  const radius = innerWidth * 0.4 * (1 - 0.2 * stage);
  const contourPoints: Map<string, { x: number; y: number; }> = new Map<string, { x: number; y: number }>();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 5;
  ctx.strokeStyle = isContMode ? '#3131316F' : 'rgba(0, 128, 128, 0.5)';
  ctx.stroke();

  const circumference = 2 * Math.PI * radius;
  const pointCount = Math.floor(circumference / 3);

  for (let i = 0; i < pointCount; i++) {
    const angle = (i / pointCount) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const point = { x: Math.round(x), y: Math.round(y) };
    contourPoints.set(JSON.stringify(point), point);
  }
  return contourPoints;
}
