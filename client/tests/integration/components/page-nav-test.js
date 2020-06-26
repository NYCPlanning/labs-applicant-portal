import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | page-nav', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders navItems and yields block content', async function(assert) {
    await render(hbs`
      <PageNav
        @navItems={{array
          (hash
            anchorId="one"
            label="one"
          )
          (hash
            anchorId="two"
            label="two"
          )
        }}
        data-test-page-nav
      >
        <div>
          A button
        </div>
      </PageNav>
    `);

    assert.dom('[data-test-page-nav]').containsText('A button');
    assert.dom('[data-test-page-nav-navitem="one"]').exists();
    assert.dom('[data-test-page-nav-navitem="two"]').exists();
  });
});
