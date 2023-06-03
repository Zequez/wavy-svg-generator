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
  const [strokeThickness, setStrokeThickness] = useState(10);
  const [heightRange, setHeightRange] = useState(0.5);
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
    heightRange,
  ]);

  function buildWavy() {
    return wavySvg(seed, WW, HH, points, {
      angleRange,
      controlMinLen: controlMinRate,
      controlMaxLen,
      controlMaxShift: maxShift,
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
        .map(([x, y]) => html`<circle cx="${x}" cy="${y}" r="8" fill="#0F0" />`)
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
              stroke="#0F0"
            />`
        )
    );
    elements = elements.concat(
      wavy
        .debugPoints()
        .map(([x, y]) => html`<circle cx="${x}" cy="${y}" r="8" fill="#F00" />`)
    );
    console.log(wavy.debugControlLines());

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
        ${InputContainer(
          "Seed",
          html`
            <input
              class=${tw`rounded-md p-2 mx-2 shadow-md w-28`}
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
          value: maxShift,
          onInput: setMaxShift,
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${WW} ${HH}"
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
        <path fill-opacity="1" class="fillPath" d=""></path>
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
  <path fill-opacity="1" d="${wavy.fillPath}"></path>
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
