import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { BaseResponse } from '../../response/base_response';

dotenv.config();

@Injectable()
export class PayStackService {
  private readonly paystackUrl =
    'https://api.paystack.co/transaction/initialize';
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  async initializeTransaction(
    email: string,
    amount: number,
    callbackUrl: string,
    metadata?: any,
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      email,
      amount,
      callbackUrl,
      metadata,
    };

    try {
      const response = await axios.post(this.paystackUrl, data, { headers });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data ||
          'An error occurred while initializing the transaction',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchBanks(): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
    };

    try {
      const response = await axios.get('https://api.paystack.co/bank', {
        headers,
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'An error occurred while fetching banks',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resolveAccountNumber(
    accountNumber: string,
    bankCode: string,
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
    };

    try {
      const response = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        { headers },
      );
      return response.data;
    } catch (error) {
      return BaseResponse.error(
        error.response?.data ||
          'An error occurred while validating the account',
        null,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
