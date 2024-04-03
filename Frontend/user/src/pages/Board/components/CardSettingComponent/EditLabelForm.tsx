import React from 'react'
import { BsPencil } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { useTheme } from '~/components/Theme/themeContext'

interface LabelModalProps {
  closeOpenFeature: () => void
}

const EditLabelForm: React.FC<LabelModalProps> = ({ closeOpenFeature }) => {
  const { colors, darkMode } = useTheme()
  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderWidth: '1px',
        borderColor: darkMode ? '#2c3e50' : ''
      }}
      className={`absolute left-0 top-full z-10  flex w-[300px] flex-col items-center rounded-lg px-1   py-2  shadow-lg`}
    >
      <div className={`relative w-full`}>
        <div className={`mb-2 flex items-center justify-between p-2`}>
          <div></div>
          <div>
            <p className={`ml-7 font-bold`}>Labels</p>
          </div>
          <div className='mr-2 cursor-pointer rounded-lg p-1 hover:bg-gray-100' onClick={() => closeOpenFeature()}>
            <IoMdClose className={``} size={'20px'} />
          </div>
        </div>
      </div>
      <div className={`w-full px-2`}>
        <input
          style={{
            backgroundColor: colors.background,
            color: colors.text
          }}
          placeholder='Search labels...'
          className={`mb-2 w-full rounded border-[3px] font-normal ${
            darkMode ? 'border-[#738496]' : 'border-[#dcdfe4]'
          }  px-2 py-1 hover:bg-gray-100 focus:border-[3px] focus:border-blue-400 focus:outline-none`}
        />
        <p className={`text-sm font-normal`}>Labels</p>

        <div className={`my-3 space-y-1`}>
          {/* Checkbox items */}
          {[
            { color: '#4bce97' },
            { color: '#f5cd47' },
            { color: '#fea362' },
            { color: '#f87168' },
            { color: '#9f8fef' },
            { color: '#579dff' }
          ].map((item, index) => (
            <div className={`flex flex-row items-center justify-between `} key={index}>
              <div className={`mr-3 flex items-center justify-center`}>
                <input
                  style={{
                    color: colors.text
                  }}
                  type='checkbox'
                  className={`  h-[16px] w-[16px] rounded accent-blue-500 outline-[3px] ${
                    darkMode ? 'outline-[#738496]' : 'outline-[#9da6b5]'
                  }  `}
                />
              </div>
              <div className={`mr-1 h-[32px] w-full rounded bg-[${item.color}]`}></div>
              <div className={`flex h-8 w-10 items-center justify-center rounded-md hover:bg-gray-200`}>
                <BsPencil size={`15px`} />
              </div>
            </div>
          ))}
        </div>
        <div className={`w-full`}>
          <button
            className={`flex w-full items-center justify-center rounded px-5 py-2 ${
              darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
            } `}
          >
            <p style={{ color: colors.text }} className={`font-semibold`}>
              Create a new label
            </p>
          </button>
          <div className='my-2 flex justify-center'>
            <hr className={`h-[1px] w-full border-0 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></hr>
          </div>
          <button
            className={`flex w-full items-center justify-center rounded px-5 py-2 ${
              darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
            } `}
          >
            <p style={{ color: colors.text }} className={`font-semibold`}>
              Enable colorblind friendly mode
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLabelForm
