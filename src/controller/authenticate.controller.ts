import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from './pipes/zod-validation-pipe'

const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthRequestBody = z.infer<typeof authBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async handle(@Body() body: AuthRequestBody) {
    const { email, password } = body

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials were not found')
    }

    const validePass = await compare(password, user.password)

    if (!validePass) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return {
      access_token: accessToken,
    }
  }
}
