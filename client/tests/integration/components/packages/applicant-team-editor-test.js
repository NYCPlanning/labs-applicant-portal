import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { selectChoose } from 'ember-power-select/test-support';


module('Integration | Component | packages/applicant-team-editor', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

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
    // create an applicant model
    let applicant = this.server.create('applicant', 'organizationApplicant');
    // get the reference to the model instance
    applicant = await this.owner.lookup('service:store').findRecord('applicant', applicant.id);

    this.applicants = [
      applicant,
    ];

    await render(hbs`
      <Packages::ApplicantTeamEditor
        @applicants={{this.applicants}}
      />
    `);


    await assert.equal(applicant.hasDirtyAttributes, false);
    await assert.equal(applicant.isDeleted, false);

    // remove the applicant
    await click('[data-test-remove-applicant-button');

    // should trigger dirty state, be queued for deletion when user saves
    await assert.equal(applicant.hasDirtyAttributes, true);
    await assert.equal(applicant.isDeleted, true);

    // FIXME: user shouldn't see the fieldset
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

  test('user can select a state for an applicant team member', async function(assert) {
    this.server.create('applicant', 'individualApplicant');

    this.applicants = [
      await this.owner.lookup('service:store').findRecord('applicant', 1),
    ];

    await render(hbs`
      <Packages::ApplicantTeamEditor 
        @applicants={{this.applicants}}
      />
    `);

    await selectChoose('[data-test-applicant-state-dropdown]', 'OR');

    assert.equal(this.applicants[0].dcpState, 717170037);
  });
});
