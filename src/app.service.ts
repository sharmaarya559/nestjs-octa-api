import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Response } from 'express';
import { CustomException } from './exception/custom.exception';

@Injectable()
export class AppService {
  private readonly baseUrl: string;
  private readonly apiToken: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('OKTA_DOMAIN');
    this.apiToken = this.configService.get<string>('OKTA_API_TOKEN');

    if (!this.baseUrl || !this.apiToken) {
      throw new Error('OKTA_DOMAIN and OKTA_API_TOKEN must be configured');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${process.env.OKTA_API_TOKEN}`,
      Accept: 'application/json',
    };
  }

  /********************************GET TOKEN*****************************************/
  private async getToken() {
    try {
      const res = await axios.post(
        `${process.env.BASE_OKTA_DOMAIN}/oauth/token`,
        {
          client_id: process.env.OKTA_CLIENT_ID,
          client_secret: process.env.OKTA_CLIENT_SECRET,
          audience: process.env.OKTA_DOMAIN,
          grant_type: 'client_credentials',
        },
        {
          headers: { 'content-type': 'application/json' },
        },
      );
      return res;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
  //--------------------------------------------------------------------------------//

  /********************************GET ALL USERS*************************************/
  async getAllUsers(limit = 20, res: Response) {
    try {
      const response = await axios.get(`${this.baseUrl}users`, {
        headers: this.getHeaders(),
        params: {
          limit,
          filter: 'status eq "ACTIVE"',
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Users fetched successfully.',
        data: response.data,
      });
    } catch (error) {
      throw new CustomException(error.message, 500);
    }
  }
  //--------------------------------------------------------------------------------//

  /******************************GET SINGLE USER*************************************/
  async getSingleUser(user_id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}users/${user_id}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      return {};
    }
  }
  //--------------------------------------------------------------------------------//

  /****************************GET USER DEVICES**************************************/
  async getUserDevices(userId: string) {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/v1/users/${userId}/factors`,
        {
          headers: this.getHeaders(),
        },
      );
      return res.data;
    } catch (error) {
      return [];
    }
  }
  //--------------------------------------------------------------------------------//

  /****************************GET SINGLE USER BY ID*********************************/
  async getUserById(user_id: string, res: Response) {
    try {
      const data = await this.getSingleUser(user_id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User fetched successfully.',
        data,
      });
    } catch (error) {
      throw new CustomException(error.message, error?.response?.status || 500);
    }
  }
  //--------------------------------------------------------------------------------//

  /****************************GET USER WITH DEVICES*********************************/
  async getUserWithDevices(user_id: string, res: Response) {
    try {
      const [user, devices] = await Promise.all([
        this.getSingleUser(user_id),
        this.getUserDevices(user_id),
      ]);

      return res.status(HttpStatus.OK).json({
        success: true,
        user,
        devices,
      });
    } catch (error) {
      throw new CustomException(error.message, 500);
    }
  }
  //--------------------------------------------------------------------------------//

  /**************************GET USER'S TRUSTED DEVICES******************************/
  async getTrustedDevices(user_id: string, res: Response) {
    try {
      const devices = await this.getUserDevices(user_id);

      const trustedDevices = devices.filter(
        (device) =>
          device.status === 'ACTIVE' &&
          (device.factorType === 'push' ||
            device.factorType === 'token:software:totp'),
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Trusted devices fetched successfully.',
        trustedDevices,
      });
    } catch (error) {
      throw new CustomException(error.message, 500);
    }
  }
  //--------------------------------------------------------------------------------//
}
