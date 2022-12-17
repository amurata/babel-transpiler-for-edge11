import React from "react";
import { useCodeMirror } from "use-codemirror";

export function Editor({ className, style, ...options }) {
  let codeMirror = useCodeMirror({
    ...options,
    config: { theme: "material", ...options.config }
  });

  if (codeMirror.editor && options.config && options.config.readOnly) {
    codeMirror.editor.setValue(options.value);
  }

  return (
    <div className={className} style={style}>
      <pre ref={codeMirror.ref} className={codeMirror.config.theme}>
        {options.value}
      </pre>
    </div>
  );
}
