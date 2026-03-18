import { Module } from '@nestjs/common';
import { CaslAblityFactory } from './casl-ablity.factory';

@Module({
  providers: [CaslAblityFactory],
  exports: [CaslAblityFactory],
})
export class CaslModule {}
