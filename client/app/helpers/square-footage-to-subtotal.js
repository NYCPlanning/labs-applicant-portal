import { helper } from '@ember/component/helper';
import { optionset } from './optionset';

export function sfOptionset(label) {
  return optionset(['ceqrInvoiceQuestionnaire', 'dcpSquarefeet', 'code', label]);
}

export const squareFootageToSubtotalLookup = [
  { squareFeet: sfOptionset('less than 10,000 square feet'), subTotal: 460 },
  { squareFeet: sfOptionset('10,000 to 19,999'), subTotal: 1350 },
  { squareFeet: sfOptionset('20,000 to 39,999'), subTotal: 2940 },
  { squareFeet: sfOptionset('40,000 to 59,999'), subTotal: 5465 },
  { squareFeet: sfOptionset('60,000 to 79,999'), subTotal: 8195 },
  { squareFeet: sfOptionset('80,000 to 99,999'), subTotal: 13660 },
  { squareFeet: sfOptionset('100,000 to 149,999'), subTotal: 27325 },
  { squareFeet: sfOptionset('150,000 to 199,999'), subTotal: 47815 },
  { squareFeet: sfOptionset('200,000 to 299,999'), subTotal: 71415 },
  { squareFeet: sfOptionset('300,000 to 499,999'), subTotal: 128545 },
  { squareFeet: sfOptionset('500,000 to 1,000,000'), subTotal: 192820 },
  { squareFeet: sfOptionset('over 1,000,000 square feet'), subTotal: 314225 },
];

export default helper(function squareFootageToSubtotal([squareFootageValue]) {
  return squareFootageToSubtotalLookup.find((lookup) => lookup.squareFeet === squareFootageValue).subTotal;
});
