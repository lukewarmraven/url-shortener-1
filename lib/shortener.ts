import { nanoid } from "nanoid";
import React from "react";

const DEFAULT_NUMBER = 7;

function shortener(url: string) {
  const code = nanoid(DEFAULT_NUMBER);
  return code;
}

export default shortener;
