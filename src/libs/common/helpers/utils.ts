import {
  HttpStatus,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

import { LOGS_SLACK_CHANNEL } from 'src/libs/constants';
import { v4 as uuid } from 'uuid';

const handleDbErrors = (err) => {
  //foreign key voiation error
  if (err.number === 547) {
    // Handle foreign key violation error here
    throw new BadRequestException('Invalid Foreign Key');
  }
  //duplicate value
  else if (err.number === 2627 || err.number === 2601) {
    throw new BadRequestException('DB duplicate error value already exists');
  }
};

export const handleErrorCatch = (err, source?: string) => {
  handleDbErrors(err);

  if (
    err.status === HttpStatus.NOT_FOUND ||
    err.status === HttpStatus.BAD_REQUEST ||
    err.status === HttpStatus.UNAUTHORIZED ||
    err.status === HttpStatus.FORBIDDEN ||
    err.status === HttpStatus.CONFLICT
  ) {
    throw new HttpException(
      {
        status: err.status,
        error: err.response.message || err.response.error,
      },
      err.status,
    );
  }

  if (source) {
    sendLogMessageToSlack(
      LOGS_SLACK_CHANNEL,
      JSON.stringify({
        source: source,
        err: {
          message: err.message,
          stack: err.stack,
        },
      }),
    );
  }

  throw new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `An error occured with the message: ${err.message}`,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};

export const sendLogMessageToSlack = (channel: string, messsage: string) => {
  try {
    const slackUrl = 'https://slack.com/api/chat.postMessage';
    axios.post(
      slackUrl,
      {
        channel,
        text: messsage,
      },
      { headers: { authorization: `Bearer` } },
    );
  } catch (err) {
    Logger.log(`Error sending slack message: ${err.message}`);
  }
};

// src/modules/auth/dto/match.decorator.ts

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: NonNullable<unknown>, propertyName: string) => {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}

export function generateCode(environment: string = 'development'): string {
  if (environment === 'production') {
    // Generate a random 6-digit code
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  } else {
    // Development environment, use a fixed code
    return '123456';
  }
}

export function generateUniqueIdFromName(name: string): string {
  const names = name.split(' ');
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  const formattedInitials =
    initials.length > 3 ? initials.substring(0, 3) : initials;

  return `${formattedInitials}-${randomNumber}`;
}

export function calculateSubscriptionEndDate(
  startDate: Date,
  subscriptionLengthInMonths: number,
): Date {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + subscriptionLengthInMonths);
  // Get the last day of the ending month
  const lastDayOfMonth = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    0,
  ).getDate();
  // Ensure the day is within the ending month's limits
  endDate.setDate(Math.min(endDate.getDate(), lastDayOfMonth));
  return endDate;
}

export const generateEpisodeCode = () => {
  const code: string = uuid();
  return code.slice(0, 6);
};
