import { 
  Controller, 
  Get, 
  Query,
  Res,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('/login')
  async login(@Res() res: Response, @Query('accessToken') NYCIDToken: string) {
    try {
      const ZAPToken = await this.authService.generateNewToken(NYCIDToken);

      res.cookie('token', ZAPToken, { httpOnly: true, sameSite: 'none', secure: true })
        .send({ message: 'Login successful!' });
    } catch (e) {
      if (e instanceof HttpException) {
        res.status(401).send({ errors: [e] });
      } else {
        console.log(e);

        res.status(500).send({ errors: [e] });
      }
    }
  }

  @Get('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token')
      .send({ message: 'Logout successful!' });
  }
}

