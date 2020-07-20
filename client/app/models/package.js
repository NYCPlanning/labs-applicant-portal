import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import FileManager from '../services/file-manager';
import {
  PACKAGE_STATUS_OPTIONSET,
  PACKAGE_STATE_OPTIONSET,
  PACKAGE_TYPE_OPTIONSET,
} from '../optionsets/package';

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
        || this.rwcdsForm.hasDirtyAttributes
        || this.rwcdsForm.isAffectedZoningResolutionsDirty;
    }

    return isPackageDirty;
  }
}
