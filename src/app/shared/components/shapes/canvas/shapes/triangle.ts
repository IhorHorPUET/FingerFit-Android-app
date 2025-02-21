export function triangle(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  stage: number,
  isContentMode: boolean = false
) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const size = canvas.width * 0.4 * (1 - 0.1 * stage);
  const contourPoints: Map<string, { x: number; y: number }> = new Map();

  ctx.lineWidth = 5;
  ctx.strokeStyle = isContentMode ? '#3131316F' : 'rgba(0, 0, 255, 0.5)';

  const topVertex = { x: centerX, y: centerY - size };
  const bottomLeft = { x: centerX - size, y: centerY + size };
  const bottomRight = { x: centerX + size, y: centerY + size };


  ctx.beginPath();
  ctx.moveTo(topVertex.x, topVertex.y);
  ctx.lineTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.closePath();
  ctx.stroke();


  addLinePoints(topVertex, bottomLeft);
  addLinePoints(bottomLeft, bottomRight);
  addLinePoints(bottomRight, topVertex);

  function addLinePoints(start: { x: number; y: number }, end: { x: number; y: number }) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    const steps = Math.ceil(distance);

    for (let i = 0; i <= steps; i += 3) {
      const t = i / steps;
      const x = start.x + t * dx;
      const y = start.y + t * dy;
      contourPoints.set(JSON.stringify({ x, y }), { x, y });
    }
  }

  return contourPoints;
}
