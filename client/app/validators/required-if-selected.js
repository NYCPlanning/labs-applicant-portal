import {
  validatePresence,
} from 'ember-changeset-validations/validators';

export default function validatePresenceIf(options) {
  const { withValue, on } = options;

  return (...args) => {
    const [,,, changes, content] = args;
    const hasMatchingWith = (changes[on] || content[on]) === withValue;

    if (hasMatchingWith) {
      return validatePresence(options)(...args);
    }

    return true;
  };
}
