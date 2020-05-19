import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import FileManager from '../services/file-manager';

export const PACKAGE_STATUS_OPTIONSET = {
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

export const PACKAGE_VISIBILITY_OPTIONSET = {
  INTERNAL_DCP_ONLY: {
    code: 717170000,
    label: 'Internal DCP Only',
  },
  CPC_ONLY: {
    code: 717170001,
    label: 'CPC Only',
  },
  APPLICANT_ONLY: {
    code: 717170002,
    label: 'Applicant Only',
  },
  GENERAL_PUBLIC: {
    code: 717170003,
    label: 'General Public',
  },
  LUP: {
    code: 717170004,
    label: 'LUP',
  },
};

export const PACKAGE_STATE_OPTIONSET = {
  ACTIVE: {
    code: 0,
    label: 'Active',
  },
  INACTIVE: {
    code: 1,
    label: 'Inactive',
  },
};

export const PACKAGE_TYPE_OPTIONSET = {
  INFORMATION_MEETING: {
    code: 717170014,
    label: 'Information Meeting',
  },
  PAS_PACKAGE: {
    code: 717170000,
    label: 'PAS Package',
  },
  DRAFT_LU_PACKAGE: {
    code: 717170001,
    label: 'Draft LU Package',
  },
  FILED_LU_PACKAGE: {
    code: 717170011,
    label: 'Filed LU Package',
  },
  DRAFT_EAS: {
    code: 717170002,
    label: 'Draft EAS',
  },
  FILED_EAS: {
    code: 717170012,
    label: 'Filed EAS',
  },
  EIS: {
    code: 717170003,
    label: 'EIS',
  },
  PDEIS: {
    code: 717170013,
    label: 'PDEIS',
  },
  RWCDS: {
    code: 717170004,
    label: 'RWCDS',
  },
  LEGAL: {
    code: 717170005,
    label: 'Legal',
  },
  WRP_PACKAGE: {
    code: 717170006,
    label: 'WRP Package',
  },
  TECHNICAL_MEMO: {
    code: 717170007,
    label: 'Technical Memo',
  },
  DRAFT_SCOPE_OF_WORK: {
    code: 717170008,
    label: 'Draft Scope of Work',
  },
  FINAL_SCOPE_OF_WORK: {
    code: 717170009,
    label: 'Final Scope of Work',
  },
  WORKING_PACKAGE: {
    code: 717170010,
    label: 'Working Package',
  },
};

export default class PackageModel extends Model {
  createFileQueue() {
    if (this.fileManager) {
      this.fileManager.existingFiles = this.documents;
    } else {
      const fileQueue = this.fileQueue.create(this.id);

      this.fileManager = new FileManager(
        this.id,
        this.documents,
        [],
        fileQueue,
      );
    }
  }

  refreshExistingDocuments() {
    this.fileManager.existingFiles = this.documents;
  }

  @service
  fileQueue;

  @belongsTo('project', { async: false })
  project;

  @belongsTo('pas-form', { async: false })
  pasForm;

  @belongsTo('rwcds-form', { async: false })
  rwcdsForm;

  @attr('number')
  statuscode;

  @attr('number')
  statecode;

  @attr('number')
  dcpPackagetype;

  @attr('number')
  dcpVisibility;

  @attr('number')
  dcpPackageversion

  @attr({ defaultValue: () => [] })
  documents;

  setAttrsForSubmission() {
    this.statuscode = PACKAGE_STATUS_OPTIONSET.SUBMITTED.code;
    this.statecode = PACKAGE_STATE_OPTIONSET.INACTIVE.code;
  }

  async save() {
    await this.fileManager.save();
    if (this.dcpPackagetype === PACKAGE_TYPE_OPTIONSET.PAS_PACKAGE.code) {
      await this.pasForm.save();
    }
    if (this.dcpPackagetype === PACKAGE_TYPE_OPTIONSET.RWCDS.code) {
      await this.rwcdsForm.save();
    }
    await super.save();
  }

  async submit() {
    this.setAttrsForSubmission();

    await this.save();
  }

  get isDirty() {
    const isPackageDirty = this.hasDirtyAttributes
      || this.fileManager.isDirty;

    if (this.dcpPackagetype === PACKAGE_TYPE_OPTIONSET.PAS_PACKAGE.code) {
      return isPackageDirty
        || this.pasForm.hasDirtyAttributes
        || this.pasForm.isBblsDirty
        || this.pasForm.isApplicantsDirty;
    }
    if (this.dcpPackagetype === PACKAGE_TYPE_OPTIONSET.RWCDS.code) {
      return isPackageDirty
        || this.rwcdsForm.hasDirtyAttributes;
    }

    return isPackageDirty;
  }
}
