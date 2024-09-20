import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class ProjectsModel extends Model {
  // The human-readable, descriptive name.
  // e.g. "Marcus Garvey Blvd Project"
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
  @attr("number") dcpNonresatleast50000;

  @attr("number") dcpNewresibuildmore50000sf;

  @attr("number") dcpIncreasepermitresatleast50000sf;

  @attr("number") dcpIncreasepermitnonresiatleast200000sf;

  @attr("number") dcpDecpermresiatleastfourcontigcb;

  @attr("number") dcpDecnumofhousunitsatleastfourcontigcb;

  @attr("number") dcpContatleast100000sfzonfla;

  @attr("number") dcpImapplyazoningtmaffectsmore5rcd;

  @attr("number") dcpAffectfourmorecb;

  // RWCDS project attrs
  @attr("number")
  dcpNumberofnewdwellingunits;

  @attr("number")
  dcpIncrementhousingunits;

  @attr("number")
  dcpActionaffordabledwellingunits;

  @attr("number")
  dcpIncrementalaffordabledwellingunits;

  @attr("number")
  dcpResidentialsqft;

  @attr("number")
  dcpNewcommercialsqft;

  @attr("number")
  dcpNewindustrialsqft;

  @attr("number")
  dcpNewcommunityfacilitysqft;

  // We assume there's only one. If there's >1 in crm, the backend
  // should return the first one.
  @belongsTo("artifact", { async: false })
  artifact;

  @hasMany("package", { async: false })
  packages;

  @hasMany("project-applicant", { async: false })
  projectApplicants;

  @hasMany("team-member", { async: false })
  teamMembers;
}
