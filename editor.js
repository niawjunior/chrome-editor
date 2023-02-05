let codeEditor;
let timeoutId;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  if (request.type === "autoRunCheckboxValue") {
    const autoRunCheckboxValue = request.value;
    // Set the state of the checkbox
    document.querySelector("#auto-run").checked = autoRunCheckboxValue;
  }
});

// Listen to the "run-button" click event

document.querySelector("#run-button").addEventListener("click", () => {
  runCode();
});

// Listen to the "Auto Run" checkbox change event
document.querySelector("#auto-run").addEventListener("change", () => {
  const autoRunCheckbox = document.querySelector("#auto-run");
  chrome.runtime.sendMessage({
    type: "autoRunCheckboxValue",
    value: autoRunCheckbox.checked,
  });

  if (!autoRunCheckbox.checked) {
    // Remove the change event listener from the code editor
    window.codeEditor.off("change");
  }
});

function runCode() {
  const codeEditor = window.codeEditor;
  const code = codeEditor.getValue();
  const encodedCode = encodeURIComponent(code);
  const currentUrl = window.location.href;
  const newUrl = currentUrl.replace(/(content=)[^&]+/, `$1${encodedCode}`);
  window.history.pushState({}, "", newUrl);

  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    const iframe = document.getElementById("sandbox");
    const output = document.querySelector("#output");

    // Listen to the message event from the iframe
    window.addEventListener("message", (event) => {
      const result = event.data.result;
      let className = "result success";

      if (event.data.isError) {
        className = "result error";
      } else {
        className = "result success";
      }

      output.innerHTML = result;
      output.className = className;
    });

    // Send the code from the editor to the iframe
    iframe.contentWindow.postMessage(codeEditor.getValue(), "*");
  }, 1000);
}

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
const urlParams = new URLSearchParams(window.location.search);
const content = urlParams.get("content");

const jsbeautifier = window.js_beautify;
const formattedCode = jsbeautifier(content);

// Initialize the CodeMirror editor
codeEditor = CodeMirror.fromTextArea(document.querySelector("#code"), {
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
codeEditor.setOption("theme", "dracula");

// Set the initial code to the editor
codeEditor.setValue(formattedCode);

window.codeEditor = codeEditor;

chrome.storage.local.get("autoRunCheckboxValue", (data) => {
  document.querySelector("#auto-run").checked =
    data.autoRunCheckboxValue || false;
});

if (window.codeEditor) {
  window.codeEditor.on("change", function () {
    const autoRunCheckbox = document.querySelector("#auto-run");
    if (autoRunCheckbox.checked) {
      runCode();
    }
  });
}
