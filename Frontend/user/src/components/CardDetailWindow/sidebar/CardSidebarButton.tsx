import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faSquareCheck,
  faTag,
  faUser,
  faClock,
  faPaperclip,
  faGripLines,
  faArrowRight,
  faCopy,
  faBoxArchive,
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons'
import { Box } from '@mui/material'
import { useTheme } from '~/components/Theme/themeContext'

// eslint-disable-next-line react-refresh/only-export-components
export enum ButtonType {
  Members = 'Members',
  Labels = 'Labels',
  Checklists = 'Checklists',
  Dates = 'Dates',
  Attachments = 'Attachments',
  CustomFields = 'Custom Fields',
  Move = 'Move',
  Copy = 'Copy',
  Archive = 'Archive',
  UnArchive = 'Send to board'
}

// eslint-disable-next-line react-refresh/only-export-components
export const buttonTypeIconMap: Record<ButtonType, IconProp> = {
  Members: faUser,
  Labels: faTag,
  Checklists: faSquareCheck,
  Dates: faClock,
  Attachments: faPaperclip,
  'Custom Fields': faGripLines,
  Move: faArrowRight,
  Copy: faCopy,
  Archive: faBoxArchive,
  'Send to board': faRotateLeft
}

interface SidebarButtonProps {
  icon: IconProp
  title: string
  onClick: () => void
}

export function SidebarButton({ icon, title, onClick }: SidebarButtonProps) {
  const { colors } = useTheme()
  return (
    <Box
      sx={{
        width: '100%',
        height: 32,
        padding: '0px 12px 0 12px',
        color: colors.text,
        bgcolor: colors.button,
        '&:hover': {
          bgcolor: colors.button_hover
        }
      }}
      className='mb-2 flex cursor-pointer flex-row items-center justify-start gap-2 rounded'
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} style={{ width: 12 }} />
      <p className='text-sm font-semibold'>{title}</p>
    </Box>
  )
}
