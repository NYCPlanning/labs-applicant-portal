import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project/project-editor-adder', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.projectApplicant = {
      dcpName: 'Donald Duck',
      emailaddress: 'donald@duck.com'
    }

    // Template block usage:
    await render(hbs`
      <Project::ProjectEditorAdder
        @form={{this.projectApplicant}}
      >
      </Project::ProjectEditorAdder>
    `);

    await this.pauseTest();

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
