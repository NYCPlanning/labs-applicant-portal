import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | packages/attachments', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays a list attachments already uploaded to the package', async function(assert) {
    this.package = {
      id: '123',
      documents: [
        {
          name: 'PAS Form.pdf',
          // TODO: Format that this is the final serialized
          // format of the "timeCreated" property
          timeCreated: '2020-04-23T22:35:30Z',
          id: '59fbf112-71a5-4af5-b20a-a746g08c4c6p',
        },
        {
          name: 'Action Changes.excel',
          timeCreated: '2020-02-21T22:25:10Z',
          id: 'f0f2f3a3-3936-499b-8f37-a9827a1c14f2',
        },
      ],
    };

    await render(hbs`<
      Packages::Attachments
      @package={{this.package}}
     />`);

    assert.equal(find('[data-test-document-name="0"]').textContent.trim(), 'PAS Form.pdf');
    assert.equal(find('[data-test-document-name="1"]').textContent.trim(), 'Action Changes.excel');
  });
});
