import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | applicant-team-editor', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Packages::ApplicantTeamEditor />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <Packages::ApplicantTeamEditor>
        template block text
      </Packages::ApplicantTeamEditor>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  // test('can add primary applicant', async function(assert) {
  //   this.applicantArray = [
  //     {
  //       dcp_firstname: 'Brandyn',
  //       dcp_lastname: 'Friedly',
  //       dcp_organization: '',
  //       dcp_emailaddress: '',
  //       dcp_address: '120 Broadway 31FL',
  //       dcp_city: 'New York',
  //       dcp_state: 'NY',
  //       dcp_zip: '10014',
  //     }];

  //   await render(hbs`
  //     <ApplicantTeamEditor @applicants={{this.applicantArray}}>
  //     </ApplicantTeamEditor>
  //   `);
  // });

  // test('can add co-applicant', async function(assert) {

  // });

  // test('can add representative', async function(assert) {

  // });

  // test('can add environmental consultant', async function(assert) {

  // });
});
