import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | optionset', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns an optionset given a model and optionsetId', async function(assert) {
    await render(hbs`{{get (get (optionset 'package' 'statecode') 'ACTIVE') 'label'}}`);

    assert.equal(this.element.textContent.trim(), 'Active');

    await render(hbs`{{get (get (optionset 'package' 'statecode') 'INACTIVE') 'code'}}`);

    assert.equal(this.element.textContent.trim(), '1');
  });

  test('it returns an options list given a model and optionsetId, when returnType is "list"', async function(assert) {
    await render(hbs`{{#each (optionset 'package' 'statecode' 'list') as |option|}}{{option.label}},{{option.code}}{{/each}}`);

    assert.equal(this.element.textContent.trim(), 'Active,0Inactive,1');
  });

  test('it returns a label for a given code', async function(assert) {
    await render(hbs`{{optionset 'package' 'dcpVisibility' 'label' 717170002}}`);

    assert.equal(this.element.textContent.trim(), 'Applicant Only');
  });

  test('it returns a label for a given identifier', async function(assert) {
    await render(hbs`{{optionset 'applicant' 'dcpState' 'label' 'OR'}}`);

    assert.equal(this.element.textContent.trim(), 'OR');
  });

  test('it returns a code for a given label', async function(assert) {
    await render(hbs`{{optionset 'package' 'dcpVisibility' 'code' 'Internal DCP Only'}}`);

    assert.equal(this.element.textContent.trim(), '717170000');
  });

  test('it returns a code for a given identifier', async function(assert) {
    await render(hbs`{{optionset 'package' 'dcpVisibility' 'code' 'INTERNAL_DCP_ONLY'}}`);

    assert.equal(this.element.textContent.trim(), '717170000');
  });

  test('it returns a blank label for an invalid code', async function(assert) {
    await render(hbs`{{optionset 'package' 'dcpVisibility' 'label' 'asdf'}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it returns a blank code for an invalid label', async function(assert) {
    await render(hbs`{{optionset 'package' 'dcpVisibility' 'code' 'asdf'}}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
