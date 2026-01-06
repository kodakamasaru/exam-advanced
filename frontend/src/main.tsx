/**
 * エントリポイント
 */

import { render } from "preact";
import { App } from "./App";
import "./style/main.css";

const root = document.getElementById("app");
if (root) {
  render(<App />, root);
}
