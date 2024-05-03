import { BodyTokenType } from '@/auth/jwt.strategy'
import { CurrentUser } from '@/decorators/current-user-decorator'
import { PrismaService } from '@/prisma/prisma.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { z } from 'zod'
import { ZodValidationPipe } from './pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const validationBodyPipe = new ZodValidationPipe(createQuestionBodySchema)

type createQuestionBodyRequest = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(validationBodyPipe) body: createQuestionBodyRequest,
    @CurrentUser() user: BodyTokenType,
  ) {
    const { title, content } = body
    const authorId = user.sub
    const slug = this.convertToSlug(title)
    await this.prisma.question.create({
      data: {
        authorId,
        title,
        content,
        slug,
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
