import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | packages/attachments', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays a list attachments already uploaded to the package', async function(assert) {
    await render(hbs`<Packages::Attachments />`);

    await this.pauseTest();
  });
});
