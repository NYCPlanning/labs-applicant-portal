import { module, test } from 'qunit';
import {
  visit,
  fillIn,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectChoose } from 'ember-power-select/test-support';

module('Acceptance | pas form validation message display', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('validation message appears for each required section', async function(assert) {
    this.server.create('package', {
      project: this.server.create('project'),
      pasForm: this.server.create('pas-form'),
    });

    await visit('/packages/1/edit');

  //dcpRevisedprojectname
  //  dcpDescriptionofprojectareageography
  //  dcpUrbanareaname
  //  dcpProjectareaindutrialzonename
  //  dcpProjectarealandmarkname
  //  dcpCityregisterfilenumber
  //  dcpEstimatedcompletiondate
  //  dcpProjectdescriptionproposeddevelopment
  //  dcpProjectdescriptionbackground
  //  dcpProjectdescriptionproposedactions
  //  dcpProjectdescriptionproposedarea
  //  dcpProjectdescriptionsurroundingarea
  //  dcpProjectattachmentsotherinformation

    await this.pauseTest();

  });
});
