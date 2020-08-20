import Controller from '@ember/controller'; 
import { action } from '@ember/object';

export default class ProjectController extends Controller {
  @action
  saveContact() {
    this.contacts.forEach(async function(contact) {
      await contact.save();
      console.log('punch', contact.firstname);
    });
  }
}
