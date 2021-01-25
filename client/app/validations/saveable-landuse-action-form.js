import {
  validateLength,
  validateNumber,
} from 'ember-changeset-validations/validators';

export default {
  dcpNameofzoningresolutionsection: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpZoningsectionstobemodified: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpTypeoflegalinstrument: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpCrfnnumber: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpNumberofzoninglotsaffected: [
    validateNumber({
      lte: 100,
      gte: 0,
      allowBlank: true,
      integer: true,
      message: 'Number must be a whole number in range ({gte} - {lte})',
    }),
  ],
  dcpSquarefootageoftheproposeddevelopment: [
    validateNumber({
      lte: 2147483647,
      gte: 0,
      allowBlank: true,
      integer: true,
      message: 'Number must be a whole number in range ({gte} - {lte})',
    }),
  ],
  dcpSquarefootassociatedwithtransferbonus: [
    validateNumber({
      lte: 2147483647,
      gte: -2147483648,
      allowBlank: true,
      integer: true,
      message: 'Number must a whole number in range ({gte} - {lte})',
    }),
  ],
  dcpNumberofdu: [
    validateNumber({
      lte: 10000,
      gte: 0,
      allowBlank: true,
      integer: true,
      message: 'Number must be a whole number in range ({gte} - {lte})',
    }),
  ],
  dcpSquarefootageofzoninglotsaffected: [
    validateNumber({
      lte: 2147483647,
      gte: 0,
      allowBlank: true,
      integer: true,
      message: 'Number must be a whole number between ({gte} - {lte})',
    }),
  ],
};
