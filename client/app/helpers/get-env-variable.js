import { helper } from '@ember/component/helper';
import { get } from '@ember/object';
import ENV from 'client/config/environment';

export default helper(([path], hash) => {
  // allow override for testing
  const targetEnv = hash.environment || ENV;

  return get(targetEnv, path);
});
