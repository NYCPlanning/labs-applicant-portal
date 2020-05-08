import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | project', function(hooks) {
  setupTest(hooks);

  test('pasFormRequiredFieldsFilled is true when required fields are filled', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('project', {
      dcpProjectname: 'our project name',
    });

    assert.equal(model.pasFormRequiredFieldsFilled, true);
  });

  test('pasFormRequiredFieldsFilled is false when required fields are NOT filled', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('project', {
      dcpProjectname: '',
    });

    assert.equal(model.pasFormRequiredFieldsFilled, false);
  });
});
