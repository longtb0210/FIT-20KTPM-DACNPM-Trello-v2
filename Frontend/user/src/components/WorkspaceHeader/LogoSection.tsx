import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { SlPeople } from 'react-icons/sl'
import { useTheme } from '../Theme/themeContext'
interface LogoProps {
  name: string | undefined
}
const LogoSection: React.FC<LogoProps> = ({ name }) => {
  const [isHoverLogo, setIsHoverLogo] = useState(false)
  const [isChangeLogo, setIsChangeLogo] = useState(false)
  const [workspaceName, setWorkspacename] = useState<string>()
  const [logo, setLogo] = useState(false)
  const { darkMode, colors } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setWorkspacename(name)
  }, [name])
  const handleFileSelect = () => {
    if (fileInputRef && fileInputRef.current) fileInputRef.current.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      if (file.type.startsWith('image/')) {
        setLogo(true)
        setIsChangeLogo(false)
        setIsHoverLogo(false)
      }
    }
  }
  return (
    <>
      {workspaceName && (
        <div
          onMouseEnter={() => setIsHoverLogo(true)}
          onMouseLeave={() => setIsHoverLogo(false)}
          onClick={() => {
            if (isHoverLogo && !isChangeLogo) setIsChangeLogo(true)
          }}
          className={`${isHoverLogo ? 'cursor-pointer' : ''} relative flex h-[65px] w-[65px] items-center justify-center rounded-md          
           shadow-sm`}
          style={{
            // background: `linear-gradient(to bottom, ${stringToColor(workspaceName)}, ${stringToColor(workspaceName + '1')})`
            background: `linear-gradient(to bottom,  #E774BB, #943D73)`
          }}
        >
          <h1
            style={{
              fontWeight: 700
            }}
            className={`text-4xl font-bold`}
          >
            {workspaceName.charAt(0).toUpperCase()}
          </h1>
          {isHoverLogo && !isChangeLogo && (
            <div
              style={{
                color: darkMode ? colors.black : colors.white
              }}
              className={`absolute bottom-0 flex h-1/2 w-full items-center justify-center rounded-b-md  ${
                darkMode ? 'bg-gray-100 bg-opacity-30' : 'bg-black bg-opacity-30'
              }`}
            >
              <p className={`font-semibold underline`}>Change</p>
            </div>
          )}
          {isChangeLogo && (
            <div
              style={{
                color: colors.text
              }}
              className={`${darkMode ? 'border-gray-700 bg-[#282e33]' : 'border-gray-100 bg-white'} absolute -left-5 top-full z-10 w-72 rounded-lg border  px-3 py-2 text-sm shadow-md`}
            >
              <div className={`mb-2 flex items-center justify-between`}>
                <div></div>
                <div>
                  <p className={`ml-7 font-semibold`}>Change logo</p>
                </div>
                <div
                  className={`mr-0 cursor-pointer rounded-lg p-2 ${darkMode ? 'hover:bg-[#333c43]' : 'hover:bg-[#dcdfe4]'}`}
                  onClick={() => {
                    setIsChangeLogo(false)
                    setIsHoverLogo(false)
                  }}
                >
                  <IoMdClose className={``} size={'17px '} />
                </div>
              </div>
              <div className={`mt-3`}>
                <input type='file' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                <button
                  onClick={handleFileSelect}
                  className={`flex w-full items-center justify-center rounded px-5 py-2 ${
                    darkMode ? 'bg-[#323940] hover:bg-[#40464d]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                  } `}
                >
                  <p style={{ color: colors.text }} className={`inline-flex items-center font-semibold `}>
                    <span>
                      <SlPeople className={`mr-2`} />
                    </span>
                    Upload new photo
                  </p>
                </button>

                {logo && (
                  <button
                    onClick={() => {
                      setIsChangeLogo(false)
                      setIsHoverLogo(false)
                      setLogo(false)
                    }}
                    className={`flex  items-center justify-center rounded px-5 py-2 ${
                      darkMode ? 'bg-[#323940] hover:bg-[#40464d]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                    } `}
                  >
                    <p style={{ color: colors.text }} className={`font-semibold `}>
                      Remove logo
                    </p>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default LogoSection
