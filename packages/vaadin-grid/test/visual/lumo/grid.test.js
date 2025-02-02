import { click, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers/dist/index-no-side-effects.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-template-renderer';
import { flushGrid, nextResize } from '../../helpers.js';
import { users } from '../users.js';
import '../../../theme/lumo/vaadin-grid.js';
import '../../../theme/lumo/vaadin-grid-column-group.js';
import '../../../theme/lumo/vaadin-grid-sorter.js';

describe('grid', () => {
  let element;

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('header and footer', () => {
        before(async () => {
          element = fixtureSync(`
            <vaadin-grid size="200" style="width: 200px; height: 100px">
              <template class="row-details">[[index]]</template>
              <vaadin-grid-column>
                <template class="header">header</template>
                <template>[[index]]</template>
                <template class="footer">footer</template>
              </vaadin-grid-column>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
          await nextRender(element);
        });

        after(() => {
          element.remove();
        });

        it('header footer', async () => {
          await visualDiff(element, `${import.meta.url}_${dir}-header-footer`);
        });
      });

      describe('column groups', () => {
        before(async () => {
          element = fixtureSync(`
            <vaadin-grid style="height: 250px" column-reordering-allowed>
              <vaadin-grid-column width="30px" flex-grow="0" resizable>
                <template class="header">#</template>
                <template>[[index]]</template>
              </vaadin-grid-column>

              <vaadin-grid-column-group resizable>
                <template class="header">Name</template>

                <vaadin-grid-column width="calc(20% - 50px)">
                  <template class="header">First</template>
                  <template>[[item.name.first]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="calc(20% - 50px)">
                  <template class="header">Last</template>
                  <template>[[item.name.last]]</template>
                </vaadin-grid-column>
              </vaadin-grid-column-group>

              <vaadin-grid-column-group resizable>
                <template class="header">Location</template>

                <vaadin-grid-column width="calc(20% - 50px)">
                  <template class="header">City</template>
                  <template>[[item.location.city]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="calc(20% - 50px)">
                  <template class="header">State</template>
                  <template>[[item.location.state]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="200px" resizable>
                  <template class="header">Street</template>
                  <template>[[item.location.street]]</template>
                </vaadin-grid-column>
              </vaadin-grid-column-group>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
          await nextRender(element);
        });

        after(() => {
          element.remove();
        });

        it('column groups', async () => {
          await visualDiff(element, `${import.meta.url}_${dir}-column-groups`);
        });
      });

      describe('row details', () => {
        before(async () => {
          element = fixtureSync(`
            <vaadin-grid>
              <template class="row-details">
                <div class="details-cell">
                  <h1>Hi, I'm [[item.name.first]]</h1>
                </div>
              </template>

              <vaadin-grid-column-group>
                <template class="header">
                  <div class="header-content">
                    <b>1-200 of 15,554</b>
                    <input placeholder="Search profiles" focus-target />
                  </div>
                </template>

                <vaadin-grid-column width="55px" flex-grow="0">
                  <template>
                    <input type="checkbox" checked="{{selected::change}}" />
                  </template>
                </vaadin-grid-column>

                <vaadin-grid-column resizable>
                  <template class="header">Email</template>
                  <template>[[item.email]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column>
                  <template class="header">City</template>
                  <template>[[item.location.city]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column>
                  <template class="header">State</template>
                  <template>[[item.location.state]]</template>
                </vaadin-grid-column>
              </vaadin-grid-column-group>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
          await nextRender(element);
        });

        after(() => {
          element.remove();
        });

        it('row details', async () => {
          element.openItemDetails(element.items[0]);
          await visualDiff(element, `${import.meta.url}_${dir}-row-details`);
        });
      });

      describe('sorting', () => {
        let firstSorter, secondSorter;

        before(async () => {
          element = fixtureSync(`
            <vaadin-grid style="height: 250px" multi-sort>
              <vaadin-grid-column width="50px">
                <template class="header">#</template>
                <template>[[index]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">
                  <vaadin-grid-sorter id="first-name-sorter" path="name.first">First name</vaadin-grid-sorter>
                </template>
                <template>[[item.name.first]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">
                  <vaadin-grid-sorter id="last-name-sorter" path="name.last">Last name</vaadin-grid-sorter>
                </template>
                <template>[[item.name.last]]</template>
              </vaadin-grid-column>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
          await nextRender(element);
          firstSorter = document.querySelector('#first-name-sorter');
          secondSorter = document.querySelector('#last-name-sorter');
        });

        after(() => {
          element.remove();
        });

        it('initial', async () => {
          await visualDiff(element, `${import.meta.url}_${dir}-sorting-initial`);
        });

        it('single asc', async () => {
          click(firstSorter);
          await visualDiff(element, `${import.meta.url}_${dir}-sorting-single-asc`);
        });

        it('multi asc asc', async () => {
          click(secondSorter);
          await visualDiff(element, `${import.meta.url}_${dir}-sorting-multi-asc-asc`);
        });

        it('multi asc desc', async () => {
          click(secondSorter);
          await visualDiff(element, `${import.meta.url}_${dir}-sorting-multi-asc-desc`);
        });

        it('single desc', async () => {
          click(secondSorter);
          click(firstSorter);
          await visualDiff(element, `${import.meta.url}_${dir}-sorting-single-desc`);
        });
      });
    });
  });

  describe('drag and drop', () => {
    before(async () => {
      element = fixtureSync(`
        <vaadin-grid drop-mode="on-top-or-between" rows-draggable>
          <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
          <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
          <vaadin-grid-column path="email"></vaadin-grid-column>
        </vaadin-grid>
      `);
      element.rowDetailsRenderer = (root) => {
        root.innerHTML = '<p>Details</p>';
      };
      element.items = users;
      flushGrid(element);
      await nextRender(element);
    });

    after(() => {
      element.remove();
    });

    it('dragover', async () => {
      element.setAttribute('dragover', '');
      await visualDiff(element, `${import.meta.url}_dragover`);
    });

    it('dragover on top', async () => {
      element.removeAttribute('dragover');
      element.$.items.children[1].setAttribute('dragover', 'on-top');
      await visualDiff(element, `${import.meta.url}_row-dragover-on-top`);
    });

    it('dragover above', async () => {
      element.$.items.children[1].setAttribute('dragover', 'above');
      await visualDiff(element, `${import.meta.url}_row-dragover-above`);
    });

    it('dragover below', async () => {
      element.$.items.children[1].setAttribute('dragover', 'below');
      await visualDiff(element, `${import.meta.url}_row-dragover-below`);
    });

    it('dragover above details', async () => {
      element.detailsOpenedItems = [element.items[1]];
      element.$.items.children[1].setAttribute('dragover', 'above');
      await visualDiff(element, `${import.meta.url}_row-dragover-above-details`);
    });

    it('dragover below details', async () => {
      element.detailsOpenedItems = [element.items[1]];
      element.$.items.children[1].setAttribute('dragover', 'below');
      await visualDiff(element, `${import.meta.url}_row-dragover-below-details`);
    });

    it('dragover row dragstart', async () => {
      element.detailsOpenedItems = [];
      await nextResize(element);
      element.$.items.children[1].removeAttribute('dragover');
      await nextFrame();
      element.$.items.children[1].setAttribute('dragstart', '123');
      await visualDiff(element, `${import.meta.url}_row-dragstart`);
    });
  });
});
