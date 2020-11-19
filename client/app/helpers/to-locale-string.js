import { helper } from '@ember/component/helper';

export default helper(function toLocaleString(number) {
  return number.toLocaleString();
});
