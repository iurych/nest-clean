import { Body, Controller, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

interface CreateAccountRequest {
  name: string
  email: string
  password: string
}

@Controller('/accounts')
export class CreationAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: CreateAccountRequest) {
    const { name, email, password } = body
    const newAccount = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    return newAccount
  }
}
