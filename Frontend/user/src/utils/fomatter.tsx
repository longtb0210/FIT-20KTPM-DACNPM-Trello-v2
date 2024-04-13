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
export function isValidEmail(email: string) {
  // Regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Test the email against the regular expression
  return emailRegex.test(email)
}
