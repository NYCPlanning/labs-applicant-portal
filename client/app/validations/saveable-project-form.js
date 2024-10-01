import {
  validateLength,
  validateNumber,
  validatePresence,
} from 'ember-changeset-validations/validators';

export default {
  dcpProjectname: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpNumberofnewdwellingunits: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
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
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
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
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
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
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
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
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
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
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
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
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
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
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
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
