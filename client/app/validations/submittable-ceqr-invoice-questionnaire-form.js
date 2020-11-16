import {
  validatePresence,
} from 'ember-changeset-validations/validators';

export default {
  dcpIsthesoleaapplicantagovtagency: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
};
