import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittableProjectsNewForm from '../../../validations/submittable-projects-new-form';

export default class ProjectsNewFormComponent extends Component {
  validations = {
    SubmittableProjectsNewForm,
  };

  @service
  router;

  @service
  store;

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
      const contactPromises = contactInputs
        .map((contact) => this.store.queryRecord('contact',
          {
            email: contact.email,
            includeAllStatusCodes: true,
          }));

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
      const verifiedContacts = await Promise.all(verifiedContactPromises);
      const applicants = verifiedContacts.map((contact) => {
        const applicant = this.store.createRecord('project-applicant');
        applicant.contact = contact;
        return applicant;
      });
      console.debug('project name', this.args.package.projectName)
      const project = this.store.createRecord('project', {
        dcpProjectname: this.args.package.projectName,
      });
      applicants.forEach((applicant) => project.projectApplicants.pushObject(applicant));
      console.debug("project with applicants", project.projectApplicants)

      
      applicants.forEach(applicant => {
        applicant.project = project;
        applicant.save();
      });
      await project.save();

      console.debug("yes, I saved")
    } catch {
      console.log('Save new project package error');
    }
  }
}
