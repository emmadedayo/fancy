// firebase.module.ts
import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService], // Make the service available for injection
})
export class FirebaseModule {}
