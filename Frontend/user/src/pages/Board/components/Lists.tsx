import { useTheme } from '~/components/Theme/themeContext'
import { List, ListsComponentProps } from '../type'
import { ListComponent } from './index'
import AddListForm from './AddNewList'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { CardlistApiRTQ } from '~/api'

import { useParams } from 'react-router-dom'
import LoadingComponent from '~/components/Loading'

export default function ListsComponent({
  lists,
  setResetManually,
  cardSelected,
  setOpenCardSetting,
  resetManually
}: ListsComponentProps) {
  const [getCardListByBoardId, { data: cardlistDataByBoardId }] =
    CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const [createCardlist] = CardlistApiRTQ.CardListApiSlice.useCreateCardlistMutation()
  const { colors, darkMode } = useTheme()
  const [showAddListForm, setShowAddListForm] = useState(false)
  const [newListName, setNewListName] = useState<string>('')
  const params = useParams()
  const boardId = params.boardId
  const [listsData, setListsData] = useState<List[]>()
  // useEffect(() => {

  // }, [lists])
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
  const updateBiggestHeight = () => {
    const listComponent = document.querySelectorAll('.list-component') as NodeListOf<HTMLElement>
    let maxHeight = 0

    listComponent.forEach((card) => {
      const height = card.clientHeight
      if (height > maxHeight) {
        maxHeight = height
      }
    })
    setBiggestHeight(maxHeight)
  }
  useEffect(() => {
    // Calculate the biggest height whenever list.cards changes
    setTimeout(() => updateBiggestHeight(), 10)
    setListsData(lists.sort((a, b) => (a.index ?? Infinity) - (b.index ?? Infinity)))
    // Re-calculate biggest height when the window is resized
    window.addEventListener('resize', updateBiggestHeight)

    return () => {
      window.removeEventListener('resize', updateBiggestHeight)
    }
  }, [lists, boardId, cardlistDataByBoardId, biggestHeight])
  useEffect(() => {
    if (!cardlistDataByBoardId) getCardListByBoardId({ id: boardId })
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
    if (boardId)
      createCardlist({
        name: newListName,
        board_id: boardId,
        index: lists?.length || 0,
        watcher_email: [],
        archive_at: undefined,
        created_at: new Date()
      }).then(() => getCardListByBoardId({ id: boardId }))
  }

  return (
    <>
      {listsData ? (
        <>
          <SortableContext
            items={listsData?.map((l) => l._id) as (UniqueIdentifier | { id: UniqueIdentifier })[]}
            strategy={horizontalListSortingStrategy}
          >
            <div className='relative flex flex-row items-start p-4 '>
              {listsData?.map((list, index) => (
                <div key={index}>
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
                  className={`h-fit w-[300px] rounded-xl border bg-black bg-opacity-20 p-3 text-left font-semibold text-white hover:bg-opacity-50`}
                  onClick={handleAddListClick}
                >
                  + Add another list
                </button>
              )}
            </div>
          </SortableContext>
        </>
      ) : (
        <>
          <LoadingComponent />
        </>
      )}
    </>
  )
}
