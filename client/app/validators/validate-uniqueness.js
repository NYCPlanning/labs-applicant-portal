export default function validateUniqueness(options) {
  const { on } = options;
  // console.log('args before', ...args);
  // console.log('args after', args);

  return (...args) => {
    const [key, newValue, oldValue, changes, content] = args;

    console.log('changes', changes);
    console.log('on beep', on);
    console.log('content[key]', content[key]);
    console.log('newValue', newValue.map(x => x[on]));
    console.log('oldValue[on]', oldValue.map(x => x[on]));

    const matchingObjects = content[key].filter(model => model[on] === oldValue[on]);

    console.log('matchingObjects', matchingObjects);

    // const target = Object.prototype.hasOwnProperty.call(changes, on) ? changes[on] : content[on];

    // const hasMatchingWith = withValue(target);

    // if (hasMatchingWith) {
    //   return validateNumber(options)(...args);
    // }

    return true;
  };
}
