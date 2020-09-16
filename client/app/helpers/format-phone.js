import { helper } from '@ember/component/helper';

export function formatPhone(params) {
  const [phone] = params;

  if (!phone) {
    return phone;
  }

  return String(phone).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

export default helper(formatPhone);
