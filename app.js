import { html, tw, render, useState, useEffect, chroma } from "./external.js";

import { wavySvg } from "./wavySvg.js";
import { usePersistentState } from "./hooks.js";

function randomSeed() {
  return Math.round(Math.random() * 1000000);
}

function App(props) {
  const [seed, setSeed] = usePersistentState("seed", () => randomSeed());
  const [WW, setWW] = usePersistentState("boxW", 1440);
  const [HH, setHH] = usePersistentState("boxH", 400);
  const [points, setPoints] = usePersistentState("points", 3);
  const [angleRange, setAngleRange] = usePersistentState("angleRange", 0.1);
  const [controlMinRate, setControlMinRate] = usePersistentState(
    "controlMinRate",
    0.2
  );
  const [controlMaxLen, setControlMaxLen] = usePersistentState(
    "controlMaxLen",
    500
  );
  const [controlMaxShift, setControlMaxShift] = usePersistentState(
    "controlMaxShift",
    0.25
  );
  const [strokeThickness, setStrokeThickness] = usePersistentState(
    "strokeTickness",
    10
  );
  const [heightRange, setHeightRange] = usePersistentState("heightRange", 0.5);
  const [wavy, setWavy] = useState(() => buildWavy());
  const [color, setColor] = usePersistentState(
    "color",
    chroma("rgb(171, 207, 74)"),
    (v) => v.toString(),
    chroma
  );

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
    controlMaxShift,
    heightRange,
  ]);

  function buildWavy() {
    return wavySvg({
      seed,
      boxW: WW,
      boxH: HH,
      points,
      angleRange,
      controlMinRate,
      controlMaxLen,
      controlMaxShift,
      heightRange,
    });
  }

  function randomizeSeed() {
    setSeed(randomSeed());
  }

  function renderDebugElements() {
    let elements = [];
    elements = elements.concat(
      wavy
        .debugControlPoints()
        .map(([x, y]) => html`<circle cx="${x}" cy="${y}" r="8" fill="#4e4" />`)
    );
    elements = elements.concat(
      wavy
        .debugControlLines()
        .map(
          ([x1, y1, x2, y2]) =>
            html`<line
              x1="${x1}"
              y1="${y1}"
              x2="${x2}"
              y2="${y2}"
              stroke-width="3"
              stroke="#4e4"
            />`
        )
    );
    elements = elements.concat(
      wavy
        .debugPoints()
        .map(([x, y]) => html`<circle cx="${x}" cy="${y}" r="8" fill="#e44" />`)
    );

    return elements;
  }

  return html`
    <div
      class=${tw`font(sans light) pt-4 bg-gray-50`}
      style=${{ background: color.alpha(0.1) }}
    >
      <h1 class=${tw`text(3xl center)`}>
        Wavy SVG seed-based generator and library
      </h1>
      <p class=${tw`text(xl center black opacity-50)`}>
        Made specifically for those wacky page dividers everyone loves
      </p>
      <div class=${tw`text-center pt-4`}>
        ${InputContainer(
          "Seed",
          html`
            <input
              class=${tw`rounded-md p-2 ml-2 shadow-md w-28`}
              type="number"
              value=${seed}
              onInput=${(e) => setSeed(parseInt(e.target.value))}
            />
          `
        )}
        ${RangeInput({
          name: "Points",
          min: 2,
          max: 10,
          value: points,
          onInput: setPoints,
        })}
        ${RangeInput({
          name: "Height Range",
          isRatio: true,
          value: heightRange,
          onInput: setHeightRange,
        })}
        ${RangeInput({
          name: "Angle Range",
          isRatio: true,
          value: angleRange,
          onInput: setAngleRange,
        })}
        ${RangeInput({
          name: "Control Min Rate",
          isRatio: true,
          value: controlMinRate,
          onInput: setControlMinRate,
        })}
        ${RangeInput({
          name: "Control Max Length",
          min: 0,
          max: 1000,
          value: controlMaxLen,
          onInput: setControlMaxLen,
        })}
        ${RangeInput({
          name: "Control Max Shift",
          isRatio: true,
          value: controlMaxShift,
          onInput: setControlMaxShift,
        })}
        ${RangeInput({
          name: "Stroke Thickness",
          min: 0,
          max: 100,
          value: strokeThickness,
          onInput: setStrokeThickness,
        })}
        ${RangeInput({
          name: "Box Width",
          min: 100,
          max: 3000,
          value: WW,
          onInput: setWW,
        })}
        ${RangeInput({
          name: "Box Height",
          min: 100,
          max: 3000,
          value: HH,
          onInput: setHH,
        })}
        ${InputContainer(
          "Color",
          html`
            <label
              style=${{ background: color }}
              class=${tw`relative inline-block bg-white p-1 rounded-md shadow-md w-28 ml-2 h-8 align-middle`}
            >
              <input
                class=${tw`absolute inset-0 opacity-0`}
                type="color"
                value=${color}
                onInput=${(e) => setColor(chroma(e.target.value))}
              />
            </label>
          `
        )}

        <button
          class=${tw`p-2 m-2 bg-blue-400 text-white rounded-md uppercase tracking-wider font-bold transition focus:outline-none hocus:bg-blue-500 hocus:scale-105 active:scale-95`}
          onClick=${randomizeSeed}
        >
          Randomize
        </button>
      </div>
      <style>
        svg path {
          transition: 0.5s;
        }
        svg .fillPath {
          d: path("${wavy.fillPath}");
        }
        svg .strokePath {
          d: path("${wavy.strokePath}");
        }
      </style>
      <div style="${{ color }}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 ${wavy.config.boxW} ${wavy.config.boxH}"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          ${strokeThickness > 0
            ? html`<path
                stroke-opacity="0.5"
                class="strokePath"
                d=""
                stroke-width=${strokeThickness}
                stroke="currentColor"
              ></path>`
            : null}
          <path class="fillPath" d=""></path>
          ${renderDebugElements()}
        </svg>
      </div>
      <code class=${tw`bg-gray-200 p-2 block whitespace-pre-wrap`}
        >${plainTextSvg()}</code
      >
      <button
        class=${tw`block bg-blue-400 text-white p-2 w-full font-bold hover:bg-blue-500`}
        onClick=${() => navigator.clipboard.writeText(plainTextSvg())}
      >
        COPY
      </button>
      <div class=${tw`text-center py-4`}>
        <a class=${tw`opacity-80 cursor-pointer`}>
          ${"Crafted with ❤️ by "}
          <a
            class=${tw`text-blue-500 underline hover:text-blue-700`}
            href="https://ezequielschwartzman.org"
            >Ezequiel</a
          >${" find "}
          <a
            class=${tw`text-blue-500 underline hover:text-blue-700`}
            href="https://github.com/Zequez/wavy-svg-generator"
            >source code on Github</a
          >
        </a>
      </div>
    </div>
  `;

  function plainTextSvg() {
    return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${WW} ${HH}"
  preserveAspectRatio="none"
  fill="currentColor"
>
${
  strokeThickness > 0
    ? `<path
  stroke-opacity="1"
  d="${wavy.strokePath}"
  stroke-width="${strokeThickness}"
  stroke="currentColor"
></path>`
    : ""
}
  <path d="${wavy.fillPath}"></path>
</svg>
`;
  }
}

const InputContainer = (name, inputEl) => html` <div
  class=${tw`mb-4 text(xl black opacity-75)`}
>
  <div class=${tw`sm:inline-block sm:w-1/2 sm:text-right whitespace-nowrap`}>
    ${name}
  </div>
  <div class=${tw`sm:inline-block sm:w-1/2 sm:text-left whitespace-nowrap`}>
    ${inputEl}
  </div>
</div>`;

const RangeInput = ({ name, min, max, value, onInput, isRatio }) => {
  if (isRatio) {
    min = 0;
    max = 1;
  }
  return InputContainer(
    name,
    html`
      <input
        type="range"
        min=${min}
        max=${max}
        value=${value}
        step=${isRatio ? 0.01 : 1}
        class=${tw`cursor-ew-resize mx-2`}
        onInput=${(e) =>
          onInput(
            isRatio ? parseFloat(e.target.value) : parseInt(e.target.value)
          )}
      />
      <span class=${tw`font-mono opacity-70`}
        >${isRatio ? parseFloat(value).toFixed(2) : value}</span
      >
    `
  );
};

render(html`<${App} name="asrtarst" />`, document.getElementById("app"));

function addLine(x1, y1, x2, y2, options = {}) {
  const line = document.createElementNS($svg.getAttribute("xmlns"), "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", options.color || "black");
  $svg.appendChild(line);
}
