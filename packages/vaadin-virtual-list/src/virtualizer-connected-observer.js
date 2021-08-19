/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class VirtualizerConnectedObserver extends HTMLElement {
  /** @protected */
  connectedCallback() {
    this.hidden = true;
    this.__virtualizer.connectedChanged(true);
  }

  /** @protected */
  disconnectedCallback() {
    this.__virtualizer.connectedChanged(false);
  }
}

customElements.define('virtualizer-connected-observer', VirtualizerConnectedObserver);
