import { Card, List, defaultCard } from '../pages/Board/type'

export function generatePlaceHolderCard(list: List) {
  const cardPlaceHolder = {
    ...defaultCard,
    _id: `${list._id}-placeHolderCard`,
    list_id: list._id,
    member_email:["123"],
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
export function formatDate(dateString: string) {
  // Format: "DD-MM-YYYY"
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export function formatDateYMD(dateString: string) {
  // Format: "YYYY-MM-DD"
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

export function formatDateTime(dateString: string) {
  // Format: "HH:MM DD-MM-YYYY"
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()

  return `${hour}:${minute} ${day}/${month}/${year} `
}

export function formatDateISO(dateString: string) {
  // Format: "YYYY-MM-DDTHH:MM:SS.SSSZ"
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return null
  }
  return date.toISOString()
}
