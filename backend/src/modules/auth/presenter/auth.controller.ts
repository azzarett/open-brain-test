import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResource } from '../../users/presenter/resources/user.resource';
import { AuthService } from '../domain/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetTokensBody } from './bodies/get-tokens.body';
import { AuthResource } from './resources';

@ApiTags('Auth')
@Controller('/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authResource: AuthResource,
    private readonly userResource: UserResource,
  ) {}

  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: GetTokensBody })
  @ApiResponse({ status: 201, description: 'Successful authorization' })
  @ApiResponse({ status: 401, description: 'Credentials are invalid' })
  async getTokens(@Body() body: GetTokensBody) {
    const [user, auth] = await this.authService.getTokens({
      email: body.email,
      password: body.password,
    });

    return {
      data: {
        user: this.userResource.convert(user),
        auth: this.authResource.convert(auth),
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/sign-out')
  @ApiOperation({ summary: 'Sign out current session' })
  @ApiResponse({ status: 200, description: 'Signed out successfully' })
  async signOut(@Req() request: Request) {
    const token = request.get('Authorization')?.replace('Bearer', '').trim();

    await this.authService.softDeleteAccessToken(token || '');

    return {
      data: {
        success: true,
      },
    };
  }
}
