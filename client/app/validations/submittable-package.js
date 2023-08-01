import {
  validateLength,
} from 'ember-changeset-validations/validators';

export default {
  documents: [
    validateLength({
      min: 1,
      message: 'One or more document uploads is required.',
    }),
  ],
};
