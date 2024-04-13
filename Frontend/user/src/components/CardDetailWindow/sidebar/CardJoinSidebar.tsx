import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'

interface SidebarButtonJoinProps {
  type: ButtonType
  handleJoinCard: () => void
}

export function SidebarButtonJoin({ type, handleJoinCard }: SidebarButtonJoinProps) {
  return (
    <Box>
      <SidebarButton
        icon={buttonTypeIconMap[type]}
        title={type}
        onClick={() => {
          handleJoinCard()
        }}
      />
    </Box>
  )
}
