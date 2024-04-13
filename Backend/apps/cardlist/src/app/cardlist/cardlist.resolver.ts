import { Query, Resolver } from '@nestjs/graphql'
import { CardlistService } from './services/cardlist.service'

import { CardList } from '@trello-v2/shared/dist/src/schemas/CardList'

@Resolver()
export class CardlistResolver {
  constructor(private cardlistService: CardlistService) {}

  @Query()
  cardlists(): Promise<CardList[]> {
    return this.cardlistService.getAllCardlistGraphQL()
  }
}
