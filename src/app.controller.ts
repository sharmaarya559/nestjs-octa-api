import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /********************************GET ALL USERS*************************************/
  @Get('users')
  @ApiOperation({ summary: 'Get all users from Okta' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit number of users you want in a one time.',
  })
  @ApiResponse({ status: 200, description: 'Users fetched successfully.' })
  async getAllUsers(limit: number, @Res() res: Response) {
    return this.appService.getAllUsers(limit, res);
  }
  //--------------------------------------------------------------------------------//

  /****************************GET SINGLE USER BY ID*********************************/
  @Get('users/:user_id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'user_id', description: 'Okta User ID' })
  @ApiResponse({ status: 200, description: 'User fetched successfully.' })
  async getUserById(@Param('user_id') user_id: string, @Res() res: Response) {
    return this.appService.getUserById(user_id, res);
  }
  //--------------------------------------------------------------------------------//

  /****************************GET USER WITH DEVICES*********************************/
  @Get('user-with-devices/:user_id')
  @ApiOperation({ summary: 'Get single user with devices' })
  @ApiParam({ name: 'user_id', description: 'Okta User ID' })
  @ApiResponse({
    status: 200,
    description: 'User and device fetched successfully.',
  })
  async getUserWithDevices(
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ) {
    return this.appService.getUserWithDevices(user_id, res);
  }
  //--------------------------------------------------------------------------------//

  /**************************GET USER'S TRUSTED DEVICES******************************/
  @Get('user-with-trusted-devices/:user_id')
  @ApiOperation({ summary: 'Get single user with trusted devices' })
  @ApiParam({ name: 'user_id', description: 'Okta User ID' })
  @ApiResponse({
    status: 200,
    description: 'Trusted devices fetched successfully.',
  })
  async getTrustedDevices(
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ) {
    return this.appService.getTrustedDevices(user_id, res);
  }
  //--------------------------------------------------------------------------------//
}
