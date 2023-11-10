import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const User = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user
  },
)
