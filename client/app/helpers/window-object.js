import { helper } from '@ember/component/helper';
import window from 'ember-window-mock';
import { get } from '@ember/object';

export default helper(function windowObject(params) {
  return get(window, params.join('.'));
});
