import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import FileManager from '../services/file-manager';

export const PACKAGE_STATUS_CODES = {
  PACKAGE_PREPARATION: {
    code: 1,
    label: 'Package Preparation',
  },
  SUBMITTED: {
    code: 717170012,
    label: 'Submitted',
  },
  UNDER_REVIEW: {
    code: 717170013,
    label: 'Under Review',
  },
  REVIEWED_NO_REVISIONS_REQUIRED: {
    code: 717170009,
    label: 'Reviewed - No Revisions Required',
  },
  CERTIFIED: {
    code: 717170005,
    label: 'Certified',
  },
  REVIEWED_REVISIONS_REQUIRED: {
    code: 717170010,
    label: 'Reviewed - Revisions Required',
  },
  FINAL_APPROVAL: {
    code: 717170008,
    label: 'Final Approval',
  },
  WITHDRAWN: {
    code: 717170011,
    label: 'Withdrawn',
  },
  MISTAKE: {
    code: 717170014,
    label: 'Mistake',
  },
};

export const PACKAGE_VISIBILITY_CODES = {
  INTERNAL_DCP_ONLY: {
    code: 717170000,
  },
  CPC_ONLY: {
    code: 717170001,
  },
  APPLICANT_ONLY: {
    code: 717170002,
  },
  GENERAL_PUBLIC: {
    code: 717170003,
  },
  LUP: {
    code: 717170004,
  },
};

export default class PackageModel extends Model {
  ready() {
    const fileQueue = this.fileQueue.create(this.id);

    this.fileManager = new FileManager(
      this.id,
      this.documents,
      [],
      fileQueue,
    );
  }

  @service
  fileQueue;

  @belongsTo('project', { async: false })
  project;

  @belongsTo('pas-form', { async: false })
  pasForm;

  @attr('number')
  statuscode;

  @attr('number')
  statecode;

  @attr('string')
  dcpPackagetype;

  @attr('number')
  dcpVisibility;

  @attr('number')
  dcpPackageversion

  @attr({ defaultValue: () => [] })
  documents;

  async saveDescendants() {
    await this.fileManager.save();
    // call special save methods because it will issue a
    // patch requests to every associated record
    await this.pasForm?.saveDirtyApplicants();
    await this.pasForm?.saveDirtyBbls();
    await this.pasForm?.save();
    await this.save();
  }

  async submit() {
    this.statuscode = PACKAGE_STATUS_CODES.FINAL_APPROVAL.code;
    this.statecode = 1;

    await this.saveDescendants();
  }
}
