import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project/project-editor-list-item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.contact = {
      firstname: 'Bugs',
      lastname: 'Bunny',
      emailaddress1: 'bugs@bunny.com',
    };

    // Template block usage:
    await render(hbs`
      <Project::ProjectEditorListItem @contact={{this.contact}}/>
    `);

    assert.dom(this.element).includesText('Bugs Bunny');
    assert.dom(this.element).includesText('bugs@bunny.com');
  });
});
