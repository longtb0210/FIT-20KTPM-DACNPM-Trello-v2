import { Box } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useTheme } from '../Theme/themeContext'
import CreateBoardModal from '../BoardsPage/CreateBoardModal'
import { useParams } from 'react-router-dom'

export function WorkspaceBoardsPageCardAdd() {
  const { workspaceId } = useParams()
  const { colors } = useTheme()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const [openModal, setOpenModal] = useState(false)

  function handleOpenDialog(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget)
    setOpenModal(true)
  }

  function handleCloseDialog() {
    setAnchorEl(null)
    setOpenModal(false)
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          width: 300,
          height: 96,
          padding: '8px',
          color: colors.text,
          backgroundColor: colors.button,
          '&:hover': { backgroundColor: colors.button_hover }
        }}
        className='flex cursor-pointer items-center justify-between rounded'
        onClick={(e) => handleOpenDialog(e)}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p className='text-sm font-semibold'>Create new board</p>
        </Box>
      </Box>
      {openModal && (
        <CreateBoardModal
          anchorEl={anchorEl}
          workspaceId={workspaceId!}
          isOpen={openModal}
          handleCloseDialog={handleCloseDialog}
        />
      )}
    </React.Fragment>
  )
}
