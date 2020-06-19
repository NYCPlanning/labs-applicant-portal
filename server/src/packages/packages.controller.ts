import { Controller, Get, Param, UseInterceptors, Patch, Body, UsePipes, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
import { AuthenticateGuard } from '../authenticate.guard';
import { PAS_FORM_ATTRS } from './pas-form/pas-form.controller';
import { APPLICANT_ATTRS } from './pas-form/applicants/applicants.controller';
import { BBL_ATTRS } from './pas-form/bbls/bbls.controller';
import { pick } from 'underscore';
import { PROJECT_ATTRS } from '../projects/projects.controller';

export const PACKAGE_ATTRS = [
  'statuscode',
  'statecode',
  'dcp_packagetype',
  'dcp_visibility',
  'dcp_packageversion',
  '_dcp_rwcdsform_value',
  '_dcp_pasform_value',
  'dcp_packageid',
  'dcp_name',
];

export const PAS_FORM_PROJECTADDRESS_ATTRS = [
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

export const RWCDS_FORM_ATTRS = [
  'dcp_describethewithactionscenario',
  'dcp_isplannigondevelopingaffordablehousing',
  'dcp_includezoningtextamendment',
  'dcp_existingconditions',
  'processid',
  'statecode',
  'importsequencenumber',
  'versionnumber',
  'dcp_rationalbehindthebuildyear',
  'createdon',
  'modifiedon',
  'dcp_isapplicantseekingaction',
  'dcp_whichactionsfromotheragenciesaresought',
  'dcp_proposedprojectdevelopmentdescription',
  'dcp_version',
  'dcp_projectsitedescription',
  'dcp_sitehistory',
  'dcp_purposeandneedfortheproposedaction',
  'dcp_describethenoactionscenario',
  'dcp_applicant',
  'dcp_hasprojectchangedsincesubmissionofthepas',
  'traversedpath',
  'statuscode',
  'dcp_borough',
  'dcp_projectname',
  'dcp_rwcdsexplanation',
  'dcp_communitydistrict',
  'dcp_howdidyoudeterminethenoactionscenario',
  'dcp_name',
  'dcp_isrwcdsscenario',
  'timezoneruleversionnumber',
  'dcp_howdidyoudeterminethiswithactionscena',
  'dcp_buildyear',
  'dcp_developmentsiteassumptions',
  'dcp_constructionphasing',
  'dcp_date',
  'overriddencreatedon',
  'utcconversiontimezonecode',
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
    'rwcds-form',
    'project',
  ],
  project: {
    ref: 'dcp_projectid',
    attributes: [
      ...PROJECT_ATTRS
    ],
  },
  'pas-form': {
    ref: 'dcp_pasformid',
    attributes: [
      ...PAS_FORM_ATTRS,

      // associations/relationships/navigation links/extensions
      'applicants',
      'bbls',
      'project-addresses',
    ],
    'project-addresses': {
      ref: 'dcp_projectaddressid',
      attributes: [
        ...PAS_FORM_PROJECTADDRESS_ATTRS,
      ],
    },
    applicants: {
      ref: 'dcp_applicantinformationid',
      attributes: [
        ...APPLICANT_ATTRS,
        'target_entity', // custom attribute to handle the two applicant crm entities
      ],
    },
    bbls: {
      ref: 'dcp_projectbblid',
      attributes: [
        ...BBL_ATTRS,
      ],
    },
  },
  'rwcds-form': {
    ref: 'dcp_rwcdsformid',
    attributes: [
      ...RWCDS_FORM_ATTRS,
    ],
  },

  // Transform here should only be used for remapping
  // navigation links into cleaner names as well as
  // handling special virtual properties that do not
  // come from CRM 
  transform(projectPackage) {
    // TODO: Consider creating separate endpoints for each
    // form, or some other solution, to avoid the
    // forking logic within the package controller/service
    // that handles the indiosyncracies of each form.
    const {
      dcp_pasform: pasForm,
      dcp_rwcdsform: rwcdsForm
    } = projectPackage;

    if (pasForm) {
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
    } else if (rwcdsForm) {
      return {
        ...projectPackage,
        'rwcds-form': {
          ...rwcdsForm,
        }
      }
    } else {
      return {
        ...projectPackage,
      };
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
