import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pas-form', function(hooks) {
  setupRenderingTest(hooks);

  test('Urban Renewal Area sub Q shows conditionally', async function(assert) {
    await render(hbs`<PasForm />`);
    assert.dom('[data-test-dcpurbanrenewalarea]').doesNotExist();
    await click('[data-test-dcpurbanrenewalarea-yes]');
    assert.dom('[data-test-dcpurbanrenewalarea]').exists();
  });

  test('SEQRA or CEQR sub Q shows conditionally', async function(assert) {
    await render(hbs`<PasForm />`);
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').doesNotExist();
    await click('[data-test-dcplanduseactiontype2-yes]');
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').exists();
  });

  test('Industrial Business Zone sub Q shows conditionally', async function(assert) {
    await render(hbs`<PasForm />`);
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszone]').doesNotExist();
    await click('[data-test-dcpprojectareaindustrialbusinesszone-yes]');
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszone]').exists();
  });

  test('Landmark or Historic District sub Q shows conditionally', async function(assert) {
    await render(hbs`<PasForm />`);
    assert.dom('[data-test-dcpisprojectarealandmark]').doesNotExist();
    await click('[data-test-dcpIsprojectarealandmark-yes]');
    assert.dom('[data-test-dcpisprojectarealandmark]').exists();
  });

  test('Other Type sub Q shows conditionally', async function(assert) {
    await render(hbs`<PasForm />`);
    assert.dom('[data-test-dcpproposeddevelopmentsiteinfoother]').doesNotExist();
    await click('[data-test-dcpproposeddevelopmentsiteotherexplanation]');
    assert.dom('[data-test-dcpproposeddevelopmentsiteinfoother]').exists();
  });

  test('MIH sub Q shows conditionally', async function(assert) {
    await render(hbs`<PasForm />`);
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').doesNotExist();
    await click('[data-test-dcpisinclusionaryhousingdesignatedarea-yes]');
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').exists();
  });

  test('Funding Source sub Q shows conditionally', async function(assert) {
    await render(hbs`<PasForm />`);
    assert.dom('[data-test-dcphousingunittypecity]').doesNotExist();
    assert.dom('[data-test-dcphousingunittypestate]').doesNotExist();
    assert.dom('[data-test-dcphousingunittypefederal]').doesNotExist();
    assert.dom('[data-test-dcphousingunittypeother]').doesNotExist();
    await click('[data-test-dcpdiscressionaryfundingforffordablehousing-yes]');
    assert.dom('[data-test-dcphousingunittypecity]').exists();
    assert.dom('[data-test-dcphousingunittypestate]').exists();
    assert.dom('[data-test-dcphousingunittypefederal]').exists();
    assert.dom('[data-test-dcphousingunittypeother]').exists();
  });
});
