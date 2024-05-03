import { BodyTokenType } from '@/auth/jwt.strategy'
import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const sub = context.switchToHttp().getRequest().user as BodyTokenType

    return sub
  },
)
