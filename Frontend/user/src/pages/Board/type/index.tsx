import { UniqueIdentifier } from '@dnd-kit/core'
import { DbSchemas } from '@trello-v2/shared'
import faker from 'faker'
const generateRandomDateOrNull = (): Date | null => {
  const randomBoolean = Math.random() < 0.5
  return randomBoolean ? new Date() : null
}
export type Card = Omit<DbSchemas.CardlistSchema.ICard, 'placeHolder' | 'list_id' | '_id'> & {
  placeHolder: boolean
  list_id: string
  _id: string
}
export type List = Omit<DbSchemas.CardlistSchema.CardList, 'cards' | '_id'> & {
  cards: Card[]
  _id: string
}
// export interface Card {
//   id: string
//   list_id: string
//   order: number
//   name: string
//   list_name: string
//   watcher_email: Array<string>
//   placeHolder: boolean
// }
export const defaultCard = {
  _id: '',
  list_id: '',
  index: 0,
  name: '',
  cover: '',
  description: '',
  watcher_email: ['email1', 'email2'],
  archive_at: generateRandomDateOrNull(),
  activities: [
    {
      workspace_id: 'workspace1',
      content: 'Activity 1',
      board_id: 'board1',
      cardlist_id: '',
      card_id: 'card1'
    }
  ],
  features: [
    {
      _id: '',
      type: 'label',
      label_id: ''
    }
  ]
}

export interface CardComponentProps {
  card: Card
  cardSelected: (card: Card) => void | undefined
  setOpenCardSetting: (data: string) => void
}
// export interface List {
//   _id: string
//   board_id: number
//   index: number
//   name: string
//   data: Array<Card>
// }
export interface ListComponentProps {
  list: List
  index: number
  maxHeight: number
  cardSelected: (card: Card) => void | undefined
  setOpenCardSetting: (data: string) => void
  resetManually: boolean
  setResetManually: (data: boolean) => void
}
export interface ListsComponentProps {
  lists: List[]
  cardSelected: (card: Card) => void | undefined
  setOpenCardSetting: (data: string) => void
  resetManually: boolean
  setResetManually: (data: boolean) => void
}
