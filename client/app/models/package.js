import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
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

  @belongsTo('landuse-form', { async: false })
  landuseForm;

  // although the business logic for this field is that
  // one package has ONE ceqr-invoice-questionnaire, the
  // data in CRM is stored as an array of objects, so
  // in this model we have a computed property singleCeqrInvoiceQuestionnaire
  // that just grabs that first (and only) object from the array
  @hasMany('ceqr-invoice-questionnaire', { async: false })
  ceqrInvoiceQuestionnaires;

  @hasMany('invoice', { async: false })
  invoices;

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

  @attr('string')
  dcpPackagenotes

  @attr({ defaultValue: () => [] })
  documents;

  @attr('number')
  grandTotal;

  get singleCeqrInvoiceQuestionnaire() {
    return this.ceqrInvoiceQuestionnaires.firstObject;
  }

  setAttrsForSubmission() {
    this.statuscode = STATUSCODE.SUBMITTED.code;
    this.statecode = STATECODE.INACTIVE.code;
  }

  async save(recordsToDelete) {
    await this.fileManager.save();
    if (this.dcpPackagetype === DCPPACKAGETYPE.PAS_PACKAGE.code) {
      await this.saveDeletedRecords(recordsToDelete);
      await this.pasForm.save();
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.RWCDS.code) {
      await this.rwcdsForm.save();
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.DRAFT_LU_PACKAGE.code
      || this.dcpPackagetype === DCPPACKAGETYPE.FILED_LU_PACKAGE.code) {
      await this.saveDeletedRecords(recordsToDelete);
      await this.landuseForm.save();
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.FILED_EAS.code) {
      await this.saveDirtySingleCeqrInvoiceQuestionnaire();
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.DRAFT_SCOPE_OF_WORK.code) {
      await this.saveDirtySingleCeqrInvoiceQuestionnaire();
    }
    await super.save();

    await this.reload();

    this._synchronizeDocuments();
  }

  get isSingleCeqrInvoiceQuestionnaireDirty() {
    if (this.singleCeqrInvoiceQuestionnaire) {
      return this.singleCeqrInvoiceQuestionnaire.hasDirtyAttributes;
    } return false;
  }

  async saveDirtySingleCeqrInvoiceQuestionnaire() {
    if (this.isSingleCeqrInvoiceQuestionnaireDirty) {
      this.singleCeqrInvoiceQuestionnaire.save();
    }
  }

  async submit() {
    this.setAttrsForSubmission();

    await this.save();
  }

  async saveDeletedRecords(recordsToDelete) {
    if (recordsToDelete) {
      return Promise.all(
        recordsToDelete
          .map((record) => record.save()),
      );
    }
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
    if (this.dcpPackagetype === DCPPACKAGETYPE.DRAFT_LU_PACKAGE.code
      || this.dcpPackagetype === DCPPACKAGETYPE.FILED_LU_PACKAGE.code) {
      return isPackageDirty
        || this.landuseForm.hasDirtyAttributes
        || this.landuseForm.isBblsDirty
        || this.landuseForm.isApplicantsDirty
        || this.landuseForm.isLanduseActionsDirty
        || this.landuseForm.isSitedatahFormsDirty
        || this.landuseForm.isLanduseGeographiesDirty
        || this.landuseForm.isRelatedActionsDirty
        || this.landuseForm.isProjectDirty
        || this.landuseForm.isAffectedZoningResolutionsDirty
        || this.landuseForm.isZoningMapChangesDirty;
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.FILED_EAS.code) {
      return isPackageDirty
        || this.isSingleCeqrInvoiceQuestionnaireDirty;
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.DRAFT_SCOPE_OF_WORK.code) {
      return isPackageDirty
        || this.isSingleCeqrInvoiceQuestionnaireDirty;
    }

    return isPackageDirty;
  }
}
