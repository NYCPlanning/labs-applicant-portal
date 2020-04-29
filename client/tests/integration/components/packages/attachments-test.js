import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  clearRender,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { selectFiles } from 'ember-file-upload/test-support';

// TODO:
//   - Make use of qunit-dom
//   - Use server.create and store.findAll to set up test data
module('Integration | Component | packages/attachments', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

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

    assert.dom('[data-test-document-name="0"]').hasText('PAS Form.pdf');
    assert.dom('[data-test-document-name="1"]').hasText('Action Changes.excel');
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

    await assert.dom('[data-test-document-to-be-deleted-name]').doesNotExist();

    // mark a file for deletion
    await click('[data-test-delete-file-button="0"]');

    await assert.dom('[data-test-document-name]').exists({ count: 1 });
    await assert.dom('[data-test-document-to-be-deleted-name]').exists({ count: 1 });
    await assert.dom('[data-test-document-to-be-deleted-name]').hasText('PAS Form.pdf');

    // mark second file for deletion
    await click('[data-test-delete-file-button="0"]');

    await assert.dom('[data-test-document-name]').doesNotExist();
    await assert.dom('[data-test-document-to-be-deleted-name]').exists({ count: 2 });
    await assert.dom('[data-test-document-to-be-deleted-name="0"]').hasText('PAS Form.pdf');
    await assert.dom('[data-test-document-to-be-deleted-name="1"]').hasText('Action Changes.excel');

    // unmark a file for deletion
    await click('[data-test-undo-delete-file-button="1"]');

    await assert.dom('[data-test-document-name]').exists({ count: 1 });
    await assert.dom('[data-test-document-to-be-deleted-name]').exists({ count: 1 });
    await assert.dom('[data-test-document-name]').hasText('Action Changes.excel');

    // unmark another file for deletion
    await click('[data-test-undo-delete-file-button="0"]');

    await assert.dom('[data-test-document-name]').exists({ count: 2 });
    await assert.dom('[data-test-document-to-be-deleted-name]').doesNotExist();
    await assert.dom('[data-test-document-name="0"]').hasText('Action Changes.excel');
    await assert.dom('[data-test-document-name="1"]').hasText('PAS Form.pdf');
  });

  test('user can select and deselect local files for upload', async function(assert) {
    this.package = {
      id: '123',
      documents: [
      ],
    };

    const file = new File(['foo'], 'PAS Form.pdf', { type: 'text/plain' });
    const file2 = new File(['foo'], 'Action Changes.excel', { type: 'text/plain' });

    await render(hbs`<
      Packages::Attachments
      @package={{this.package}}
    />`);

    await assert.dom('[data-test-document-to-be-uploaded-name]').doesNotExist();

    await selectFiles('#FileUploader123 > input', file, file2);

    await assert.dom('[data-test-document-to-be-uploaded-name]').exists({ count: 2 });
    await assert.dom('[data-test-document-to-be-uploaded-name="0"]').hasText('PAS Form.pdf');
    await assert.dom('[data-test-document-to-be-uploaded-name="1"]').hasText('Action Changes.excel');

    await click('[data-test-deselect-file-button="0"]');

    await assert.dom('[data-test-document-to-be-uploaded-name]').exists({ count: 1 });

    await click('[data-test-deselect-file-button="0"]');

    await assert.dom('[data-test-document-to-be-uploaded-name]').doesNotExist();
  });

  test('user can return to attachments component and see correct files', async function (assert) {
    this.package = {
      id: '123',
      documents: [
      ],
    };

    const file = new File(['foo'], 'PAS Form.pdf', { type: 'text/plain' });
    const file2 = new File(['foo'], 'Action Changes.excel', { type: 'text/plain' });

    await render(hbs`<
      Packages::Attachments
      @package={{this.package}}
    />`);

    await selectFiles('#FileUploader123 > input', file, file2);

    await clearRender();

    await render(hbs`<
      Packages::Attachments
      @package={{this.package}}
    />`);

    await assert.dom('[data-test-document-to-be-uploaded-name]').exists({ count: 2 });
  });

  test('fileManager.save() will upload and delete files, then reset to-be-uploaded/deleted lists', async function (assert) {
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

    await click('[data-test-delete-file-button="0"]');
    await click('[data-test-delete-file-button="0"]');

    const file = new File(['foo'], 'Zoning Application.pdf', { type: 'text/plain' });
    const file2 = new File(['foo'], 'RWCDS.excel', { type: 'text/plain' });

    await selectFiles('#FileUploader123 > input', file, file2);

    const fileManager = this.owner.lookup('service:fileManagement').fileManagers['123'];

    await assert.dom('[data-test-document-name]').doesNotExist();
    await assert.dom('[data-test-document-to-be-deleted-name]').exists({ count: 2 });
    await assert.dom('[data-test-document-to-be-deleted-name="0"]').hasText('PAS Form.pdf');
    await assert.dom('[data-test-document-to-be-deleted-name="1"]').hasText('Action Changes.excel');
    await assert.dom('[data-test-document-to-be-uploaded-name]').exists({ count: 2 });
    await assert.dom('[data-test-document-to-be-uploaded-name="0"]').hasText('Zoning Application.pdf');
    await assert.dom('[data-test-document-to-be-uploaded-name="1"]').hasText('RWCDS.excel');

    await fileManager.save();

    await assert.dom('[data-test-document-to-be-deleted-name]').doesNotExist();
    await assert.dom('[data-test-document-to-be-uploaded-name]').doesNotExist();
  });
});
