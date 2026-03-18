import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import type { RequestWithUser } from 'src/common/types';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  createArticle(@Request() req: RequestWithUser) {
    return this.articleService.create(req.user.id);
  }

  @Get()
  getAll() {
    return this.articleService.getAll();
  }

  @Patch(':id')
  changePublished(
    @Request() req: RequestWithUser,
    @Param('id') articleId: number,
  ) {
    return this.articleService.changePublished(req.user, articleId);
  }

  @Delete(':id')
  deleteArticle(
    @Request() req: RequestWithUser,
    @Param('id') articleId: number,
  ) {
    return this.articleService.deleteArticle(req.user, articleId);
  }
}
