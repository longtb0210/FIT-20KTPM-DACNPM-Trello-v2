import React, { useEffect, useState } from 'react'
import { useTheme } from '../Theme/themeContext'
import { TrelloApi } from '@trello-v2/shared'
import { UpdateWorkspaceInfoRequest, WorspaceResponse } from '@trello-v2/shared/dist/src/api/WorkspaceApi'

interface EditFormProps {
  formData: UpdateWorkspaceInfoRequest
  setFormData: React.Dispatch<React.SetStateAction<UpdateWorkspaceInfoRequest>>
  isFormValid: boolean
  handleSaveClick: () => void
  handleCancelClick: () => void
}

const EditForm: React.FC<EditFormProps> = ({
  formData,
  setFormData,
  isFormValid,
  handleSaveClick,
  handleCancelClick
}) => {
  const { darkMode, colors } = useTheme()
  const [formDataState, setFormDataState] = useState<UpdateWorkspaceInfoRequest>()
  useEffect(() => {
    setFormDataState(formData)
  }, [formData])
  return (
    <div className='flex w-6/12 flex-col'>
      <div className='flex flex-col space-y-2'>
        <div className={`flex flex-col`}>
          <label className='text-[12px] font-bold'>
            Name<span className='text-red-500'>*</span>
          </label>
          <input
            style={{
              backgroundColor: colors.background,
              color: colors.text
            }}
            type='text'
            id='name'
            value={formDataState?.name}
            onChange={(e) => setFormData({ ...formDataState, name: e.target.value })}
            className={`rounded-sm border-[3px]  ${darkMode ? 'border-[#738496]' : 'border-[#9da6b5]'} p-1 px-2 focus:border-[3px] focus:border-blue-400 focus:outline-none`}
          />
        </div>
        <div className={`flex flex-col`}>
          <label className='text-[12px] font-bold'>
            Short name<span className='text-red-500'>*</span>
          </label>
          <input
            style={{
              backgroundColor: colors.background,
              color: colors.text
            }}
            type='text'
            id='shortName'
            value={formDataState?.short_name}
            onChange={(e) => setFormData({ ...formDataState, short_name: e.target.value })}
            className={`rounded-sm border-[3px]  ${darkMode ? 'border-[#738496]' : 'border-[#9da6b5]'} p-1 px-2 focus:border-[3px] focus:border-blue-400 focus:outline-none`}
          />
        </div>
        <div className={`flex flex-col`}>
          <label className='text-[12px] font-bold'>Website (Optional)</label>
          <input
            style={{
              backgroundColor: colors.background,
              color: colors.text
            }}
            type='text'
            id='website'
            value={formDataState?.website || ''}
            onChange={(e) => setFormData({ ...formDataState, website: e.target.value })}
            className={`rounded-sm border-[3px]  ${darkMode ? 'border-[#738496]' : 'border-[#9da6b5]'} p-1 px-2 focus:border-[3px] focus:border-blue-400 focus:outline-none`}
          />
        </div>
        <div className={`flex flex-col`}>
          <label className='text-[12px] font-bold'>Description (Optional)</label>
          <textarea
            style={{
              backgroundColor: colors.background,
              color: colors.text
            }}
            id='description'
            value={formDataState?.description || ''}
            onChange={(e) => setFormData({ ...formDataState, description: e.target.value })}
            className={`resize-y rounded-sm border-[3px]  ${darkMode ? 'border-[#738496]' : 'border-[#9da6b5]'} p-1 px-2 focus:border-[3px] focus:border-blue-400 focus:outline-none`}
          />
        </div>
      </div>

      <div className='mt-2 flex'>
        <button
          onClick={handleSaveClick}
          disabled={!isFormValid}
          className={`mr-2 rounded px-3 py-2 font-semibold ${
            !isFormValid
              ? darkMode
                ? 'cursor-not-allowed bg-gray-800 opacity-50'
                : 'bg-gray 100            cursor-not-allowed opacity-50'
              : darkMode
                ? 'bg-[#579dff] text-gray-700 hover:bg-[#7bb0f9]'
                : 'bg-[#0c66e4] text-white hover:bg-[#0e5bc7]'
          }`}
        >
          Save
        </button>
        <button
          onClick={handleCancelClick}
          className={`mr-2 rounded px-3 py-2 text-sm font-semibold ${
            darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          } `}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default EditForm
