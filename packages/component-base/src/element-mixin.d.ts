/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ReactiveControllerHost } from 'lit';
import '../custom_typings/vaadin-usage-statistics.js';
import '../custom_typings/vaadin.js';
import { DirMixinClass } from './dir-mixin.js';

/**
 * A mixin to provide common logic for Vaadin components.
 */
export declare function ElementMixin<T extends Constructor<HTMLElement>>(
  superclass: T
): T &
  Constructor<DirMixinClass> &
  Constructor<ElementMixinClass> &
  Pick<ReactiveControllerHost, 'addController' | 'removeController'>;

export declare class ElementMixinClass {
  static version: string;

  protected static finalize(): void;
}
