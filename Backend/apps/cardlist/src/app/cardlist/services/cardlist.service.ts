import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DbSchemas, TrelloApi } from '@trello-v2/shared'

export abstract class ICardlistService {
  abstract createCardlist(data: TrelloApi.CardlistApi.CreateCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList>

  abstract copyCardlist(data: TrelloApi.CardlistApi.CopyCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList>

  abstract updateCardlist(data: TrelloApi.CardlistApi.UpdateCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList>
  abstract moveCardlist(data: TrelloApi.CardlistApi.MoveCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList>
  abstract moveAllCards(data: TrelloApi.CardlistApi.MoveAllCardsRequest): Promise<DbSchemas.CardlistSchema.CardList>
  abstract getAllCardlist(): Promise<DbSchemas.CardlistSchema.CardList[]>

  abstract getAllCardlistByBoardId(board_id: string): Promise<DbSchemas.CardlistSchema.CardList[]>

  abstract getAllCardlistArchivedByBoardId(board_id: string): Promise<DbSchemas.CardlistSchema.CardList[]>

  abstract getAllCardlistNonArchivedByBoardId(board_id: string): Promise<DbSchemas.CardlistSchema.CardList[]>
  abstract sortCardlistByOldestDate(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList[]>
  abstract sortCardlistByNewestDate(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList[]>
  abstract sortCardlistByName(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList[]>

  abstract sortCardByOldestDate(board_id: string): Promise<DbSchemas.CardlistSchema.CardList>
  abstract sortCardByNewestDate(board_id: string): Promise<DbSchemas.CardlistSchema.CardList>
  abstract sortCardByName(board_id: string): Promise<DbSchemas.CardlistSchema.CardList>

  abstract archiveCardsInlist(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList>
  abstract archiveCardlist(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList>

  abstract addWatcher(data: TrelloApi.CardlistApi.AddWatcherRequest): Promise<DbSchemas.CardlistSchema.CardList>

  abstract addCardToList(data: TrelloApi.CardlistApi.AddCardToListRequest): Promise<DbSchemas.CardlistSchema.CardList>
  abstract cloneCardlistsToNewBoard(board_id_input: string, board_id_output: string): Promise<DbSchemas.CardlistSchema.CardList[]>

  abstract deleteCardlistsByBoardId(data: TrelloApi.CardlistApi.DeleteCardlistsByBoardIdRequest): Promise<{ status: string; msg: string }>
}

export class CardlistService implements ICardlistService {
  constructor(
    @InjectModel(DbSchemas.COLLECTION_NAMES[0])
    private CardlistMModel: Model<DbSchemas.CardlistSchema.CardList>,
    @InjectModel(DbSchemas.COLLECTION_NAMES[1])
    private BoardMModel: Model<DbSchemas.BoardSchema.Board>,
    @InjectModel(DbSchemas.COLLECTION_NAMES[5])
    private CardMModel: Model<DbSchemas.CardlistSchema.Card>,
  ) {}

  async createCardlist(data: TrelloApi.CardlistApi.CreateCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    const board = await this.BoardMModel.findById(data.board_id)
    if (!board) {
      // throw new NotFoundError('Board not found')
      return { status: 'Not Found', msg: `Can't find any board with id: ${data.board_id}` } as any
    }
    data.archive_at = null
    data.created_at = new Date()
    const model = new this.CardlistMModel(data)

    return model.save()
  }

  async copyCardlist(data: TrelloApi.CardlistApi.CopyCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    const existingCardList = await this.CardlistMModel.findById(data._id)
    const lengthCardlist = (await this.CardlistMModel.find({ board_id: existingCardList.board_id }).exec()).length
    if (!existingCardList) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    const watcher_list = existingCardList.watcher_email
    if (!watcher_list.includes(data.created_by)) {
      watcher_list.push(data.created_by)
    }
    const newCards = []
    for (const card of existingCardList.cards) {
      const newCard = new this.CardMModel({
        name: card.name,
        index: card.index,
        watcher_email: card.watcher_email,
        archive_at: null,
        activities: card.activities,
        features: card.features,
        cover: card.cover,
        description: card.description,
        created_at: new Date(),
      })
      await newCard.save()
      newCards.push(newCard)
    }
    const newCardList = new this.CardlistMModel({
      name: existingCardList.name,
      board_id: existingCardList.board_id,
      cards: newCards,
      watcher_email: watcher_list,
      index: lengthCardlist,
      archive_at: null,
      created_at: new Date(),
    })
    await newCardList.save()
    return await newCardList.toJSON()
  }

  async updateCardlist(data: TrelloApi.CardlistApi.UpdateCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    const cardlist = await this.CardlistMModel.findById(data._id)
    if (!cardlist) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    if (data.name) {
      cardlist.name = data.name
    }
    if (data.archive_at) {
      cardlist.archive_at = data.archive_at
    }
    if (data.index) {
      cardlist.index = data.index
    }
    return cardlist.save()
  }

  async moveCardlist(data: TrelloApi.CardlistApi.MoveCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    const cardlist = await this.CardlistMModel.findById(data._id)
    if (!cardlist) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    if (data.board_id) {
      cardlist.board_id = data.board_id
    }
    if (data.index) {
      cardlist.index = data.index
    }
    return cardlist.save()
  }

  async moveCardlistInBoard(data: TrelloApi.CardlistApi.MoveCardlistInBoardRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    const updated_cardlist = await this.CardlistMModel.findById(data._id)
    const cardlists = await this.CardlistMModel.find({ board_id: updated_cardlist.board_id }).exec()
    if (!updated_cardlist) {
      return { status: 'Not Found', msg: "Can't find any updated_cardlist" } as any
    }
    if (updated_cardlist.index < data.index) {
      for (let i = 0; i < cardlists.length; i++) {
        if (cardlists[i].index <= data.index) {
          cardlists[i].index -= 1
          await cardlists[i].save()
        }
      }
    } else if (updated_cardlist.index > data.index) {
      for (let i = 0; i < cardlists.length; i++) {
        if (cardlists[i].index >= data.index) {
          cardlists[i].index += 1
          await cardlists[i].save()
        }
      }
    }

    if (data.index) {
      updated_cardlist.index = data.index
    }
    return updated_cardlist.save()
  }

  async moveAllCards(data: TrelloApi.CardlistApi.MoveAllCardsRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    const input_cardlist = await this.CardlistMModel.findById(data.cardlist_input_id)
    const output_cardlist = await this.CardlistMModel.findById(data.cardlist_output_id)
    if (!input_cardlist || !output_cardlist) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    if (output_cardlist.cards.length == 0) {
      for (const card of input_cardlist.cards) {
        output_cardlist.cards.push(card)
      }
      input_cardlist.cards = []
      input_cardlist.save()
    } else {
      for (const card of input_cardlist.cards) {
        const updateCard = await this.CardMModel.findById(card._id).exec()
        updateCard.index = output_cardlist.cards.length
        updateCard.save()
        output_cardlist.cards.push(updateCard)
      }
      input_cardlist.cards = []
      input_cardlist.save()
    }
    await output_cardlist.save()
    return output_cardlist.toJSON()
  }

  async getAllCardlist() {
    return this.CardlistMModel.find().exec()
  }

  async getAllCardlistByBoardId(board_id: string) {
    return this.CardlistMModel.find({ board_id }).exec()
  }

  async getAllCardlistArchivedByBoardId(board_id: string) {
    return this.CardlistMModel.find({ board_id, archive_at: { $ne: null } }).exec()
  }

  async getAllCardlistNonArchivedByBoardId(board_id: string) {
    return this.CardlistMModel.find({ board_id, archive_at: null }).exec()
  }

  async sortCardlistByOldestDate(board_id: string) {
    const cardlists = await this.CardlistMModel.find({ board_id }).exec()
    cardlists.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : null
      const dateB = b.created_at ? new Date(b.created_at).getTime() : null

      if (dateA === null && dateB === null) {
        return 0
      } else if (dateA === null) {
        return -1
      } else if (dateB === null) {
        return 1
      }

      return dateA - dateB
    })
    cardlists.forEach((item, index) => {
      item.index = index
      item.save()
    })
    return cardlists
  }

  async sortCardlistByNewestDate(board_id: string) {
    const cardlists = await this.CardlistMModel.find({ board_id }).exec()
    cardlists.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : null
      const dateB = b.created_at ? new Date(b.created_at).getTime() : null

      if (dateA === null && dateB === null) {
        return 0
      } else if (dateA === null) {
        return -1
      } else if (dateB === null) {
        return 1
      }

      return dateB - dateA
    })
    cardlists.forEach((item, index) => {
      item.index = index
      item.save()
    })
    return cardlists
  }

  async sortCardlistByName(board_id: string) {
    const cardlists = await this.CardlistMModel.find({ board_id }).exec()
    cardlists.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()

      return nameA.localeCompare(nameB)
    })
    cardlists.forEach((item, index) => {
      item.index = index
    })
    cardlists.forEach((item, index) => {
      item.index = index
      item.save()
    })
    return cardlists
  }

  async sortCardByOldestDate(cardlist_id: string) {
    const cardlist = await this.CardlistMModel.findById(cardlist_id).exec()
    cardlist.cards.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : null
      const dateB = b.created_at ? new Date(b.created_at).getTime() : null

      if (dateA === null && dateB === null) {
        return 0
      } else if (dateA === null) {
        return -1
      } else if (dateB === null) {
        return 1
      }

      return dateA - dateB
    })
    for (let index = 0; index < cardlist.cards.length; index++) {
      const item = cardlist.cards[index]
      const card = await this.CardMModel.findById(item._id).exec()
      card.index = index
      item.index = index
      await card.save()
    }

    await cardlist.save()
    return cardlist
  }

  async sortCardByNewestDate(cardlist_id: string) {
    const cardlist = await this.CardlistMModel.findById(cardlist_id).exec()
    cardlist.cards.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : null
      const dateB = b.created_at ? new Date(b.created_at).getTime() : null

      if (dateA === null && dateB === null) {
        return 0
      } else if (dateA === null) {
        return -1
      } else if (dateB === null) {
        return 1
      }

      return dateB - dateA
    })
    for (let index = 0; index < cardlist.cards.length; index++) {
      const item = cardlist.cards[index]
      const card = await this.CardMModel.findById(item._id).exec()
      card.index = index
      item.index = index
      await card.save()
    }

    await cardlist.save()
    return cardlist
  }

  async sortCardByName(cardlist_id: string) {
    const cardlist = await this.CardlistMModel.findById(cardlist_id).exec()
    cardlist.cards.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()

      return nameA.localeCompare(nameB)
    })

    for (let index = 0; index < cardlist.cards.length; index++) {
      const item = cardlist.cards[index]
      const card = await this.CardMModel.findById(item._id).exec()
      card.index = index
      item.index = index
      await card.save()
    }

    await cardlist.save()
    return cardlist
  }
  async archiveCardsInlist(cardlist_id: string) {
    const cardlist = await this.CardlistMModel.findById(cardlist_id)
    const currentDate = new Date()
    if (!cardlist) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    for (let i = 0; i < cardlist.cards.length; i++) {
      const card = await this.CardMModel.findById(cardlist.cards[i]._id)
      if (!card) {
        return { status: 'Not Found', msg: "Can't find any card" } as any
      }
      card.archive_at = currentDate
      cardlist.cards[i].archive_at = currentDate
      await card.save()
      await cardlist.save()
    }
    return cardlist.save()
  }

  async archiveCardlist(cardlist_id: string) {
    const cardlist = await this.CardlistMModel.findById(cardlist_id)
    const currentDate = new Date()
    if (!cardlist) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    for (let i = 0; i < cardlist.cards.length; i++) {
      const card = await this.CardMModel.findById(cardlist.cards[i]._id)
      if (!card) {
        return { status: 'Not Found', msg: "Can't find any card" } as any
      }
      card.archive_at = currentDate
      cardlist.cards[i].archive_at = currentDate
      await card.save()
      await cardlist.save()
    }
    cardlist.archive_at = currentDate
    return cardlist.save()
  }

  async addWatcher(data: TrelloApi.CardlistApi.AddWatcherRequest) {
    const cardlist = await this.CardlistMModel.findById(data._id)
    if (!cardlist) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    if (!cardlist.watcher_email.includes(data.email)) {
      cardlist.watcher_email.push(data.email)
      return cardlist.save()
    }
    return cardlist.save()
  }
  async addCardToList(data: TrelloApi.CardlistApi.AddCardToListRequest) {
    const cardlist = await this.CardlistMModel.findById(data.cardlist_id)
    if (!cardlist) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    const card = new this.CardMModel({
      name: data.name,
      index: data.index,
      watcher_email: data.watcher_email,
      archive_at: null,
      activities: [],
      features: [],
      cover: data.cover,
      description: data.description,
      created_at: new Date(),
    })
    await card.save()
    cardlist.cards.push(card)
    return cardlist.save()
  }
  async cloneCardlistsToNewBoard(board_id_input: string, board_id_output: string): Promise<DbSchemas.CardlistSchema.CardList[]> {
    const currentDate = new Date()
    try {
      const cardlists = await this.CardlistMModel.find({ board_id: board_id_input }).exec()

      const newCardlists = await Promise.all(
        cardlists.map(async (cardlist) => {
          if (cardlist.archive_at == null) {
            const newCardlist = new this.CardlistMModel({
              name: cardlist.name,
              board_id: board_id_output,
              watcher_email: cardlist.watcher_email,
              index: cardlist.index,
              archive_at: null,
              created_at: currentDate,
              cards: [],
            })

            await newCardlist.save()

            await Promise.all(
              cardlist.cards.map(async (card) => {
                if (card.archive_at == null) {
                  const newCard = new this.CardMModel({
                    name: card.name,
                    index: card.index,
                    watcher_email: card.watcher_email,
                    archive_at: null,
                    activities: [],
                    features: [],
                    cover: card.cover,
                    description: card.description,
                    cardlist_id: newCardlist._id,
                  })

                  await newCard.save()

                  newCardlist.cards.push(newCard)

                  return newCard
                }
              }),
            )

            await newCardlist.save()

            return newCardlist
          }
        }),
      )
      return newCardlists
    } catch (error) {
      console.error('Error while cloning cardlists:', error)
      throw error
    }
  }
  async deleteCardlistsByBoardId(data: TrelloApi.CardlistApi.DeleteCardlistsByBoardIdRequest): Promise<{ status: string; msg: string }> {
    try {
      await this.CardlistMModel.deleteMany(data).exec()
      return {
        status: 'Success',
        msg: 'Cardlists deleted successfully',
      }
    } catch (error) {
      console.error('Error while deleting cardlists by board id:', error)
      throw error
    }
  }
}

export class CardlistServiceMock implements ICardlistService {
  createCardlist(data: TrelloApi.CardlistApi.CreateCardlistRequest) {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({ ...data, _id: 'Mock-id', watcher_email: [], cards: [] })
    })
  }

  copyCardlist(data: TrelloApi.CardlistApi.CopyCardlistRequest) {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        ...data,
        board_id: 'Mock-id',
        name: '',
        watcher_email: [],
        cards: [],
        archive_at: null,
      })
    })
  }

  updateCardlist(data: TrelloApi.CardlistApi.UpdateCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        ...data,
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  moveCardlist(data: TrelloApi.CardlistApi.MoveCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        ...data,
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  moveAllCards(data: TrelloApi.CardlistApi.MoveAllCardsRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        ...data,
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  getAllCardlist() {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([
        {
          _id: 'Mock-id',
          name: 'Mock-name',
          board_id: 'Mock-id',
          watcher_email: [],
          cards: [],
          archive_at: null,
          created_at: new Date(),
        },
      ])
    })
  }

  getAllCardlistByBoardId(board_id: string) {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([
        {
          _id: 'Mock-id',
          name: 'Mock-name',
          board_id: board_id,
          watcher_email: [],
          cards: [],
          archive_at: null,
          created_at: new Date(),
        },
      ])
    })
  }

  getAllCardlistArchivedByBoardId(board_id: string) {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([
        {
          _id: 'Mock-id',
          name: 'Mock-name',
          board_id: board_id,
          watcher_email: [],
          cards: [],
          archive_at: null,
          created_at: new Date(),
        },
      ])
    })
  }

  getAllCardlistNonArchivedByBoardId(board_id: string) {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([
        {
          _id: 'Mock-id',
          name: 'Mock-name',
          board_id: board_id,
          watcher_email: [],
          cards: [],
          archive_at: null,
          created_at: new Date(),
        },
      ])
    })
  }

  sortCardlistByOldestDate(board_id: string): Promise<DbSchemas.CardlistSchema.CardList[]> {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([
        {
          _id: 'Mock-id',
          name: 'Mock-name',
          board_id: board_id,
          watcher_email: [],
          cards: [],
          archive_at: null,
          created_at: new Date(),
        },
      ])
    })
  }

  sortCardlistByNewestDate(board_id: string): Promise<DbSchemas.CardlistSchema.CardList[]> {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([
        {
          _id: 'Mock-id',
          name: 'Mock-name',
          board_id: board_id,
          watcher_email: [],
          cards: [],
          archive_at: null,
          created_at: new Date(),
        },
      ])
    })
  }

  sortCardlistByName(board_id: string): Promise<DbSchemas.CardlistSchema.CardList[]> {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([
        {
          _id: 'Mock-id',
          name: 'Mock-name',
          board_id: board_id,
          watcher_email: [],
          cards: [],
          archive_at: null,
          created_at: new Date(),
        },
      ])
    })
  }

  sortCardByOldestDate(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: cardlist_id,
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  sortCardByNewestDate(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: cardlist_id,
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  sortCardByName(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: cardlist_id,
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }
  archiveCardsInlist(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: cardlist_id,
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  archiveCardlist(cardlist_id: string): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: cardlist_id,
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  addWatcher(data: TrelloApi.CardlistApi.AddWatcherRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        ...data,
        board_id: 'Mock-id',
        watcher_email: [data.email],
        cards: [],
        name: 'Mock-name',
      })
    })
  }
  addCardToList(data: TrelloApi.CardlistApi.AddCardToListRequest): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: 'Mock_id',
        board_id: 'Mock_board_id',
        index: data.index,
        name: data.name,
        cards: [],
        watcher_email: [],
        archive_at: null,
        created_at: new Date(),
      })
    })
  }

  cloneCardlistsToNewBoard(board_id_input: string, board_id_output: string): Promise<DbSchemas.CardlistSchema.CardList[]> {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([
        {
          _id: 'Mock-id',
          name: 'Mock-name',
          board_id: board_id_input ? board_id_input : board_id_output,
          watcher_email: [],
          cards: [],
          archive_at: null,
          created_at: new Date(),
        },
      ])
    })
  }
  async deleteCardlistsByBoardId(data: TrelloApi.CardlistApi.DeleteCardlistsByBoardIdRequest): Promise<{ status: string; msg: string }> {
    try {
      // Trả về một promise với thông điệp mô phỏng việc xóa thành công
      return Promise.resolve({ status: 'Success', msg: `Cardlists deleted successfully in board ${data.board_id}` })
    } catch (error) {
      // Nếu có lỗi, in ra console và throw error
      console.error('Error while deleting cardlists by board id:', error)
      throw error
    }
  }
}
