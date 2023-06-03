import { h, render } from "//esm.sh/preact";
import { useState, useEffect } from "//esm.sh/preact/hooks";
import htm from "//esm.sh/htm";
import { tw, setup } from "//cdn.skypack.dev/twind";
import chroma from "//esm.sh/chroma-js";
import { prng_alea } from "//cdn.jsdelivr.net/npm/esm-seedrandom/esm/index.min.mjs";

setup({
  variants: {
    hocus: ["&:hover", "&:focus"],
  },
});

const html = htm.bind(h);

export { html, render, useState, useEffect, tw, chroma, prng_alea };
