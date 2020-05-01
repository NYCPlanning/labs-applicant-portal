import { Controller, Patch, Body, Param, Post } from '@nestjs/common';
import { PasFormService } from '../pas-form.service';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly pasFormService: PasFormService) { }

  @Patch('/:id')
  patchApplicant(@Body() body, @Param('id') id) {
    return {
      dcp_applicantinformationid: id,
      ...body,
    }
  }

  @Post('/')
  postApplicant(@Body() body) {
    return {
      ...body,
    }
  }
}
