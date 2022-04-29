export const YES_NO = {
  YES: {
    code: true,
    label: 'Yes',
  },
  NO: {
    code: false,
    label: 'No',
  },
};

// Ideally we can remove this
// After CRM is updated so all YES/NO
// optionsets use True/False values
export const YES_NO_INTEGER = {
  YES: {
    code: 1,
    label: 'Yes',
  },
  NO: {
    code: 0,
    label: 'No',
  },
};

export const YES_NO_PICKLIST_CODE = {
  YES: {
    code: 717170000,
    label: 'Yes',
  },
  NO: {
    code: 717170001,
    label: 'No',
  },
};

export const YES_NO_UNSURE = {
  YES: {
    code: 717170000,
    label: 'Yes',
  },
  NO: {
    code: 717170001,
    label: 'No',
  },
  UNSURE: {
    code: 717170002,
    label: 'Unsure at this time',
  },
};

export const YES_NO_UNSURE_SMALLINT = {
  YES: {
    code: 1,
    label: 'Yes',
  },
  NO: {
    code: 2,
    label: 'No',
  },
  UNSURE: {
    code: null,
    label: 'Unsure at this time',
  },
};

export const YES_NO_DONT_KNOW = {
  YES: {
    code: 717170000,
    label: 'Yes',
  },
  NO: {
    code: 717170001,
    label: 'No',
  },
  DONT_KNOW: {
    code: 717170002,
    label: 'Don\u2019t Know',
  },
};

const COMMON_OPTIONSETS = {
  YES_NO,
  YES_NO_UNSURE,
  YES_NO_PICKLIST_CODE,
  YES_NO_DONT_KNOW,
  YES_NO_INTEGER,
};

export default COMMON_OPTIONSETS;
