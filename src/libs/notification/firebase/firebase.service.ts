import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { UserEntity } from '../../../modules/user/entity/user.entity';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    // Resolve path to service account file
    const serviceAccountPath = path.join(
      __dirname,
      'libs',
      'notification',
      'firebase',
      'fanzy.json',
    );

    // Verify that the file exists
    if (!fs.existsSync(serviceAccountPath)) {
      console.error(
        `Service account file not found at path: ${serviceAccountPath}`,
      );
      return;
    }

    // Initialize Firebase Admin SDK
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
    }
  }

  async sendNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: { [key: string]: string },
  ) {
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens,
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async createUser(user: any) {
    try {
      //insert into user collection
      const db = admin.firestore();
      //const userMap = user.toJwtPayload();
      await db.collection('users').doc(user.id).set(user);
    } catch (e) {
      console.log(e);
    }
  }
}
