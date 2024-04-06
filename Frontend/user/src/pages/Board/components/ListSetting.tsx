import { useTheme } from '~/components/Theme/themeContext'
import { IoMdClose } from 'react-icons/io'
import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Box, FormControl, Grid, MenuItem, Popover, Select, SelectChangeEvent } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faLocationDot, faXmark } from '@fortawesome/free-solid-svg-icons'

import { faFlipboard } from '@fortawesome/free-brands-svg-icons'

import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { SidebarButtonMove } from '~/components/CardDetailWindow/sidebar/CardMoveSidebar'
import { ButtonType } from '~/components/CardDetailWindow/sidebar/CardSidebarButton'
import { testCard } from '~/components/CardDetailWindow/test_data'
interface ListSettingProps {
  closeListSetting: () => void
}
const boardChoices: string[] = ['Project Trello', 'Front-end', 'Back-end']
const listChoices: string[] = ['To do', 'Doing', 'Done', 'Week 1', 'Week 2']
const positionChoices: string[] = ['1', '2', '3', '4']
export default function ListSetting({ closeListSetting }: ListSettingProps) {
  const { colors, darkMode } = useTheme()
  const [openMoveList, setOpenMoveList] = useState<boolean>(false)
  const [openCopyList, setOpenCopyList] = useState<boolean>(false)
  const menuItemFontSize = 14
  const [selectedBoard, setSelectedBoard] = useState('Project Trello')
  const [selectedList, setSelectedList] = useState('Doing')
  const [selectedPosition, setSelectedPosition] = useState('3')
  const [_currentCardState,_setCurrentCardState] = useState<Card>(testCard)
  function handleSelectBoard(event: SelectChangeEvent) {
    event.preventDefault()
    setSelectedBoard(event.target.value as string)
  }

  function handleSelectList(event: SelectChangeEvent) {
    setSelectedList(event.target.value as string)
  }

  function handleSelectPosition(event: SelectChangeEvent) {
    event.stopPropagation()
    setSelectedPosition(event.target.value as string)
  }
  const handleBack = () => {
    setOpenMoveList(false)
    setOpenCopyList(false)
  }
  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderWidth: '1px',
        borderColor: darkMode ? '#2c3e50' : ''
      }}
      className={`absolute -right-64 z-10  flex  w-[300px] flex-row rounded-lg px-1 py-2   font-sans font-semibold shadow-lg`}
    >
      <div className={`relative w-full`}>
        <div className={`mb-2 flex items-center justify-between p-2`}>
          <div className={`w-[20px] p-1`}>
            {(openCopyList || openMoveList) && (
              <div className='cursor-pointer rounded-lg hover:bg-gray-100' onClick={handleBack}>
                <IoIosArrowBack className={``} size={'20px'} />
              </div>
            )}
          </div>
          <div>
            <p className={` font-bold`}>
              {openCopyList && <p>Copy list</p>}
              {openMoveList && <p>Move list</p>}
              {!openCopyList && !openMoveList && <p>List actions</p>}
            </p>
          </div>
          <div
            className='cursor-pointer rounded-lg p-1 hover:bg-gray-100'
            onClick={() => {
              closeListSetting()
              handleBack()
            }}
          >
            <IoMdClose className={``} size={'20px'} />
          </div>
        </div>
        {openCopyList && (
          <div className={`w-full px-2`}>
            <p className={` text-sm`}>Name</p>
            <input
              style={{
                backgroundColor: colors.background,
                color: colors.text
              }}
              className={`mb-4 w-full rounded border-[3px] font-normal ${
                darkMode ? 'border-[#738496]' : 'border-[#dcdfe4]'
              }  px-2 pb-5 pt-1 hover:bg-gray-100 focus:border-[3px] focus:border-blue-400 focus:outline-none`}
            />
            <button
              className={`flex flex-row items-center space-x-1 rounded px-3 py-[7px] text-sm font-semibold ${
                darkMode
                  ? 'bg-[#579dff] text-gray-700 hover:bg-[#7bb0f9]'
                  : 'bg-[#0c66e4] text-white hover:bg-[#0e5bc7]'
              }`}
              onClick={() => {
                closeListSetting()
                handleBack()
              }}
            >
              Create list
            </button>
          </div>
        )}
        {openMoveList && (
          <div className={`relative w-full px-2`}>
            {/* <div>
              <div className={`mb-3  mt-1 space-y-1`}>
                <div
                  className={`flex cursor-pointer flex-col  justify-center rounded px-2 py-1 ${
                    darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                  }`}
                >
                  <p className={`text-sm font-normal`}>Board</p>
                  <p className='font-semibold'>My Board</p>
                </div>
                <div
                  className={`flex h-auto cursor-pointer flex-col justify-center rounded px-2 py-1 ${
                    darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                  }`}
                >
                  <p className={`text-sm font-normal`}>Position</p>
                  <p className='font-semibold'>1</p>
                </div>
              </div>
            </div>
            <button
              className={`flex flex-row items-center space-x-1 rounded px-3 py-[7px] text-sm font-semibold ${
                darkMode
                  ? 'bg-[#579dff] text-gray-700 hover:bg-[#7bb0f9]'
                  : 'bg-[#0c66e4] text-white hover:bg-[#0e5bc7]'
              }`}
              onClick={() => {
                closeListSetting()
                handleBack()
              }}
            >
              Move
            </button> */}

            {/* <Box sx={{ width: 'fit-content', height: 20, marginBottom: '4px' }} className='flex flex-row items-center'>
              <FontAwesomeIcon icon={faFlipboard} style={{ fontSize: 12 }} />
              <p style={{ marginLeft: '6px', color: colors.text }} className='text-xs font-semibold'>
                Board
              </p>
            </Box>
            <FormControl fullWidth className='flex flex-col'>
              <Box sx={{ width: '100%', height: 'fit-content' }}>
                <Select
                  sx={{
                    width: '100%',
                    height: 36,
                    margin: '0 0 8px 0',
                    fontSize: 14,
                    background: colors.background_modal,
                    color: colors.text
                  }}
                  value={selectedBoard}
                  onChange={handleSelectBoard}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 144,
                        marginTop: 8,
                        background: colors.background_modal,
                        color: colors.text
                      }
                    }
                  }}
                >
                  {boardChoices.map((choice, index) => (
                    <MenuItem key={index} value={choice} sx={{ fontSize: menuItemFontSize }}>
                      {choice}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FormControl>

            <Grid item xs={5}>
              <Box
                sx={{ width: 'fit-content', height: 20, marginBottom: '4px' }}
                className='flex flex-row items-center'
              >
                <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: 12 }} />
                <p style={{ marginLeft: '6px', color: colors.text }} className='text-xs font-semibold'>
                  Position
                </p>
              </Box>
              <FormControl fullWidth className='flex flex-col'>
                <Select
                  sx={{
                    width: '100%',
                    height: 36,
                    margin: '0 0 8px 0',
                    fontSize: 14,
                    background: colors.background_modal,
                    color: colors.text
                  }}
                  value={selectedPosition}
                  onChange={handleSelectPosition}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 144,
                        marginTop: 8,
                        background: colors.background_modal,
                        color: colors.text
                      }
                    }
                  }}
                >
                  {positionChoices.map((choice, index) => (
                    <MenuItem key={index} value={choice} sx={{ fontSize: menuItemFontSize }}>
                      {choice}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

      
            </Grid> */}
            <SidebarButtonMove
              type={ButtonType.Move}
              currentCard={_currentCardState}
              setCurrentCard={_setCurrentCardState}
            />
          </div>
        )}
        {!openCopyList && !openMoveList && (
          <>
            <div>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Add card</button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`} onClick={() => setOpenCopyList(true)}>
                Copy list
              </button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`} onClick={() => setOpenMoveList(true)}>
                Move list
              </button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Watch</button>
            </div>
            <div className='my-2 flex justify-center'>
              <hr className={`h-[1px] w-11/12 border-0 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></hr>
            </div>
            <div className={``}>
              <p className={`w-full p-2 text-left text-xs font-bold`}>Sort by...</p>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Dated created (newest List)</button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Dated created (oldest List)</button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Card name (alphabetically)</button>
            </div>
            <div className='my-2 flex justify-center'>
              <hr className={`h-[1px] w-11/12 border-0 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></hr>
            </div>
            <div className={``}>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Move all card in this list</button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Archive all card in this list</button>
            </div>
            <div className='my-2 flex justify-center'>
              <hr className={`h-[1px] w-11/12 border-0 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></hr>
            </div>
            <div className={``}>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Archive this list</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
