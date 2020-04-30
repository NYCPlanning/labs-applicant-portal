import { Controller, Get, Param, UseInterceptors, Patch, Body, Session, HttpException, HttpStatus, UsePipes, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
import { AuthenticateGuard } from '../authenticate.guard';

@UseInterceptors(new JsonApiSerializeInterceptor('packages', {
  id: 'dcp_packageid',
  attributes: [
    'statuscode',
    'dcp_packagetype',
    'dcp_visibility',
    'pas-form',
  ],
  'pas-form': {
    ref: 'dcp_pasformid',
    attributes: [
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

      // associations/relationships/navigation links/extensions
      'applicants',
      'bbls',
    ],
    applicants: {
      ref: 'dcp_applicantinformationid',
      attributes: [
        'dcp_firstname',
        'dcp_lastname',
        'dcp_organization',
        'dcp_email',
        'dcp_address',
        'dcp_city',
        'dcp_state',
        'dcp_zipcode',
        'dcp_phone',
      ],
    },
    bbls: {
      ref: 'dcp_projectbblid',
      attributes: [
        'dcp_partiallot',
        'dcp_developmentsite',
      ],
    },
  },

  // remap verbose navigation link names to
  // more concise names
  transform(projectPackage) {
    const { dcp_pasform: pasForm } = projectPackage;

    if (!pasForm) {
      return {
        ...projectPackage,
      };
    } else {
      return {
        ...projectPackage,
        'pas-form': {
          ...pasForm,
          applicants: pasForm.dcp_dcp_applicantinformation_dcp_pasform,
          bbls: pasForm.dcp_dcp_projectbbl_dcp_pasform,
        },
      }
    }
  },
}))
@UsePipes(JsonApiDeserializePipe)
@UseGuards(AuthenticateGuard)
@Controller()
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('/packages/:id')
  getPackage(@Param('id') id) {
    return this.packagesService.getPackage(id);
  }

  @Patch('/packages/:id')
  patchPackage(@Body() body, @Param('id') id) {
    return {
      dcp_packageid: id,
      ...body,
    };
  }
}
