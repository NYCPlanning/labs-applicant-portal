import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittableProjectsNewForm from '../../validations/submittable-projects-new-form';
import { optionset } from '../../helpers/optionset';
import config from '../../config/environment';
import validateFileUpload from '../../validators/validate-file-presence';

export default class ProjectsNewFormComponent extends Component {
  validations = {
    SubmittableProjectsNewForm,
  };

  requestCounter = 0;

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
    const requestStartTime = Date.now();
    this.requestCounter++;
    console.log(`LOGGER: [Total Requests Made in the client controller] ${this.requestCounter}`);

    const primaryContactInput = {
      first: this.args.package.primaryContactFirstName,
      last: this.args.package.primaryContactLastName,
      email: this.args.package.primaryContactEmail,
      phone: this.args.package.primaryContactPhone,
    };

    const applicantInput = {
      first: this.args.package.applicantFirstName,
      last: this.args.package.applicantLastName,
      email: this.args.package.applicantEmail,
      phone: this.args.package.applicantPhone,
    };

    const contactInputs = [primaryContactInput, applicantInput];

    const validationResult = validateFileUpload(
      {
        message: 'Please upload at least one file before submitting.',
      },
    )('documents', this.args.package.documents);

    if (validationResult !== true) {
      this.errorMessage = validationResult;
      return;
    }

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

      const [verifiedPrimaryContact, verifiedApplicant] = await Promise.all(
        verifiedContactPromises,
      );

      const authSessionRaw = localStorage.getItem('ember_simple_auth-session');

      if (authSessionRaw === null) {
        throw new Error('unauthorized');
      }
      const authSession = JSON.parse(authSessionRaw);
      const {
        authenticated: { access_token: accessToken },
      } = authSession;
      if (accessToken === undefined) {
        throw new Error('unauthorized');
      }

      const response = await fetch(`${config.host}/projects`, {
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
              dcpBorough: this.args.package.borough.code,
              dcpApplicanttype: this.args.package.applicantType.code,
              dcpProjectbrief: this.args.package.projectBrief,
              _dcpApplicantadministratorCustomerValue:
              verifiedPrimaryContact.id,
              _dcpApplicantCustomerValue: verifiedApplicant.id,
            },
          },
        }),
      });
      const { data: project } = await response.json();
      const requestEndTime = Date.now();
      console.debug(`LOGGER: POST request in the client controller to took ${requestEndTime - requestStartTime} ms`);
      console.debug('response in client controller: ', response, 'response status: ', response.status);

      this.args.package.saveAttachedFiles(project.attributes['dcp-artifactsid']);

      this.router.transitionTo('projects');
    } catch {
      /* eslint-disable-next-line no-console */
      console.error('Error while creating project');
    }
  }
}
