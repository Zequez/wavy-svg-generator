import { prng_alea } from "//cdn.jsdelivr.net/npm/esm-seedrandom/esm/index.min.mjs";
import SvgPath from "./svgPath.js";

let r = () => Math.random();
export function resetSeed(seed) {
  r = seed === undefined ? () => Math.rand() : prng_alea(seed);
}

export function randControl({
  minLen = 200,
  maxLen = 500,
  maxShift = 0.25,
  angleRange = 0.5,
}) {
  const angle = (r() * Math.PI - Math.PI / 2) * angleRange;
  const length = r() * (maxLen - minLen) + minLen;
  const shift = r() * ((length / 2) * maxShift);

  // soh cah toa
  const x1 = -Math.cos(angle) * (length / 2 + shift);
  const y1 = Math.sin(angle) * (length / 2 + shift);
  const x2 = Math.cos(angle) * (length / 2 - shift);
  const y2 = -Math.sin(angle) * (length / 2 - shift);

  return { x1, y1, x2, y2 };
}

export function randControls(num, options) {
  return [...Array(num)].map(() => randControl(options));
}

export function randHeight(HH, range) {
  return r() * range * HH + HH * ((1 - range) / 2);
}

export function randomPoints(WW, HH, points, { heightRange = 0.5 }) {
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

  return pointsX.map((x) => ({ x, y: randHeight(HH, heightRange) }));
}

export function wavySvg(seed, WW, HH, points, { angleRange }) {
  const path = new SvgPath();

  resetSeed(seed);
  const p = randomPoints(WW, HH, points, { heightRange: 0.5 });
  const c = randControls(points, {
    minLen: 150,
    maxLen: 150,
    angleRange,
    maxShift: 0,
  });

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

  path.line(WW, HH);
  path.line(0, HH);
  path.end();

  const result = {
    path: path.result(),
    debugPoints: () => {
      const points = [];
      path.instructions.map(([command, ...args]) => {
        // console.log(command, args);
        if (command === "M") points.push(args);
        else if (command === "C") {
          points.push([args[4], args[5]]);
        }
      });

      return points;
    },
    debugControlPoints: () => {
      const points = [];
      path.instructions.map(([command, ...args]) => {
        // console.log(command, args);
        if (command === "C") {
          points.push([args[0], args[1]]);
          points.push([args[2], args[3]]);
        }
      });
      return points;
    },
  };

  return result;
}
