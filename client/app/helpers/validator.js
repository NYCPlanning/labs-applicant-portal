import Helper from '@ember/component/helper';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { next } from '@ember/runloop';

export default class Validator extends Helper {
  compute([model, validations = {}], { dependsOn }) {
    // this recomputes each time the model changes, so make idempotent
    if (!this.changeset) {
      this.changeset = Changeset(
        model,
        lookupValidator(validations),
        validations,
      );

      if (dependsOn) {
        dependsOn.on('beforeValidation', (key) => {
          this.changeset[key] = dependsOn[key];
        });

        dependsOn.on('afterValidation', () => {
          this.changeset.validate();
        });
      }

      // initial validation
      next(() => this.changeset.validate());
    }

    return this.changeset;
  }
}
