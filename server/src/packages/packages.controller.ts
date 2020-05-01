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
  'dcp_packagetype',
  'dcp_visibility',
];

@UseInterceptors(new JsonApiSerializeInterceptor('packages', {
  id: 'dcp_packageid',
  attributes: [
    ...PACKAGE_ATTRS,

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
    ],
    applicants: {
      ref: 'dcp_applicantinformationid',
      attributes: [
        ...APPLICANT_ATTRIBUTES
      ],
    },
    bbls: {
      ref: 'dcp_projectbblid',
      attributes: [
        ...BBL_ATTRIBUTES
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
      ...body,
    };
  }
}
