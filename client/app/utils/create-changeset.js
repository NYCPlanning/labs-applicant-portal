import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default function createChangeset(model, validations, options = {}) {
  const { dependsOn } = options;
  // console.log("model", model);
  // console.log("validations", validations);
  console.log("create change-changeset js options", options);
  console.log("dependsOn", dependsOn);
  // this recomputes each time the model changes, so make idempotent
  const changeset = Changeset(
    model,
    lookupValidator(validations),
    validations,
    options,
  );

  console.log("changeset", changeset);

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
