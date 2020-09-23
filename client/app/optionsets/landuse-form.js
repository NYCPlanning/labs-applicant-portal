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

const LANDUSE_FORM_OPTIONSETS = {
  CEQR_TYPE,
  DCPDEVSIZE,
  DCPMANNEROFDISPOSITION,
  DCPRESTRICTANDCONDITION,
  DCPDESIGNATION,
  DCPPROJECTHOUSINGPLANUDAAP,
  DCPDISPOSITION,
  DCPINDICATETYPEOFFACILITY,
};

export default LANDUSE_FORM_OPTIONSETS;
