import { BoardLabel } from '@trello-v2/shared/src/schemas/Board'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { labelColors } from './CardLabelList'
import { Feature_CardLabel } from '@trello-v2/shared/src/schemas/Feature'

export const testBoardMembers: string[] = [
  'reactjs@gmail.com',
  'nodejs@gmail.com',
  'tailwindcss@gmail.com',
  'materialui@gmail.com',
  'restjs@gmail.com',
  'mongodb@gmail.com'
]

export const testBoardLabels: BoardLabel[] = [
  { _id: '5', color: labelColors[5], name: 'Đã hoàn thành' },
  { _id: '6', color: labelColors[6], name: 'Sắp hoàn thành' },
  { _id: '7', color: labelColors[7], name: 'Gấp' },
  { _id: '13', color: labelColors[13], name: 'Không kịp tiến độ' },
  { _id: '9', color: labelColors[9], name: '' },
  { _id: '20', color: labelColors[20], name: '' },
  { _id: '14', color: labelColors[14], name: '' }
]

export const testCardLabels: Feature_CardLabel[] = [
  { type: 'label', label_id: '5' },
  { type: 'label', label_id: '6' },
  { type: 'label', label_id: '7' },
  { type: 'label', label_id: '13' }
]

export const testCard: Card = {
  name: 'Experimental Card',
  index: 0,
  watcher_email: [],
  archive_at: null,
  activities: [],
  features: [...testCardLabels],
  cover: '',
  description: ''
}
