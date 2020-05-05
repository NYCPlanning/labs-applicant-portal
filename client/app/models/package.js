import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import FileManager from '../services/file-manager';

// TODO: Get theses codes from a Constants service
const PACKAGE_STATUS_CODES = {
  PACKAGE_PREPARATION: 'Package Preparation',
  CERTIFIED: 'Certified',
  FINAL_APPROVAL: 'Final Approval',
  REVIEWED_NO_REVISIONS_REQUIRED: 'Reviewed - No Revisions Required',
  REVIEWED_REVISIONS_REQUIRED: 'Reviewed - Revisions Required',
  WITHDRAWN: 'Withdrawn',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  MISTAKE: 'Mistake',
};

const PACKAGE_VISIBILITY_CODES = {
  APPLICANT_ONLY: 717170002,
  GENERAL_PUBLIC: 717170003,
};

export default class PackageModel extends Model {
  ready() {
    if (this.isApplicantPackage) {
      const fileQueue = this.fileQueue.create(this.id);

      this.fileManager = new FileManager(
        this.id,
        this.documents,
        [],
        fileQueue,
      );
    }
  }

  @service
  fileQueue;

  @belongsTo('project', { async: false })
  project;

  @belongsTo('pas-form', { async: false })
  pasForm;

  @attr('string')
  statuscode;

  @attr('string')
  dcpPackagetype;

  @attr('number')
  dcpVisibility;

  @attr('number')
  dcpPackageversion

  @attr({ defaultValue: () => [] })
  documents;

  async saveDescendants() {
    await this.fileManager.uploadFiles();
    // call special save methods because it will issue a
    // patch requests to every associated record
    await this.pasForm?.saveDirtyApplicants();
    await this.pasForm?.saveDirtyBbls();
    await this.pasForm?.save();
    await this.save();
  }

  get isApplicantPackage() {
    if (
      this.statuscode === PACKAGE_STATUS_CODES.PACKAGE_PREPARATION
      && [
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
      ].includes(this.dcpVisibility)
    ) {
      return true;
    }
    return false;
  }
}
