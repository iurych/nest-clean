import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { BodyTokenType } from 'src/auth/jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const sub = context.switchToHttp().getRequest().user as BodyTokenType

    return sub
  },
)
