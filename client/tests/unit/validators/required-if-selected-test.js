import { module, test } from 'qunit';
import validateRequiredIfSelected from 'client/validators/required-if-selected';
import { registerDebugInfoHelper } from '@ember/test-helpers';

module('Unit | Validator | required-if-selected');

// signature here: https://github.com/poteto/ember-changeset-validations/blob/master/addon/validators/presence.js#L18
// key, value, _oldValue, changes, content
test('it invalidates when withValue met', function (assert) {
  const args = ['someKey', '', undefined, {}, { dependentKey: 123 }];

  registerDebugInfoHelper({
  name: 'result error detection',
  log() {
    if (!result) {
      console.log('hay');
    }
  }
});

  const result = validateRequiredIfSelected({
    presence: true,
    on: 'dependentKey',
    withValue: 123,
    message: 'someKey must be filled in.',
  })(...args);

  registerDebugInfoHelper();

  assert.equal(result, 'someKey must be filled in.');
});

test('it validates when withValue is not present', function (assert) {
  const args = ['someKey', '', undefined, {}, {}];

  const result = validateRequiredIfSelected({
    presence: true,
    on: 'dependentKey',
    withValue: 123,
    message: 'someKey must be filled in.',
  })(...args);

  registerDebugInfoHelper();

  assert.equal(result, true);
});

test('it validates when withValue is falsey', function (assert) {
  const args = ['someKey', '', undefined, {}, { dependentKey: true }];

  const result = validateRequiredIfSelected({
    presence: true,
    on: 'dependentKey',
    withValue: false,
    message: 'someKey must be filled in.',
  })(...args);

  registerDebugInfoHelper();

  assert.equal(result, true);
});

test('it validates when key not in content but in changes', function (assert) {
  const args = ['someKey', '', undefined, { dependentKey: true }, {}];

  const result = validateRequiredIfSelected({
    presence: true,
    on: 'dependentKey',
    withValue: false,
  })(...args);

  registerDebugInfoHelper();

  assert.equal(result, true);
});
