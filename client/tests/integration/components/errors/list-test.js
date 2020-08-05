import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | errors/list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.mockErrors = [
      {
        code: 1,
        title: '1 title',
        detail: '1 detail',
      },
      {
        code: 2,
        title: '2 title',
        detail: '2 detail',
      },
    ];

    await render(hbs`<Errors::List
      @errors={{this.mockErrors}}
    />`);

    assert.dom('[data-test-error-key="detail"][data-test-error-idx="0"]').includesText('detail: 1 detail');
    assert.dom('[data-test-error-key="code"][data-test-error-idx="1"]').includesText('code: 2');
  });
});
