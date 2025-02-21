export function eight(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, stage: number, isContMode: boolean = false) {
  const centerX =  innerWidth / 2;
  const centerY = canvas.height / 2;
  const radius = innerWidth * 0.2 * (1 - 0.2 * stage);
  const contourPoints: Map<string, { x: number; y: number; }> = new Map<string, { x: number; y: number }>();

  ctx.strokeStyle = isContMode ? '#3131316F' : 'rgba(255, 0, 0, 0.5)';
  ctx.lineWidth = 5;

  const leftCenter = { x: centerX - radius, y: centerY };
  const rightCenter = { x: centerX + radius, y: centerY };

  function addCirclePoints(centerX: number, centerY: number, radius: number) {
    const circumference = 2 * Math.PI * radius;
    const pointCount = Math.floor(circumference / 3);

    for (let i = 0; i <  pointCount; i++) {
      const angle = (i / pointCount) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const point = { x: Math.round(x), y: Math.round(y) };
      contourPoints.set(JSON.stringify(point), point);
    }
  }

  ctx.beginPath();
  ctx.arc(leftCenter.x, leftCenter.y, radius, 0, 2 * Math.PI);

  ctx.stroke();
  addCirclePoints(leftCenter.x, leftCenter.y, radius);

  ctx.beginPath();
  ctx.arc(rightCenter.x, rightCenter.y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  addCirclePoints(rightCenter.x, rightCenter.y, radius);

  return contourPoints;
}
