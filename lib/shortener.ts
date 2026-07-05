import { nanoid } from "nanoid";

const DEFAULT_NUMBER = 7;

function shortener() {
  return nanoid(DEFAULT_NUMBER);
}

export default shortener;
