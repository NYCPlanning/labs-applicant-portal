import {
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticateGuard } from '../authenticate.guard';

@Controller('citypay')
export class CityPayController {
  @Post('/postbackpayment')
  async citypayPostback() {
  }
}
