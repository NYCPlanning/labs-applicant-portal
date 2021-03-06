export const PROJECT_ATTRS = [
  'dcp_projectname',
  'dcp_name',
  'dcp_borough',
  'statecode',
  'statuscode',
  'dcp_visibility',
  'dcp_publicstatus',
  'dcp_projectbrief',
  '_dcp_applicant_customer_value',
  'dcp_dcp_project_dcp_projectapplicant_Project',
];

export const MILESTONE_DATE_ATTRS = [
  'dcp_actualstartdate',
  'dcp_actualenddate',
  'dcp_plannedcompletiondate',
  'dcp_plannedstartdate',
];

export const MILESTONE_NON_DATE_ATTRS = [
 'statuscode',
 '_dcp_milestone_value',
]

export const MILESTONE_ATTRS = [
   ...MILESTONE_DATE_ATTRS,
   ...MILESTONE_NON_DATE_ATTRS,
];
