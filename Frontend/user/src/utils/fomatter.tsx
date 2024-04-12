import { Card, List, defaultCard } from '../pages/Board/type'

export function generatePlaceHolderCard(list: List) {
  const cardPlaceHolder = {
    ...defaultCard,
    _id: `${list._id}-placeHolderCard`,
    list_id: list._id,
    placeHolder: true
  } as Card
  return cardPlaceHolder
}
