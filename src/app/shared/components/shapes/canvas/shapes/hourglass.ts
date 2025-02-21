export function hourglass(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, stage: number, isContMode: boolean = false) {
  const centerX =  innerWidth / 2;
  const centerY = canvas.height / 2;
  const halfSize = innerWidth * 0.4  * (1 - 0.2 * stage);
  const contourPoints: Map<string, { x: number; y: number; }> = new Map<string, { x: number; y: number }>();

  ctx.lineWidth = 5;
  ctx.strokeStyle = isContMode ? '#3131316F' : 'rgba(255, 165, 0, 0.5)';


  const topBaseY = centerY - halfSize;
  const topLeft = { x: centerX - halfSize, y: topBaseY };
  const topRight = { x: centerX + halfSize, y: topBaseY };
  const topVertex = { x: centerX, y: centerY };

  ctx.beginPath();
  ctx.moveTo(topVertex.x, topVertex.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.closePath();
  ctx.stroke();

  addLinePoints(topVertex, topLeft);
  addLinePoints(topLeft, topRight);
  addLinePoints(topRight, topVertex);


  const bottomBaseY = centerY + halfSize; // Основа нижнього трикутника
  const bottomLeft = { x: centerX - halfSize, y: bottomBaseY };
  const bottomRight = { x: centerX + halfSize, y: bottomBaseY };
  const bottomVertex = { x: centerX, y: centerY }; // Вершина нижнього трикутника

  ctx.beginPath();
  ctx.moveTo(bottomVertex.x, bottomVertex.y); // Вершина
  ctx.lineTo(bottomLeft.x, bottomLeft.y); // Ліва точка основи
  ctx.lineTo(bottomRight.x, bottomRight.y); // Права точка основи
  ctx.closePath();
  ctx.stroke();

  function addLinePoints(start: { x: number; y: number }, end: { x: number; y: number }) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    const steps = Math.ceil(distance); // Розбиття на кроки з точністю до 1 пікселя

    for (let i = 0; i <= steps; i += 3) {
      const t = i / steps;
      const x = start.x + t * dx;
      const y = start.y + t * dy;
      contourPoints.set(JSON.stringify({x, y}), {x, y});
    }
  }


  addLinePoints(bottomVertex, bottomLeft);
  addLinePoints(bottomLeft, bottomRight);
  addLinePoints(bottomRight, bottomVertex);

  return contourPoints;
}
