import {
  validateLength,
  validateNumber,
} from 'ember-changeset-validations/validators';

export default {
  dcpProjectname: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpNumberofnewdwellingunits: [ // start
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      allowBlank: true,
      message: ' Must be a number',
    }),
  ],
  dcpIncrementhousingunits: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      allowBlank: true,
      message: 'Must be a number',
    }),
  ],
  dcpActionaffordabledwellingunits: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      allowBlank: true,
      message: 'Must be a number',
    }),
  ],
  dcpIncrementalaffordabledwellingunits: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      allowBlank: true,
      message: 'Must be a number',
    }),
  ],
  dcpResidentialsqft: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      allowBlank: true,
      message: 'Must be a number',
    }),
  ],
  dcpNewcommercialsqft: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      allowBlank: true,
      message: 'Must be a number',
    }),
  ],
  dcpNewindustrialsqft: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      allowBlank: true,
      message: 'Must be a number',
    }),
  ],
  dcpNewcommunityfacilitysqft: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      allowBlank: true,
      message: 'Must be a number',
    }),
  ],
};
