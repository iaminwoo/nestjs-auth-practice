import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from 'src/users/users.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), CaslModule, UsersModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
