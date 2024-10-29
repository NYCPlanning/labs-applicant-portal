import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittableProjectsNewForm from '../../validations/submittable-projects-new-form';
import { optionset } from '../../helpers/optionset';


export default class ProjectsNewFormComponent extends Component {
  validations = {
    SubmittableProjectsNewForm,
  };

  @service
  router;

  @service
  store;

  get boroughOptions() {
    return optionset(['project', 'boroughs', 'list']);
  }

  get applicantOptions() {
    return optionset(['applicant', 'dcpApplicantType', 'list']);
  }

  @action
  async submitPackage() {
    /* eslint-disable no-console */
    console.log('this dot args dot packages?', this.args.package);

    const projectInformation = {
      projectName: this.args.package.projectName,
      borough: this.args.package.borough.code,
      applicantType: this.args.package.applicantType.code,
    };

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
      const contactPromises = contactInputs.map(
        (contact) => this.store.queryRecord('contact',
          {
            email: contact.email,
            includeAllStatusCodes: true,
          }),
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

      const saveProjectInformation = () => {
        const projectModel = this.store.createRecord('project', {
          dcpProjectName: projectInformation.projectName,
          dcpBorough: projectInformation.borough,
          dcoApplicantType: projectInformation.applicantType,
        });
        return projectModel.save();
      };

      await Promise.all(
        [
          verifiedContactPromises,
          saveProjectInformation,
        ],
      )
        .then(
          await this.args.package.submit(),
        );
    } catch (error) {
      console.log('Save new project package error', error);
    }
  }
}
