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
export function createMembersArray(arrayA: string[]) {
  if (arrayA.length > 3) {
    const firstThreeElements = arrayA.slice(0, 3) // Get the first three elements of arrayA
    const restElementsCount = arrayA.length - 3 // Calculate the number of rest elements
    const fourthElement = `+ ${restElementsCount}` // Create the fourth element

    // Concatenate the first three elements and the fourth element
    const arrayB = [...firstThreeElements, fourthElement]

    return arrayB
  }
  return arrayA
}
