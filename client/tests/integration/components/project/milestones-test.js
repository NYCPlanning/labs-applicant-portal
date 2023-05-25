import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project/milestones', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('milestones', []);

    await render(hbs`
      <Project::Milestones
        @milestones={{this.milestones}}
      />
    `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
