import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { User } from '@/infra/auth/user.decorator'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @User()
    user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBody,
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
