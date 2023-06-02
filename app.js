import { h, render } from "https://esm.sh/preact";
import { useState, useEffect } from "https://esm.sh/preact/hooks";
import htm from "https://esm.sh/htm";
import { tw, setup } from "https://cdn.skypack.dev/twind";
const html = htm.bind(h);

setup({
  variants: {
    hocus: ["&:hover", "&:focus"],
  },
});

import SvgPath from "./svgPath.js";
import { randomWave } from "./rand.js";

function generatePath(WW, HH, points) {
  const path = new SvgPath();
  randomWave(WW, HH, points, path);
  path.line(WW, HH);
  path.line(0, HH);
  path.end();
  return path.result();
}

function App(props) {
  const [WW, setWW] = useState(1440);
  const [HH, setHH] = useState(300);
  const [points, setPoints] = useState(3);
  const [pathData, setPathData] = useState(generatePath(WW, HH, points));

  useEffect(() => {
    setPathData(generatePath(WW, HH, points));
  }, [WW, HH, points]);

  function regeneratePath() {
    setPathData(generatePath(WW, HH, points));
  }

  function renderDebugElements() {
    return html`<circle cx="100" cy="100" r="10" fill="red" />`;
  }

  return html`
    <div class=${tw`font(sans light) pt-4`}>
      <h1 class=${tw`text(3xl center)`}>
        Wavy SVG seed-based generator and library
      </h1>
      <p class=${tw`text(xl center black opacity-50)`}>
        Made specifically for those wacky page dividers everyone loves
      </p>
      <div class=${tw`text-center pt-4`}>
        <div class=${tw`text(xl black opacity-75)`}>
          Points
          <input
            type="range"
            min="2"
            max="10"
            value=${points}
            class=${tw`cursor-ew-resize mx-2`}
            onInput=${(e) => setPoints(parseInt(e.target.value))}
          />
          ${points}
        </div>
        <button
          class=${tw`p-2 m-2 bg-blue-400 text-white rounded-md uppercase tracking-wider font-bold transition focus:outline-none hocus:bg-blue-500 hocus:scale-105 active:scale-95`}
          onClick=${regeneratePath}
        >
          Randomize
        </button>
      </div>
      <style>
        svg path {
          d: path("${pathData}");
          transition: 0.5s;
        }
      </style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${WW} ${HH}"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path fill-opacity="1" d=""></path>
        ${renderDebugElements()}
      </svg>
      <code class=${tw`bg-gray-200 p-2 block whitespace-pre-wrap`}
        >${plainTextSvg()}</code
      >
      <button
        class=${tw`block bg-blue-400 text-white p-2 w-full font-bold hover:bg-blue-500`}
        onClick=${() => navigator.clipboard.writeText(plainTextSvg())}
      >
        COPY
      </button>
    </div>
  `;

  function plainTextSvg() {
    return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${WW} ${HH}"
  preserveAspectRatio="none"
  fill="currentColor"
>
  <path fill-opacity="1" d="${pathData}"></path>
</svg>
`;
  }
}

render(html`<${App} name="asrtarst" />`, document.getElementById("app"));

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
