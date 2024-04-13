import React, { useState, useEffect, useRef } from 'react'
import { AiOutlineUserAdd, AiOutlineClose } from 'react-icons/ai'
import { useTheme } from '~/components/Theme/themeContext'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { HiLink } from 'react-icons/hi'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'
import { WorkspaceApiRTQ } from '~/api'
import WorkspaceInfo from './WorkspaceInfo'
interface InviteFormProps {
  workspace: Workspace | undefined
}
const InviteForm: React.FC<InviteFormProps> = ({ workspace }) => {
  const { colors, darkMode } = useTheme()
  const [inviteMember2Workspace] = WorkspaceApiRTQ.WorkspaceApiSlice.useInviteMember2WorkspaceMutation()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedEmail, setSelectedEmail] = useState<string[]>([])
  const [selectedEmailName, setSelectedEmailName] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [originalEmails, setOriginalEmails] = useState<string[]>(['123@gmail.com', '456@gmail.com', '457@gmail.com'])
  const [filteredEmails, setFilteredEmails] = useState<string[]>(originalEmails)
  const [textFocus, setTextFocus] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const containerRef_Form = useRef<HTMLDivElement>(null)
  const [linkToCopy, setLinkToCopy] = useState<string>('Link abcxyz')
  const [copied, setCopied] = useState(false)
  const [workspaceInfo, setWorkspaceInfo] = useState<Workspace | undefined>()
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Notification disappears after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  useEffect(() => {
    setWorkspaceInfo(workspace)
  }, [workspace])
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setTextFocus(false)
      }
    }
    const handleClickOutside_Form = (event: MouseEvent) => {
      if (containerRef_Form.current && !containerRef_Form.current.contains(event.target as Node)) {
        setIsVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('mousedown', handleClickOutside_Form)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('mousedown', handleClickOutside_Form)
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setSearchTerm(value)

    // Filter emails based on the search term before the "@" symbol
    const filtered = originalEmails.filter((email) => email.split('@')[0].toLowerCase().includes(value.toLowerCase()))

    setFilteredEmails(filtered)
  }

  const handleEmailSelect = (email: string) => {
    setSelectedEmail([...selectedEmail, email]) // Only the part before "@"
    setSearchTerm('') // Set search term to show the selected email
  }

  const handleClearEmail = (index: number) => {
    setSelectedEmail((prev) => {
      const updatedSelectedEmail = [...prev] // Create a copy of selectedEmail
      updatedSelectedEmail.splice(index, 1) // Remove the element at the specified index
      return updatedSelectedEmail // Return the updated array
    })
  }
  const handleSendInvite = () => {
    // Implement send invite functionality here
    // You can use selectedEmail to send the invite
    console.log('Sending invite to:', selectedEmail)
    const members = selectedEmail.map((email) => ({
      role: 'member',
      email: email,
      status: 'member' // or you can omit this property if it's optional
    }))

    if (workspaceInfo)
      inviteMember2Workspace({
        id: workspaceInfo?._id,
        members: members
      })
    // Reset states or close the form after sending the invite
    setSelectedEmail([])
  }

  return (
    <div>
      <button
        onClick={() => setIsVisible(true)}
        className={`absolute right-28 top-7 flex flex-row items-center space-x-1 rounded px-3 py-[7px] text-sm font-semibold ${
          darkMode ? 'bg-[#579dff] text-gray-700 hover:bg-[#7bb0f9]' : 'bg-[#0c66e4] text-white hover:bg-[#0e5bc7]'
        }`}
      >
        <AiOutlineUserAdd
          className={` font-semibold ${darkMode ? 'bg-[#579dff] text-gray-700 ' : 'bg-[#0c66e4] text-white '}`}
        />
        <p>Invite Workspace members</p>
      </button>
      {isVisible && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 '>
          <div
            style={{
              backgroundColor: colors.background,
              color: colors.text
            }}
            className='relative w-[600px] rounded-lg p-5 shadow-lg'
            ref={containerRef_Form}
          >
            <div className={`mb-5 flex flex-row items-center `}>
              <h1 className={`text-xl`}>Invite to Workspace</h1>
              {copied && (
                <div
                  className={`ml-5 inline-flex items-center space-x-2 rounded-2xl px-2 py-[4px] ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'} `}
                >
                  <FaRegCircleCheck size={`20px`} />
                  <p className={` text-sm`}>Link copied to clipboard</p>
                </div>
              )}

              <div className='absolute right-5 top-0 mt-4 '>
                <button onClick={() => setIsVisible(false)}>
                  <AiOutlineClose className='rounded-md p-1  hover:bg-gray-300' size={`30px`} />
                </button>
              </div>
            </div>
            <div ref={containerRef} className='mb-2 flex flex-row  justify-between '>
              <div className={`relative w-full`}>
                <div
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text
                  }}
                  onClick={() => setTextFocus(true)}
                  className={`flex flex-row rounded-sm border-[3px] py-2 ${selectedEmail ? 'w-full' : 'w-full'}  ${
                    darkMode
                      ? textFocus
                        ? ' border-blue-400 '
                        : 'border-[#738496]'
                      : textFocus
                        ? ' border-blue-400 '
                        : 'border-[#9da6b5]'
                  } p-1 px-2 `}
                >
                  {selectedEmail &&
                    selectedEmail.map((email, index) => (
                      <div
                        style={{ color: colors.text }}
                        className={` mr-2 flex flex-row items-center justify-center rounded-md px-2 text-sm ${darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'} `}
                      >
                        <p className='pr-2'>{email.split('@')[0] + ''}</p>
                        <button
                          key={index}
                          onClick={() => handleClearEmail(index)}
                          className={`m-0 p-0 text-center hover:text-blue-500 hover:underline`}
                        >
                          <p className={``}>X</p>
                        </button>
                      </div>
                    ))}
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text
                    }}
                    className={`w-full text-sm focus:border-0 focus:outline-none`}
                    onClick={() => setTextFocus(true)}
                    placeholder={` ${selectedEmail ? (selectedEmail.length === 0 ? 'Email address or name' : '') : ''} `}
                  />
                </div>
                {searchTerm && textFocus && (
                  <div
                    style={{
                      color: colors.text
                    }}
                    className={`${darkMode ? 'border-gray-700 bg-[#282e33]' : 'border-gray-50 bg-white'} absolute top-full z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-md border shadow-md `}
                  >
                    {filteredEmails ? (
                      filteredEmails.map((email, index) => (
                        <div
                          key={email}
                          className={`flex cursor-pointer flex-row items-center px-3 py-2 ${index === 0 ? 'mt-0' : 'mt-1'} ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-[#dcdfe4]'} `}
                          onClick={() => handleEmailSelect(email)}
                        >
                          <div
                            className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 pl-[1px] text-white`}
                          >
                            TT
                          </div>
                          <div>{email}</div>
                        </div>
                      ))
                    ) : (
                      <div className={`p-2`}>
                        <p>Looks like that person isn't a Trello member yet. Add their email address to invite them</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {selectedEmail && selectedEmail.length > 0 && (
                <button
                  onClick={handleSendInvite}
                  className={`m-0 ml-2 w-32  rounded px-2 py-2 text-sm font-semibold ${
                    darkMode
                      ? 'bg-[#579dff] text-gray-700 hover:bg-[#7bb0f9]'
                      : 'bg-[#0c66e4] text-white hover:bg-[#0e5bc7]'
                  }`}
                >
                  Send invite
                </button>
              )}
            </div>
            {isLoading && <div>Loading...</div>}

            {selectedEmail && selectedEmail.length > 0 && (
              <textarea
                style={{
                  backgroundColor: colors.background,
                  color: colors.text
                }}
                id='description'
                rows={3}
                placeholder='Join this Trello Workspace to start collaborating with me!'
                className={`w-full resize-none rounded-sm border-[3px] placeholder:text-sm  ${
                  darkMode ? 'border-[#738496]' : 'border-[#9da6b5]'
                } p-1 px-2 focus:border-[3px] focus:border-blue-400 focus:outline-none`}
              />
            )}
            <div className={`mt-5 flex flex-row items-center justify-between text-sm`}>
              <div>
                <p>Invite someone to this Workspace with a link:</p>
                {linkToCopy && linkToCopy.length > 0 && (
                  <p
                    style={{
                      color: colors.add_card
                    }}
                    onClick={() => setLinkToCopy('')}
                    className={`w-fit cursor-pointer text-[12px] font-semibold  hover:underline`}
                  >
                    Disable link{' '}
                  </p>
                )}
              </div>
              <div>
                {linkToCopy ? (
                  <button
                    className={`flex items-center rounded px-3 py-2 ${
                      darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                    } `}
                    onClick={() => copyToClipboard(linkToCopy)}
                  >
                    <div style={{ color: colors.text }} className={`inline-flex items-center space-x-3 font-semibold`}>
                      <HiLink />
                      <p>Copy link</p>
                    </div>
                  </button>
                ) : (
                  <button
                    className={`flex items-center rounded px-3 py-2 ${
                      darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                    } `}
                    onClick={() => {
                      setLinkToCopy('Link abcxyz')
                      copyToClipboard('Link abcxyz')
                    }}
                  >
                    <div style={{ color: colors.text }} className={`inline-flex items-center space-x-3 font-semibold`}>
                      <HiLink />
                      <p>Create Link</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InviteForm
