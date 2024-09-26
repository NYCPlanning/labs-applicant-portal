import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import FileManager from '../services/file-manager';
import {
  STATUSCODE,
  STATECODE,
  DCPPACKAGETYPE,
} from '../optionsets/package';
import {
  YES_NO_UNSURE_SMALLINT,
} from '../optionsets/common';

export default class PackageModel extends Model {
  createFileQueue() {
    if (this.fileManager) {
      this.fileManager.existingFiles = this.documents;
    } else {
      const fileQueue = this.fileQueue.create(`package${this.id}`);

      this.fileManager = new FileManager(
        this.id,
        "package",
        this.documents,
        [],
        fileQueue,
        this.session
      );
    }
  }

  // Since file upload doesn't perform requests through
  // an Ember Model save() process, it doesn't automatically
  // hydrate the package.adapterError property. When an error occurs
  // during upload we have to manually hydrate a custom error property
  // to trigger the error box displayed to the user.
  @tracked
  fileUploadErrors = null;

  @service
  session;

  @service
  fileQueue;

  @belongsTo("project", { async: false })
  project;

  @belongsTo("pas-form", { async: false })
  pasForm;

  @belongsTo("rwcds-form", { async: false })
  rwcdsForm;

  @belongsTo("landuse-form", { async: false })
  landuseForm;

  @belongsTo("projects", { async: false })
  projects;

  // although the business logic for this field is that
  // one package has ONE ceqr-invoice-questionnaire, the
  // data in CRM is stored as an array of objects, so
  // in this model we have a computed property singleCeqrInvoiceQuestionnaire
  // that just grabs that first (and only) object from the array
  @hasMany("ceqr-invoice-questionnaire", { async: false })
  ceqrInvoiceQuestionnaires;

  @hasMany("invoice", { async: false })
  invoices;

  @attr("number")
  statuscode;

  @attr("date")
  dcpStatusdate;

  @attr("date")
  dcpPackagesubmissiondate;

  @attr("number")
  statecode;

  @attr("number")
  dcpPackagetype;

  @attr("number")
  dcpVisibility;

  @attr("number")
  dcpPackageversion;

  @attr("string")
  dcpPackagenotes;

  @attr({ defaultValue: () => [] })
  documents;

  @attr("number")
  grandTotal;

  get singleCeqrInvoiceQuestionnaire() {
    return this.ceqrInvoiceQuestionnaires.firstObject;
  }

  get isLUPackage() {
    return (
      this.dcpPackagetype === DCPPACKAGETYPE.DRAFT_LU_PACKAGE.code ||
      this.dcpPackagetype === DCPPACKAGETYPE.FILED_LU_PACKAGE.code ||
      this.dcpPackagetype === DCPPACKAGETYPE.POST_CERT_LU.code
    );
  }

  setAttrsForSubmission() {
    this.statuscode = STATUSCODE.SUBMITTED.code;
    this.statecode = STATECODE.INACTIVE.code;
  }

  get isRERApplicable() {
    const {
      dcpNonresatleast50000,
      dcpNewresibuildmore50000sf,
      dcpIncreasepermitresatleast50000sf,
      dcpIncreasepermitnonresiatleast200000sf,
      dcpDecpermresiatleastfourcontigcb,
      dcpDecnumofhousunitsatleastfourcontigcb,
      dcpContatleast100000sfzonfla,
      dcpImapplyazoningtmaffectsmore5rcd,
      dcpAffectfourmorecb,
    } = this.project;

    let rerValues = [
      dcpNonresatleast50000,
      dcpNewresibuildmore50000sf,
      dcpIncreasepermitresatleast50000sf,
      dcpIncreasepermitnonresiatleast200000sf,
      dcpDecpermresiatleastfourcontigcb,
      dcpDecnumofhousunitsatleastfourcontigcb,
      dcpContatleast100000sfzonfla,
      dcpImapplyazoningtmaffectsmore5rcd,
    ];

    if (this.isLUPackage) {
      rerValues = [...rerValues, dcpAffectfourmorecb];
    }

    return rerValues.includes(YES_NO_UNSURE_SMALLINT.YES.code);
  }

  setPASApplicability() {
    this.pasForm.dcpApplicability = this.isRERApplicable
      ? YES_NO_UNSURE_SMALLINT.YES.code
      : YES_NO_UNSURE_SMALLINT.NO.code;
  }

  setLUApplicability() {
    this.landuseForm.dcpApplicability = this.isRERApplicable
      ? YES_NO_UNSURE_SMALLINT.YES.code
      : YES_NO_UNSURE_SMALLINT.NO.code;
  }

  async save(recordsToDelete) {
    let formAdapterError = false;

    try {
      if (this.dcpPackagetype === DCPPACKAGETYPE.PAS_PACKAGE.code) {
        this.setPASApplicability();
        await this.saveDeletedRecords(recordsToDelete);
        await this.pasForm.save();
      }
      if (this.dcpPackagetype === DCPPACKAGETYPE.RWCDS.code) {
        await this.rwcdsForm.save();
      }
      if (this.isLUPackage) {
        this.setLUApplicability();
        await this.saveDeletedRecords(recordsToDelete);
        await this.landuseForm.save();
      }
      if (this.dcpPackagetype === DCPPACKAGETYPE.FILED_EAS.code) {
        await this.saveDirtySingleCeqrInvoiceQuestionnaire();
      }
      if (this.dcpPackagetype === DCPPACKAGETYPE.DRAFT_SCOPE_OF_WORK.code) {
        await this.saveDirtySingleCeqrInvoiceQuestionnaire();
      }
    } catch (e) {
      console.log("Error saving a Form or Ceqr Invoice Questionnaire: ", e); // eslint-disable-line no-console

      formAdapterError = true;
    }

    try {
      await super.save();
    } catch (e) {
      console.log("Error saving package: ", e); // eslint-disable-line no-console
    }

    try {
      await this.fileManager.save();
    } catch (e) {
      console.log("Error saving files: ", e); // eslint-disable-line no-console

      // See comment on the tracked fileUploadError property
      // definition above.
      this.fileUploadErrors = [
        {
          code: "UPLOAD_DOC_FAILED",
          title: "Failed to upload documents",
          detail:
            "An error occured while  uploading your documents. Please refresh and retry.",
        },
      ];
    }

    if (this.isLUPackage && this.project.artifact) {
      try {
        await this.project.artifact.fileManager.save();
      } catch (e) {
        console.log("Error saving artifact files: ", e); // eslint-disable-line no-console

        // See comment on the tracked fileUploadError property
        // definition above.
        this.fileUploadErrors = [
          {
            code: "UPLOAD_DOC_FAILED",
            title: "Failed to upload artifact documents",
            detail:
              "An error occured while  uploading your documents. Please refresh and retry.",
          },
        ];
      }
    }

    if (!formAdapterError && !this.adapterError && !this.fileUploadErrors) {
      if (this.isLUPackage && this.project.artifact)
        await this.project.artifact.rollbackAttributes();

      await this.reload();

      this._synchronizeDocuments();

      if (this.isLUPackage && this.project.artifact)
        this.project.artifact._synchronizeDocuments();
    }
  }

  get isSingleCeqrInvoiceQuestionnaireDirty() {
    if (this.singleCeqrInvoiceQuestionnaire) {
      return this.singleCeqrInvoiceQuestionnaire.hasDirtyAttributes;
    }
    return false;
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
      return Promise.all(recordsToDelete.map((record) => record.save()));
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
    const isPackageDirty =
      this.hasDirtyAttributes ||
      this.fileManager.isDirty ||
      (this.isLUPackage && this.project.isDirty);

    if (this.dcpPackagetype === DCPPACKAGETYPE.PAS_PACKAGE.code) {
      return (
        isPackageDirty ||
        this.pasForm.hasDirtyAttributes ||
        this.pasForm.isBblsDirty ||
        this.pasForm.isApplicantsDirty ||
        this.pasForm.isProjectDirty
      );
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.RWCDS.code) {
      return (
        isPackageDirty ||
        this.rwcdsForm.hasDirtyAttributes ||
        this.rwcdsForm.isAffectedZoningResolutionsDirty
      );
    }
    if (this.isLUPackage) {
      return (
        isPackageDirty ||
        this.landuseForm.hasDirtyAttributes ||
        this.landuseForm.isBblsDirty ||
        this.landuseForm.isApplicantsDirty ||
        this.landuseForm.isLanduseActionsDirty ||
        this.landuseForm.isSitedatahFormsDirty ||
        this.landuseForm.isLanduseGeographiesDirty ||
        this.landuseForm.isRelatedActionsDirty ||
        this.landuseForm.isAffectedZoningResolutionsDirty ||
        this.landuseForm.isZoningMapChangesDirty
      );
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.FILED_EAS.code) {
      return isPackageDirty || this.isSingleCeqrInvoiceQuestionnaireDirty;
    }
    if (this.dcpPackagetype === DCPPACKAGETYPE.DRAFT_SCOPE_OF_WORK.code) {
      return isPackageDirty || this.isSingleCeqrInvoiceQuestionnaireDirty;
    }

    return isPackageDirty;
  }
}
