import { helper } from '@ember/component/helper';

export default helper(function bblBreakup(bbl) {
  // for labs-search component, bbl comes back as number
  const bblString = bbl.toString();
  // borough is first number
  const borough = bblString.substr(0, 1);
  // block is numbers 2-6
  const block = bblString.substr(1, 5);
  // lot is numbers 7-10
  const lot = bblString.substr(6, 9);
  return `Borough ${borough}, Block ${block}, Lot ${lot}`;
});
