import {
  validateLength,
  validateNumber,
} from 'ember-changeset-validations/validators';

export default {
  dcpApplicationnumber: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Number is too long (max {max} characters)',
    }),
  ],
  dcpBorough: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpUrsitenumber: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Number is too long (max {max} characters)',
    }),
  ],
  dcpBlocknumbertext: [
    validateLength({
      min: 0,
      max: 5,
      message: 'Number is too long (max {max} characters)',
    }),
  ],
  dcpAddress: [
    validateLength({
      min: 0,
      max: 200,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpLotnumberstring: [
    validateLength({
      min: 0,
      max: 20,
      message: 'Number is too long (max {max} characters)',
    }),
  ],

  dcpOwner: [
    validateLength({
      min: 0,
      max: 25,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpSitenumber: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Number is too long (max {max} characters)',
    }),
  ],

  dcpBuildings: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpZoning: [
    validateLength({
      min: 0,
      max: 20,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpExistinguses: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpExistingstories: [
    validateLength({
      min: 0,
      max: 30,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProposeduses: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpCommoccup: [
    validateNumber({
      lte: 2147483647,
      allowBlank: true,
      message: 'Number is too large (max {lte})',
    }),
  ],

  dcpVacant: [
    validateNumber({
      lte: 2147483647,
      allowBlank: true,
      message: 'Number is too large (max {lte})',
    }),
  ],

  dcpNoofemp: [
    validateNumber({
      lte: 2147483647,
      allowBlank: true,
      message: 'Number is too large (max {lte})',
    }),
  ],

  dcpDwellingcup: [
    validateNumber({
      lte: 2147483647,
      allowBlank: true,
      message: 'Number is too large (max {lte})',
    }),
  ],

  dcpDwellingvacant: [
    validateNumber({
      lte: 2147483647,
      allowBlank: true,
      message: 'Number is too large (max {lte})',
    }),
  ],
};
