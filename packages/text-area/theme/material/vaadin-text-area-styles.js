/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/text-field/theme/material/vaadin-input-field-shared-styles.js';

registerStyles(
  'vaadin-text-area',
  css`
    [part='input-field'] {
      height: auto;
      box-sizing: border-box;
    }

    [part='input-field'] ::slotted(textarea) {
      padding-top: 0;
      margin-top: 4px;
    }

    [part='input-field'] ::slotted(textarea) {
      white-space: pre-wrap; /* override "nowrap" from <vaadin-text-field> */
      align-self: stretch; /* override "baseline" from <vaadin-text-field> */
    }
  `,
  { moduleId: 'material-text-area', include: ['material-input-field-shared-styles'] }
);
