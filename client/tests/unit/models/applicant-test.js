import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | applicant', function(hooks) {
  setupTest(hooks);

  test('pasFormRequiredFieldsFilled is true when required fields are present', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('applicant', {
      dcpFirstname: 'first name',
      dcpLastname: 'last name',
      dcpEmail: 'email@email.com',
    });

    assert.equal(model.pasFormRequiredFieldsFilled, true);
  });

  test('pasFormRequiredFieldsFilled is false when one required field is blank', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('applicant', {
      dcpFirstname: '',
      dcpLastname: 'last name',
      dcpEmail: 'email@email.com',
    });

    assert.equal(model.pasFormRequiredFieldsFilled, false);
  });
});
