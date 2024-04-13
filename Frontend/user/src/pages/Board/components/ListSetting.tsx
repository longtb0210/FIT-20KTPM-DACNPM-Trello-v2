import { useTheme } from '~/components/Theme/themeContext'
import { IoMdClose } from 'react-icons/io'
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { List } from '../type'
import { CardlistApiRTQ } from '~/api'
import { user_id } from '~/api/getInfo'
import { useParams } from 'react-router-dom'

interface ListSettingProps {
  closeListSetting: () => void
  setAddCardOnTop: (data: string) => void
  list: List
}
const boardChoices: string[] = ['Project Trello', 'Front-end', 'Back-end']
const listChoices: string[] = ['To do', 'Doing', 'Done', 'Week 1', 'Week 2']
const positionChoices: string[] = ['1', '2', '3', '4']
export default function ListSetting({ closeListSetting, setAddCardOnTop, list }: ListSettingProps) {
  const { colors, darkMode } = useTheme()
  const [openMoveList, setOpenMoveList] = useState<boolean>(false)
  const [openCopyList, setOpenCopyList] = useState<boolean>(false)
  const [openMoveAllCard, setOpenMoveAllCard] = useState<boolean>(false)
  const [openArchiveAllCard, setOpenArchiveAllCard] = useState<boolean>(false)
  const [showBoardOptions, setShowBoardOptions] = useState<boolean>(false)
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [showPositionOptions, setShowPositionOptions] = useState<boolean>(false)
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [value, setValue] = useState<string>(list.name)
  const [isEmpty, setIsEmpty] = useState<boolean>(false)
  // const params = useParams()
  // const board_id = params.boardId
  const [copyCardList] = CardlistApiRTQ.CardListApiSlice.useCopyCardListMutation()
  const [archiveAllCard] = CardlistApiRTQ.CardListApiSlice.useArchiveAllCardInCardListMutation()
  const [removeWatcherCardList] = CardlistApiRTQ.CardListApiSlice.useRemoveWatcherCardListMutation()
  // const [archiveCardList] = CardlistApiRTQ.CardListApiSlice.useArchiveCardListMutation()
  const [sortCardOldestOrder, { data: mydata }] = CardlistApiRTQ.CardListApiSlice.useLazySortCardOldestQuery()
  const [updateCardList] = CardlistApiRTQ.CardListApiSlice.useUpdateCardListMutation()
  const [getAllCardlistByBoardId] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const [addWatcherAPI] = CardlistApiRTQ.CardListApiSlice.useAddWatcherCardListMutation()
  const [profile, setProfile] = useState({ email: '' })

  const storedProfile = localStorage.getItem('profile')
  useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '' }
    setProfile({ ...profileSave })
  }, [storedProfile])
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setValue(newValue)
    setIsEmpty(newValue.trim() === '')
  }
  const handleSortCardOldestOrder = () => {
    sortCardOldestOrder({
      id: list._id
    }).then(() => {
      getAllCardlistByBoardId({ id: list.board_id })
    })
  }
  const handleAddWatcher = () => {
    addWatcherAPI({
      email: profile.email,
      _id: list._id
    }).then(() => {
      getAllCardlistByBoardId({ id: list.board_id })
    })
  }
  const handleCopyList = () => {
    if (isEmpty) {
      alert('Please enter list name')
    } else {
      copyCardList({
        created_by: user_id,
        _id: list._id,
        created_at: new Date()
      }).then(() => {
        getAllCardlistByBoardId({ id: list.board_id })
      })
    }
  }
  const handleBoardSelect = (option: string) => {
    setSelectedBoard(option)
    setShowBoardOptions(false)
  }
  const handlePositionSelect = (option: number) => {
    setSelectedPosition(option)
    setShowPositionOptions(false)
  }
  const handleBack = () => {
    setOpenMoveList(false)
    setOpenCopyList(false)
    setOpenMoveAllCard(false)
    setOpenArchiveAllCard(false)
  }
  const handleArchiveAllCardInCardList = () => {
    archiveAllCard({
      cardListId: list._id
    }).then(() => getAllCardlistByBoardId({ id: list.board_id }))
  }
  const handleArchiveList = () => {
    updateCardList({
      _id: list._id,
      archive_at: new Date()
    }).then(() => getAllCardlistByBoardId({ id: list.board_id }))
  }
  const handleRemoveWatcher = () => {
    removeWatcherCardList({
      _id: list._id,
      watcher: profile.email
    }).then(() => {
      getAllCardlistByBoardId({ id: list.board_id })
    })
  }
  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderWidth: '1px',
        borderColor: darkMode ? '#2c3e50' : ''
      }}
      className={`absolute -right-64 z-10 flex  w-[350px]  flex-row rounded-lg px-1 py-2  font-sans font-semibold shadow-lg`}
    >
      <div className={`relative w-full`}>
        <div className={`mb-2 flex items-center justify-between p-2`}>
          <div className={`w-[20px] p-1`}>
            {(openCopyList || openMoveList || openMoveAllCard || openArchiveAllCard) && (
              <div className='cursor-pointer rounded-lg hover:bg-gray-100' onClick={handleBack}>
                <IoIosArrowBack className={``} size={'20px'} />
              </div>
            )}
          </div>
          <div>
            <p className={` font-bold`}>
              {openCopyList && <p>Copy list</p>}
              {openMoveList && <p>Move list</p>}
              {openMoveAllCard && <p>Move all cards in this list</p>}
              {openArchiveAllCard && <p>Archive all cards in this list?</p>}
              {!openCopyList && !openMoveList && !openMoveAllCard && !openArchiveAllCard && <p>List actions</p>}
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
              value={value}
              onChange={handleChange}
            />
            <button
              className={`flex flex-row items-center space-x-1 rounded px-3 py-[7px] text-sm font-semibold ${
                darkMode
                  ? 'bg-[#579dff] text-gray-700 hover:bg-[#7bb0f9]'
                  : 'bg-[#0c66e4] text-white hover:bg-[#0e5bc7]'
              }`}
              onClick={() => {
                handleCopyList()
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
            <div>
              <div className={`mb-3  mt-1 space-y-1`}>
                <div
                  className={`relative flex cursor-pointer flex-col  justify-center rounded px-2 py-1 ${
                    darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                  }`}
                  onClick={() => setShowBoardOptions(!showBoardOptions)}
                >
                  <p className={`text-sm font-normal`}>Board</p>
                  <p className='font-semibold'>{selectedBoard ? selectedBoard : 'Select an option'}</p>
                </div>
                {showBoardOptions && (
                  <div
                    className={`absolute z-10 mt-1 w-[95%] rounded border ${darkMode ? 'border-gray-200 bg-[#282e33]' : 'border-gray-800 bg-white'}  shadow-lg transition-all`}
                  >
                    <div className={`flex cursor-pointer flex-col  justify-center  px-2 py-1`}>
                      <p className={`text-sm font-bold`}>Board</p>
                      <p
                        className={`pl-3 font-normal ${darkMode ? 'hover:bg-[#0f1214]' : ' hover:bg-[#dcdfe4]'} `}
                        onClick={() => {
                          handleBoardSelect('data')
                        }}
                      >
                        data
                      </p>
                    </div>
                  </div>
                )}
                <div
                  className={`relative flex h-auto cursor-pointer flex-col justify-center rounded px-2 py-1 ${
                    darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                  }`}
                  onClick={() => setShowPositionOptions(!showPositionOptions)}
                >
                  <p className={`text-sm font-normal`}>Position</p>
                  <p className='font-semibold'>{selectedPosition ? selectedPosition : 1}</p>
                </div>
              </div>
              {showPositionOptions && (
                <div
                  className={`absolute z-10 -mt-2 w-[95%] rounded border ${darkMode ? 'border-gray-200 bg-[#282e33]' : 'border-gray-800 bg-white'}  shadow-lg transition-all`}
                >
                  <p
                    className={`pl-1 font-normal ${darkMode ? 'hover:bg-[#0f1214]' : ' hover:bg-[#dcdfe4]'} `}
                    onClick={() => {
                      handlePositionSelect(2)
                    }}
                  >
                    2 (current)
                  </p>
                </div>
              )}
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
            </button>
          </div>
        )}
        {openMoveAllCard && (
          <div className={`relative w-full px-2`}>
            <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>To Do</button>
            <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Doing (current)</button>
          </div>
        )}
        {openArchiveAllCard && (
          <div className={`relative w-full px-2`}>
            <p className={`font-normal`}>
              This will remove all the cards in this list from the board. To view archived cards and bring them back to
              the board, click “Menu” {'>'} “Archived Items.”
            </p>
            <button
              onClick={() => {
                handleArchiveAllCardInCardList()
                handleBack()
              }}
              className={`mt-5 flex w-full items-center justify-center rounded px-5 py-[4px]
                ${darkMode ? 'bg-[#f87168] text-gray-700 hover:bg-red-300' : 'bg-red-600 text-white hover:bg-red-700'}
          `}
            >
              <p className={`font-semibold`}>Archive all</p>
            </button>
          </div>
        )}
        {!openCopyList && !openMoveList && !openMoveAllCard && !openArchiveAllCard && (
          <>
            <div>
              <button
                className={`m-0 w-full p-2 text-left hover:bg-gray-200`}
                onClick={() => {
                  setAddCardOnTop(list._id)
                  closeListSetting()
                }}
              >
                Add card
              </button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`} onClick={() => setOpenCopyList(true)}>
                Copy list
              </button>
              <button
                className={`m-0 w-full p-2 text-left hover:bg-gray-200`}
                onClick={() => {
                  setOpenMoveList(true)
                }}
              >
                Move list
              </button>
              <button
                className={`m-0 w-full p-2 text-left hover:bg-gray-200`}
                onClick={() => {
                  if (list.watcher_email.includes(profile.email)) {
                    handleRemoveWatcher()
                  } else {
                    handleAddWatcher()
                  }
                }}
              >
                Watch
              </button>
            </div>
            <div className='my-2 flex justify-center'>
              <hr className={`h-[1px] w-11/12 border-0 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></hr>
            </div>
            <div className={``}>
              <p className={`w-full p-2 text-left text-xs font-bold`}>Sort by...</p>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Dated created (newest List)</button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`} onClick={handleSortCardOldestOrder}>
                Dated created (oldest List)
              </button>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`}>Card name (alphabetically)</button>
            </div>
            <div className='my-2 flex justify-center'>
              <hr className={`h-[1px] w-11/12 border-0 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></hr>
            </div>
            <div className={``}>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`} onClick={() => setOpenMoveAllCard(true)}>
                Move all card in this list
              </button>
              <button
                className={`m-0 w-full p-2 text-left hover:bg-gray-200`}
                onClick={() => setOpenArchiveAllCard(true)}
              >
                Archive all card in this list
              </button>
            </div>
            <div className='my-2 flex justify-center'>
              <hr className={`h-[1px] w-11/12 border-0 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></hr>
            </div>
            <div className={``}>
              <button className={`m-0 w-full p-2 text-left hover:bg-gray-200`} onClick={() => handleArchiveList()}>
                Archive this list
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
