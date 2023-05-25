import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { optionset } from '../helpers/optionset';

export default class ProjectController extends Controller {
  @tracked landuse = false;

  @service
  store;

  @action
  async saveEditor(applicant) {
    const newApplicant = await this.store.createRecord('project-applicant', {
      dcpName: `${applicant.firstName} ${applicant.lastName}`,
      firstname: applicant.firstName,
      lastname: applicant.lastName,
      emailaddress: applicant.emailAddress,
      dcpApplicantrole: optionset([
        'projectApplicant',
        'applicantrole',
        'code',
        'Other',
      ]),
      project: this.model,
    });

    await newApplicant.save();
  }
}
