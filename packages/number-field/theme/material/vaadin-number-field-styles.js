/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { fieldButton } from '@vaadin/vaadin-material-styles/mixins/field-button.js';
import { inputFieldShared } from '@vaadin/text-field/theme/material/vaadin-input-field-shared-styles.js';

const numberField = css`
  :host {
    width: 8em;
  }

  :host([has-controls]) ::slotted(input) {
    text-align: center;
  }

  [part$='button'][disabled] {
    opacity: 0.2;
  }

  [part$='decrease-button'] {
    cursor: pointer;
    font-size: var(--material-body-font-size);
    padding-bottom: 0.21em;
  }
`;

registerStyles('vaadin-number-field', [inputFieldShared, fieldButton, numberField], {
  moduleId: 'material-number-field'
});
