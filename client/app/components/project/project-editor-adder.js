import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ProjectProjectEditorAdderComponent extends Component {
  @tracked buttonOpen;

  @service
  store;

  @action
  addApplicant(firstName, lastName, emailAddress) {
    this.store.createRecord('contact', {
      firstname: firstName,
      lastname: lastName,
      emailaddress1: emailAddress,
    });
  }
}
