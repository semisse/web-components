import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import '@vaadin/vaadin-material-styles/shadow.js';

const dialogOverlay = css`
  [part='overlay'] {
    box-shadow: var(--material-shadow-elevation-24dp);
    outline: none;
    max-width: 560px;
    min-width: 280px;
    -webkit-tap-highlight-color: transparent;
  }

  [part='content'] {
    padding: 24px;
  }

  /* No padding */
  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }
`;

registerStyles('vaadin-dialog-overlay', [overlay, dialogOverlay], {
  moduleId: 'material-dialog'
});
