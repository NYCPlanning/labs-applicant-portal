import { module, test } from 'qunit';
import validateRequiredIfSelected from 'client/validators/required-if-selected';

module('Unit | Validator | required-if-selected');

test('it exists', function(assert) {
  assert.ok(validateRequiredIfSelected());
});
