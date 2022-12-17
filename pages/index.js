import { App } from "../components/App";
import { BABEL_CONFIG, SOURCE } from "./src";

export default () => (
  <div>
    <App defaultBabelConfig={BABEL_CONFIG} defaultSource={SOURCE} />
  </div>
);
