import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'

interface SidebarButtonArchiveProps {
  type: ButtonType
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export function SidebarButtonArchive({ type }: SidebarButtonArchiveProps) {
  function handleCardArchive() {
    console.log('Card archive not implemented yet.')
  }

  return (
    <Box>
      <SidebarButton
        icon={buttonTypeIconMap[type]}
        title={type}
        onClick={() => {
          handleCardArchive()
        }}
      />
    </Box>
  )
}
