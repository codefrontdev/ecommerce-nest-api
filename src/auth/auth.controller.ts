import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInUserDto } from './dto/signin-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { JWTPayloadType } from 'src/utils/types';
import { Roles } from './decorators/user-role.decorator';
import { UserRole } from 'src/utils/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(
    @Body() SignInUserDto: SignInUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.signIn(SignInUserDto, req, res);
  }

  @Get('my-account')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  myAccount(@CurrentUser() payload: JWTPayloadType) {
    return this.authService.myAccount({ id: payload.id });
  }
  

  @Get('signout')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  signout(@Req() req: Request, @Res() res: Response) {
    return this.authService.signout(req, res);
  }
}
