import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { PACKAGE_TYPE_OPTIONSET } from '../packages.service';
import { PAS_FORM_ATTRS } from './pas-form.attrs';
import { PACKAGE_ATTRS } from '../packages.attrs';

@Injectable()
export class PasFormService {
  constructor(private readonly crmService: CrmService) {}

  async find(id) {
    const { records: [pasForm] } = await this.crmService.get(`dcp_pasforms`, `
      $select=${PAS_FORM_ATTRS.join(',')}
      &$filter=
        dcp_pasformid eq ${id}
      &$expand=
        dcp_dcp_applicantinformation_dcp_pasform,
        dcp_dcp_applicantrepinformation_dcp_pasform,
        dcp_dcp_projectbbl_dcp_pasform($filter=statecode eq 0),
        dcp_dcp_projectaddress_dcp_pasform,
        dcp_projectname($select=dcp_projectname)
    `);

    // dcp_projectname is the name of the CRM navigation link.
    // then dcp_projectname is the real project name
    const { dcp_projectname } = pasForm.dcp_projectname || {};

    return {
      ...pasForm,

      dcp_revisedprojectname: pasForm.dcp_revisedprojectname || dcp_projectname,
    };
  }

  // Gets the lateset PAS Form on Project `projectId`
  async getLatestPasForm(projectId): Promise<any> {
    try {
      const { records: pasPackages } = await this.crmService.get('dcp_packages', `
        $filter=
          _dcp_project_value eq ${projectId}
          and dcp_packagetype eq ${PACKAGE_TYPE_OPTIONSET['PAS_PACKAGE'].code}
        &$expand=
          dcp_pasform
      `);

      // if pasA is of a higher version than pasB, it should come first
      const [{ dcp_pasform: latestPasForm }] = pasPackages.sort((pasA, pasB) => {
        return pasB.dcp_packageversion - pasA.dcp_packageversion;
      });

      return latestPasForm;
    } catch (e) {
      const errorMessage = `Error finding a PAS Form on given Project. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }
}
