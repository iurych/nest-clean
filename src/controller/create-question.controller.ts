import { Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { BodyTokenType } from 'src/auth/jwt.strategy'
import { CurrentUser } from 'src/decorators/current-user-decorator'

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor() {}

  @Post()
  async handle(@CurrentUser() user: BodyTokenType) {
    return 'ok'
  }
}
