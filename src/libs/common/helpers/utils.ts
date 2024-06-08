import {
  HttpStatus,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';

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

export const generateEpisodeCode = () => {
  const code: string = uuid();
  return code.slice(0, 6);
};
