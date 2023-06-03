# Wavy SVG seed-based generator

![Alt text](/screenshot.png?raw=true "App UI screenshot")

## Features

- 10 parameters to customize the generator
- Randomness is seed based, it will always generate the same result with the same seed
- Stroke generator in addition to filled shape
- Visualization of bezier curves control points
- Text SVG output and quick copy button
- Configuration persists on browser local storage, so you don't miss your tuning when you reload or close the app

## Use as a library

```javascript
  import wavySvg from 'https://cdn.jsdelivr.net/gh/zequez/wavy-svg-generator@0.1.0/wavySvg.js';

  const wavy = wavySvg({
    seed,
    boxW,
    boxH,
    points,
    angleRange,
    controlMinRate,
    controlMaxLen,
    controlMaxShift,
    heightRange,
  });

  html`<path  stroke-width="4" stroke="currentColor" d=${wavy.strokePath}></path>`
  html`<path fill="currentColor" d=${wavy.strokePath}></path>`
```

## Bundler-free development

I developed this without using any package bundler, using JS modules and a plain HTML file

You can grab yourself a pretty solid bundler-free toolbox with:

```javascript
import { h, render } from "https://esm.sh/preact";
import { useState, useEffect } from "https://esm.sh/preact/hooks";
import htm from "https://esm.sh/htm";
import { tw, setup } from "https://cdn.skypack.dev/twind";
const html = htm.bind(h);

function App(props) {
  return html`<div>Hello ${props.name} World</div>`;
}

render(html`<${App} name="World" />`, document.getElementById("app"));
```

Look how clean the repo is! Just plain HTML and JavaScript.

Sure there is no pre-rendering... yet. There are some possible work arounds. I'm thinking a small file server that allows outputting to the filesystem. And we can pre-render on the browser and output hydratable static files.

For the development process, I just use [VSCode Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server). It creates a static file server for the files and reload the page on changes.

## License

All code is copyleft under the *GPL V3* software license.