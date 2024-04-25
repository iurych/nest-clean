import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const CreateAccountRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
})

type CreateAccountRequest = z.infer<typeof CreateAccountRequestSchema>

@Controller('/accounts')
export class CreationAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: CreateAccountRequest) {
    const { name, email, password } = CreateAccountRequestSchema.parse(body)

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
