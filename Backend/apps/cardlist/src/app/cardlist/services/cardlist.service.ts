import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DbSchemas, TrelloApi } from '@trello-v2/shared'

export abstract class ICardlistService {
  abstract createCardlist(data: TrelloApi.CardlistApi.CreateCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList>

  abstract copyCardlist(data: TrelloApi.CardlistApi.CopyCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList>

  abstract updateCardlist(data: TrelloApi.CardlistApi.UpdateCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList>
  abstract moveCardlist(data: TrelloApi.CardlistApi.MoveCardlistRequest): Promise<DbSchemas.CardlistSchema.CardList>
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
    if (!existingCardList) {
      return { status: 'Not Found', msg: "Can't find any cardlist" } as any
    }
    const watcher_list = existingCardList.watcher_email
    if (!watcher_list.includes(data.created_by)) {
      watcher_list.push(data.created_by)
    }
    const newCardList = new this.CardlistMModel({
      name: existingCardList.name,
      board_id: existingCardList.board_id,
      cards: existingCardList.cards,
      watcher_email: watcher_list,
      index: existingCardList.index,
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

  getAllCardlist() {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([])
    })
  }

  getAllCardlistByBoardId() {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([])
    })
  }

  getAllCardlistArchivedByBoardId() {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([])
    })
  }

  getAllCardlistNonArchivedByBoardId() {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([])
    })
  }

  sortCardlistByOldestDate(): Promise<DbSchemas.CardlistSchema.CardList[]> {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([])
    })
  }

  sortCardlistByNewestDate(): Promise<DbSchemas.CardlistSchema.CardList[]> {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([])
    })
  }

  sortCardlistByName(): Promise<DbSchemas.CardlistSchema.CardList[]> {
    return new Promise<DbSchemas.CardlistSchema.CardList[]>((res) => {
      res([])
    })
  }

  sortCardByOldestDate(): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: 'Mock cardlist-id',
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  sortCardByNewestDate(): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: 'Mock cardlist-id',
        board_id: 'Mock-id',
        watcher_email: [],
        cards: [],
        name: 'Mock-name',
      })
    })
  }

  sortCardByName(): Promise<DbSchemas.CardlistSchema.CardList> {
    return new Promise<DbSchemas.CardlistSchema.CardList>((res) => {
      res({
        _id: 'Mock cardlist-id',
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
