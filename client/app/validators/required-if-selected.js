import {
  validatePresence,
} from 'ember-changeset-validations/validators';

export default function validatePresenceIf(options) {
  const { withValue, on } = options;

  return (...args) => {
    const [,,, changes, content] = args;
    const hasMatchingWith = (changes[on] || content[on]) === withValue;
    let isPresent = validatePresence(options)(...args);
    let message = '';

    // string implies false (invalid) bc it's the error msg
    // stash the error message for later
    if (typeof isPresent === 'string') {
      message = isPresent;

      isPresent = false;
    }

    // if it isn't present, but does not have matching with
    // it's valid because we only care when the condition is met
    if ((isPresent === false) && !hasMatchingWith) {
      return true;
    }

    return message;
  };
}
