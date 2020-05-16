import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';


module('Integration | Component | packages/applicant-team-editor', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('user sees a blank fieldset when there are no existing applicants', async function(assert) {
    this.applicants = [];

    await render(hbs`
      <Packages::ApplicantTeamEditor
        @applicants={{this.applicants}}
      />
    `);

    assert.dom('[data-test-applicant-fieldset="0"]').exists();
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

    // there are 3 fieldsets visibile
    assert.dom('[data-test-applicant-fieldset="0"]').exists();
    assert.dom('[data-test-applicant-fieldset="1"]').exists();
    assert.dom('[data-test-applicant-fieldset="2"]').exists();
  });

  test('user can add new applicants', async function(assert) {
    this.applicants = [];

    await render(hbs`
      <Packages::ApplicantTeamEditor
        @applicants={{this.applicants}}
      />
    `);

    // can add an applicant
    await click('[data-test-add-applicant-button]');
    assert.dom('[data-test-applicant-type="Applicant"]').exists();

    // can add an applicant team member
    await click('[data-test-add-applicant-team-member-button]');
    assert.dom('[data-test-applicant-type="Other Team Member"]').exists();
  });

  test('user can remove applicants', async function(assert) {
    const applicant = this.server.create('applicant', 'organizationApplicant');

    this.applicants = [
      await this.owner.lookup('service:store').findRecord('applicant', applicant.id),
    ];

    await render(hbs`
      <Packages::ApplicantTeamEditor
        @applicants={{this.applicants}}
      />
    `);

    await click('[data-test-remove-applicant-button');

    assert.dom('[data-test-applicant-fieldset="0"]').doesNotExist();
  });

  test('user can toggle individual or organization applicant type', async function(assert) {
    this.server.create('applicant', 'individualApplicant');

    this.applicants = [
      await this.owner.lookup('service:store').findRecord('applicant', 1),
    ];

    await render(hbs`
      <Packages::ApplicantTeamEditor
        @applicants={{this.applicants}}
      />
    `);

    // switch from Individual to Organization applicant type
    await click('[data-test-applicant-type-radio-organization]');

    // organization input should appear after user toggles to "Organization"
    assert.dom('[data-test-applicant-organization]').hasText('Organization');

    // should be reflected in the applicants array!
    assert.equal(this.applicants[0].dcpType, 717170001);
  });
});
