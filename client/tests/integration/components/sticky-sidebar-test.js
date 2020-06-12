import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | sticky-sidebar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders navItems and yields block content', async function(assert) {
    await render(hbs`
      <StickySidebar
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
        data-test-stickysidebar
      >
        <div>
          A button
        </div>
      </StickySidebar>
    `);

    assert.dom('[data-test-stickysidebar]').containsText('A button');
    assert.dom('[data-test-stickysidebar-navitem="one"]').exists();
    assert.dom('[data-test-stickysidebar-navitem="two"]').exists();
  });
});
