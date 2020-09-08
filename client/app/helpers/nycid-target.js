import { helper } from '@ember/component/helper';

const encodeToBase64 = (string) => btoa(string);

export default helper(function nycidTarget(params, { url }) {
  const [first] = params; // in case it's invoked differently

  return encodeToBase64(url || first);
});
