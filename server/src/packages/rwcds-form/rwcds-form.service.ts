import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { PasFormService } from '../pas-form/pas-form.service';
import { pick } from 'underscore';
import { RWCDS_FORM_ATTRS } from './rwcds-form.attrs';
import { PACKAGE_ATTRS } from '../packages.attrs';

const ZONING_RESOLUTION_TYPES = [
  { label: 'ZA', code: 717170000 },
  { label: 'ZC', code: 717170001 },
  { label: 'ZS', code: 717170002 },
  { label: 'ZR', code: 717170003 },
  { label: 'ZM', code: 717170008 },
  { label: 'SD', code: 717170009 },
  { label: 'SC', code: 717170010 },
  { label: 'SA', code: 717170011 },
  { label: 'RS', code: 717170012 },
  { label: 'RC', code: 717170013 },
  { label: 'RA', code: 717170014 },
  { label: 'PS', code: 717170015 },
  { label: 'PQ', code: 717170016 },
  { label: 'PP', code: 717170017 },
  { label: 'PE', code: 717170018 },
  { label: 'PC', code: 717170019 },
  { label: 'NP', code: 717170020 },
  { label: 'MY', code: 717170021 },
  { label: 'MM', code: 717170022 },
  { label: 'ML', code: 717170023 },
  { label: 'ME', code: 717170024 },
  { label: 'MC', code: 717170025 },
  { label: 'LD', code: 717170026 },
  { label: 'HU', code: 717170027 },
  { label: 'HP', code: 717170028 },
  { label: 'HO', code: 717170029 },
  { label: 'HN', code: 717170030 },
  { label: 'HG', code: 717170031 },
  { label: 'HD', code: 717170032 },
  { label: 'HC', code: 717170033 },
  { label: 'HA', code: 717170034 },
  { label: 'GF', code: 717170035 },
  { label: 'CM', code: 717170036 },
  { label: 'BF', code: 717170037 },
  { label: 'BD', code: 717170038 },
];

export const INCLUDE_ZONING_TEXT_AMENDMENT_OPTIONSET = {
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

export const ACTION_VALUE_OPTIONSET = {
  ZR: {
    code: '886ede3a-dad0-e711-8125-1458d04e2f18',
    label: 'ZR',
  },
};

@Injectable()
export class RwcdsFormService {
  constructor(
    private readonly crmService: CrmService,
    private readonly pasFormService: PasFormService,
  ) {}

  async _getPackageProjectId(packageId): Promise<string> {
    const {
      records: [firstPackage],
    } = await this.crmService.get(
      'dcp_packages',
      `
      $select=_dcp_project_value
      &$filter=dcp_packageid eq ${packageId}
    `,
    );

    if (!firstPackage) {
      return undefined;
    }

    const { _dcp_project_value } = firstPackage;

    return _dcp_project_value;
  }

  async update(id, body) {
    const allowedAttrs = pick(body, RWCDS_FORM_ATTRS);
    const { package: packageId } = body;
    const projectId = await this._getPackageProjectId(packageId);

    if (!projectId) {
      return new HttpException(
        'Package not found for RWCDS Form',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.crmService.update('dcp_rwcdsforms', id, allowedAttrs);

    if (allowedAttrs.hasOwnProperty('dcp_buildyear')) {
      await this.crmService.update('dcp_projects', projectId, {
        dcp_anticipatedyearbuilt: allowedAttrs.dcp_buildyear,
      });
    }
  }

  async find(id) {
    try {
      // Because we post data from dcp_projectaction to dcp_affectedzoningresolution, we need
      // to GET the rwcdsForm twice. Once to pass the form into the syncActions method. And
      // a second time to include the updated dcp_affectedzoningresolution relationship.
      const {
        records: [rwcdsFormWithoutUpdatedZr],
      } = await this.crmService.get(
        `dcp_rwcdsforms`,
        `
        $filter=
          dcp_rwcdsformid eq ${id}
        &$expand=dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform
      `,
      );

      // run syncActions to synchronize dcp_projectaction and dcp_affectedzoningresolution entities
      await this.syncActions(rwcdsFormWithoutUpdatedZr);

      // version of rwcdsForm that guarantees we have updated dcp_affectedzoningresolution
      const {
        records: [rwcdsForm],
      } = await this.crmService.get(
        `dcp_rwcdsforms`,
        `
        $filter=
          dcp_rwcdsformid eq ${id}
        &$expand=dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform
      `,
      );

      const { _dcp_projectid_value } = rwcdsForm;

      // requires info from adjacent latest pasForm
      if (
        rwcdsForm.dcp_projectsitedescription === null ||
        rwcdsForm.dcp_proposedprojectdevelopmentdescription === null
      ) {
        const latestPasForm =
          await this.pasFormService.getLatestPasForm(_dcp_projectid_value);

        if (latestPasForm) {
          const {
            dcp_projectdescriptionproposedarea,
            dcp_projectdescriptionproposeddevelopment,
          } = latestPasForm;

          // It is possible that only one of dcp_projectsitedescription
          // or dcp_proposedprojectdevelopmentdescription is not yet
          // edited on the RWCDs form
          if (rwcdsForm.dcp_projectsitedescription === null) {
            rwcdsForm.dcp_projectsitedescription =
              dcp_projectdescriptionproposedarea;
          }

          if (rwcdsForm.dcp_proposedprojectdevelopmentdescription === null) {
            rwcdsForm.dcp_proposedprojectdevelopmentdescription =
              dcp_projectdescriptionproposeddevelopment;
          }
        }
      }
      return rwcdsForm;
    } catch (e) {
      console.log('error in finding RWCDS package in RWCDS service', e);
      throw e;
    }
  }

  // The syncActions method queries for project actions (dcp_projectaction) associated
  // with the rwcds form's related project.
  // Then, it posts each of the project actions to dcp_affectedzoningresolution.
  // This occurs every time that the rwcds-form endpoint is hit.

  // dcp_projectaction entity --> dcp_affectedzoningresolution entity attribute mapping:
  // `_dcp_action_value@OData.Community.Display.V1.FormattedValue`  --> `dcp_zoningresolutiontype`
  // `ZoningResolution.dcp_zoningresolution` --> `dcp_zrsectionnumeber`
  // `dcp_zrmodifyingzrtxt` --> `dcp_modifiedzrsectionnumber`
  async syncActions(rwcdsForm) {
    try {
      const {
        dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform:
          affectedZoningResolutions,
        _dcp_projectid_value,
        dcp_rwcdsformid,
      } = rwcdsForm;
      const zrTypes = affectedZoningResolutions.map(
        (zr) =>
          zr[
            'dcp_zoningresolutiontype@OData.Community.Display.V1.FormattedValue'
          ],
      );
      const { records: projectActions } = await this.crmService.get(
        `dcp_projectactions`,
        `
        $filter=_dcp_project_value eq ${_dcp_projectid_value}
        &$expand=dcp_ZoningResolution
      `,
      );
      await this.updateIncludeZoningTextAmendment(
        dcp_rwcdsformid,
        projectActions,
      );

      await Promise.all(
        projectActions.map((action) => {
          const projectActionLabel =
            action[
              '_dcp_action_value@OData.Community.Display.V1.FormattedValue'
            ];

          // Lookup: dcp_affectedzoningresolutions asks for a ZR type,
          const { label, code } = ZONING_RESOLUTION_TYPES.find(
            (zr) => zr.label === projectActionLabel,
          ) || { label: '', code: null };

          const matchingZr = affectedZoningResolutions.find(
            (zr) => zr.dcp_zoningresolutiontype === code,
          );

          // action attribute that matches dcp_zrsectionnumber on dcp_affectedzoningresolution
          const currentActionZoningResolution = action.dcp_ZoningResolution
            ? action.dcp_ZoningResolution.dcp_zoningresolution
            : null;

          if (!label)
            console.log(
              `Could not find Affected ZR Type for ${projectActionLabel}`,
            );

          // IF the action.ZoningResolution.dcp_zoningresolution value has changed since the initial POST,
          // then PATCH the new value to dcp_zrsectionnumber on dcp_affectedzoningresolution entity
          // NOTE: dcp_modifiedzrsectionnumber not included here because it's updated by applicant on rwcds-form
          if (
            matchingZr &&
            matchingZr.dcp_zrsectionnumber !== currentActionZoningResolution
          ) {
            try {
              return this.crmService.update(
                'dcp_affectedzoningresolutions',
                matchingZr.dcp_affectedzoningresolutionid,
                {
                  dcp_zrsectionnumber: currentActionZoningResolution,
                },
              );
            } catch (e) {
              console.log(
                'cannot update dcp_affectedzoningresolutions for matchingZr && matchingZr.dcp_zrsectionnumber',
                e,
              );
              throw e;
            }
          }

          // IF the zr type does not exist yet, then POST the action
          // NOTE: Some actions that exist in dcp_projectaction SHOULD NOT be copied over.
          // The ZONING_RESOLUTION_TYPES lookup also functions as a list of actions that SHOULD be
          // copied over from dcp_projectaction, which is why we check that `code` exists here.
          if (!matchingZr && code) {
            try {
              return this.crmService.create(`dcp_affectedzoningresolutions`, {
                dcp_zoningresolutiontype: code,
                dcp_zrsectionnumber: currentActionZoningResolution,
                dcp_modifiedzrsectionnumber: action.dcp_zrmodifyingzrtxt,
                'dcp_rwcdsform@odata.bind': `/dcp_pasforms(${dcp_rwcdsformid})`,
              });
            } catch (e) {
              console.log(
                'cannot create dcp_affectedzoningresolutions for !matchingZr && code',
                e,
              );
              throw e;
            }
          }
        }),
      );
    } catch (e) {
      console.log('Error in syncActions function', e);
      throw e;
    }
  }

  async updateIncludeZoningTextAmendment(dcp_rwcdsformid, projectActions) {
    // dcp_includezoningtextamendment is a field on the rwcds-form that should be "Yes" (717170000) if...
    // there exists a "ZR" action and that action's dcp_ZoningResolution.dcp_zoningresolution is "AppendixF"
    const includeZoningTextAmendmentAction = projectActions.find(
      (action) =>
        action._dcp_action_value === ACTION_VALUE_OPTIONSET['ZR'].code &&
        action.dcp_ZoningResolution?.dcp_zoningresolution === 'AppendixF',
    );

    if (includeZoningTextAmendmentAction) {
      await this.crmService.update('dcp_rwcdsforms', dcp_rwcdsformid, {
        // set to "Yes"
        dcp_includezoningtextamendment:
          INCLUDE_ZONING_TEXT_AMENDMENT_OPTIONSET['YES'].code,
      });
    } else {
      await this.crmService.update('dcp_rwcdsforms', dcp_rwcdsformid, {
        // set to "No"
        dcp_includezoningtextamendment:
          INCLUDE_ZONING_TEXT_AMENDMENT_OPTIONSET['NO'].code,
      });
    }
  }
}
