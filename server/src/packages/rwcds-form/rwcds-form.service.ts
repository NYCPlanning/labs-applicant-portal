import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { PasFormService } from '../pas-form/pas-form.service';
import { pick } from 'underscore';
import { RWCDS_FORM_ATTRS } from './rwcds-form.attrs';
import { PACKAGE_ATTRS } from '../packages.attrs';

const ZONING_RESOLUTION_TYPES = [
  ["ZA", 717170000],
  ["ZC", 717170001],
  ["ZS", 717170002],
  ["ZR", 717170003],
  ["ZM", 717170008],
  ["SD", 717170009],
  ["SC", 717170010],
  ["SA", 717170011],
  ["RS", 717170012],
  ["RC", 717170013],
  ["RA", 717170014],
  ["PS", 717170015],
  ["PQ", 717170016],
  ["PP", 717170017],
  ["PE", 717170018],
  ["PC", 717170019],
  ["NP", 717170020],
  ["MY", 717170021],
  ["MM", 717170022],
  ["ML", 717170023],
  ["ME", 717170024],
  ["MC", 717170025],
  ["LD", 717170026],
  ["HU", 717170027],
  ["HP", 717170028],
  ["HO", 717170029],
  ["HN", 717170030],
  ["HG", 717170031],
  ["HD", 717170032],
  ["HC", 717170033],
  ["HA", 717170034],
  ["GF", 717170035],
  ["CM", 717170036],
  ["BF", 717170037],
  ["BD", 717170038],
];

@Injectable()
export class RwcdsFormService {
  constructor(
    private readonly crmService: CrmService,
    private readonly pasFormService: PasFormService,
  ) {}

  async _getPackageProjectId(packageId):Promise<String> {
    const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
      $select=_dcp_project_value
      &$filter=dcp_packageid eq ${packageId}
    `);

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

    if(!projectId) {
      return new HttpException('Package not found for RWCDS Form', HttpStatus.NOT_FOUND);
    }

    await this.crmService.update('dcp_rwcdsforms', id, allowedAttrs);

    if (allowedAttrs.hasOwnProperty('dcp_buildyear')) {
      await this.crmService.update('dcp_projects', projectId, {
        dcp_anticipatedyearbuilt: allowedAttrs.dcp_buildyear,
      });
    }
  }

  async find(id) {
    // Because we post data from dcp_projectaction to dcp_affectedzoningresolution, we need
    // to GET the rwcdsForm twice. Once to pass the form into the syncActions method. And 
    // a second time to include the updated dcp_affectedzoningresolution relationship. 
    const { records: [rwcdsFormWithoutUpdatedZr] } = await this.crmService.get(`dcp_rwcdsforms`, `
      $filter=
        dcp_rwcdsformid eq ${id}
      &$expand=dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform
    `);

    // run syncActions to synchronize dcp_projectaction and dcp_affectedzoningresolution entities
    await this.syncActions(rwcdsFormWithoutUpdatedZr);

    // version of rwcdsForm that guarantees we have updated dcp_affectedzoningresolution
    const { records: [rwcdsForm] } = await this.crmService.get(`dcp_rwcdsforms`, `
      $filter=
        dcp_rwcdsformid eq ${id}
      &$expand=dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform
    `);

    const { _dcp_projectid_value } = rwcdsForm;

    // requires info from adjacent latest pasForm
    if (
      rwcdsForm.dcp_projectsitedescription === null
      || rwcdsForm.dcp_proposedprojectdevelopmentdescription === null
    ) {
      const {
        dcp_projectdescriptionproposedarea,
        dcp_projectdescriptionproposeddevelopment,
      } = await this.pasFormService.getLatestPasForm(_dcp_projectid_value);

      if (rwcdsForm.dcp_projectsitedescription === null) {
        rwcdsForm.dcp_projectsitedescription = dcp_projectdescriptionproposedarea;
      }

      if (rwcdsForm.dcp_proposedprojectdevelopmentdescription === null) {
        rwcdsForm.dcp_proposedprojectdevelopmentdescription = dcp_projectdescriptionproposeddevelopment;
      }
    }

    return rwcdsForm;
  }

  // The syncActions method queries for project actions (dcp_projectaction) associated
  // with the rwcds form's related project. 
  // Then, it posts each of the project actions to dcp_affectedzoningresolution.
  // This occurs every time that the rwcds-form endpoint is hit
  async syncActions(rwcdsForm) {
    const {
      dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform: affectedZoningResolutions,
      _dcp_projectid_value,
      dcp_rwcdsformid,
    } = rwcdsForm;
    const zrTypes = affectedZoningResolutions.map(zr => zr['dcp_zoningresolutiontype@OData.Community.Display.V1.FormattedValue']);
    const { records: projectActions } = await this.crmService.get(`dcp_projectactions`, `
      $filter=_dcp_project_value eq ${_dcp_projectid_value}
    `);

    await Promise.all(projectActions.map(action => {
      const projectActionLabel = action['_dcp_action_value@OData.Community.Display.V1.FormattedValue'];

      // Lookup: dcp_affectedzoningresolutions asks for a ZR type,
      const [actionLabel, actionCode] = ZONING_RESOLUTION_TYPES.find((label) => label === projectActionLabel) || ['ZA', 717170000];

      if (!actionLabel) console.log(`Could not find Affected ZR Type for ${projectActionLabel}`);

      if (!zrTypes.includes(actionLabel)) {
        return this.crmService.create(`dcp_affectedzoningresolutions`, {
          'dcp_zoningresolutiontype': actionCode, // this is a coded value
          'dcp_zrsectionnumber': action.dcp_zrsectionnumber,
          'dcp_modifiedzrsectionnumber': action.dcp_zrmodifyingzrtxt,
          'dcp_rwcdsform@odata.bind': `/dcp_pasforms(${dcp_rwcdsformid})`,
        });
      } else {
        console.log(`zoning resolution with id ${projectActionLabel} already exists`);
      }
    }));
  }
}
