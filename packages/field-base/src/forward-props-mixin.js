/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const ForwardPropsMixinImplementation = (superclass) =>
  class ForwardPropsMixinClass extends superclass {
    /**
     * An array of the host properties which are forwarded to the element.
     */
    static get forwardProps() {
      return [];
    }

    get _forwardPropsTarget() {
      return null;
    }

    /** @protected */
    ready() {
      super.ready();

      this._createForwardPropsObserver();
    }

    /** @protected */
    _createForwardPropsObserver() {
      this._createMethodObserver(
        `_forwardPropsChanged(${this.constructor.forwardProps.join(', ')}, __forwardPropsObserverInitialized)`
      );

      this.__forwardPropsObserverInitialized = true;
    }

    /** @protected */
    _forwardPropsChanged(...attributesValues) {
      console.error('forward', this._forwardPropsTarget);
      this._propagateHostAttributes(attributesValues);
    }

    /** @protected */
    _propagateHostAttributes(attributesValues) {
      const target = this._forwardPropsTarget;
      const attributeNames = this.constructor.forwardProps;

      attributeNames.forEach((attr, index) => {
        const value = attributesValues[index];
        if (attr === 'invalid') {
          this._setOrToggleAttribute(attr, value, target);
          this._setOrToggleAttribute('aria-invalid', value ? 'true' : false, target);
        } else {
          this._setOrToggleAttribute(attr, value, target);
        }
      });
    }

    /** @protected */
    _setOrToggleAttribute(name, value, node) {
      if (!name || !node) {
        return;
      }

      if (value) {
        node.setAttribute(name, typeof value === 'boolean' ? '' : value);
      } else {
        node.removeAttribute(name);
      }
    }
  };

/**
 * A mixin to forward properties to the input element.
 */
export const ForwardPropsMixin = dedupingMixin(ForwardPropsMixinImplementation);
