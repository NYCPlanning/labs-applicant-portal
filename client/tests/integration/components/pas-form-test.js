import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render, click, fillIn, settled,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | pas-form', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('Urban Renewal Area sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpurbanrenewalarea]').doesNotExist();
    await click('[data-test-dcpurbanrenewalarea-yes]');
    assert.dom('[data-test-dcpurbanrenewalarea]').exists();
  });

  test('SEQRA or CEQR sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').doesNotExist();
    await click('[data-test-dcplanduseactiontype2-yes]');
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').exists();
  });

  test('Industrial Business Zone sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszone]').doesNotExist();
    await click('[data-test-dcpprojectareaindustrialbusinesszone-yes]');
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszone]').exists();
  });

  test('Landmark or Historic District sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });


    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpisprojectarealandmark]').doesNotExist();
    await click('[data-test-dcpIsprojectarealandmark-yes]');
    assert.dom('[data-test-dcpisprojectarealandmark]').exists();
  });

  test('Other Type sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpproposeddevelopmentsiteotherexplanation]').doesNotExist();
    await click('[data-test-dcpproposeddevelopmentsiteinfoother]');
    assert.dom('[data-test-dcpproposeddevelopmentsiteotherexplanation]').exists();
  });

  test('MIH sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').doesNotExist();
    await click('[data-test-dcpisinclusionaryhousingdesignatedarea-yes]');
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').exists();
  });

  test('Funding Source sub Q shows conditionally', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

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
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // render form
    await render(hbs`<Packages::PasForm::Edit @package={{this.package}} />`);

    // edit a field
    await fillIn('[data-test-dcprevisedprojectname]', 'Some Cool New Project Name');

    // save it
    await click('[data-test-save-button]');
    await settled(); // async make sure save action finishes before assertion

    assert.equal(this.server.db.pasForms[0].dcpRevisedprojectname, 'Some Cool New Project Name');
  });
});
