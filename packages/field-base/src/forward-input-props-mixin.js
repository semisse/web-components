/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { InputSlotMixin } from './input-slot-mixin.js';
import { ForwardPropsMixin } from './forward-props-mixin.js';

const ForwardInputPropsMixinImplementation = (superclass) =>
  class ForwardInputPropsMixinClass extends ForwardPropsMixin(InputSlotMixin(superclass)) {
    static get properties() {
      return {
        /**
         * The name of this field.
         */
        name: {
          type: String,
          reflectToAttribute: true
        },

        /**
         * A hint to the user of what can be entered in the field.
         */
        placeholder: {
          type: String,
          reflectToAttribute: true
        },

        /**
         * When present, it specifies that the field is read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * The text usually displayed in a tooltip popup when the mouse is over the field.
         */
        title: {
          type: String,
          reflectToAttribute: true
        }
      };
    }

    static get forwardProps() {
      return ['name', 'type', 'placeholder', 'required', 'readonly', 'invalid', 'title'];
    }

    get _forwardPropsTarget() {
      return this.inputElement;
    }
  };

/**
 * A mixin to forward properties to the input element.
 */
export const ForwardInputPropsMixin = dedupingMixin(ForwardInputPropsMixinImplementation);
