import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';

module('Integration | Component | packages/applicant-team-editor', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.pasFormModel = {
      dcp_pasformid: '09c0127a-415b-ea11-a9af-001dd83080ab',
      dcp_dcp_applicantrepinformation_dcp_pasform: [
        {
          role: 'Applicant', // FIXME: field does not exist, need to figure out how to derive role/title
          title: 'Primary Applicant', // FIXME: field does not exist, need to figure out how to derive role/title
          dcp_address: null,
          dcp_firstname: 'Matt',
          createdon: '2020-03-03T20:22:35Z',
          dcp_state: null,
          dcp_organization: null,
          dcp_zipcode: null,
          dcp_email: 'asdfasdfasdf@asdf.com',
          versionnumber: 137731284,
          dcp_applicantrepresentativeinformationid: 'e5a170b5-8c5d-ea11-a9a8-001dd8308047',
          dcp_name: 'Matt Gardner ',
          dcp_city: null,
          statecode: 0,
          dcp_phone: null,
          dcp_lastname: 'Gardner'
        }
      ]
    };

    await render(hbs`
      <Packages::ApplicantTeamEditor @applicants={{this.pasFormModel.dcp_dcp_applicantrepinformation_dcp_pasform}} />
    `)

    await this.pauseTest();
  });
});
