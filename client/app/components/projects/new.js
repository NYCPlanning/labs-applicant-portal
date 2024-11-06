/* eslint-disable no-console */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittableProjectsNewForm from '../../validations/submittable-projects-new-form';
import { optionset } from '../../helpers/optionset';
import { DCPAPPLICANTROLE } from '../../optionsets/project-applicant';

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
  async submitProject() {
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
      role: DCPAPPLICANTROLE.PRIMARY_CONTACT.code,
    };

    const applicantInput = {
      first: this.args.package.applicantFirstName,
      last: this.args.package.applicantLastName,
      email: this.args.package.applicantEmail,
      phone: this.args.package.applicantPhone,
      role: DCPAPPLICANTROLE.PRIMARY_APPLICANT.code,
    };

    const contactInputs = [primaryContactInput, applicantInput];

    try {
      const projectModel = this.store.createRecord('project', {
        dcpProjectname: projectInformation.projectName,
        dcpBorough: projectInformation.borough,
        dcpApplicanttype: projectInformation.applicantType,
      });

      await projectModel.save();
      console.log('new project?', projectModel);

      const projects = await this.store.findAll('project');
      const sortedProjects = projects.sortBy('createdAt').reverse();
      const mostRecentProject = sortedProjects.get('firstObject');

      console.log('Resolved most recent project:', mostRecentProject);

      const contactPromises = contactInputs.map((contact) => this.store.queryRecord('contact',
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

      const applicantRoleCodes = [DCPAPPLICANTROLE.PRIMARY_CONTACT.code, DCPAPPLICANTROLE.PRIMARY_APPLICANT.code];
      const applicants = applicantRoleCodes.map((code) => {
        const applicant = this.store.createRecord('project-applicant', {
          dcpApplicantrole: code,
        });
        const input = contactInputs.find((input) => input.role === code);
        if (input === undefined) throw new Error('Applicant role not found');
        const { email } = input;
        const contact = verifiedContacts.find((contact) => contact.emailaddress1 === email);
        if (contact === undefined) throw new Error('Contact for applicant role not found');
        applicant.contact = contact;
        return applicant;
      });

      console.log('applicants', applicants);

      applicants.forEach(
        (applicant) => mostRecentProject.projectApplicants.pushObject(applicant),
      );
      applicants.forEach((applicant) => {
        console.log('applicant', applicant);
        console.log(
          'mostRecentProject.projectApplicants',
          mostRecentProject.projectApplicants,
        );
        applicant.mostRecentProject = mostRecentProject;
        applicant.save();
      });

      await mostRecentProject.save();
    } catch (error) {
      console.log('Save new project package error', error.message);
      console.log('the error', error);
    }
  }
}
