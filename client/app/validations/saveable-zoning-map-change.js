import {
  validateLength,
} from 'ember-changeset-validations/validators';

export default {
  dcpZoningsectionmapsnumber: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Number is too long (max {max} characters)',
    }),
  ],
  dcpProposedzoningmapvalue: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Number is too long (max {max} characters)',
    }),
  ],
  dcpExistingzoningdistrictvaluenew: [
    validateLength({
      min: 0,
      max: 30,
      message: 'Number is too long (max {max} characters)',
    }),
  ],
};
