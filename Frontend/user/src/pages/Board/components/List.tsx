import { UniqueIdentifier } from '@dnd-kit/core'
import { CardComponent, ListSetting } from '.'
import { ListComponentProps } from '../type'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef, useState } from 'react'
// import { useEffect, useState } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { IoMdClose } from 'react-icons/io'
import { IoImagesOutline } from 'react-icons/io5'
import { useTheme } from '~/components/Theme/themeContext'
// import { createCardAPI } from '~/api/Card'
import { CardApiRTQ, CardlistApiRTQ } from '~/api'
import { TrelloApi } from '@trello-v2/shared'
import { board_id } from '~/api/getInfo'
export default function ListComponent({
  list,
  index,
  cardSelected,
  maxHeight,
  setOpenCardSetting,
  setResetManually,
  resetManually
}: ListComponentProps) {
  const [createCard] = CardApiRTQ.CardApiSlice.useCreateCardMutation()
  const [updateCardList] = CardlistApiRTQ.CardListApiSlice.useUpdateCardListMutation()
  // const [getAllCardlist] = CardlistApiRTQ.CardListApiSlice.useLazyGetAllCardlistQuery()
  const [getCardListByBoardId, { data: cardlistDataByBoardId }] =
    CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const { colors, darkMode } = useTheme()
  const [listSettingOpen, setListSettingOpen] = useState<string>()
  const [addCardOpenAt, setAddCardOpenAt] = useState<string>('')
  const [listName, setListName] = useState({ name: '', list_id: '' })
  const componentRef_AddCard = useRef<HTMLDivElement>(null)
  const componentRef_ListSetting = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside_AddCard = (event: MouseEvent) => {
      if (componentRef_AddCard.current && !componentRef_AddCard.current.contains(event.target as Node)) {
        // Clicked outside of Component A, hide it
        setAddCardOpenAt('')
        setNewCardName('')
      }
    }

    const handleClickOutside_ListSetting = (event: MouseEvent) => {
      if (componentRef_ListSetting.current && !componentRef_ListSetting.current.contains(event.target as Node)) {
        // Clicked outside of Component A, hide it
        setListSettingOpen('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside_AddCard)
    document.addEventListener('mousedown', handleClickOutside_ListSetting)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside_AddCard)
      document.removeEventListener('mousedown', handleClickOutside_ListSetting)
    }
  }, [])
  const [inputValue, setInputValue] = useState<string>('')
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
  const [editName, setEditName] = useState<boolean>(false)
  useEffect(() => {
    setInputValue(list.name)
  }, [list])
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleInputBlur = () => {
    // If the input is blurred without any changes, revert to list name
    if (!inputValue.trim() || inputValue === list.name) {
      setInputValue(list.name)
    }
    updateCardList({
      _id: list._id,
      index: list.index || undefined,
      name: inputValue,
      archive_at: new Date()
    }).then(() => {
      getCardListByBoardId({ id: board_id })
    })
    setResetManually(!resetManually)
    setEditName(false)
    setIsInputFocused(false)
  }

  const handleInputFocus = () => {
    setIsInputFocused(true)
  }
  const [newCardName, setNewCardName] = useState<string>('')
  async function addCard() {
    const index = list.cards.length == 1 && list.cards[0].placeHolder ? 0 : list.cards.length
    console.log(list.cards.length)
    createCard({
      name: newCardName,
      cardlist_id: list._id,
      index: index
    }).then(() => {
      setAddCardOpenAt('')
      setNewCardName('')
      getCardListByBoardId({ id: board_id })
    })
  }
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: list._id,
    data: { ...list }
  })
  const [isHovered, setIsHovered] = useState(false)
  const styleList = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    height: '100%',
    backgroundColor: darkMode ? 'black' : '#f1f2f6',
    color: colors.text,
    minHeight: `${maxHeight}px`
    // maxHeight: `${maxHeight > 590 ? 590 : maxHeight}px`
  }

  return (
    <div
      ref={setNodeRef}
      style={styleList}
      className={`relative mr-2 flex h-fit w-[300px] max-w-[300px] flex-col rounded-xl border pt-1 shadow-sm`}
      {...attributes}
      {...listeners}
    >
      <div className=' relative my-1 ml-4 mr-6 flex flex-row items-center justify-between'>
        {!editName ? (
          <h2
            onClick={() => setEditName(true)}
            className={`-ml-1 w-11/12 rounded-md border-[3px]  px-2 py-1 font-bold ${darkMode ? 'border-black' : 'border-[#f1f2f6]'}  `}
          >
            {list.name}
          </h2>
        ) : (
          <input
            style={{
              backgroundColor: colors.background,
              color: colors.text
            }}
            className={`-ml-1 w-11/12 rounded-lg border-[3px] px-2 py-1 font-bold ${darkMode ? 'border-black' : 'border-[#f1f2f6]'}  focus:border-[3px] focus:border-blue-400 focus:outline-none`}
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
          />
        )}

        <HiOutlineDotsHorizontal
          size={'20px'}
          className={` top-50 absolute right-0 rounded-lg   ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
          onClick={() => setListSettingOpen(list._id)}
        />
      </div>
      <div className={`relative max-h-[580px]  overscroll-contain`}>
        {listSettingOpen && listSettingOpen === list._id && (
          <div ref={componentRef_ListSetting}>
            <ListSetting closeListSetting={() => setListSettingOpen('')} />
          </div>
        )}
        <div className={`my-1`}>
          <SortableContext
            items={list.cards.map((c) => c._id) as (UniqueIdentifier | { id: UniqueIdentifier })[]}
            strategy={verticalListSortingStrategy}
          >
            <div className={`space-y-[10px] `}>
              {list.cards &&
                list.cards.map((card, index) => (
                  <CardComponent
                    cardSelected={cardSelected}
                    key={index}
                    card={card}
                    setOpenCardSetting={setOpenCardSetting}
                  />
                ))}
            </div>
          </SortableContext>
        </div>
        {addCardOpenAt &&
          addCardOpenAt === list._id &&
          (list.cards[0].placeHolder === false ? (
            <div ref={componentRef_AddCard} className='mx-3'>
              <div className={` mt-[10px] rounded-xl  ${darkMode ? `` : ' shadow-sm shadow-gray-300'} `}>
                <div className={`flex flex-row items-center   justify-between`}>
                  <input
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text
                    }}
                    className={` h-full w-full rounded-lg px-2 pb-8 pt-2 text-left focus:border-0 focus:outline-none focus:ring-0 `}
                    placeholder='Enter the title for this card...'
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    autoFocus
                  ></input>
                </div>
              </div>
              <div className={`mb-1 mt-[10px] flex flex-row space-x-2`}>
                <button
                  style={{
                    backgroundColor: !isHovered ? colors.add_card : colors.add_card_hover,
                    color: darkMode ? 'black' : 'white'
                  }}
                  className=' rounded   bg-blue-600 px-3 py-2 hover:bg-blue-700'
                  onClick={() => {
                    if (list._id) setAddCardOpenAt(list._id)
                    addCard()
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <p className={`text-left ${darkMode ? '' : 'font-semibold'}`}> Add card</p>
                </button>
                <button
                  className={` rounded-lg px-3 py-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                  onClick={() => {
                    setAddCardOpenAt('')
                    setNewCardName('')
                  }}
                >
                  <p className={`text-left font-semibold`}>
                    {' '}
                    <IoMdClose className={``} size={'20px'} />{' '}
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div ref={componentRef_AddCard} className=' mx-3 -mt-3 '>
              <div className={` space-y-2 rounded-xl  ${darkMode ? `` : ' shadow-sm shadow-gray-300'} `}>
                <div className={`flex flex-row items-center   justify-between`}>
                  <input
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text
                    }}
                    className={` h-full w-full rounded-lg px-2 pb-8 pt-2 text-left focus:border-0 focus:outline-none focus:ring-0 `}
                    placeholder='Enter the title for this card...'
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    autoFocus
                  ></input>
                </div>
              </div>
              <div className={`mb-1 mt-[10px] flex flex-row space-x-2`}>
                <button
                  style={{
                    backgroundColor: !isHovered ? colors.add_card : colors.add_card_hover,
                    color: darkMode ? 'black' : 'white'
                  }}
                  className=' rounded   bg-blue-600 px-3 py-2 hover:bg-blue-700'
                  onClick={() => {
                    if (list._id) setAddCardOpenAt(list._id)
                    addCard()
                  }}
                >
                  <p className={`text-left ${darkMode ? '' : 'font-semibold'}`}> Add card</p>
                </button>
                <button
                  className={` rounded-lg px-3 py-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                  onClick={() => {
                    setAddCardOpenAt('')
                    setNewCardName('')
                  }}
                >
                  <p className={`text-left font-semibold `}>
                    {' '}
                    <IoMdClose className={``} size={'20px'} />{' '}
                  </p>
                </button>
              </div>
            </div>
          ))}
      </div>
      {!addCardOpenAt && (
        <div className={`mx-3 my-2 flex flex-row space-x-2`}>
          <button
            className={`w-10/12 rounded-lg p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
            onClick={() => {
              setAddCardOpenAt(list._id)
            }}
          >
            <p className={`text-left font-semibold `}>+ Add a card</p>
          </button>
          <button
            className={` content-center rounded-lg p-2 text-center  ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
          >
            <IoImagesOutline className={`text-center`} />
          </button>
        </div>
      )}
      {/* {index !== 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', height: '200px', zIndex: 50 }}>
        
        </div>
      )} */}
    </div>
  )
}
