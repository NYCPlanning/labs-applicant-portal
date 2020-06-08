import { Controller, Patch, Body, Param, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
import { CrmService } from '../../crm/crm.service';
import { pick } from 'underscore';

export const PAS_FORM_ATTRS = [
  // Project Information
  'dcp_revisedprojectname',

  // Project Geography
  'dcp_descriptionofprojectareageography',

  // Proposed Land Use Actions
  'dcp_pfchangeincitymap',
  'dcp_pfudaap',
  'dcp_pfsiteselectionpublicfacility',
  'dcp_pfura',
  'dcp_pfacquisitionofrealproperty',
  'dcp_pfhousingplanandproject',
  'dcp_pfdispositionofrealproperty',
  'dcp_pffranchise',
  'dcp_pfrevocableconsent',
  'dcp_pfconcession',
  'dcp_pflandfill',
  'dcp_pfzoningspecialpermit',
  'dcp_zoningspecialpermitpursuantto',
  'dcp_zoningspecialpermittomodify',
  'dcp_pfzoningauthorization',
  'dcp_zoningauthorizationpursuantto',
  'dcp_zoningauthorizationtomodify',
  'dcp_pfzoningcertification',
  'dcp_zoningpursuantto',
  'dcp_zoningtomodify',
  'dcp_pfzoningmapamendment',
  'dcp_existingmapamend',
  'dcp_proposedmapamend',
  'dcp_pfzoningtextamendment',
  'dcp_affectedzrnumber',
  'dcp_zoningresolutiontitle',
  'dcp_previousulurpnumbers1',
  'dcp_previousulurpnumbers2',
  'dcp_pfacquisitionofrealproperty',
  'dcp_pfchangeincitymap',
  'dcp_pfconcession',
  'dcp_pfdispositionofrealproperty',
  'dcp_pffranchise',
  'dcp_pfhousingplanandproject',
  'dcp_pflandfill',
  'dcp_pfmodification',
  'dcp_pfrenewal',
  'dcp_pfrevocableconsent',
  'dcp_pfsiteselectionpublicfacility',
  'dcp_pfudaap',
  'dcp_pfura',
  'dcp_pfzoningauthorization',
  'dcp_pfzoningcertification',
  'dcp_pfzoningmapamendment',
  'dcp_pfzoningspecialpermit',
  'dcp_pfzoningtextamendment',
  'dcp_zoningauthorizationpursuantto',
  'dcp_zoningauthorizationtomodify',
  'dcp_zoningpursuantto',
  'dcp_zoningtomodify',
  'dcp_existingmapamend',
  'dcp_proposedmapamend',
  'dcp_zoningspecialpermitpursuantto',
  'dcp_zoningspecialpermittomodify',
  'dcp_affectedzrnumber',
  'dcp_zoningresolutiontitle',
  'dcp_previousulurpnumbers1',
  'dcp_previousulurpnumbers2',

  // Project Area
  'dcp_proposedprojectorportionconstruction',
  'dcp_urbanrenewalarea',
  'dcp_urbanareaname',
  'dcp_legalstreetfrontage',
  'dcp_landuseactiontype2',
  'dcp_pleaseexplaintypeiienvreview',
  'dcp_projectareaindustrialbusinesszone',
  'dcp_projectareaindutrialzonename',
  'dcp_isprojectarealandmark',
  'dcp_projectarealandmarkname',
  'dcp_projectareacoastalzonelocatedin',
  'dcp_projectareaischancefloodplain',
  'dcp_restrictivedeclaration',
  'dcp_cityregisterfilenumber',
  'dcp_restrictivedeclarationrequired',

  // Proposed Development Site
  'dcp_estimatedcompletiondate',
  'dcp_proposeddevelopmentsitenewconstruction',
  'dcp_proposeddevelopmentsitedemolition',
  'dcp_proposeddevelopmentsiteinfoalteration',
  'dcp_proposeddevelopmentsiteinfoaddition',
  'dcp_proposeddevelopmentsitechnageofuse',
  'dcp_proposeddevelopmentsiteenlargement',
  'dcp_proposeddevelopmentsiteinfoother',
  'dcp_proposeddevelopmentsiteotherexplanation',
  'dcp_isinclusionaryhousingdesignatedarea',
  'dcp_inclusionaryhousingdesignatedareaname',
  'dcp_discressionaryfundingforffordablehousing',
  'dcp_housingunittype',

  // Project Description
  'dcp_projectdescriptionproposeddevelopment',
  'dcp_projectdescriptionbackground',
  'dcp_projectdescriptionproposedactions',
  'dcp_projectdescriptionproposedarea',
  'dcp_projectdescriptionsurroundingarea',
  'dcp_projectattachmentsotherinformation',
];

@UseInterceptors(new JsonApiSerializeInterceptor('pas-forms', {
  attributes: [
    ...PAS_FORM_ATTRS,
  ],
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('pas-forms')
export class PasFormController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, PAS_FORM_ATTRS);

    await this.crmService.update('dcp_pasforms', id, allowedAttrs);

    return {
      dcp_pasformid: id,
      ...body
    };
  }
}
