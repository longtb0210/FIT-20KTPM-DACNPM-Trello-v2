import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql'
import { CardlistService } from './services/cardlist.service'
import { DbSchemas } from '@trello-v2/shared'
import { Cardlist } from './entity/cardlist.entity'

@Resolver((of) => Cardlist)
export class CardlistResolver {
  constructor(private cardlistService: CardlistService) {}

  @Query((returns) => [Cardlist])
  cardlists(): Promise<CardList[]> {
    return this.cardlistService.getAllCardlistGraphQL()
  }
}
