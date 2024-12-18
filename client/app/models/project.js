import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { optionset } from '../helpers/optionset';

export default class ProjectModel extends Model {
  // The human-readable, descriptive name.
  // e.g. 'Marcus Garvey Blvd Project'
  @attr dcpProjectname;

  // The CRM Project 5-letter ID.
  // e.g. 2020M0442
  // This is NOT the project GUID.
  @attr dcpName;

  @attr dcpBorough;

  @attr statuscode;

  // e.g. 'Noticed', 'Filed', 'In Public Review', 'Completed'
  @attr dcpPublicstatus;

  @attr dcpVisibility;

  @attr dcpApplicantCustomerValue;

  @attr dcpProjectbrief;

  // equitable development project attrs
  @attr('number') dcpNonresatleast50000;

  @attr('number') dcpNewresibuildmore50000sf;

  @attr('number') dcpIncreasepermitresatleast50000sf;

  @attr('number') dcpIncreasepermitnonresiatleast200000sf;

  @attr('number') dcpDecpermresiatleastfourcontigcb;

  @attr('number') dcpDecnumofhousunitsatleastfourcontigcb;

  @attr('number') dcpContatleast100000sfzonfla;

  @attr('number') dcpImapplyazoningtmaffectsmore5rcd;

  @attr('number') dcpAffectfourmorecb;

  // RWCDS project attrs
  @attr('number')
  dcpNumberofnewdwellingunits;

  @attr('number')
  dcpIncrementhousingunits;

  @attr('number')
  dcpActionaffordabledwellingunits;

  @attr('number')
  dcpIncrementalaffordabledwellingunits;

  @attr('number')
  dcpResidentialsqft;

  @attr('number')
  dcpNewcommercialsqft;

  @attr('number')
  dcpNewindustrialsqft;

  @attr('number')
  dcpNewcommunityfacilitysqft;

  // We assume there's only one. If there's >1 in crm, the backend
  // should return the first one.
  @belongsTo('artifact', { async: false })
  artifact;

  @hasMany('package', { async: false })
  packages;

  @hasMany('project-applicant', { async: false })
  projectApplicants;

  @hasMany('team-member', { async: false })
  teamMembers;

  @hasMany('milestone', { async: false })
  milestones;

  get isDirty() {
    return this.hasDirtyAttributes || (this.artifact && this.artifact.isDirty);
  }

  get publicStatusGeneralPublicProject() {
    const isGeneralPublic = this.dcpVisibility
      === optionset(['project', 'dcpVisibility', 'code', 'GENERAL_PUBLIC']);
    return this.dcpPublicstatus && isGeneralPublic;
  }

  get pasPackages() {
    const pasPackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'PAS_PACKAGE']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return pasPackages;
  }

  get rwcdsPackages() {
    const rwcdsPackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'RWCDS']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return rwcdsPackages;
  }

  get landusePackages() {
    const landusePackages = [
      ...this.postCertLUPackages,
      ...this.filedLandusePackages,
      ...this.draftLandusePackages,
    ];

    return landusePackages;
  }

  get draftLandusePackages() {
    const landusePackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'DRAFT_LU_PACKAGE']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return landusePackages;
  }

  get filedLandusePackages() {
    const landusePackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'FILED_LU_PACKAGE']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return landusePackages;
  }

  get postCertLUPackages() {
    return this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'POST_CERT_LU']),
      )
      .sortBy('dcpPackageversion')
      .reverse();
  }

  get easPackages() {
    const easPackages = [...this.filedEasPackages, ...this.draftEasPackages];

    return easPackages;
  }

  get draftEasPackages() {
    const easPackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'DRAFT_EAS']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return easPackages;
  }

  get filedEasPackages() {
    const easPackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'FILED_EAS']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return easPackages;
  }

  get scopeOfWorkDraftPackages() {
    const scopeOfWorkDraftPackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset([
            'package',
            'dcpPackagetype',
            'code',
            'DRAFT_SCOPE_OF_WORK',
          ]),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return scopeOfWorkDraftPackages;
  }

  get eisPackages() {
    const eisPackages = [...this.feisPackages, ...this.deisPackages];

    return eisPackages;
  }

  get deisPackages() {
    const eisPackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'PDEIS']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return eisPackages;
  }

  get feisPackages() {
    const eisPackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'EIS']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return eisPackages;
  }

  get technicalMemoPackages() {
    const technicalMemoPackages = this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'TECHNICAL_MEMO']),
      )
      .sortBy('dcpPackageversion')
      .reverse();

    return technicalMemoPackages;
  }

  get workingPackages() {
    return this.packages
      .filter(
        (projectPackage) => projectPackage.dcpPackagetype
          === optionset(['package', 'dcpPackagetype', 'code', 'WORKING_PACKAGE']),
      )
      .sortBy('dcpPackageversion')
      .reverse();
  }
}
