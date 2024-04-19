// ListForm.tsx
import { IoMdClose } from 'react-icons/io'

interface ListFormProps {
  darkMode: boolean
  colors: { background: string; text: string }
  newListName: string
  setShowAddListForm: React.Dispatch<React.SetStateAction<boolean>>
  setNewListName: React.Dispatch<React.SetStateAction<string>>
  handleSaveListClick: () => void
}

const AddListForm: React.FC<ListFormProps> = ({
  darkMode,
  colors,
  newListName,
  setShowAddListForm,
  setNewListName,
  handleSaveListClick
}) => {
  return (
    <div
      style={{
        backgroundColor: darkMode ? 'black' : '#f1f2f6',
        color: darkMode ? '#d2dae2' : '#2f3542'
      }}
      className={`mr-2 flex h-[110px] w-[300px]  flex-col rounded-xl border p-4 shadow-sm`}
    >
      <input
        type='text'
        value={newListName}
        placeholder='Enter list title...'
        onChange={(e) => setNewListName(e.target.value)}
        style={{
          backgroundColor: colors.background,
          color: colors.text
        }}
        className={`h-full w-full placeholder-[${colors.text}] placeholder rounded-sm px-2 py-1 text-left  focus:border-[3px] focus:border-blue-400 focus:outline-none`}
        autoFocus
      />
      <div className={`mt-3 flex flex-row space-x-2`}>
        <button className='rounded bg-blue-600 px-3 py-2 hover:bg-blue-700' onClick={handleSaveListClick}>
          <p className={`text-left font-semibold text-white`}> Add list</p>
        </button>
        <button
          className={`rounded-lg px-3 py-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
          onClick={() => {
            setShowAddListForm(false)
            setNewListName('')
          }}
        >
          <p className={`text-left font-semibold`}>
            {' '}
            <IoMdClose className={``} size={'20px'} />
          </p>
        </button>
      </div>
    </div>
  )
}

export default AddListForm
