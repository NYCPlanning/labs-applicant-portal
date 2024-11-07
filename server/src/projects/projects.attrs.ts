export const PROJECT_ATTRS = [
  'dcp_projectname',
  'dcp_name',
  'dcp_borough',
  'statecode',
  'statuscode',
  'dcp_visibility',
  'dcp_publicstatus',
  'dcp_projectbrief',
  'dcp_applicanttype',
  '_dcp_applicant_customer_value',
  '_dcp_applicantadministrator_customer_value',
  'dcp_dcp_project_dcp_projectapplicant_Project',

  'dcp_nonresatleast50000',
  'dcp_newresibuildmore50000sf',
  'dcp_increasepermitresatleast50000sf',
  'dcp_increasepermitnonresiatleast200000sf',
  'dcp_decpermresiatleastfourcontigcb',
  'dcp_decnumofhousunitsatleastfourcontigcb',
  'dcp_contatleast100000sfzonfla',
  'dcp_imapplyazoningtmaffectsmore5rcd',
  'dcp_affectfourmorecb',

  'dcp_numberofnewdwellingunits',
  'dcp_incrementhousingunits',
  'dcp_actionaffordabledwellingunits',
  'dcp_incrementalaffordabledwellingunits',
  'dcp_residentialsqft',
  'dcp_newcommercialsqft',
  'dcp_newindustrialsqft',
  'dcp_newcommunityfacilitysqft',
];

export const MILESTONE_DATE_ATTRS = [
  'dcp_actualstartdate',
  'dcp_actualenddate',
  'dcp_plannedcompletiondate',
  'dcp_plannedstartdate',
];

export const MILESTONE_NON_DATE_ATTRS = ['statuscode', '_dcp_milestone_value'];

export const MILESTONE_ATTRS = [
  ...MILESTONE_DATE_ATTRS,
  ...MILESTONE_NON_DATE_ATTRS,
];
