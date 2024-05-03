import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from './pipes/zod-validation-pipe'

const CreateAccountRequestSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(5),
  })
  .required()

type CreateAccountRequest = z.infer<typeof CreateAccountRequestSchema>

@Controller('/accounts')
export class CreationAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateAccountRequestSchema))
  async handle(@Body() body: CreateAccountRequest) {
    const { name, email, password } = body

    const duplicateEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (duplicateEmail) {
      throw new ConflictException('This email is already registered')
    }

    const pwdHashed = await hash(password, 8)

    const newAccount = await this.prisma.user.create({
      data: {
        name,
        email,
        password: pwdHashed,
      },
    })

    return newAccount
  }
}
