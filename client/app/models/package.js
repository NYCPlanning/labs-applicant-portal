import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import FileManager from '../services/file-manager';
import {
  STATUSCODE,
  STATECODE,
  DCPPACKAGETYPE,
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
        this.session,
      );
    }
  }

  @service
  session;

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

  @attr('date')
  dcpStatusdate;

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
    this.statuscode = STATUSCODE.SUBMITTED.code;
    this.statecode = STATECODE.INACTIVE.code;
  }

  async save() {
    await this.fileManager.save();
    if (this.dcpPackagetype === DCPPACKAGETYPE.PAS_PACKAGE.code) {
      await this.pasForm.save();
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.RWCDS.code) {
      await this.rwcdsForm.save();
    }
    await super.save();

    await this.reload();

    this._synchronizeDocuments();
  }

  async submit() {
    this.setAttrsForSubmission();

    await this.save();
  }

  // deprecate
  // filemanager does not actually mutate the package directly. instead, it pushes files into the API
  // and, upon save, the API then detects more documents and sends back the list of documents which
  // this model then sees. This hack is to refresh the in-memory fileManager with those documents.
  _synchronizeDocuments() {
    this.fileManager.existingFiles = this.documents;
  }

  get isDirty() {
    const isPackageDirty = this.hasDirtyAttributes
      || this.fileManager.isDirty;

    if (this.dcpPackagetype === DCPPACKAGETYPE.PAS_PACKAGE.code) {
      return isPackageDirty
        || this.pasForm.hasDirtyAttributes
        || this.pasForm.isBblsDirty
        || this.pasForm.isApplicantsDirty;
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.RWCDS.code) {
      return isPackageDirty
        || this.rwcdsForm.hasDirtyAttributes
        || this.rwcdsForm.isAffectedZoningResolutionsDirty;
    }

    return isPackageDirty;
  }
}
