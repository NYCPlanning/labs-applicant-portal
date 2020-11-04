import {
  validateLength,
  validateNumber,
} from 'ember-changeset-validations/validators';

export default {
  dcpBorough: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpBlock: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpLot: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpCommunityfacilitycommercialnooffirms: [
    validateNumber({
      lte: 2147483647,
      gte: -2147483648,
      allowBlank: true,
      message: 'Number must be in range ({gte} - {lte})',
    }),
  ],
  dcpNumberofdwellingunits: [
    validateNumber({
      lte: 2147483647,
      gte: -2147483648,
      allowBlank: true,
      message: 'Number must be in range ({gte} - {lte})',
    }),
  ],
  dcpUsesonsite: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpBuildingsorsitetotalsquarefootage: [
    validateNumber({
      lte: 2147483647,
      gte: -2147483648,
      allowBlank: true,
      message: 'Number must be in range ({gte} - {lte})',
    }),
  ],
  dcpLocationsiteinbuilding: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitenumber: [],
  dcpOwnership: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpDisplacementorrelocation: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSquarefootagetobeacquired: [
    validateNumber({
      lte: 2147483647,
      gte: -2147483648,
      allowBlank: true,
      message: 'Number must be in range ({gte} - {lte})',
    }),
  ],
  dcpNumberoffloorsinbuilding: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpCommunityfacilitycommercialnoofemployees: [
    validateNumber({
      lte: 2147483647,
      gte: -2147483648,
      allowBlank: true,
      message: 'Number must be in range ({gte} - {lte})',
    }),
  ],
  dcpVacantforlessthantwoyears: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
};
