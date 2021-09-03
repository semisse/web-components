/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to forward properties to an element.
 */
declare function ForwardPropsMixin<T extends new (...args: any[]) => {}>(base: T): T & ForwardPropsMixinConstructor;

interface ForwardPropsMixinConstructor {
  new (...args: any[]): ForwardPropsMixin;
}

interface ForwardPropsMixin {
  _forwardPropsTarget: HTMLElement | null;
}

export { ForwardPropsMixinConstructor, ForwardPropsMixin };
