import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | packages/applicant-team-editor', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('triggers callbacks', async function(assert) {
    let applicantType;

    this.add = function(type) {
      applicantType = type;
    };

    await render(hbs`
      <Packages::ApplicantTeamEditor
        @addApplicant={{this.add}}
      />
    `);

    await click('[data-test-add-applicant-button]');

    assert.equal(applicantType, 'dcp_applicantinformation');

    await click('[data-test-add-applicant-team-member-button]');

    assert.equal(applicantType, 'dcp_applicantrepresentativeinformation');
  });
});
