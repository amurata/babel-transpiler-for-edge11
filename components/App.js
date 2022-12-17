import React from "react";
import * as Babel from "@babel/core";

import { Editor } from "./Editor";

// take from @babel/standalone
import {
  presets as availablePresets,
  plugins as availablePlugins
} from "../plugins-list";

function loadBuiltin(builtinTable, name) {
  if (Array.isArray(name) && typeof name[0] === "string") {
    if (builtinTable?.[name[0]]) {
      return [builtinTable[name[0]]].concat(name.slice(1));
    }
    return;
  } else if (typeof name === "string") {
    return builtinTable[name];
  }
  // Could be an actual preset/plugin module
  return name;
}

function processOptions(options) {
  if (typeof options === "string") options = JSON.parse(options);

  // Parse preset names
  const presets = (options.presets || []).map((presetName) => {
    const preset = loadBuiltin(availablePresets, presetName);

    if (preset) {
      // workaround for babel issue
      // at some point, babel copies the preset, losing the non-enumerable
      // buildPreset key; convert it into an enumerable key.
      if (
        Array.isArray(preset) &&
        typeof preset[0] === "object" &&
        preset[0]?.buildPreset
      ) {
        preset[0] = { ...preset[0], buildPreset: preset[0].buildPreset };
      }
    } else {
      throw new Error(
        `Invalid preset specified in Babel options: "${presetName}"`
      );
    }
    return preset;
  });

  // Parse plugin names
  const plugins = (options.plugins || []).map((pluginName) => {
    const plugin = loadBuiltin(availablePlugins, pluginName);

    if (!plugin) {
      throw new Error(
        `Invalid plugin specified in Babel options: "${pluginName}"`
      );
    }
    return plugin;
  });

  return {
    babelrc: false,
    ...options,
    presets,
    plugins
  };
}

export const App = ({ defaultSource, defaultBabelConfig }) => {
  const [source, setSource] = React.useState(defaultSource);
  const [babelConfig, setBabelConfig] = React.useState(defaultBabelConfig);

  let transpiled;
  try {
    const { code } = Babel.transform(source, processOptions(babelConfig));
    transpiled = code;
  } catch (e) {
    transpiled = e.message;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // height: "100vh",
        overflow: "hidden",
        padding: 8
      }}
    >
      <section>
        <div>Source:</div>
        <Editor
          value={source}
          onChange={(val) => setSource(val)}
          docName="source.js"
        />
      </section>

      <section className="subsection">
        <div>Output:</div>
        <Editor
          value={transpiled}
          docName="result.js"
          config={{ readOnly: true }}
        />
      </section>

      <div className="subsection">
        <div>Babel Config:</div>
        <Editor
          value={babelConfig}
          onChange={(val) => setBabelConfig(val)}
          docName="config.json"
          config={{ mode: "application/json" }}
        />
      </div>
      <style jsx>{`
        section {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          height: 100%;
          flex: 2;
        }

        .subsection {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.75);
          flex: 1;
        }

        .editor {
          height: 100%;
        }

        .CodeMirror {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          margin: 4px;
          height: inherit;
        }

        .CodeMirror-activeline-background {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .CodeMirror-simplescroll-vertical {
          height: 0;
        }
      `}</style>
    </div>
  );
};
