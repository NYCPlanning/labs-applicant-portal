import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render, click, fillIn, settled,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import Service from '@ember/service';

module('Integration | Component | pas-form', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('Urban Renewal Area sub Q shows conditionally', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpurbanrenewalarea]').doesNotExist();
    await click('[data-test-dcpurbanrenewalarea-yes]');
    assert.dom('[data-test-dcpurbanrenewalarea]').exists();
  });

  test('SEQRA or CEQR sub Q shows conditionally', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').doesNotExist();
    await click('[data-test-dcplanduseactiontype2-yes]');
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').exists();
  });

  test('Industrial Business Zone sub Q shows conditionally', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszone]').doesNotExist();
    await click('[data-test-dcpprojectareaindustrialbusinesszone-yes]');
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszone]').exists();
  });

  test('Landmark or Historic District sub Q shows conditionally', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });


    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpisprojectarealandmark]').doesNotExist();
    await click('[data-test-dcpIsprojectarealandmark-yes]');
    assert.dom('[data-test-dcpisprojectarealandmark]').exists();
  });

  test('Other Type sub Q shows conditionally', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpproposeddevelopmentsiteotherexplanation]').doesNotExist();
    await click('[data-test-dcpproposeddevelopmentsiteinfoother]');
    assert.dom('[data-test-dcpproposeddevelopmentsiteotherexplanation]').exists();
  });

  test('MIH sub Q shows conditionally', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').doesNotExist();
    await click('[data-test-dcpisinclusionaryhousingdesignatedarea-yes]');
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').exists();
  });

  test('Funding Source sub Q shows conditionally', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcphousingunittype-city]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype-state]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype-federal]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype-other]').doesNotExist();
    await click('[data-test-dcpdiscressionaryfundingforffordablehousing-yes]');
    assert.dom('[data-test-dcphousingunittype-city]').exists();
    assert.dom('[data-test-dcphousingunittype-state]').exists();
    assert.dom('[data-test-dcphousingunittype-federal]').exists();
    assert.dom('[data-test-dcphousingunittype-other]').exists();
  });

  test('user can save pas form', async function(assert) {
    const ourProject = this.server.create('project', { dcpProjectname: 'Frozen Banana Castle' });
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    // render form
    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);

    // should be pre-populated with project.dcpProjectname
    assert.equal((this.element.querySelector('[data-test-project-name-input]')).value, 'Frozen Banana Castle');

    // save button should start disabled
    // TODO: fix this test.  The form starts dirty because we implicitly create a new applicant when the applicants array is empty
    // assert.dom('[data-test-save-button').hasProperty('disabled', true);

    // edit a field to make it pasForm dirty
    await fillIn('[data-test-project-name-input]', 'Some Cool New Project Name');

    assert.equal((this.element.querySelector('[data-test-project-name-input]')).value, 'Some Cool New Project Name');

    // save button should become active when dirty
    assert.dom('[data-test-save-button').hasProperty('disabled', false);

    // save it
    await click('[data-test-save-button]');
    await settled(); // async make sure save action finishes before assertion

    // database record should have new updated value
    assert.equal(this.server.db.pasForms[0].dcpRevisedprojectname, 'Some Cool New Project Name');
  });

  test('user sees a confirmation modal upon submit', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    class LocationStub extends Service {
      transitionTo() {}
    }

    this.owner.register('service:router', LocationStub);

    // render form
    await render(hbs`
      <Packages::PasForm::Edit @package={{this.package}} />
      <div id="reveal-modal-container"></div>
      `);

    // modal doesn't exist to start
    assert.dom('[data-test-reveal-modal]').doesNotExist();
    assert.dom('[data-test-confirm-submit-button]').doesNotExist();

    // click submit
    await click('[data-test-submit-button]');

    // modal should exist
    assert.dom('[data-test-reveal-modal]').exists();
    assert.dom('[data-test-confirm-submit-button]').exists();

    await click('[data-test-confirm-submit-button]');
  });
});
