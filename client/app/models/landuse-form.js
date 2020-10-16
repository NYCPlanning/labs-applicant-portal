import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class LanduseFormModel extends Model {
  @belongsTo('package', { async: false })
  package;

  @hasMany('applicant', { async: false })
  applicants;

  @hasMany('landuse-action', { async: false })
  landuseActions;

  @hasMany('bbl', { async: false })
  bbls;

  @hasMany('related-action', { async: false })
  relatedActions;

  @hasMany('sitedatah-form', { async: false })
  sitedatahForms;

  @hasMany('landuse-geography', { async: false })
  landuseGeographies;

  @hasMany('affected-zoning-resolution', { async: false })
  affectedZoningResolutions;

  @hasMany('zoning-map-change', { async: false })
  zoningMapChanges;

  // this is just for GETting dcp_leadagency information
  // we do not PATCH or POST directly to dcp_leadagency
  // instead we handle sending related information to the backend
  // through a made-up field called `chosenLeadAgencyId`
  @belongsTo('lead-agency', { async: false })
  leadAgency;

  @attr dcpVersion;

  // project name
  @attr dcpProject;

  @attr dcpContactname;

  @attr dcpContactphone;

  @attr dcpContactemail;

  // Site Information attrs
  @attr dcpSitedataadress;

  @attr dcpCitycouncil;

  @attr dcpSitedatacommunitydistrict;

  @attr dcpSitedatazoningsectionnumbers;

  @attr dcpSitedataexistingzoningdistrict;

  @attr dcpSpecialdistricts;

  // Proposed Project Area attrs
  @attr dcpWholecity;

  @attr dcpEntiretyboroughs;

  @attr dcpBoroughs;

  @attr dcpEntiretycommunity;

  @attr dcpCommunity;

  @attr dcpNotaxblock;

  @attr dcpSitedatapropertydescription;

  @attr dcpZonesspecialdistricts;

  @attr dcpStateczm;

  @attr dcpHistoricdistrict;

  @attr dcpSitedatarenewalarea;

  // Proposed Development Site attrs
  @attr dcp500kpluszone;

  @attr dcpDevsize;

  @attr dcpSitedatasiteisinnewyorkcity;

  @attr dcpSitedataidentifylandmark;

  // Environmental Review attrs
  @attr dcpCeqrnumber;

  @attr dcpCeqrtype;

  @attr dcpTypecategory;

  @attr dcpDeterminationdate;

  // Housing Plans attrs
  @attr dcpDesignation;

  @attr dcpProjecthousingplanudaap;

  @attr dcpDisposition;

  @attr dcpMannerofdisposition;

  @attr dcpRestrictandcondition;

  // public facilities attrs
  @attr dcpOfficespaceleaseopt;

  @attr dcpAcquisitionopt;

  @attr dcpSiteselectionopt;

  @attr dcpIndicatetypeoffacility;

  @attr dcpExistingfacilityproposedtoremainopt;

  @attr dcpExistingfacilityproposedtoremainandexpand;

  @attr dcpHowlonghasexistingfacilitybeenatthislocat;

  @attr dcpTextexistingfacility;

  @attr dcpExistingfacilityreplacementinanewlocation;

  @attr dcpCurrentfacilitylocation;

  @attr dcpNewfacilityopt;

  @attr dcpIsprojectlistedinstatementofneedsopt;

  @attr dcpIndicatefiscalyears;

  @attr dcpIndicatepgno;

  @attr dcpDidboroughpresidentproposealternativesite;

  @attr dcpWhatsite;

  @attr dcpCapitalbudgetline;

  @attr dcpForfiscalyrs;

  @attr dcpOwnersubjectproperty;

  @attr dcpLeesseesubjectproperty;

  @attr dcpLeaseorbuy;

  @attr dcpIsother;

  @attr dcpOtherparties;

  @attr dcpLegalinstrument;

  @attr dcpEstablishstreetopt;

  @attr dcpEstablishparkopt;

  @attr dcpEstablishpublicplaceopt;

  @attr dcpEstablishgradeopt;

  @attr dcpEasement1;

  @attr dcpEliminatestreetopt;

  @attr dcpEliminateparkopt;

  @attr dcpEliminatepublicplaceopt;

  @attr dcpEliminategradeopt;

  @attr dcpEasement2;

  @attr dcpChangestreetwidthopt;

  @attr dcpChangestreetalignmentopt;

  @attr dcpChangestreetgradeopt;

  @attr dcpChangestreetgradeopt;

  @attr dcpEasement3;

  @attr dcpRelatedacquisitionofpropertyopt;

  @attr dcpRelatedacquisition;

  @attr dcpOnlychangetheeliminationofamappedbutunimp;

  @attr dcpIsitbeingeliminatedfromthepropertyof;

  // A made-up field so we can send an id to the backend
  // and we can bind an account to the dcp_leadagency field
  @attr chosenLeadAgencyId;

  // Disposition attrs
  @attr dcpTypedisposition;

  @attr dcpTextcityagency;

  @attr dcpTowhom;

  // Zoning Map Amendment attrs
  @attr dcpTotalzoningareatoberezoned;

  async save() {
    await this.saveDirtyLanduseActions();
    await this.saveDirtyRelatedActions();
    await this.saveDirtyApplicants();
    await this.saveDirtySitedatahForms();
    await this.saveDirtyLanduseGeographies();
    await this.saveDirtyBbls();
    await this.saveDirtyProject();
    await this.saveDirtyAffectedZoningResolutions();
    await this.saveZoningMapChanges();
    await super.save();
  }

  async saveDirtyRelatedActions() {
    return Promise.all(
      this.relatedActions
        .filter((action) => action.hasDirtyAttributes)
        .map((action) => action.save()),
    );
  }

  async saveDirtyLanduseActions() {
    return Promise.all(
      this.landuseActions
        .filter((action) => action.hasDirtyAttributes)
        .map((action) => action.save()),
    );
  }

  async saveDirtyBbls() {
    return Promise.all(
      this.bbls
        .filter((bbl) => bbl.hasDirtyAttributes)
        .map((bbl) => bbl.save()),
    );
  }

  async saveDirtyProject() {
    if (this.isProjectDirty) {
      this.package.project.save();
    }
  }

  async saveDirtyApplicants() {
    return Promise.all(
      this.applicants
        .filter((applicant) => applicant.hasDirtyAttributes)
        .map((applicant) => applicant.save()),
    );
  }

  async saveDirtySitedatahForms() {
    return Promise.all(
      this.sitedatahForms
        .filter((sitedatahForm) => sitedatahForm.hasDirtyAttributes)
        .map((sitedatahForm) => sitedatahForm.save()),
    );
  }

  async saveDirtyLanduseGeographies() {
    return Promise.all(
      this.landuseGeographies
        .filter((landuseGeography) => landuseGeography.hasDirtyAttributes)
        .map((landuseGeography) => landuseGeography.save()),
    );
  }

  async saveDirtyAffectedZoningResolutions() {
    return Promise.all(
      this.affectedZoningResolutions
        .filter((zoningResolution) => zoningResolution.hasDirtyAttributes)
        .map((zoningResolution) => zoningResolution.save()),
    );
  }

  async saveZoningMapChanges() {
    return Promise.all(
      this.zoningMapChanges
        .filter((zoningMapChange) => zoningMapChange.hasDirtyAttributes)
        .map((zoningMapChange) => zoningMapChange.save()),
    );
  }

  get isLanduseActionsDirty() {
    const dirtyLanduseActions = this.landuseActions.filter((action) => action.hasDirtyAttributes);

    return dirtyLanduseActions.length > 0;
  }


  get isRelatedActionsDirty() {
    const dirtyRelatedActions = this.relatedActions.filter((action) => action.hasDirtyAttributes);

    return dirtyRelatedActions.length > 0;
  }

  get isBblsDirty() {
    const dirtyBbls = this.bbls.filter((bbl) => bbl.hasDirtyAttributes);

    return dirtyBbls.length > 0;
  }

  get isApplicantsDirty() {
    const dirtyApplicants = this.applicants.filter((applicant) => applicant.hasDirtyAttributes);

    return dirtyApplicants.length > 0;
  }

  get isSitedatahFormsDirty() {
    const dirtySitedatahForms = this.sitedatahForms.filter((sitedatahForm) => sitedatahForm.hasDirtyAttributes);

    return dirtySitedatahForms.length > 0;
  }

  get isLanduseGeographiesDirty() {
    const dirtyLanduseGeographies = this.landuseGeographies.filter((landuseGeography) => landuseGeography.hasDirtyAttributes);

    return dirtyLanduseGeographies.length > 0;
  }

  get isProjectDirty() {
    return this.package.project.hasDirtyAttributes;
  }

  get isAffectedZoningResolutionsDirty() {
    const dirtyZrs = this.affectedZoningResolutions.filter((zr) => zr.hasDirtyAttributes);

    return dirtyZrs.length > 0;
  }

  get isZoningMapChanges() {
    const dirtyZoningMapChanges = this.zoningMapChanges.filter((zoningMapChange) => zoningMapChange.hasDirtyAttributes);

    return dirtyZoningMapChanges.length > 0;
  }
}
