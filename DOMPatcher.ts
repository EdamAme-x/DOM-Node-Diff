function DOMPatcher(RDOM: HTMLElement, VDOM: HTMLElement): void {
  if (RDOM.isEqualNode(VDOM)) {
    return;
  }

  if (RDOM.nodeType === Node.TEXT_NODE) {
    if (RDOM.textContent !== VDOM.textContent) {
      RDOM.textContent = VDOM.textContent;
    }
    return;
  }

  if (RDOM.tagName !== VDOM.tagName) {
    RDOM.replaceWith(VDOM);
    return;
  }

  const RAttrs = RDOM.attributes;
  const VAttrs = VDOM.attributes;

  for (let i = RAttrs.length - 1; i >= 0; i--) {
    const attr = RAttrs[i];
    const { name } = attr;
    const vAttr = VAttrs.getNamedItem(name);
    if (!vAttr) {
      RDOM.removeAttribute(name);
    } else if (attr.value !== vAttr.value) {
      RDOM.setAttribute(name, vAttr.value);
    }
    VAttrs.removeNamedItem(name);
  }

  for (let i = 0; i < VAttrs.length; i++) {
    const vAttr = VAttrs[i];
    const { name, value } = vAttr;
    RDOM.setAttribute(name, value);
  }

  const RChildren = RDOM.childNodes;
  const VChildren = VDOM.childNodes;

  for (let i = RChildren.length - 1; i >= 0; i--) {
    const RChild = RChildren[i] as HTMLElement;
    if (!VChildren[i]) {
      RChild.remove();
    } else {
      DOMPatcher(RChild, VChildren[i] as HTMLElement);
    }
  }

  for (let i = RChildren.length; i < VChildren.length; i++) {
    RDOM.appendChild(VChildren[i]);
  }
}
