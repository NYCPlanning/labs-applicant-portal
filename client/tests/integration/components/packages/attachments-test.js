import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  find,
  findAll,
  click,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { selectFiles } from 'ember-file-upload/test-support';

// TODO:
//   - Make use of qunit-dom
//   - Use server.create and store.findAll to set up test data
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

  test('user can mark and unmark an existing document for deletion', async function(assert) {
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

    await assert.equal(findAll('[data-test-document-to-be-deleted-name]').length, 0);

    // mark a file for deletion
    await click('[data-test-delete-file-button="0"]');

    await assert.equal(findAll('[data-test-document-name]').length, 1);
    await assert.equal(findAll('[data-test-document-to-be-deleted-name]').length, 1);
    await assert.equal(find('[data-test-document-to-be-deleted-name]').textContent.trim(), 'PAS Form.pdf');

    // mark second file for deletion
    await click('[data-test-delete-file-button="0"]');

    await assert.equal(findAll('[data-test-document-name]').length, 0);
    await assert.equal(findAll('[data-test-document-to-be-deleted-name]').length, 2);
    await assert.equal(find('[data-test-document-to-be-deleted-name="0"]').textContent.trim(), 'PAS Form.pdf');
    await assert.equal(find('[data-test-document-to-be-deleted-name="1"]').textContent.trim(), 'Action Changes.excel');

    // unmark a file for deletion
    await click('[data-test-undo-delete-file-button="1"]');

    await assert.equal(findAll('[data-test-document-name]').length, 1);
    await assert.equal(findAll('[data-test-document-to-be-deleted-name]').length, 1);
    await assert.equal(find('[data-test-document-name]').textContent.trim(), 'Action Changes.excel');

    // unmark another file for deletion
    await click('[data-test-undo-delete-file-button="0"]');

    await assert.equal(findAll('[data-test-document-name]').length, 2);
    await assert.equal(findAll('[data-test-document-to-be-deleted-name]').length, 0);
    await assert.equal(find('[data-test-document-name="0"]').textContent.trim(), 'Action Changes.excel');
    await assert.equal(find('[data-test-document-name="1"]').textContent.trim(), 'PAS Form.pdf');
  });

  test('user can select and deselect local files for upload', async function(assert) {
    this.package = {
      id: '123',
      documents: [
      ],
    };

    await render(hbs`<
      Packages::Attachments
      @package={{this.package}}
     />`);


    const file = new File(['foo'], 'PAS Form.pdf', { type: 'text/plain' });
    const file2 = new File(['foo'], 'Action Changes.excel', { type: 'text/plain' });

    await render(hbs`<
      Packages::Attachments
      @package={{this.package}}
    />`);

    await assert.equal(findAll('[data-test-document-to-be-uploaded-name]').length, 0);

    await selectFiles('#FileUploader123 > input', file, file2);

    await assert.equal(findAll('[data-test-document-to-be-uploaded-name]').length, 2);
    await assert.equal(find('[data-test-document-to-be-uploaded-name="0"]').textContent.trim(), 'PAS Form.pdf');
    await assert.equal(find('[data-test-document-to-be-uploaded-name="1"]').textContent.trim(), 'Action Changes.excel');

    await click('[data-test-deselect-file-button="0"]');

    await assert.equal(findAll('[data-test-document-to-be-uploaded-name]').length, 1);

    await click('[data-test-deselect-file-button="0"]');

    await assert.equal(findAll('[data-test-document-to-be-uploaded-name]').length, 0);
  });
});
