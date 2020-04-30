import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';


module('Integration | Component | packages/applicant-team-editor', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('user has a blank fieldset when there are no existing applicants', async function(assert) {
    this.applicants = [];

    await render(hbs`
      <Packages::ApplicantTeamEditor
        @applicants={{this.applicants}}
      />
    `);

    // assert what?
  });

  test('user can see existing applicants', async function(assert) {
    // 3 scenarios/permutations of kinds of applicants
    this.server.create('applicant', 'organizationApplicant');
    this.server.create('applicant', 'individualApplicant');
    this.server.create('applicant', 'applicantTeamMember');
  
    this.applicants = [
      await this.owner.lookup('service:store').findRecord('applicant', 1),
      await this.owner.lookup('service:store').findRecord('applicant', 2),
      await this.owner.lookup('service:store').findRecord('applicant', 3),
    ];
  
    await render(hbs`
      <Packages::ApplicantTeamEditor 
        @applicants={{this.applicants}}
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
