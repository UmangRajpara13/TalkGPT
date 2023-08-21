const inputText = "Here is some `inline code` within a sentence. You can also use `code` for formatting.";

function replaceCodeWithHtml(match, code) {
  return `<code>${code}</code>`;
}

const outputText = inputText.replace(/`([^`]+)`/g, replaceCodeWithHtml);

console.log(outputText);
