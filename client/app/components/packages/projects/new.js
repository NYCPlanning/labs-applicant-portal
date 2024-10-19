import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import SubmittableProjectsNewForm from '../../../validations/submittable-projects-new-form';
import { optionset } from '../../../helpers/optionset';


export default class ProjectsNewFormComponent extends Component {
  validations = {
    SubmittableProjectsNewForm,
  };

  @service
  router;

  @service
  store;

  @tracked
  selectedBorough = null;

  get boroughOptions() {
    return optionset(['project', 'boroughs', 'list']);
  }

  @action
  handleBoroughChange(selectedBorough) {
    console.log('Selected borough:', selectedBorough);

    this.selectedBorough = selectedBorough;

    if (this.args.form) {
      this.args.form.set('borough', selectedBorough);
    }
  }

  @action
  async submitPackage() {
    const primaryContactInput = {
      first: this.args.package.primaryContactFirstName,
      last: this.args.package.primaryContactLastName,
      email: this.args.package.primaryContactEmail,
      phone: this.args.package.primaryContactPhone,
      role: 'contact',
    };

    const applicantInput = {
      first: this.args.package.applicantFirstName,
      last: this.args.package.applicantLastName,
      email: this.args.package.applicantEmail,
      phone: this.args.package.applicantPhone,
      role: 'applicant',
    };

    const contactInputs = [primaryContactInput, applicantInput];
    try {
      const contactPromises = contactInputs.map((contact) =>
        this.store.queryRecord('contact', {
          email: contact.email,
          includeAllStatusCodes: true,
        })
      );

      const contacts = await Promise.all(contactPromises);

      const verifiedContactPromises = contacts.map((contact, index) => {
        if (contact.id === '-1') {
          const contactInput = contactInputs[index];
          const contactModel = this.store.createRecord('contact', {
            firstname: contactInput.first,
            lastname: contactInput.last,
            emailaddress1: contactInput.email,
            telephone1: contactInput.phone,
          });
          return contactModel.save();
        }
        return contact;
      });
      await Promise.all(verifiedContactPromises);
    } catch {
      console.log('Save new project package error');
    }
  }
}
