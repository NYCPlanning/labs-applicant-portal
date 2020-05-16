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
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpurbanrenewalareaname]').doesNotExist();

    await click('[data-test-dcpurbanrenewalarea="Yes"]');
    assert.dom('[data-test-dcpurbanrenewalareaname]').exists();
  });

  test('SEQRA or CEQR sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').doesNotExist();
    await click('[data-test-dcplanduseactiontype2="Yes"]');
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').exists();
  });

  test('Industrial Business Zone sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszonename]').doesNotExist();
    await click('[data-test-dcpprojectareaindustrialbusinesszone="Yes"]');
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszonename]').exists();
  });

  test('Landmark or Historic District sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpisprojectarealandmarkname]').doesNotExist();
    await click('[data-test-dcpIsprojectarealandmark="Yes"]');
    assert.dom('[data-test-dcpisprojectarealandmarkname]').exists();
  });

  test('Other Type sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpproposeddevelopmentsiteotherexplanation]').doesNotExist();
    await click('[data-test-dcpproposeddevelopmentsiteinfoother]');
    assert.dom('[data-test-dcpproposeddevelopmentsiteotherexplanation]').exists();
  });

  test('MIH sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').doesNotExist();
    await click('[data-test-dcpisinclusionaryhousingdesignatedarea="Yes"]');
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').exists();
  });

  test('Funding Source sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcphousingunittype="City"]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype="State"]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype="Federal"]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype="Other"]').doesNotExist();
    await click('[data-test-dcpdiscressionaryfundingforffordablehousing="Yes"]');
    assert.dom('[data-test-dcphousingunittype="City"]').exists();
    assert.dom('[data-test-dcphousingunittype="State"]').exists();
    assert.dom('[data-test-dcphousingunittype="Federal"]').exists();
    assert.dom('[data-test-dcphousingunittype="Other"]').exists();
  });

  test('user can save pas form', async function(assert) {
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });
    this.save = () => { this.package.save(); };
    this.submit = () => { this.package.submit(); };

    // render form
    await render(hbs`
      <Packages::PasForm::Edit
        @package={{this.package}}
        @onSave={{fn this.save}}
        @onSubmit={{fn this.submit}}
      />
    `);

    // save button should start disabled
    // TODO: fix this test.  The form starts dirty because we implicitly create a new applicant when the applicants array is empty
    // assert.dom('[data-test-save-button').hasProperty('disabled', true);

    // edit a field to make it pasForm dirty
    await fillIn('[data-test-dcprevisedprojectname]', 'Some Cool New Project Name');

    // save button should become active when dirty
    assert.dom('[data-test-save-button').hasProperty('disabled', false);

    // save it
    await click('[data-test-save-button]');
    await settled(); // async make sure save action finishes before assertion

    // database record should have new updated value
    assert.equal(this.server.db.pasForms[0].dcpRevisedprojectname, 'Some Cool New Project Name');
  });

  test('user sees a confirmation modal upon submit', async function(assert) {
    const projectPackage = this.server.create('package', {
      project: this.server.create('project'),
    });

    this.package = await this.owner.lookup('service:store')
      .findRecord('package', projectPackage.id, { include: 'pas-form,project' });
    this.save = () => { this.package.save(); };
    this.submit = () => { this.package.submit(); };

    class RouterServiceStub extends Service {
      transitionTo() {}
    }

    this.owner.register('service:router', RouterServiceStub);

    // render form
    await render(hbs`
      <Packages::PasForm::Edit
        @package={{this.package}}
        @onSave={{fn this.save}}
        @onSubmit={{fn this.submit}}
      />
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

    // research: ember changeset validations save method triggers a
    // promise that resolves _after_ mirage has been torn down by tests
    await settled();

    assert.ok(true);
  });
});
