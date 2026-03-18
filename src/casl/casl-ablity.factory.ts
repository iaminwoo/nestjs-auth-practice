import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Article } from 'src/articles/entities/article.entity';
import { Action, Role } from 'src/common/enum';
import { User } from 'src/users/entities/user.entity';

type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAblityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === Role.Admin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
      can(Action.Update, Article, { authorId: user.id });
      can(Action.Delete, Article, { authorId: user.id });
      cannot(Action.Delete, Article, { isPublished: true });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
