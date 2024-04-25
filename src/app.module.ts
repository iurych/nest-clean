import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CreationAccountController } from './controller/create-account.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CreationAccountController],
  providers: [PrismaService],
})
export class AppModule {}
