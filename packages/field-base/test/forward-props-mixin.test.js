import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ForwardPropsMixin } from '../src/forward-props-mixin.js';

customElements.define(
  'forward-props-mixin-element',
  class extends ForwardPropsMixin(PolymerElement) {
    static get properties() {
      return {
        title: {
          type: String,
          reflectToAttribute: true
        },

        invalid: {
          type: Boolean,
          reflectToAttribute: true
        }
      };
    }

    static get forwardProps() {
      return ['title', 'invalid'];
    }

    get _forwardPropsTarget() {
      return this.$.input;
    }

    static get template() {
      return html`<input id="input" />`;
    }
  }
);

describe('forward-props-mixin', () => {
  let element, input;

  describe('title', () => {
    beforeEach(() => {
      element = fixtureSync('<forward-props-mixin-element title="foo"></forward-props-mixin-element>');
      input = element.shadowRoot.querySelector('input');
    });

    it('should propagate title attribute to the input', () => {
      expect(input.getAttribute('title')).to.equal('foo');
    });

    it('should set title property on the input', () => {
      element.title = 'bar';
      expect(input.getAttribute('title')).to.equal('bar');
    });
  });

  describe('invalid', () => {
    beforeEach(() => {
      element = fixtureSync('<forward-props-mixin-element invalid></forward-props-mixin-element>');
      input = element.shadowRoot.querySelector('input');
    });

    it('should propagate invalid attribute to the input', () => {
      expect(input.hasAttribute('invalid')).to.be.true;
    });

    it('should set aria-invalid attribute on the input', () => {
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('should remove invalid attribute when valid', () => {
      element.invalid = false;
      expect(input.hasAttribute('invalid')).to.be.false;
    });

    it('should remove aria-invalid attribute when valid', () => {
      element.invalid = false;
      expect(input.hasAttribute('aria-invalid')).to.be.false;
    });
  });
});
