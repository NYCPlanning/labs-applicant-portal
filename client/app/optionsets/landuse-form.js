import COMMON_OPTIONSETS from './common';

export const CEQR_TYPE = {
  TYPE_I: {
    code: 717170000,
    label: 'Type I',
  },
  TYPE_II: {
    code: 717170001,
    label: 'Type II',
  },
  UNLISTED: {
    code: 717170002,
    label: 'Unlisted',
  },
};

export const DCPDEVSIZE = {
  HALF_TO_LT_ONE_MIL: {
    code: 717170000,
    label: '500,000 to 999,999 zoning sq ft',
  },
  ONE_TO_LT_TWENTYFIVE_MIL: {
    code: 717170001,
    label: '1,000,000 - 2,499,999 zoning sq ft',
  },
  GTE_TWENTYFIVE_MIL: {
    code: 717170002,
    label: 'At least 2,500,000 zoning sq ft',
  },
};

export const DCPMANNEROFDISPOSITION = {
  GENERAL: {
    code: 717170000,
    label: 'General',
  },
  DIRECT: {
    code: 717170001,
    label: 'Direct',
  },
};

const DCPRESTRICTANDCONDITION = {
  NONE: {
    code: 717170000,
    label: 'None (Pursuant to Zoning)',
  },
  RESTRICTED: {
    code: 717170001,
    label: 'Restricted',
  },
};

export const DCPDESIGNATION = {
  YES: {
    code: COMMON_OPTIONSETS.YES_NO.YES.code,
    label: 'Yes (HA, HN, HG, possibly HU)',
  },
  NO: {
    code: COMMON_OPTIONSETS.YES_NO.NO.code,
    label: 'No (HC, HD, HO, HP, possibly HU)',
  },
};

export const DCPPROJECTHOUSINGPLANUDAAP = {
  YES: {
    code: COMMON_OPTIONSETS.YES_NO.YES.code,
    label: 'Yes (HA, HN, HG)',
  },
  NO: {
    code: COMMON_OPTIONSETS.YES_NO.NO.code,
    label: 'No (HC, HD, HO, HP, HU)',
  },
};

export const DCPDISPOSITION = {
  YES: {
    code: COMMON_OPTIONSETS.YES_NO.YES.code,
    label: 'Yes (HA, HD)',
  },
  NO: {
    code: COMMON_OPTIONSETS.YES_NO.NO.code,
    label: 'No (HC, HD, HG, HN, HO, HP, HU)',
  },
};

export const DCPINDICATETYPEOFFACILITY = {
  LOCAL_NEIGHBORHOOD: {
    code: 804810000,
    label: 'Local/Neighborhood',
  },
  REGIONAL_CITYWIDE: {
    code: 717170001,
    label: 'Regional/Citywide',
  },
};

export const DCPLEGALINSTRUMENT = {
  YES: {
    code: 717170000,
    label: 'Yes',
  },
  NO: {
    code: 717170001,
    label: 'No',
  },
};

export const DCPONLYCHANGETHEELIMINATIONOFAMAPPEDBUTUNIMP = {
  YES: {
    code: 717170000,
    label: 'Yes',
  },
  NO: {
    code: 717170001,
    label: 'No',
  },
};

export const DCPISITBEINGELIMINATEDFROMTHEPROPERTYOF = {
  YES: {
    code: 717170000,
    label: 'Yes',
  },
  NO: {
    code: 717170001,
    label: 'No',
  },
};

export const DCPTYPEDISPOSITION = {
  GENERAL: {
    code: 717170000,
    label: 'General',
  },
  DIRECT: {
    code: 717170001,
    label: 'Direct',
  },
};

export const DCPTOTALZONINGAREATOBEREZONED = {
  LT_10K: {
    code: 717170000,
    label: 'Less than 10,000 square feet',
  },
  LT_20K: {
    code: 717170001,
    label: '10,000 to 19,999 square feet',
  },
  LT_40K: {
    code: 717170002,
    label: '20,000 to 39,999 square feet',
  },
  LT_70K: {
    code: 717170003,
    label: '40,000 to 69,999 square feet',
  },
  LT_100K: {
    code: 717170004,
    label: '70,000 to 99,999 square feet',
  },
  LT_240K: {
    code: 717170005,
    label: '100,000 to 239,999 square feet',
  },
  LTE_500K: {
    code: 717170006,
    label: '240,000 to 500,000 square feet',
  },
  GT_500K: {
    code: 717170007,
    label: 'Greater than 500,000 square feet',
  },
};

const LANDUSE_FORM_OPTIONSETS = {
  CEQR_TYPE,
  DCPDEVSIZE,
  DCPMANNEROFDISPOSITION,
  DCPRESTRICTANDCONDITION,
  DCPDESIGNATION,
  DCPPROJECTHOUSINGPLANUDAAP,
  DCPDISPOSITION,
  DCPINDICATETYPEOFFACILITY,
  DCPLEGALINSTRUMENT,
  DCPONLYCHANGETHEELIMINATIONOFAMAPPEDBUTUNIMP,
  DCPISITBEINGELIMINATEDFROMTHEPROPERTYOF,
  DCPTYPEDISPOSITION,
  DCPTOTALZONINGAREATOBEREZONED,
};

export default LANDUSE_FORM_OPTIONSETS;
