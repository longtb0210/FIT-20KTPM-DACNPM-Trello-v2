import { InjectModel } from '@nestjs/mongoose'
import { DbSchemas, TrelloApi } from '@trello-v2/shared'
import { Model } from 'mongoose'

export class CardService {
  constructor(
    @InjectModel(DbSchemas.COLLECTION_NAMES[0])
    private CardlistMModel: Model<DbSchemas.CardlistSchema.CardList>,
  ) {}

  async getAllCardsOfCardlist(data: TrelloApi.CardApi.GetCardsOfCardlistRequest) {
    const cardlist = await this.CardlistMModel.findById(data.cardlist_id, {
      'cards.activities': 0,
      'cards.features': 0,
    })
    return cardlist ? cardlist.toJSON() : null
  }

  async createCard(data: TrelloApi.CardApi.CreateCardRequest) {
    const cardlist = await this.CardlistMModel.findById(data.cardlist_id)
    if (!cardlist) return null
    cardlist.cards.push({
      name: data.name,
      index: data.index,
      watcher_email: [],
      activities: [],
      features: [],
      member_email: [],
    })
    await cardlist.save()

    const { cards } = cardlist.toJSON()
    return cards[cards.length - 1]
  }

  async getCardDetail(data: TrelloApi.CardApi.GetCardDetailRequest) {
    const cardlist = await this.CardlistMModel.findById(data.cardlist_id, {
      cards: { $elemMatch: { _id: data.card_id } },
    })
    const cardlistJson = cardlist?.toJSON()
    return cardlistJson && cardlistJson.cards.length >= 0 ? cardlistJson.cards[0] : null
  }

  async updateCardDetail(data: TrelloApi.CardApi.UpdateCardDetailRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: { $elemMatch: { _id: data.card_id } },
      },
      {
        $set: {
          ...(data.name ? { 'cards.$.name': data.name } : {}),
          ...(data.cover ? { 'cards.$.cover': data.cover } : {}),
          ...(data.description ? { 'cards.$.cover': data.description } : {}),
        },
      },
      { new: true },
    ).exec()
    if (!res) return null
    const newCard = res.toJSON().cards.find((c) => c._id?.toString() === data.card_id)
    return newCard ? newCard : null
  }

  async addFeatureToCard(data: TrelloApi.CardApi.AddCardFeatureRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: { $elemMatch: { _id: data.card_id } },
      },
      {
        $push: {
          'cards.$.features': data.feature,
        },
      },
      { new: true },
    ).exec()
    const newCard = res?.toJSON().cards.find((e) => e._id?.toString() === data.card_id)
    return newCard ? newCard.features[newCard.features.length - 1] : null
  }

  async updateFeatureOfCard(data: TrelloApi.CardApi.UpdateCardFeatureRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: {
          $elemMatch: {
            features: { $elemMatch: { _id: data.feature._id } },
          },
        },
      },
      {
        $set: {
          'cards.$[i].features.$[j]': { ...data.feature },
        },
      },
      {
        new: true,
        arrayFilters: [{ 'i._id': data.card_id }, { 'j._id': data.feature._id }],
      },
    )
    const feature = res
      ?.toJSON()
      .cards.find((e) => e._id?.toString() === data.card_id)
      ?.features.find((e) => e._id?.toString() === data.feature._id)
    return feature
  }

  async addWatcherToCard(data: TrelloApi.CardApi.AddWatcherToCardRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: { $elemMatch: { _id: data.card_id } },
      },
      {
        $push: { 'cards.$.watcher_email': data.watcher_email },
      },
      { new: true, fields: { 'cards.features': 0, 'cards.activities': 0 } },
    )
    const card = res?.toJSON().cards.find((e) => e._id?.toString() === data.card_id)
    return card ? card : null
  }

  async deleteWatcherFromCard(data: TrelloApi.CardApi.DeleteWatcherToCardRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: { $elemMatch: { _id: data.card_id } },
      },
      {
        $pullAll: {
          'cards.$.watcher_email': [data.watcher_email],
        },
      },
      { new: true, fields: { 'cards.features': 0, 'cards.activities': 0 } },
    )
    const card = res?.toJSON().cards.find((e) => e._id?.toString() === data.card_id)
    return card ? card : null
  }

  async archiveCard(data: TrelloApi.CardApi.ArchiveCardRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: { $elemMatch: { _id: data.card_id } },
      },
      { $set: { 'cards.$.archive_at': new Date().toISOString(), index: null } },
      { new: true, fields: { 'cards.features': 0, 'cards.activities': 0 } },
    )
    const card = res?.toJSON().cards.find((e) => e._id?.toString() === data.card_id)
    return card ? card : null
  }

  async unArchiveCard(data: TrelloApi.CardApi.UnArchiveCardRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: { $elemMatch: { _id: data.card_id } },
      },
      { $unset: { 'cards.$.archive_at': 1 } },
      { new: true, fields: { 'cards.features': 0, 'cards.activities': 0 } },
    )
    const card = res?.toJSON().cards.find((e) => e._id?.toString() === data.card_id)
    return card ? card : null
  }

  async moveCardSamelist(data: TrelloApi.CardApi.MoveCardSamelistRequest) {
    const cardlist = await this.CardlistMModel.findById(data.cardlist_id, {
      'cards.activities': 0,
      'cards.features': 0,
      'cards.watcher_email': 0,
      'cards.archive_at': 0,
      'cards.cover': 0,
      'cards.description': 0,
    })
    if (!cardlist) return null

    for (let i = 0; i < cardlist.cards.length; i++) {
      const id = cardlist.cards[i]._id
      if (id && typeof data.cards_data[id] === 'number') cardlist.cards[i].index = data.cards_data[id]
    }
    await cardlist.save()
    return cardlist.toJSON().cards
  }

  async moveCard({ data }: TrelloApi.CardApi.MoveCardRequest) {
    const lists = await this.CardlistMModel.find(
      {
        _id: {
          $in: !data.destination_new_list
            ? [data.source_list.cardlist_id]
            : [data.source_list.cardlist_id, data.destination_new_list.cardlist_id],
        },
      },
      {
        board_id: 0,
        name: 0,
        archive_at: 0,
        created_at: 0,
        watcher_email: 0,
        // 'cards.activities': 0,
        // 'cards.features': 0,
        // 'cards.watcher_email': 0,
        // 'cards.archive_at': 0,
        // 'cards.cover': 0,
        // 'cards.description': 0,
      },
    )

    const srcIdx = lists.findIndex((cl) => cl._id.toString() === data.source_list.cardlist_id)
    if (srcIdx < 0) return null

    const dstIdx = lists.length === 2 ? (srcIdx === 0 ? 1 : 0) : -1

    data.source_list.cards_id_index.forEach((id, index) => {
      const cardIdx = lists[srcIdx].cards.findIndex((c) => c._id.toString() === id)
      if (cardIdx < 0) return
      lists[srcIdx].cards[cardIdx].index = index
    })

    //same list
    if (dstIdx < 0) {
      lists[srcIdx].save()
      return lists.map((c) => c.toJSON())
    }

    const targetCard = lists[srcIdx].cards.find((c) => c._id.toString() === data.source_list.target_card_id)
    if (!targetCard) return null

    lists[srcIdx].cards = lists[srcIdx].cards.filter((c) => c._id.toString() !== data.source_list.target_card_id)

    lists[dstIdx].cards.push(targetCard)
    data.destination_new_list.cards_id_index.forEach((id, index) => {
      const cardIdx = lists[dstIdx].cards.findIndex((c) => c._id.toString() === id)
      if (cardIdx < 0) return
      lists[dstIdx].cards[cardIdx].index = index
    })

    lists[srcIdx].save()
    lists[dstIdx].save()
    return lists.map((c) => c.toJSON())
  }

  async deleteFeature(data: TrelloApi.CardApi.DeleteFeatureRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: {
          $elemMatch: {
            features: { $elemMatch: { _id: data.feature_id } },
          },
        },
      },
      {
        $pull: {
          'cards.$[i].features': { _id: data.feature_id },
        },
      },
      {
        new: true,
        arrayFilters: [{ 'i._id': data.card_id }],
      },
    )
    return res.toJSON().cards.find((c) => data.card_id === c._id.toString())
  }

  async addMemberToCard(creator_email: string, data: TrelloApi.CardApi.AddCardMemberRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: { $elemMatch: { _id: data.card_id } },
      },
      {
        $push: { 'cards.$.member_email': data.member_email },
      },
      { new: true, fields: { 'cards.features': 0 } },
    )
    const cardIdx = res.cards.findIndex((e) => e._id?.toString() === data.card_id)
    if (cardIdx < 0) return null
    res.cards[cardIdx].activities.push({
      content: `<b>${creator_email}</b> has add <b>${data.member_email}</b> to ${res.cards[cardIdx].name} card`,
      create_time: new Date(),
      creator_email: creator_email,
      workspace_id: 'id',
    })
    res.save()
    return res.toJSON().cards[cardIdx]
  }

  async deleteMemberToCard(data: TrelloApi.CardApi.DeleteCardMemberRequest) {
    const res = await this.CardlistMModel.findOneAndUpdate(
      {
        _id: data.cardlist_id,
        cards: { $elemMatch: { _id: data.card_id } },
      },
      {
        $pullAll: {
          'cards.$.member_email': [data.member_email],
        },
      },
      { new: true, fields: { 'cards.features': 0 } },
    )
    const card = res?.toJSON().cards.find((e) => e._id?.toString() === data.card_id)
    return card ? card : null
  }
}
