import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Divider, Drawer } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { useTheme } from '~/components/Theme/themeContext'
import Button from '@mui/material/Button'
import { CardApiRTQ, CardlistApiRTQ } from '~/api'
import ArCard from './ArchiveCardUI'
import { useParams } from 'react-router-dom'
import { CardList } from '@trello-v2/shared/src/schemas/CardList'

const drawerWidth = 330

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  marginTop: 12
}))

interface Props {
  open: boolean
  handleDrawerClose: () => void
}

const ArchivedItems: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const { workspaceId, boardId } = useParams()

  const { colors } = useTheme()
  const [getCardListArchiveByBoardId, { data: CardData }] =
    CardlistApiRTQ.CardListApiSlice.useLazyGetCardListArchiveByBoardIdQuery()
  const [getCardArchiveByBoardId, { data: cardArchiveData }] =
    CardApiRTQ.CardApiSlice.useLazyGetCardArchiveByBoardIdQuery()
  const [archiveItems, setArchiveItems] = useState<CardList[]>([])
  const [switchToLists, setSwitchToLists] = useState(true)

  React.useEffect(() => {
    if (boardId !== undefined) {
      getCardListArchiveByBoardId(boardId)
    }
  }, [boardId])

  React.useEffect(() => {
    if (boardId !== undefined) {
      getCardArchiveByBoardId({ board_id: boardId })
    }
    setArchiveItems(CardData?.data as unknown as CardList[])
  }, [CardData, cardArchiveData, open])

  const handleSwitchButtonClick = () => {
    setSwitchToLists((prev) => !prev)
  }

  return (
    <div style={{ position: 'absolute' }}>
      <Drawer
        sx={{
          ...(open && { width: drawerWidth }),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '53px',
            color: colors.text,
            paddingX: '20px',
            backgroundColor: colors.background
          },
          color: colors.text,
          backgroundColor: colors.background
        }}
        variant='persistent'
        anchor='right'
        open={open}
      >
        <div style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: colors.background }}>
          {/* Header */}
          <DrawerHeader>
            <span className='text- w-[100%] overflow-y-hidden rounded-md font-bold'>
              <div className='flex justify-center'>
                <h3>Archive</h3>
                <IoMdClose
                  className='absolute right-3 cursor-pointer hover:text-gray-400'
                  onClick={handleDrawerClose}
                />
              </div>
            </span>
          </DrawerHeader>
          <Divider />
          {/* Search */}
          <Box style={{ position: 'sticky', top: '53px', zIndex: 1, backgroundColor: colors.background }}>
            <input
              type='text'
              className={` mt-3 w-[160px] max-w-[90%] overflow-y-auto rounded-[3px] border-[3px] border-[#8590A2] p-1 pl-2 text-[13px] transition-all duration-100 active:scale-[0.98]`}
              placeholder='Search archive...'
              style={{ backgroundColor: colors.backgroundSecond }}
            />
            <Button
              sx={{
                width: '110px',
                height: '35px',
                fontSize: '13px',
                color: 'black',
                marginLeft: '10px',
                paddingX: '5px',
                marginTop: '4px',
                textTransform: 'none',
                backgroundColor: colors.button,
                ':hover': {
                  backgroundColor: colors.button_hover
                }
              }}
              onClick={handleSwitchButtonClick}
            >
              {switchToLists ? 'Switch to lists' : 'Switch to cards'}
            </Button>
          </Box>
        </div>
        {/* Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
          {switchToLists ? (
            cardArchiveData &&
            cardArchiveData.data &&
            cardArchiveData.data &&
            cardArchiveData.data.map((card: any, index: number) => (
              <div key={index}>
                <>
                  {card && card.archive_at.toString() !== '1970-01-01T00:00:00.000Z' && (
                    <ArCard
                      card={card}
                      switchToLists={switchToLists}
                      boardId={boardId !== undefined ? boardId : ''}
                      cardListId={card.cardlist_id}
                      key={card._id}
                    />
                  )}
                </>
              </div>
            ))
          ) : (
            <div>
              {/* Render cardlists here */}
              {archiveItems.map((cardList: any, index: number) => (
                <div key={index}>
                  {cardList.archive_at && cardList.archive_at.toString() !== '1970-01-01T00:00:00.000Z' && cardList && (
                    <ArCard
                      card={cardList}
                      switchToLists={switchToLists}
                      boardId={boardId !== undefined ? boardId : ''}
                      key={cardList.id}
                      cardListId={cardList._id}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </Box>
      </Drawer>
    </div>
  )
}

export default ArchivedItems
