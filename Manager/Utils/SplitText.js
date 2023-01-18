export default class TextSplitter {
  constructor(node) {
    this.node = node;
    this.lines = [];
    this.curLine = [];
    this.splitText();
  }

  breakIntoLines(nodes) {
    nodes.forEach((n) => {
      if (n instanceof HTMLBRElement) {
        this.lines.push(this.curLine);
        this.curLine = [];
        return;
      }
      this.curLine.push(n);
    });
    this.lines.push(this.curLine);
    return this.lines.filter((line) => line.length > 0);
  }

  createSpan(word) {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('word');
    wordSpan.innerHTML = word;
    return wordSpan;
  }

  formatTextNode(node, masterNode) {
    node.textContent.split(' ').forEach((word) => {
      if (word !== '') masterNode.appendChild(this.createSpan(word));
    });
  }

  createHTML(node, element) {
    return node.appendChild(document.createElement(element));
  }

  createLetters(node) {
    node.querySelectorAll('.word').forEach((word) => {
      word.innerHTML = word.innerText
        .split('')
        .map((letter) => `<span class="letter">${letter}</span>`)
        .join('');
    });
  }

  recursivelyFormatNodes(node, parentNode) {
    if (node.nodeType === 3) {
      this.formatTextNode(node, parentNode);
      return;
    }
    if (!node.childNodes.length) return;
    node.childNodes.forEach((c) => {
      this.recursivelyFormatNodes(
        c,
        this.createHTML(parentNode, node.localName)
      );
    });
  }

  splitText() {
    const lines = this.breakIntoLines(this.node.childNodes);
    this.node.innerHTML = '';
    lines.forEach((line) => {
      line.forEach((node) => this.recursivelyFormatNodes(node, this.node));
      lines.length > 1 && this.createHTML(this.node, 'br');
    });

    this.createLetters(this.node);
  }
}
