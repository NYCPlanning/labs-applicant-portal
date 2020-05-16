import Model, { belongsTo, hasMany, attr } from '@ember-data/model';

export default class PasFormModel extends Model {
  @belongsTo('package', { async: false })
  package;

  @hasMany({ async: false })
  applicants;

  @hasMany({ async: false })
  bbls;


  @attr('string') dcpApplicantnamecompanyorganization;

  @attr('boolean') dcpIsexistingrestrictionsondevsiteapplicable;

  @attr('number') dcpDevelopmentlot;

  @attr('number') dcpProposedstorieshighestbuilding;

  @attr('string') dcpCoapplicantphone1;

  @attr('number') dcpProjectarewetland;

  @attr('boolean') dcpCannotdetermineatthistimerestriction;

  @attr('boolean') dcpProjectareaothertransport;

  @attr('string') dcpZoningspecialpermitpursuantto;

  @attr('string') dcpCoapplicantzip1;

  @attr('string') dcpProjectdescriptionsurroundingarea;

  @attr('number') dcpProposedtotalunenclosedparkingspaces;

  @attr('boolean') dcpProposeddevelopmentsiteinfoaddition;

  @attr('string') dcpCommunityusegroup;

  @attr('string') dcpStatementofintentrepresentativename;

  @attr('number') dcpProcommercialunenclosedparkingspaces;

  @attr('number') dcpProjectblock;

  @attr({
    defaultValue(pasForm) {
      return pasForm.package.project.dcpProjectname;
    },
  })
  dcpRevisedprojectname;

  @attr('boolean') dcpExistingbuildingoccupied;

  @attr('number') dcpProptotalenparkspaces;

  @attr('number') dcpProindustrialnumberofdwellingunits;

  @attr('boolean') dcpExistingdrycleaner;

  @attr('string') dcpApplicantsprimaryrepresentative;

  @attr('date') dcpDateofinformationalmeeting;

  @attr('number') dcpProresidentialunenclosedparkingspaces;

  @attr('string') dcpCoapplicantcity2;

  @attr('boolean') dcpProposeddevelopmentsiteinfoalteration;

  @attr('string') dcpDevelopmentsitegeographicboundingstreets;

  @attr('number') dcpPropcommzoningsqft;

  @attr('string') dcpRepresentativeaddress2;

  @attr('boolean') dcpProposeddevelopmentsiteenlargement;

  @attr('string') dcpZoningresolutiontitle;

  @attr('boolean') dcpProjectareausarmycorps;

  @attr('string') dcpRepresentativeemail2;

  @attr('date') dcpStatementofintentrepresentativesignat;

  @attr('number') dcpProposedprojectlanduse;

  @attr('number') dcpPropcommgrosssqft;

  @attr('number') dcpPindnoofparkspacesenclosed;

  @attr('number') dcpPcommunoofparkspacesunenclosed;

  @attr('string') dcpCoapplicantzip2;

  @attr('number') dcpProposedlowestbuildingheight;

  @attr('string') dcpDevelopmentsitegeographicaddresses;

  @attr('boolean') dcpContributingstructure;

  @attr('string') dcpResidentialusegrouptype;

  @attr('boolean') dcpIsprojectarealandmark;

  @attr('string') dcpRepresentativefax1;

  @attr('number') dcpTotaldwellingunits;

  @attr('boolean') dcpProjectareaistrainrailroadlocated;

  @attr('number') dcpGreaterthan200000commercialspace;

  @attr('number') dcpRepresentative2role;

  @attr('boolean') dcpExistinghistoricdistrict;

  @attr('number') dcpProptotalnoofdwellingunits;

  @attr('number') dcpCommunitydwellingunits;

  @attr('string') dcpCoapplicantphone2;

  @attr('string') dcpPleaseexplain400perimeter;

  @attr('number') dcpResidentialdwellingunits;

  @attr('number') dcpPfzoningmapamendment;

  @attr('string') dcpApplicantcontactperson;

  @attr('number') dcpRepresentative1role;

  @attr('boolean') dcpProjectareasubway;

  @attr('boolean') dcpExistingsitelandmarknotapplicable;

  @attr('boolean') dcpZoningspcialpermit;

  @attr('number') dcpPfrenewal;

  @attr('string') dcpProresidentialusegroup;

  @attr('string') dcpCoapplicantnamecompanyorganization;

  @attr('string') dcpPropertyinterestexplanation;

  @attr('string') dcpRepresentativeaddress1;

  @attr('string') dcpExistingmapamend;

  @attr('boolean') dcpExistingstoragetanks;

  @attr('string') dcpUrbanareaname;

  @attr('number') dcpLegalstreetfrontage;

  @attr('string') dcpApplicantsrepresentative3;

  @attr('boolean') dcpProposeddevelopmentsitenewconstruction;

  @attr('string') dcpApplicanttelephone;

  @attr('number') dcpPropindzoningsqft;

  @attr('string') dcpProjectdescriptionproposeddevelopment;

  @attr('string') dcpRepresentativephone3;

  @attr('number') dcpPindnoofparkspacesunenclosed;

  @attr('number') dcpIndustrialzoningsqft;

  @attr('number') dcpProindustrialgrosssqft;

  @attr('string') dcpRepresentativecity3;

  @attr('string') dcpProjectdescriptionproposedarea;

  @attr('number') dcpPfchangeincitymap;

  @attr('boolean') dcpProjectareamanufacturingplant;

  @attr('number') dcpApplicantspropertyinterest;

  @attr('string') dcpProcommunityfacilityusegroup;

  @attr('date') dcpStatementofintentapplicantsignaturedate;

  @attr('boolean') dcpSitepublicfacility;

  @attr('boolean') dcpProjectattachmentsphotographs;

  @attr('string') dcpZoningsectionnumber;

  @attr('string') dcpIndustrialusegrouptype;

  @attr('number') dcpPfacquisitionofrealproperty;

  @attr('boolean') dcpProjectareacoastalzonelocatedin;

  @attr('number') dcpProjectareaischancefloodplain;

  @attr('number') dcpGrandtotalgrosssqft;

  @attr('number') dcpProcommercialzoningsqft;

  @attr('number') dcpPrototalenclosedparkingspaces;

  @attr('string') dcpGreaterhan200residentialunitsexplanation;

  @attr('boolean') dcpRevocableconsent;

  @attr('number') dcpProjectidnumberprojectdescription;

  @attr('number') dcpDiscressionaryfundingforffordablehousing;

  @attr('number') dcpPropresizoningsqft;

  @attr('string') dcpCoapplicantemail2;

  @attr('string') dcpCommercialusegroup;

  @attr('number') dcpCommunityparkingspacesunenclosed;

  @attr('boolean') dcpExistingsitevacantlot;

  @attr('string') dcpName;

  @attr('number') dcpTotalunenclosedparkingspcaces;

  @attr('number') dcpProjectareajamaicabaywatershed;

  @attr('boolean') dcpProjectareaworship;

  @attr('string') dcpProvidedetailshazmat;

  @attr('string') dcpDescriptionofprojectareageography;

  @attr('string') dcpPf1area;

  @attr('boolean') dcpProjectareapowerplant;

  @attr('boolean') dcpExistinglandmarkstate;

  @attr('string') dcpProindustrialusegroup;

  @attr('number') dcpCommericalparkingspacesunenclosed;

  @attr('string') dcpPfarea;

  @attr('string') dcpProjectareaboundingstreets;

  @attr('string') dcpRepresentativefax3;

  @attr('date') dcpGrandtotalzoningsqftDate;

  @attr('boolean') dcpStatehistoricdistrict;

  @attr('string') dcpProspectivecoapplicantname1;

  @attr('string') dcpPropcommusegroup;

  @attr('boolean') dcpProjectareadrycleaning;

  @attr('number') dcpGrandtotalzoningsqft;

  @attr('string') dcpProjectareahighwayname;

  @attr('boolean') dcpExistinglandmarkfederal;

  @attr('number') dcpProptotalunenparkspaces;

  @attr('number') dcpIndustrialparkingspacesunenclosed;

  @attr('string') dcpZoningtomodify;

  @attr('string') dcpProjectdescriptionproposedactions;

  @attr('string') dcpApplicantsrepresentative2;

  @attr('boolean') dcpProjectattachmentselevations;

  @attr('boolean') dcpExistingsitelandmarkcity;

  @attr('number') dcpProjectarearevitalizationprogram;

  @attr('number') dcpVersion;

  @attr('string') dcpProjectdescriptionbackground;

  @attr('number') dcpProptotalgrosssqft;

  @attr('number') dcpCommunityzoningsqft;

  @attr('string') dcpPasprojectname;

  @attr('string') dcpPropresiusegrouptype;

  @attr('number') dcpProresidentialzoningsqft;

  @attr('number') dcpProjectlot;

  @attr('number') dcpProresidentialenclosedparkingspaces;

  @attr('number') dcpPropresinoofdwellingunits;

  @attr('string') dcpApplicantotherinterest;

  @attr('string') dcpSitelotarea;

  @attr('string') dcpExplainotherexistingrestrictions;

  @attr('number') dcpProjectareasize;

  @attr('boolean') dcpHazmatonsitenotapplicable;

  @attr('number') dcpRestrictivedeclarationrequired;

  @attr('number') dcpMultiplezoninglots;

  @attr('string') dcpBoundingstreets;

  @attr('string') dcpRepresentativeemail3;

  @attr('boolean') dcpHousingplanproject;

  @attr('string') dcpApplicantfax;

  @attr('number') dcpPrototalnumberofdwellingunits;

  @attr('number') dcpParkingpermitrequired;

  @attr('boolean') dcpUdaap;

  @attr('string') dcpProjectarealandmarkname;

  @attr('number') dcpProcommercialgrosssqft;

  @attr('string') dcpCoapplicantemail1;

  @attr('number') dcpPflandfill;

  @attr('number') dcpPfrevocableconsent;

  @attr('boolean') dcpInformationalmeetingheld;

  @attr('string') dcpBlocksandlots;

  @attr('string') dcpCoapplicantcontactperson1;

  @attr('string') dcpPleaseexplaintypeiienvreview;

  @attr('boolean') dcpOtherexistingconditions;

  @attr('string') dcpRepresentativestate1;

  @attr('string') dcpRepresentativephone2;

  @attr('number') dcpPfmodification;

  @attr('number') dcpGrounddistubance;

  @attr('string') dcpPreviousulurpnumbers2;

  @attr('number') dcpProposedfar;

  @attr('boolean') dcpProposeddevelopmentsiteother;

  @attr('string') dcpProposeddevelopmentsiteotherexplanation;

  @attr('string') dcpCoapplicantfax2;

  @attr('string') dcpDevelopmentaddress;

  @attr('boolean') dcpChangecitymap;

  @attr('number') dcpProcommunityenclosedparkingspaces;

  @attr('number') dcpIndustrialdwellingunits;

  @attr('boolean') dcpZoningauthorization;

  @attr('string') dcpRepresentativezip1;

  @attr('boolean') dcpAcquisitionrealproperty;

  @attr('string') dcpExistingspecialzoning;

  @attr('boolean') dcpProjectareaenvironmentalconservation;

  @attr('number') dcpGreaterhan200residentialunits;

  @attr('boolean') dcpProjectattachmentsavgpercentofslope;

  @attr('string') dcpExplainotherexistingconditions;

  @attr('string') dcpAffectedzrnumber;

  @attr('number') dcpPfzoningtextamendment;

  @attr('boolean') dcpDispositionrealproperty;

  @attr('string') dcpProjectaddress;

  @attr('number') dcpProposednumberofcurbits;

  @attr('number') dcpDevelopmentblock;

  @attr('number') dcpNumberbldgs;

  @attr('string') dcpCommunityusegrouptype;

  @attr('boolean') dcpProjectareaschool;

  @attr('string') dcpRepresentativezip3;

  @attr('number') dcpLowestbldgheight;

  @attr('number') dcpStorieslowestbldg;

  @attr('number') dcpPfura;

  @attr('string') dcpGrounddistubanceexplanation;

  @attr('number') dcpPresinoofparkspacesunenclosed;

  @attr('string') dcpPropindusegroup;

  @attr('number') dcpGrandtotalzoningsqftState;

  @attr('string') dcpProjectareasubwaytrainname;

  @attr('boolean') dcpProjectattachmentsmassing;

  @attr('string') dcpExistingzoningdistricts;

  @attr('number') dcpCommericalparkingspacesenclosed;

  @attr('string') dcpProindustrialusegrouptype;

  @attr('boolean') dcpOtherrestrictions;

  @attr('string') dcpRepresentativefax2;

  @attr('boolean') dcpLandfill;

  @attr('string') dcpStatementofintentapplicantname;

  @attr('number') dcpPropcommuzoningsqft;

  @attr('boolean') dcpWaterfrontzrlocation;

  @attr('boolean') dcpModification;

  @attr('string') dcpCoapplicantstate2;

  @attr('string') dcpZoningauthorizationtomodify;

  @attr('number') dcpRepresentative3role;

  @attr('number') dcpTotalgrosssqft;

  @attr('number') dcpResidentialzoniingsqft;

  @attr('number') dcpPffranchise;

  @attr('number') dcpPfzoningcertification;

  @attr('string') dcpPropcommusegrouptype;

  @attr('string') dcpStatementofintentrepresentativesignature;

  @attr('number') dcpProjectborogh;

  @attr('number') dcpProcommercialenclosedparkingspaces;

  @attr('string') dcpProcommerciausegrouptype;

  @attr('string') dcpCoapplicantaddress1;

  @attr('string') dcpCitycouncildistricts;

  @attr('number') dcpResidentialparkingspacesenclosed;

  @attr('string') dcpCoapplicantstate1;

  @attr('boolean') dcpIndustrialmanufacturinguse;

  @attr('number') dcpPropindgrosssqft;

  @attr('number') dcpBorough;

  @attr('string') dcpCoapplicantaddress2;

  @attr('number') dcpProposedhighestbuildingheight;

  @attr('boolean') dcpDesignaton;

  @attr('date') dcpEstimatedcompletiondate;

  @attr('date') dcpGrandtotalnumberofdwellingunitsDate;

  @attr('number') dcpPromanufacturingzoningsqft;

  @attr('string') dcpProcommunityusegrouptype;

  @attr('string') dcpProspectiveapplicantname;

  @attr('boolean') dcpProjectattachmentssiteplan;

  @attr('string') dcpRepresentativecity2;

  @attr('boolean') dcpProjectareaemissionsources;

  @attr('boolean') dcpZoningcertification;

  @attr('number') dcpGrandtotalnumberofdwellingunits;

  @attr('boolean') dcpProjectareaautobody;

  @attr('string') dcpProcommercialusegroup;

  @attr('string') dcpIndustrialusegroup;

  @attr('string') dcpApplicantstate;

  @attr('string') dcpProspectiveapplicantcontactperson;

  @attr('number') dcpResidentialgrosssqft;

  @attr('boolean') dcpZoningmapamend;

  @attr('boolean') dcpProjectareaconcreteplant;

  @attr('string') dcpProjectareatrainname;

  @attr('string') dcpProjectattachmentsotherinformation;

  @attr('string') dcpDevelopmentsitegeographicblocksandlots;

  @attr('number') dcpProresidentialnumberofdwellingunits;

  @attr('string') dcpPleaseexplain;

  @attr('boolean') dcpRegisterhistoricdistrict;

  @attr('number') dcpNoofstorieslowestblog;

  @attr('string') dcpRepresentativecity1;

  @attr('number') dcpPropcommugrosssqft;

  @attr('boolean') dcpDeclaration;

  @attr('number') dcpProindustrialenclosedparkingspaces;

  @attr('string') dcpRepresentativestate3;

  @attr('string') dcpZoningpursuantto;

  @attr('string') dcpZoningspecialpermittomodify;

  @attr('string') dcpCommercialusegrouptype;

  @attr('number') dcpHousingunittype;

  @attr('string') dcpApplicantddress;

  @attr('boolean') dcpProjectareaisairportlocated;

  @attr('string') dcpPfpropertyinterest;

  @attr('number') dcpProposednumberofbuildings;

  @attr('string') dcpRepresentativephone1;

  @attr('string') dcpCommunitydistricts;

  @attr('number') dcpProjectarea;

  @attr('string') dcpCoapplicantcity1;

  @attr('boolean') dcpFranchise;

  @attr('number') dcpCommercialzoningsqft;

  @attr('boolean') dcpProjectareabus;

  @attr('number') dcpPfhousingplanandproject;

  @attr('number') dcpPcommunoofparkspacesenclosed;

  @attr('string') dcpApplicantcity;

  @attr('number') dcpPcommnoofparkspacesenclosed;

  @attr('string') dcpZoningmapnumbers;

  @attr('string') dcpCityregisterfilenumber;

  @attr('string') dcpCoapplicantfax1;

  @attr('string') dcpGreaterthan200000commercialspaceexplanation;

  @attr('string') dcpProvidedetailsrestsite;

  @attr('string') dcpProjectareaairportname;

  @attr('number') dcpCommunitiygrosssqft;

  @attr('number') dcpProindustrialunenclosedparkingspaces;

  @attr('string') dcpInclusionaryhousingdesignatedareaname;

  @attr('number') dcpGrandtotalnumberofdwellingunitsState;

  @attr('boolean') dcpProjectattachmentssections;

  @attr('number') dcpGrandtotalgrosssqftState;

  @attr('boolean') dcpProposeddevelopmentsitechnageofuse;

  @attr('date') dcpGrandtotalgrosssqftDate;

  @attr('string') dcpAddresses;

  @attr('string') dcpPreviousulurpnumber;

  @attr('string') dcpResidentialusegroup;

  @attr('string') dcpPropindusegrouptype;

  @attr('boolean') dcpIscontactednycdeptofenvorusarmycorpsofeng;

  @attr('string') dcpBuiltfar;

  @attr('boolean') dcpRestrictivedeclaration;

  @attr('number') dcpHighestbldgheight;

  @attr('string') dcpRepresentativestate2;

  @attr('number') dcpPropresigrosssqft;

  @attr('number') dcpPcommnoofparkspacesunenclosed;

  @attr('boolean') dcpExistinggasstationorautoservice;

  @attr('string') dcpRepresentativezip2;

  @attr('string') dcpRepresentativeemail1;

  @attr('number') dcpCommercialgrosssqft;

  @attr('string') dcpPreviousulurpnumbers1;

  @attr('number') dcpPfsiteselectionpublicfacility;

  @attr('number') dcpNoofstorieshighestblog;

  @attr('number') dcpNumbercurbcuts;

  @attr('number') dcpIndustrialparkingspacesenclosed;

  @attr('boolean') dcpNoticeofcertifications;

  @attr('boolean') dcpProjectattachmentssitesurvey;

  @attr('number') dcpPfdispositionofrealproperty;

  @attr('number') dcpProposedstorieslowestbuilding;

  @attr('string') dcpProjectareaunderservedname;

  @attr('number') dcpCommunityparkingspacesenclosed;

  @attr('string') dcpPropresiusegroup;

  @attr('number') dcpPfzoningspecialpermit;

  @attr('number') dcpProresidentialgrosssqft;

  @attr('number') dcpGroundtotalproposeddevsiteprojdata;

  @attr('string') dcpApplicantzip;

  @attr('string') dcpParkspopsname;

  @attr('string') dcpPropcommuusegroup;

  @attr('boolean') dcpProposeddevelopmentsitedemolition;

  @attr('string') dcpProposedmapamend;

  @attr('string') dcpProjectareaindutrialzonename;

  @attr('boolean') dcpProjectareacommerciallaundry;

  @attr('string') dcpZoningauthorizationpursuantto;

  @attr('boolean') dcpProposeddevelopmentsiteinfoother;

  @attr('number') dcpTotalenclosedparkingspaces;

  @attr('number') dcpProjectareadevelopmentsite;

  @attr('number') dcpUrbanrenewalarea;

  @attr('string') dcpRepresentativecompany2;

  @attr('number') dcpProptotalzoningsqft;

  @attr('number') dcpResidentialparkingspacesunenclosed;

  @attr('number') dcpLanduseactiontype2;

  @attr('number') dcpProposedprojectorportionconstruction;

  @attr('number') dcpProcommunityfacilitygrosssqft;

  @attr('boolean') dcpProjectareamedicallab;

  @attr('boolean') dcpUra;

  @attr('boolean') dcpRenewal;

  @attr('string') dcpPropcommuusegrouptype;

  @attr('boolean') dcpConcession;

  @attr('number') dcpIndustrialgrosssqft;

  @attr('boolean') dcpProjectareahospital;

  @attr('number') dcpProposedprojectorportionconstructionpermi;

  @attr('number') dcpPfconcession;

  @attr('boolean') dcpNoticeofrestriction;

  @attr('number') dcpProcommunityfacilityzoningsqft;

  @attr('boolean') dcpProjectareaishighwaylocated;

  @attr('string') dcpProspectivecoapplicantname2;

  @attr('number') dcpPfudaap;

  @attr('number') dcpCommercialdwellingunits;

  @attr('string') dcpProresidentialusegrouptype;

  @attr('number') dcpPrototalzoningsqft;

  @attr('string') dcpEmailaddress;

  @attr('number') dcpPresinoofparkspacesenclosed;

  @attr('boolean') dcpZoningtextamend;

  @attr('boolean') dcpProjectareaindustrialbusinesszone;

  @attr('boolean') dcpProjectareaisabovesubway;

  @attr('boolean') dcpIsprojectareaunderserved;

  @attr('number') dcpProposedtotalgrosssqft;

  @attr('string') dcpStatementofintentapplicantsignature;

  @attr('boolean') dcpIsinclusionaryhousingdesignatedarea;

  @attr('boolean') dcpProjectattachmentszoingtreecalculations;

  @attr('number') dcpProcompletiondateyear;

  @attr('number') dcpProcommunityunenclosedparkingspaces;

  @attr('boolean') dcpProjectareaparkpops;

  @attr('string') dcpCoapplicantcontactperson2;

  @attr('string') dcpRepresentativecompany1;

  @attr('number') dcpTotalzoningsqft;

  @attr('number') dcpPfzoningauthorization;

  @attr('string') dcpRepresentativecompany3;

  @attr('string') dcpRepresentativeaddress3;

  temporaryAddressLabel = '';

  async save() {
    await this.saveDirtyApplicants();
    await this.saveDirtyBbls();
    await super.save();
  }

  async saveDirtyBbls() {
    return Promise.all(
      this.bbls
        .filter((bbl) => bbl.hasDirtyAttributes)
        .map((bbl) => bbl.save()),
    );
  }

  async saveDirtyApplicants() {
    return Promise.all(
      this.applicants
        .filter((applicant) => applicant.hasDirtyAttributes)
        .map((applicant) => applicant.save()),
    );
  }

  get isBblsDirty() {
    const dirtyBbls = this.bbls.filter((bbl) => bbl.hasDirtyAttributes);

    return dirtyBbls.length > 0;
  }

  get isApplicantsDirty() {
    const dirtyApplicants = this.applicants.filter((applicant) => applicant.hasDirtyAttributes);

    return dirtyApplicants.length > 0;
  }
}
