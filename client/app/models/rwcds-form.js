import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RwcdsFormModel extends Model {
  @belongsTo('package', { async: false })
  package;

  @hasMany('affected-zoning-resolution', { async: false })
  affectedZoningResolutions;

  @attr('string') dcpDescribethewithactionscenario;

  @attr('boolean') dcpIsplannigondevelopingaffordablehousing;

  // dependent on when:
  // there's a project-action with dcpZoningresolutiontype = 'ZR'
  // && dcpZrsectionnumber = 'Appendix F'
  @attr('number') dcpIncludezoningtextamendment;

  @attr('boolean') dcpExistingconditions;

  @attr('string') processid;

  @attr('number') statecode;

  @attr('number') importsequencenumber;

  @attr('number') versionnumber;

  @attr('string') dcpRationalbehindthebuildyear;

  @attr('date') createdon;

  @attr('date') modifiedon;

  @attr('number') dcpIsapplicantseekingaction;

  @attr('string') dcpWhichactionsfromotheragenciesaresought;

  @attr('string') dcpProposedprojectdevelopmentdescription;

  @attr('number') dcpVersion;

  @attr('string') dcpProjectsitedescription;

  @attr('string') dcpSitehistory;

  @attr('string') dcpPurposeandneedfortheproposedaction;

  @attr('string') dcpDescribethenoactionscenario;

  @attr('string') dcpApplicant;

  @attr('boolean') dcpHasprojectchangedsincesubmissionofthepas;

  @attr('string') traversedpath;

  @attr('number') statuscode;

  @attr('number') dcpBorough;

  @attr('string') dcpProjectname;

  @attr('string') dcpRwcdsexplanation;

  @attr('number') dcpCommunitydistrict;

  @attr('string') dcpHowdidyoudeterminethenoactionscenario;

  @attr('string') dcpName;

  @attr('boolean') dcpIsrwcdsscenario;

  @attr('number') timezoneruleversionnumber;

  @attr('string') dcpHowdidyoudeterminethiswithactionscena;

  @attr('string') dcpBuildyear;

  @attr('string') dcpDevelopmentsiteassumptions;

  @attr('number') dcpConstructionphasing;

  @attr('date') dcpDate;

  @attr('date') overriddencreatedon;

  @attr('number') utcconversiontimezonecode;

  async save() {
    try {
      await this.saveDirtyAffectedZoningResolutions();
      await super.save();
    } catch (e) {
      console.log('Saving RWCDS Form failed.');
      console.log(e);
    }
  }

  async saveDirtyAffectedZoningResolutions() {
    return Promise.all(
      this.affectedZoningResolutions
        .filter((zoningResolution) => zoningResolution.hasDirtyAttributes)
        .map((zoningResolution) => zoningResolution.save()),
    );
  }

  get isAffectedZoningResolutionsDirty() {
    const dirtyZrs = this.affectedZoningResolutions.filter((zr) => zr.hasDirtyAttributes);

    return dirtyZrs.length > 0;
  }
}
