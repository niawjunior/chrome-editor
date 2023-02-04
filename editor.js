// Listen to the "run-button" click event
document.querySelector("#run-button").addEventListener("click", () => {
  const codeEditor = window.codeEditor;
  const iframe = document.getElementById("sandbox");
  const output = document.querySelector("#output");

  // Listen to the message event from the iframe
  window.addEventListener("message", (event) => {
    output.innerHTML = event.data;
    console.log("EVAL output", event.data);
  });

  // Send the code from the editor to the iframe
  iframe.contentWindow.postMessage(codeEditor.getValue(), "*");
});

// Listen to the "back-button" click event
document.querySelector("#back-button").addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const site = urlParams.get("site");
  window.location.href = site;
});

// Listen to the "format-button" click event
document.querySelector("#format-button").addEventListener("click", () => {
  const codeEditor = window.codeEditor;
  const jsbeautifier = window.js_beautify;
  const formattedCode = jsbeautifier(codeEditor.getValue());

  // Set the formatted code back to the editor
  codeEditor.setValue(formattedCode);
});

// Listen to the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const content = urlParams.get("content");

  const jsbeautifier = window.js_beautify;
  const formattedCode = jsbeautifier(content);

  // Initialize the CodeMirror editor
  window.codeEditor = CodeMirror.fromTextArea(document.querySelector("#code"), {
    lineNumbers: true,
    mode: "javascript",
    matchBrackets: true,
    fontSize: 20,
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    styleActiveLine: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  });
  window.codeEditor.setOption("theme", "dracula");

  // Set the initial code to the editor
  window.codeEditor.setValue(formattedCode);
});
