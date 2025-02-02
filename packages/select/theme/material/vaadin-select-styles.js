/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { menuOverlay } from '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import { inputFieldShared } from '@vaadin/text-field/theme/material/vaadin-input-field-shared-styles.js';

const select = css`
  :host {
    display: inline-flex;
    -webkit-tap-highlight-color: transparent;
  }

  /* placeholder styles */
  :host(:not([has-value])) [part='input-field'] ::slotted([slot='value']) {
    color: var(--material-disabled-text-color);
    transition: opacity 0.175s 0.1s;
    opacity: 1;
  }

  :host([has-value]) [part='input-field'] ::slotted([slot='value']) {
    color: var(--material-body-text-color);
  }

  [part='toggle-button']::before {
    content: var(--material-icons-dropdown);
  }

  :host([opened]) [part='toggle-button'] {
    transform: rotate(180deg);
  }

  :host([disabled]) {
    pointer-events: none;
  }
`;

registerStyles('vaadin-select', [inputFieldShared, select], { moduleId: 'material-select' });

registerStyles(
  'vaadin-select-value-button',
  css`
    :host {
      font: inherit;
      letter-spacing: normal;
      text-transform: none;
    }

    :host::before,
    :host::after {
      display: none;
    }
  `,
  { moduleId: 'material-select-value-button' }
);

const selectOverlay = css`
  :host([bottom-aligned]) {
    justify-content: flex-end;
  }

  [part='overlay'] {
    min-width: var(--vaadin-select-text-field-width);
  }
`;

registerStyles('vaadin-select-overlay', [menuOverlay, selectOverlay], { moduleId: 'material-select-overlay' });
