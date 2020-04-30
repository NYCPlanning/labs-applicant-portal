import { Controller, Patch, Body, Param, Post } from '@nestjs/common';
import { PasFormService } from '../pas-form.service';

@Controller('bbls')
export class BblsController {
  constructor(private readonly pasFormService: PasFormService) { }

  @Patch('/:id')
  patchBbl(@Body() body, @Param('id') id) {
    return {
      dcp_projectbblid: id,
      ...body,
    }
  }

  @Post('/')
  postBbl(@Body() body) {
    return {
      ...body,
    }
  }
}
