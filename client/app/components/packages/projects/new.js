import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import SubmittableProjectsNewForm from '../../../validations/submittable-projects-new-form';
import { optionset } from '../../../helpers/optionset';
import config from '../../../config/environment';


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

  @tracked
  selectedApplicantType = null;

  get boroughOptions() {
    return optionset(['project', 'boroughs', 'list']);
  }

  get applicantOptions() {
    return optionset(['applicant', 'dcpApplicantType', 'list']);
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
  handleApplicantTypeChange(selectedApplicantType) {
    console.log('Selected Applicant Type:', selectedApplicantType);

    this.selectedApplicantType = selectedApplicantType;

    if (this.args.form) {
      this.args.form.set('dcpApplicantType', selectedApplicantType);
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
      const contactPromises = contactInputs.map((contact) => this.store.queryRecord('contact', {
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
      const [verifiedPrimaryContact, verifiedApplicant] = await Promise.all(verifiedContactPromises);

      const authSessionRaw = localStorage.getItem('ember_simple_auth-session');

      if (authSessionRaw === null) {
        throw new Error('unauthorized');
      }
      const authSession = JSON.parse(authSessionRaw);
      const { authenticated: { access_token: accessToken } } = authSession;
      if (accessToken === undefined) {
        throw new Error('unauthorized');
      }

      await fetch(`${config.host}/projects`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              dcpProjectname: this.args.package.projectName,
              dcpBorough: this.selectedBorough.code,
              dcpApplicantType: this.selectedApplicantType.code,
              dcpProjectbrief: '',
              _dcpApplicantadministratorCustomerValue: verifiedPrimaryContact.id,
              _dcpApplicantCustomerValue: verifiedApplicant.id,
              _dcpLeadplannerValue: verifiedApplicant.id,
            },
          },
        }),
      });
    } catch (e) {
      console.log('Save new project package error', e);
    }
  }
}
