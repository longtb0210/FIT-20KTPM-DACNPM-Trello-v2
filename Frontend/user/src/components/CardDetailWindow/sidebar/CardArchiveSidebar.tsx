import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'

interface SidebarButtonArchiveProps {
  type: ButtonType
  handleArchive: () => void
}

export function SidebarButtonArchive({ type, handleArchive }: SidebarButtonArchiveProps) {
  return (
    <Box>
      <SidebarButton
        icon={buttonTypeIconMap[type]}
        title={type}
        onClick={() => {
          handleArchive()
        }}
      />
    </Box>
  )
}
