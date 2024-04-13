import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'

interface SidebarButtonUnArchiveProps {
  type: ButtonType
  handleUnArchive: () => void
}

export function SidebarButtonUnArchive({ type, handleUnArchive }: SidebarButtonUnArchiveProps) {
  return (
    <Box>
      <SidebarButton
        icon={buttonTypeIconMap[type]}
        title={type}
        onClick={() => {
          handleUnArchive()
        }}
      />
    </Box>
  )
}
