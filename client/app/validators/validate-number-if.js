import { validateNumber } from 'ember-changeset-validations/validators';

export default function validateNumberIf(options) {
  const { withValue, on } = options;

  return (...args) => {
    const [, , , changes, content] = args;
    const target = Object.prototype.hasOwnProperty.call(changes, on)
      ? changes[on]
      : content[on];

    const hasMatchingWith = withValue(target);

    if (hasMatchingWith) {
      return validateNumber(options)(...args);
    }

    return true;
  };
}
