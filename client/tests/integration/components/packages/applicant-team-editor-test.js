import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';


module('Integration | Component | packages/applicant-team-editor', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('user has a blank fieldset when there are no existing applicants', async function(assert) {
    const emptyApplicantsArray = [];
    await render(hbs`
      <Packages::ApplicantTeamEditor
        @applicants={{this.emptyApplicantsArray}}
      />
    `);
  });

  test('user can see existing applicants', async function(assert) {
    // 3 scenarios/permutations of kinds of applicants
    this.server.create('applicant', 'organizationApplicant');
    this.server.create('applicant', 'individualApplicant');
    this.server.create('applicant', 'applicantTeamMember');

    const applicant1 = await this.owner.lookup('service:store').findRecord('applicant', 1);
    const applicant2 = await this.owner.lookup('service:store').findRecord('applicant', 2);
    const applicant3 = await this.owner.lookup('service:store').findRecord('applicant', 3);
  
    this.applicantsArray = [applicant1, applicant2, applicant3];
  
    await render(hbs`
      {{log "Rendering Packages::ApplicantTeamEditor..."}}
      <Packages::ApplicantTeamEditor 
        @applicants={{this.applicantsArray}}
      />
    `);

    await this.pauseTest();
  });

  test('user can add new applicants', async function(assert) {

  });

  test('user can add new applicant team members', async function(assert) {

  });

  test('user can remove applicants', async function(assert) {
    
  })
});
