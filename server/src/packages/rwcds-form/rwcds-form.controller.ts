import { Controller, Patch, Body, Param, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
import { RwcdsFormService } from './rwcds-form.service';
import { pick } from 'underscore';

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
];

@UseInterceptors(new JsonApiSerializeInterceptor('rwcds-forms', {
  attributes: [
    ...RWCDS_FORM_ATTRS,
  ],
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('rwcds-forms')
export class RwcdsFormController {
  constructor(private readonly rwcdsFormService: RwcdsFormService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, [
      ...RWCDS_FORM_ATTRS,
      'package',
    ]);

    await this.rwcdsFormService.update(id, allowedAttrs);

    return {
      dcp_rwcdsformid: id,
      ...body
    };
  }
}
