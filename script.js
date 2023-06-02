const WW = 1440;
const HH = 300;

const $svg = document.querySelector("svg");
const $wavePath = $svg.querySelector("#wave");

function setViewBox(w, h) {
  $svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
}

function setPath(data) {
  $wavePath.setAttribute("d", data);
}

function addDot(x, y, options = {}) {
  const circle = document.createElementNS($svg.getAttribute("xmlns"), "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", "8");
  circle.setAttribute("fill", options.color || "rgba(255,0,0,0.5)");
  $svg.appendChild(circle);
}

function addLine(x1, y1, x2, y2, options = {}) {
  const line = document.createElementNS($svg.getAttribute("xmlns"), "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", options.color || "black");
  $svg.appendChild(line);
}

class PathData {
  instructions = [];

  add(...values) {
    this.instructions.push(values);
  }

  result() {
    return this.instructions.map((arr) => arr.join(" ")).join(",");
  }

  move(x, y) {
    this.add("M", x, y);
    addDot(x, y);
  }
  line(x, y) {
    this.add("L", x, y);
    addDot(x, y);
  }

  curve(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.add("C", cp1x, cp1y, cp2x, cp2y, x, y);
    addDot(cp1x, cp1y, { color: "green" });
    addDot(cp2x, cp2y, { color: "green" });
    addDot(x, y);
  }

  scurve(cp2x, cp2y, x, y) {
    this.add("S", cp2x, cp2y, x, y);
    addDot(cp2x, cp2y, { color: "green" });
    addDot(x, y);
  }

  end() {
    this.add("Z");
  }
}

setViewBox(WW, HH);

const path = new PathData();
randomWave(path);
path.line(WW, HH);
path.line(0, HH);
path.end();

setPath(path.result());

// ██╗   ██╗████████╗██╗██╗     ███████╗
// ██║   ██║╚══██╔══╝██║██║     ██╔════╝
// ██║   ██║   ██║   ██║██║     ███████╗
// ██║   ██║   ██║   ██║██║     ╚════██║
// ╚██████╔╝   ██║   ██║███████╗███████║
//  ╚═════╝    ╚═╝   ╚═╝╚══════╝╚══════╝

function r() {
  return Math.random();
}

function randControl() {
  const angle = r() * Math.PI * 0.5 + 0.25 * Math.PI;
  const length = r() * 300 + 200;
  const shift = r() * ((length / 2) * 0.25);

  const x1 = -Math.sin(angle) * (length / 2 + shift);
  const y1 = Math.cos(angle) * (length / 2 + shift);
  const x2 = Math.sin(angle) * (length / 2 - shift);
  const y2 = -Math.cos(angle) * (length / 2 - shift);

  return { x1, y1, x2, y2 };
}

function randControls(num) {
  return [...Array(num)].map(() => randControl());
}

function randHeight() {
  return r() * 0.5 * HH + HH * 0.25;
}

function randomPoints(points) {
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
    console.log(newPointX);
    pointsX.splice(pointsDXIndex + 1, 0, Math.round(newPointX));
  }

  for (let i = 0; i < extraPoints; ++i) {
    addPoint();
  }

  return pointsX.map((x) => ({ x, y: randHeight() }));
}

function randomWave(path) {
  const points = 5;
  const p = randomPoints(points);
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
