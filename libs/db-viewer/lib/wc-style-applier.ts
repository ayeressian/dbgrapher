const applyStyle = (shadowRoot: Node, style: string) => {
  const styleElem = document.createElement("style");
  styleElem.innerHTML = style;
  shadowRoot.appendChild(styleElem);
};

export default applyStyle;
