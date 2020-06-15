import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | packages/rwcds-form/project-description', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('rwcdsForm', {
      saveableChanges: {
        dcpProjectsitedescription: 'Mixed use',
        dcpProposedprojectdevelopmentdescription: 'Increase equity',
        dcpBuildyear: '1990',
        dcpSitehistory: 'Some history',
      },
    });

    await render(hbs`
      <Packages::RwcdsForm::ProjectDescription
        @rwcdsForm={{this.rwcdsForm}}
      />
    `);

    assert.dom('[data-test-textarea="dcpProjectsitedescription"]').hasValue('Mixed use');
    assert.dom('[data-test-textarea="dcpProposedprojectdevelopmentdescription"]').hasValue('Increase equity');
    assert.dom('[data-test-input="dcpBuildyear"]').hasValue('1990');
    assert.dom('[data-test-textarea="dcpSitehistory"]').hasValue('Some history');
  });
});
