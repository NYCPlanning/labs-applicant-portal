export const DCPPUBLICSTATUS = {
  NOTICED: {
    code: 717170005,
    label: 'Noticed',
  },
  FILED: {
    code: 717170000,
    label: 'Filed',
  },
  IN_PUBLIC_REVIEW: {
    code: 717170001,
    label: 'In Public Review',
  },
  COMPLETED: {
    code: 717170002,
    label: 'Completed',
  },
};

export const DCPVISIBILITY = {
  APPLICANT_ONLY: {
    code: 717170002,
    label: 'Applicant Only',
  },
  CPC_ONLY: {
    code: 717170001,
    label: 'CPC Only',
  },
  GENERAL_PUBLIC: {
    code: 717170003,
    label: 'General Public',
  },
  INTERNAL_DCP_ONLY: {
    code: 717170000,
    label: 'Internal DCP Only',
  },
  LUP: {
    code: 717170004,
    label: 'LUP',
  },
};

export const STATUSCODE = {
  ACTIVE: {
    code: 1,
    label: 'Active',
  },
  ON_HOLD: {
    code: 717170000,
    label: 'On-Hold',
  },
  RECORD_CLOSED: {
    code: 707070003,
    label: 'Record Closed',
  },
  COMPLETE: {
    code: 707070000,
    label: 'Complete',
  },
  TERMINATED: {
    code: 707070002,
    label: 'Terminated',
  },
  WITHDRAWN_APPLICANT_UNRESPONSIVE: {
    code: 707070001,
    label: 'Withdrawn-Applicant Unresponsive',
  },
  WITHDRAWN_OTHER: {
    code: 717170001,
    label: 'Withdrawn-Other',
  },
};

const PROJECT_OPTIONSETS = {
  DCPPUBLICSTATUS,
  DCPVISIBILITY,
  STATUSCODE,
};

export default PROJECT_OPTIONSETS;
