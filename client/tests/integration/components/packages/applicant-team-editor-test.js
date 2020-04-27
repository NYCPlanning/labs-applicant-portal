import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';


module('Integration | Component | packages/applicant-team-editor', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function(assert) {
    this.testApplicants = this.server.createList('applicant', 2, 'organizationApplicant');

    await render(hbs`
      {{log "Rendering Packages::ApplicantTeamEditor..."}}
      <Packages::ApplicantTeamEditor 
        @applicants={{this.testApplicants}}
      />
    `)

    await this.pauseTest();
  });
});
