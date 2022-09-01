import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('citypay')
export class CityPayController {
  @Post('/postbackpayment')
  async citypayPostback(@Body() body) {
    console.log("Body: ", body);

    return 1;
  }
}
