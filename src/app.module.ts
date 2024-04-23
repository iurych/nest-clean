import { Module } from '@nestjs/common'
import { CreationAccountController } from './controller/create-account.controller'
import { PrismaService } from './prisma/prisma.service'

@Module({
  controllers: [CreationAccountController],
  providers: [PrismaService],
})
export class AppModule {}
