import { useTheme } from '~/components/Theme/themeContext'
import { ListsComponentProps } from '../type'
import { ListComponent } from './index'
import AddListForm from './AddNewList'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { CardlistApiRTQ } from '~/api'
import { board_id } from '~/api/getInfo'

export default function ListsComponent({
  lists,
  setResetManually,
  cardSelected,
  setOpenCardSetting,
  resetManually
}: ListsComponentProps) {
  const [getAllCardlist, { data: cardlistData }] = CardlistApiRTQ.CardListApiSlice.useLazyGetAllCardlistQuery()
  const [getCardListByBoardId, { data: cardlistDataByBoardId }] =
    CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const [createCardlist] = CardlistApiRTQ.CardListApiSlice.useCreateCardlistMutation()
  const { colors, darkMode } = useTheme()
  const [showAddListForm, setShowAddListForm] = useState(false)
  const [newListName, setNewListName] = useState<string>('')
  const handleAddListClick = () => {
    setShowAddListForm(true)
  }
  const listFormRef = useRef<HTMLDivElement>(null)
  const handleClickOutside = (event: MouseEvent) => {
    if (listFormRef.current && !listFormRef.current.contains(event.target as Node)) {
      // Clicked outside of ListForm, turn back to the button
      setShowAddListForm(false)
      setNewListName('')
    }
  }
  const [biggestHeight, setBiggestHeight] = useState<number>(0)

  useEffect(() => {
    const updateBiggestHeight = () => {
      const listComponent = document.querySelectorAll('#list-component') as NodeListOf<HTMLElement>
      let maxHeight = 0

      listComponent.forEach((card) => {
        const height = card.clientHeight
        if (height > maxHeight) {
          maxHeight = height
        }
      })

      setBiggestHeight(maxHeight)
    }

    // Calculate the biggest height whenever list.cards changes
    updateBiggestHeight()

    // Re-calculate biggest height when the window is resized
    window.addEventListener('resize', updateBiggestHeight)

    return () => {
      window.removeEventListener('resize', updateBiggestHeight)
    }
  }, [lists])
  useEffect(() => {
    if (!cardlistDataByBoardId) getCardListByBoardId({ id: board_id })
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const handleSaveListClick = () => {
    // Implement your logic to save the new list
    createList()
    setShowAddListForm(false)
    setNewListName('')
  }
  async function createList() {
    createCardlist({
      name: newListName,
      board_id: board_id,
      index: cardlistDataByBoardId?.data.length || 0,
      watcher_email: [],
      archive_at: undefined,
      created_at: new Date()
    }).then(() => getCardListByBoardId({ id: board_id }))
    // const res = await createListAPI(data)
    // console.log(res)
  }

  return (
    <>
      <SortableContext
        items={lists?.map((l) => l._id) as (UniqueIdentifier | { id: UniqueIdentifier })[]}
        strategy={horizontalListSortingStrategy}
      >
        <div className='relative flex flex-row items-start p-4'>
          {lists?.map((list, index) => (
            <div key={index} id='list-component'>
              <ListComponent
                cardSelected={cardSelected}
                maxHeight={biggestHeight}
                index={index}
                list={list}
                resetManually={resetManually}
                setResetManually={setResetManually}
                setOpenCardSetting={setOpenCardSetting}
              />
            </div>
          ))}
          {/* <p>The maximum height of ListComponents is: {biggestHeight}px</p> */}
          {showAddListForm ? (
            <div ref={listFormRef} className={`h-[120px]`}>
              <AddListForm
                darkMode={darkMode}
                colors={colors}
                newListName={newListName}
                setShowAddListForm={setShowAddListForm}
                setNewListName={setNewListName}
                handleSaveListClick={handleSaveListClick}
              />
            </div>
          ) : (
            <button
              className={`h-fit w-[300px]   rounded-xl border bg-black bg-opacity-20 p-3 text-left font-semibold text-white`}
              onClick={handleAddListClick}
            >
              + Add another list
            </button>
          )}
        </div>
      </SortableContext>
    </>
  )
}
