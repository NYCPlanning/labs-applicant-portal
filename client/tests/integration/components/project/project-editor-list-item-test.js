import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project/project-editor-list-item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.projectApplicant = {
      dcpName: 'Bugs Bunny',
      emailaddress: 'bugs@bunny.com',
    };

    // Template block usage:
    await render(hbs`
      <Project::ProjectEditorListItem @projectApplicant={{this.projectApplicant}}/>
    `);

    assert.dom(this.element).includesText('Bugs Bunny');
    assert.dom(this.element).includesText('bugs@bunny.com');
  });
});
