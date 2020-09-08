import {
  validateLength,
} from 'ember-changeset-validations/validators';

export default {
  dcpProjectname: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
};
