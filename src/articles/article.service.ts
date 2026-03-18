import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CaslAblityFactory } from 'src/casl/casl-ablity.factory';
import { Action } from 'src/common/enum';
import { AuthUser } from 'src/common/types';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private caslAbilityFactory: CaslAblityFactory,
    private userService: UsersService,
  ) {}

  async create(authorId: number) {
    const newArticle = this.articleRepository.create({ authorId });
    return await this.articleRepository.save(newArticle);
  }

  async getAll() {
    return await this.articleRepository.find();
  }

  async findOne(id: number): Promise<Article | null> {
    return await this.articleRepository.findOneBy({ id });
  }

  async findArticleWithId(id: number): Promise<Article> {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException();
    return article;
  }

  async changePublished(authUser: AuthUser, articleId: number) {
    const user = await this.userService.findUserWithUsername(authUser.username);
    const ablity = this.caslAbilityFactory.createForUser(user);
    const article = await this.findArticleWithId(articleId);

    if (ablity.cannot(Action.Update, article)) throw new ForbiddenException();

    article.isPublished = !article.isPublished;
    return await this.articleRepository.save(article);
  }

  async deleteArticle(authUser: AuthUser, articleId: number) {
    const user = await this.userService.findUserWithUsername(authUser.username);
    const ablity = this.caslAbilityFactory.createForUser(user);
    const article = await this.findArticleWithId(articleId);

    if (ablity.cannot(Action.Delete, article))
      throw new ForbiddenException(`공개상태 : ${article.isPublished}`);

    await this.articleRepository.remove(article);
    return `${article.authorId} is deleted`;
  }
}
