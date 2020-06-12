import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default function createChangeset(model, validations, options = {}) {
  const { dependsOn } = options;

  // this recomputes each time the model changes, so make idempotent
  const changeset = Changeset(
    model,
    lookupValidator(validations),
    validations,
    options,
  );

  if (dependsOn) {
    dependsOn.on('beforeValidation', (key) => {
      changeset[key] = dependsOn[key];
    });

    dependsOn.on('afterValidation', () => {
      changeset.validate();
    });
  }

  // initial validation
  changeset.validate();

  return changeset;
}
