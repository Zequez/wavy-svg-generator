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

import { wavySvg } from "./wavySvg.js";

function randomSeed() {
  return Math.round(Math.random() * 1000000);
}

function App(props) {
  const [seed, setSeed] = useState(() => randomSeed());
  const [WW, setWW] = useState(1440);
  const [HH, setHH] = useState(300);
  const [points, setPoints] = useState(3);
  const [angleRange, setAngleRange] = useState(0.1);
  const [controlMinRate, setControlMinRate] = useState(0.2);
  const [controlMaxLen, setControlMaxLen] = useState(500);
  const [maxShift, setMaxShift] = useState(0.25);
  const [wavy, setWavy] = useState(() => buildWavy());

  useEffect(() => {
    setWavy(buildWavy());
  }, [
    WW,
    HH,
    points,
    seed,
    angleRange,
    controlMinRate,
    controlMaxLen,
    maxShift,
  ]);

  function buildWavy() {
    return wavySvg(seed, WW, HH, points, {
      angleRange,
      controlMinLen: controlMinRate,
      controlMaxLen,
      controlMaxShift: maxShift,
    });
  }

  function randomizeSeed() {
    setSeed(randomSeed());
  }

  function renderDebugElements() {
    let elements = [];
    elements = elements.concat(
      wavy
        .debugPoints()
        .map(([x, y]) => html`<circle cx="${x}" cy="${y}" r="8" fill="red" />`)
    );
    elements = elements.concat(
      wavy
        .debugControlPoints()
        .map(
          ([x, y]) => html`<circle cx="${x}" cy="${y}" r="8" fill="green" />`
        )
    );

    return elements;
  }

  return html`
    <div class=${tw`font(sans light) pt-4 bg-gray-50`}>
      <h1 class=${tw`text(3xl center)`}>
        Wavy SVG seed-based generator and library
      </h1>
      <p class=${tw`text(xl center black opacity-50)`}>
        Made specifically for those wacky page dividers everyone loves
      </p>
      <div class=${tw`text-center pt-4`}>
        <div class=${tw`mb-4 text(xl black opacity-75)`}>
          Seed
          <input
            class=${tw`rounded-md p-2 mx-2 shadow-md`}
            type="number"
            value=${seed}
            onInput=${(e) => setSeed(parseInt(e.target.value))}
          />
        </div>
        <div class=${tw`mb-4 text(xl black opacity-75)`}>
          Points
          <input
            type="range"
            min="2"
            max="10"
            value=${points}
            class=${tw`cursor-ew-resize mx-2`}
            onInput=${(e) => setPoints(parseInt(e.target.value))}
          />
          <span class=${tw`font-mono opacity-70`}>${points}</span>
        </div>
        <div class=${tw`mb-4 text(xl black opacity-75)`}>
          Angle Range
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value=${angleRange}
            class=${tw`cursor-ew-resize mx-2`}
            onInput=${(e) => setAngleRange(parseFloat(e.target.value))}
          />
          <span class=${tw`font-mono opacity-70`}
            >${Number.parseFloat(angleRange).toFixed(2)}</span
          >
        </div>
        <div class=${tw`mb-4 text(xl black opacity-75)`}>
          Control Min Rate
          <input
            type="range"
            min="0"
            step="0.01"
            max="1"
            value=${controlMinRate}
            class=${tw`cursor-ew-resize mx-2`}
            onInput=${(e) => setControlMinRate(parseFloat(e.target.value))}
          />
          <span class=${tw`font-mono opacity-70`}
            >${Number.parseFloat(controlMinRate).toFixed(2)}</span
          >
        </div>
        <div class=${tw`mb-4 text(xl black opacity-75)`}>
          Control Max Length
          <input
            type="range"
            min="0"
            max="1000"
            value=${controlMaxLen}
            class=${tw`cursor-ew-resize mx-2`}
            onInput=${(e) => setControlMaxLen(parseInt(e.target.value))}
          />
          <span class=${tw`font-mono opacity-70`}>${controlMaxLen}</span>
        </div>
        <div class=${tw`mb-4 text(xl black opacity-75)`}>
          Control Max Shift
          <input
            type="range"
            min="0"
            step="0.01"
            max="1"
            value=${maxShift}
            class=${tw`cursor-ew-resize mx-2`}
            onInput=${(e) => setMaxShift(parseFloat(e.target.value))}
          />
          <span class=${tw`font-mono opacity-70`}
            >${Number.parseFloat(maxShift).toFixed(2)}</span
          >
        </div>
        <button
          class=${tw`p-2 m-2 bg-blue-400 text-white rounded-md uppercase tracking-wider font-bold transition focus:outline-none hocus:bg-blue-500 hocus:scale-105 active:scale-95`}
          onClick=${randomizeSeed}
        >
          Randomize
        </button>
      </div>
      <style>
        svg path {
          d: path("${wavy.path}");
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
  <path fill-opacity="1" d="${wavy.path}"></path>
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
