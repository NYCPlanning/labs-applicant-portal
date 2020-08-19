import Controller from '@ember/controller'; 
import { action } from '@ember/object';
import { addToHasMany } from '../utils/ember-changeset';

export default class ProjectController extends Controller {
  // @action
  // addApplicant(changeset) {
  //   console.log('changeset coffee', changeset);
  //   console.log('this.model tea', this.model);
  //   const newApplicant = this.store.createRecord('projectApplicant', {
  //     project: this.model,
  //   });

  //   addToHasMany(changeset, 'projectApplicants', newApplicant);
  // }
}
