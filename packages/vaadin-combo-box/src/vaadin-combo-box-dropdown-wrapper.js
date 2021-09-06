/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './vaadin-combo-box-item.js';
import './vaadin-combo-box-dropdown.js';
import './vaadin-combo-box-scroller.js';

const TOUCH_DEVICE = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * Element for internal use only.
 *
 * @extends HTMLElement
 * @private
 */
class ComboBoxDropdownWrapperElement extends PolymerElement {
  static get template() {
    return html`
      <vaadin-combo-box-dropdown
        id="dropdown"
        hidden="[[_hidden(_items.*, loading)]]"
        position-target="[[positionTarget]]"
        on-position-changed="_setOverlayHeight"
        theme="[[theme]]"
      ></vaadin-combo-box-dropdown>
    `;
  }

  static get is() {
    return 'vaadin-combo-box-dropdown-wrapper';
  }

  static get properties() {
    return {
      /**
       * True if the device supports touch events.
       */
      touchDevice: {
        type: Boolean,
        value: TOUCH_DEVICE
      },

      opened: Boolean,

      /**
       * The element to position/align the dropdown by.
       */
      positionTarget: {
        type: Object
      },

      /**
       * Custom function for rendering the content of the `<vaadin-combo-box-item>` propagated from the combo box element.
       */
      renderer: Function,

      /**
       * `true` when new items are being loaded.
       */
      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_setOverlayHeight'
      },

      /**
       * Used to propagate the `theme` attribute from the host element.
       */
      theme: String,

      _selectedItem: {
        type: Object
      },

      _items: {
        type: Object
      },

      _focusedIndex: {
        type: Number,
        value: -1
      },

      _focusedItem: {
        type: String,
        computed: '_getFocusedItem(_focusedIndex)'
      },

      _itemLabelPath: {
        type: String,
        value: 'label'
      },

      _itemValuePath: {
        type: String,
        value: 'value'
      },

      _scroller: Object,

      _itemIdPath: String,

      __effectiveItems: {
        computed: '_getItems(opened, _items)'
      }
    };
  }

  static get observers() {
    return [
      '_loadingChanged(loading)',
      '_openedChanged(opened, _items, loading)',
      '__updateAllItems(_selectedItem, renderer)',
      '__updateScroller(_scroller, __effectiveItems, _selectedItem, _itemIdPath, _focusedIndex, renderer, theme)'
    ];
  }

  ready() {
    super.ready();

    this._initDropdown();
  }

  __effectiveItemsChanged(effectiveItems, scroller) {
    if (scroller && effectiveItems) {
      scroller.items = effectiveItems;
    }
  }

  _fireTouchAction(sourceEvent) {
    this.dispatchEvent(
      new CustomEvent('vaadin-overlay-touch-action', {
        detail: { sourceEvent: sourceEvent }
      })
    );
  }

  _getItems(opened, items) {
    if (opened) {
      return items;
    }
    return [];
  }

  _isEmpty(items) {
    return !items || !items.length;
  }

  _openedChanged(opened, items, loading) {
    if (this._isEmpty(items)) {
      this.$.dropdown.__emptyItems = true;
    }
    this.$.dropdown.opened = !!(opened && (loading || !this._isEmpty(items)));
    this.$.dropdown.__emptyItems = false;
  }

  _initDropdown() {
    const overlay = this.$.dropdown.$.overlay;

    overlay.renderer = (root) => {
      if (!root.firstChild) {
        const scroller = document.createElement('vaadin-combo-box-scroller');
        scroller.wrapper = this;
        root.appendChild(scroller);
      }
    };

    // Ensure the scroller is rendered
    overlay.requestContentUpdate();

    this._scroller = overlay.content.querySelector('vaadin-combo-box-scroller');

    this._loadingChanged(this.loading);

    overlay.addEventListener('touchend', (e) => this._fireTouchAction(e));
    overlay.addEventListener('touchmove', (e) => this._fireTouchAction(e));

    // Prevent blurring the input when clicking inside the overlay.
    overlay.addEventListener('mousedown', (e) => e.preventDefault());
  }

  _loadingChanged(loading) {
    this.$.dropdown.$.overlay.toggleAttribute('loading', loading);

    if (!loading && this._scroller) {
      setTimeout(() => this._scroller.updateItems());
    }
  }

  _setOverlayHeight() {
    if (!this._scroller || !this.opened || !this.positionTarget) {
      return;
    }

    const targetRect = this.positionTarget.getBoundingClientRect();

    this._scroller.style.maxHeight =
      getComputedStyle(this).getPropertyValue('--vaadin-combo-box-overlay-max-height') || '65vh';

    const maxHeight = this._maxOverlayHeight(targetRect);

    // overlay max height is restrained by the #scroller max height which is set to 65vh in CSS.
    this.$.dropdown.$.overlay.style.maxHeight = maxHeight;
  }

  _maxOverlayHeight(targetRect) {
    const margin = 8;
    const minHeight = 116; // Height of two items in combo-box
    if (this.$.dropdown.alignedAbove) {
      return Math.max(targetRect.top - margin + Math.min(document.body.scrollTop, 0), minHeight) + 'px';
    } else {
      return Math.max(document.documentElement.clientHeight - targetRect.bottom - margin, minHeight) + 'px';
    }
  }

  _getFocusedItem(focusedIndex) {
    if (focusedIndex >= 0) {
      return this._items[focusedIndex];
    }
  }

  /**
   * Gets the index of the item with the provided label.
   * @return {number}
   */
  indexOfLabel(label) {
    if (this._items && label) {
      for (let i = 0; i < this._items.length; i++) {
        if (this.getItemLabel(this._items[i]).toString().toLowerCase() === label.toString().toLowerCase()) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Gets the label string for the item based on the `_itemLabelPath`.
   * @return {string}
   */
  getItemLabel(item, itemLabelPath) {
    itemLabelPath = itemLabelPath || this._itemLabelPath;
    let label = item && itemLabelPath ? this.get(itemLabelPath, item) : undefined;
    if (label === undefined || label === null) {
      label = item ? item.toString() : '';
    }
    return label;
  }

  _scrollIntoView(index) {
    if (!this._scroller || !(this.opened && index >= 0)) {
      return;
    }
    this._scroller.scrollToIndex(index);
  }

  adjustScrollPosition() {
    if (this.opened && this._items) {
      this._scrollIntoView(this._focusedIndex);
    }
  }

  __updateAllItems() {
    if (this._scroller) {
      this._scroller.updateItems();
    }
  }

  __updateScroller(scroller, items, selectedItem, itemIdPath, focusedIndex, renderer, theme) {
    if (scroller) {
      scroller.setProperties({
        items,
        selectedItem,
        itemIdPath,
        focusedIndex,
        renderer,
        theme
      });
    }
  }

  /**
   * We want to prevent the kinetic scrolling energy from being transferred from the overlay contents over to the parent.
   * Further improvement ideas: after the contents have been scrolled to the top or bottom and scrolling has stopped, it could allow
   * scrolling the parent similarly to touch scrolling.
   */
  _patchWheelOverScrolling() {
    this._selector.addEventListener('wheel', (e) => {
      const scroller = this._scroller;
      const scrolledToTop = scroller.scrollTop === 0;
      const scrolledToBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 1;
      if (scrolledToTop && e.deltaY < 0) {
        e.preventDefault();
      } else if (scrolledToBottom && e.deltaY > 0) {
        e.preventDefault();
      }
    });
  }

  _hidden() {
    return !this.loading && this._isEmpty(this._items);
  }
}

customElements.define(ComboBoxDropdownWrapperElement.is, ComboBoxDropdownWrapperElement);
