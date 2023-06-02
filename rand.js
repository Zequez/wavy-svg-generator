export function r() {
  return Math.random();
}

export function randControl() {
  const angle = r() * Math.PI * 0.5 + 0.25 * Math.PI;
  const length = r() * 300 + 200;
  const shift = r() * ((length / 2) * 0.25);

  const x1 = -Math.sin(angle) * (length / 2 + shift);
  const y1 = Math.cos(angle) * (length / 2 + shift);
  const x2 = Math.sin(angle) * (length / 2 - shift);
  const y2 = -Math.cos(angle) * (length / 2 - shift);

  return { x1, y1, x2, y2 };
}

export function randControls(num) {
  return [...Array(num)].map(() => randControl());
}

export function randHeight(HH) {
  return r() * 0.5 * HH + HH * 0.25;
}

export function randomPoints(WW, HH, points) {
  if (points < 2) throw "Must be at least 2";

  const extraPoints = points - 2;
  const minSpace = 0.25;
  const pointsX = [0, WW];
  function addPoint() {
    const pointsDX = [];
    for (let i = 0; i < pointsX.length - 1; ++i) {
      pointsDX.push(pointsX[i + 1] - pointsX[i]);
    }
    const pointsDXMax = Math.max(...pointsDX);
    const pointsDXIndex = pointsDX.indexOf(pointsDXMax);
    const newPointX =
      pointsX[pointsDXIndex] +
      r() * pointsDXMax * (1 - minSpace * 2) +
      pointsDXMax * minSpace;
    pointsX.splice(pointsDXIndex + 1, 0, Math.round(newPointX));
  }

  for (let i = 0; i < extraPoints; ++i) {
    addPoint();
  }

  return pointsX.map((x) => ({ x, y: randHeight(HH) }));
}

export function randomWave(WW, HH, points, path) {
  const p = randomPoints(WW, HH, points);
  const c = randControls(points);

  path.move(p[0].x, p[0].y);
  for (let i = 1; i < points; ++i) {
    const p0 = p[i - 1];
    const c0 = c[i - 1];
    const p1 = p[i];
    const c1 = c[i];
    path.curve(
      p0.x + c0.x2,
      p0.y + c0.y2,
      p1.x + c1.x1,
      p1.y + c1.y1,
      p1.x,
      p1.y
    );
  }
}
