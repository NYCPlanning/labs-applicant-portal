import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UseInterceptors,
  UseGuards,
  UsePipes,
  Redirect
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
import { PackageAccessGuard } from './package-access.guard';
import { pick } from 'underscore';
import { LANDUSE_FORM_ATTRS } from './landuse-form/landuse-form.attrs';
import { RWCDS_FORM_ATTRS } from './rwcds-form/rwcds-form.attrs';
import { PAS_FORM_ATTRS, PAS_FORM_PROJECTADDRESS_ATTRS } from './pas-form/pas-form.attrs';
import { PACKAGE_ATTRS } from './packages.attrs';
import { PROJECT_ATTRS } from '../projects/projects.attrs';
import { BBL_ATTRS } from './bbls/bbls.attrs';
import { AFFECTEDZONINGRESOLUTION_ATTRS } from './rwcds-form/affected-zoning-resolution/affected-zoning-resolutions.attrs';
import { APPLICANT_ATTRS } from './pas-form/applicants/applicants.attrs';
import { RELATED_ACTION_ATTRS } from './landuse-form/related-actions/related-actions.attrs';
import { LANDUSE_ACTION_ATTRS } from './landuse-form/landuse-actions/landuse-actions.attrs';
import { SITEDATAH_FORM_ATTRS } from './landuse-form/sitedatah-forms/sitedatah-form.attrs';
import { LANDUSE_GEOGRAPHY_ATTRS } from './landuse-form/landuse-geography/landuse-geography.attrs';
import { ZONINGRESOLUTION_ATTRS } from '../zoning-resolutions/zoning-resolutions.attrs';
import { ZONING_MAP_CHANGE_ATTRS } from './landuse-form/zoning-map-changes/zoning-map-change.attrs';
import { CitypayService } from '../citypay/citypay.service';

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
    'landuse-form',
    'project',

    // pay link - not a relationship
    'city_pay_url',
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
      'affected-zoning-resolutions',
    ],
    'affected-zoning-resolutions': {
      ref: 'dcp_affectedzoningresolutionid',
      attributes: [
        ...AFFECTEDZONINGRESOLUTION_ATTRS,
      ],
    },
  },
  'landuse-form': {
    ref: 'dcp_landuseid',
    attributes: [
      ...LANDUSE_FORM_ATTRS,

      'applicants',
      'bbls',
      'related-actions',
      'landuse-actions',
      'sitedatah-forms',
      'landuse-geographies',
      'lead-agency',
      'affected-zoning-resolutions',
      'zoning-map-changes',
    ],
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
    'related-actions': {
      ref: 'dcp_relatedactionsid',
      attributes: [
        ...RELATED_ACTION_ATTRS,
      ],
    },
    'landuse-actions': {
      ref: 'dcp_landuseactionid',
      attributes: [
        ...LANDUSE_ACTION_ATTRS,

        'zoning-resolution',
      ],
      'zoning-resolution': {
        ref: 'dcp_zoningresolutionid',
        attributes: [
          ...ZONINGRESOLUTION_ATTRS,
        ],
      },
    },
    'sitedatah-forms': {
      ref: 'dcp_sitedatahformid',
      attributes: [
        ...SITEDATAH_FORM_ATTRS,
      ],
    },
    'landuse-geographies': {
      ref: 'dcp_landusegeographyid',
      attributes: [
        ...LANDUSE_GEOGRAPHY_ATTRS,
      ],
    },
    'lead-agency': {
      ref: 'accountid',
      attributes: [
        'name',
        'accountid',
      ],
    },
    'affected-zoning-resolutions': {
      ref: 'dcp_affectedzoningresolutionid',
      attributes: [
        ...AFFECTEDZONINGRESOLUTION_ATTRS,
      ],
    },
    'zoning-map-changes': {
      ref: 'dcp_zoningmapchangesid',
      attributes: [
        ...ZONING_MAP_CHANGE_ATTRS,
      ],
    },
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
    try {
      const {
        dcp_pasform: pasForm,
        dcp_rwcdsform: rwcdsForm,
        dcp_landuse: landuseForm
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
            'affected-zoning-resolutions': rwcdsForm.dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform,
          }
        }
      } else if (landuseForm) {
        return {
          ...projectPackage,
          'landuse-form': {
            ...landuseForm,
            applicants: [
              ...landuseForm.dcp_dcp_applicantinformation_dcp_landuse,
              ...landuseForm.dcp_dcp_applicantrepinformation_dcp_landuse.map((applicant) => {
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
            bbls: landuseForm.dcp_dcp_projectbbl_dcp_landuse,
            'related-actions': landuseForm.dcp_dcp_landuse_dcp_relatedactions,
            'landuse-actions': landuseForm.landuseActions.map(action => {
              return {
                ...action,
                'zoning-resolution': action.dcp_zoningresolutionsectionactionispursuantto,
              }
            }),
            'sitedatah-forms': landuseForm.dcp_dcp_landuse_dcp_sitedatahform_landuseform,
            'landuse-geographies': landuseForm.dcp_dcp_landuse_dcp_landusegeography_landuseform,
            'lead-agency': landuseForm.dcp_leadagency,
            'affected-zoning-resolutions': landuseForm.dcp_dcp_landuse_dcp_affectedzoningresolution_Landuseform,
            'zoning-map-changes': landuseForm.dcp_dcp_landuse_dcp_zoningmapchanges_LandUseForm,
          }
        }
      } else {
        return {
          ...projectPackage,
        };
      }
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'PACKAGES_ERROR',
          title: 'Failed to load package(s)',
          detail: `An error occurred while loading one or more packages. ${e.message}`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  },
}))
@UsePipes(JsonApiDeserializePipe)
@UseGuards(PackageAccessGuard)
@Controller('packages')
export class PackagesController {
  constructor(
    private readonly packagesService: PackagesService,
    private readonly cityPay: CitypayService
  ) {}

  @Get('/:id')
  getPackage(@Param('id') id) {
    try {
      return this.packagesService.getPackage(id);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'FIND_PACKAGED_FAILED',
          title: 'Failed getting a package',
          detail: `An unknown server error occured while finding a package by ID. ${e.message}`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Patch('/:id')
  async patchPackage(@Body() body, @Param('id') id) {
    try {
      const allowedAttrs = pick(body, PACKAGE_ATTRS);

      await this.packagesService.update(id, allowedAttrs);

      return {
        dcp_packageid: id,
        ...allowedAttrs,
      };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'PATCH_PROJECT_FAILED',
          title: 'Failed patching package',
          detail: `An unknown server error occured while patching a package. ${e.message}`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('/pay/:id')
  async generatePaymentLink(@Param('id') id) {
    return { 
      city_pay_url: await this.cityPay.generateCityPayLink(id),
    };
  }
}
