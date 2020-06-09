import { Controller, Get, Param, UseInterceptors, Patch, Body, Session, HttpException, HttpStatus, UsePipes, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
import { AuthenticateGuard } from '../authenticate.guard';
import { PAS_FORM_ATTRIBUTES } from './pas-form/pas-form.controller';
import { APPLICANT_ATTRIBUTES } from './pas-form/applicants/applicants.controller';
import { BBL_ATTRIBUTES } from './pas-form/bbls/bbls.controller';
import { pick } from 'underscore';
import { PROJECT_ATTRIBUTES } from '../projects/projects.controller';

export const PACKAGE_ATTRS = [
  'statuscode',
  'statecode',
  'dcp_packagetype',
  'dcp_visibility',
  'dcp_packageversion',
];

export const PASFORM_PROJECTADDRESS_ATTRS = [
  'dcp_validatedpostalcode',
  'dcp_projectaddressid',
  'modifiedon',
  'dcp_dmsourceid',
  'dcp_name',
  'dcp_validatedxcoordinate',
  'overriddencreatedon',
  'dcp_validatedccd',
  'createdon',
  'dcp_userinputborough',
  'dcp_addressvalidated',
  'dcp_userinputaddressnumber',
  'dcp_validatedstreet',
  'dcp_responsewarning',
  'dcp_userinputunit',
  'versionnumber',
  'dcp_migratedlastupdateddate',
  'statuscode',
  'dcp_validatedycoordinate',
  'dcp_validatedborough',
  'dcp_responseerror',
  'dcp_validatedcd',
  'timezoneruleversionnumber',
  'dcp_validatedzm',
  'dcp_validatedaddressnumber',
  'importsequencenumber',
  'dcp_dcp_validatedbintext',
  'utcconversiontimezonecode',
  'dcp_userinputstreet',
  'dcp_validatedstreetcode',
  'dcp_concatenatedaddressvalidated',
  'dcp_validatedaddressoverride',
  'dcp_addressvalidateddate',
  'statecode',
]

@UseInterceptors(new JsonApiSerializeInterceptor('packages', {
  id: 'dcp_packageid',
  attributes: [
    ...PACKAGE_ATTRS,

    // not a relationship proper, just an array of objects
    // REDO: make this a rel
    'documents',

    // entity relationships
    'pas-form',
    'project',
  ],
  project: {
    ref: 'dcp_projectid',
    attributes: [
      ...PROJECT_ATTRIBUTES
    ],
  },
  'pas-form': {
    ref: 'dcp_pasformid',
    attributes: [
      ...PAS_FORM_ATTRIBUTES,

      // associations/relationships/navigation links/extensions
      'applicants',
      'bbls',
      'project-addresses',
    ],
    'project-addresses': {
      ref: 'dcp_projectaddressid',
      attributes: [
        ...PASFORM_PROJECTADDRESS_ATTRS,
      ],
    },
    applicants: {
      ref: 'dcp_applicantinformationid',
      attributes: [
        ...APPLICANT_ATTRIBUTES,
        'target_entity', // custom attribute to handle the two applicant crm entities
      ],
    },
    bbls: {
      ref: 'dcp_projectbblid',
      attributes: [
        ...BBL_ATTRIBUTES,
      ],
    },
  },

  // Transform here should only be used for remapping
  // navigation links into cleaner names as well as
  // handling special virtual properties that do not
  // come from CRM 
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
          'project-addresses': pasForm.dcp_dcp_projectaddress_dcp_pasform,
          applicants: [
            ...pasForm.dcp_dcp_applicantinformation_dcp_pasform,
            ...pasForm.dcp_dcp_applicantrepinformation_dcp_pasform.map((applicant) => {
              // map this array to handle the slight differences in schemas between these two entities
              // that we treat as one applicants array on the frontend

              // define target_entity for the frontend (defaults to dcp_applicantinformation)
              applicant['target_entity'] = 'dcp_applicantrepresentativeinformation'

              return {
              ...applicant,
              // FIXME: this is ensuring the Ember Data relationships work (with a unique ref)
              // but this is hacky because dcp_applicantinformationid doesn't exist on this entity
              dcp_applicantinformationid: `representative-${applicant.dcp_applicantrepresentativeinformationid}`
            }}),
          ],
          bbls: pasForm.dcp_dcp_projectbbl_dcp_pasform,
        },
      }
    }
  },
}))
@UsePipes(JsonApiDeserializePipe)
@UseGuards(AuthenticateGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('/:id')
  getPackage(@Param('id') id) {
    return this.packagesService.getPackage(id);
  }

  @Patch('/:id')
  async patchPackage(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, PACKAGE_ATTRS);

    await this.packagesService.update(id, allowedAttrs);

    return {
      dcp_packageid: id,
      ...allowedAttrs,
    };
  }
}
