import React, { useState, useRef, useEffect } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineLock, MdPublic } from 'react-icons/md'
import { useTheme } from '~/components/Theme/themeContext'
import { FaCheck } from 'react-icons/fa6'
import { WorkspaceHeader } from '../../../components/WorkspaceHeader/WorkspaceHeader'
import { WorkspaceApiRTQ } from '~/api'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'
export const Settings: React.FC = () => {
  // const image = '/src/assets/Profile/profile_img.svg'
  const { colors, darkMode } = useTheme()
  // const [visibility, setVisibility] = useState<string>('private')
  const [workspaceInfo, setWorkspaceInfo] = useState<Workspace>()
  const [getWorkspaceInfo, { data: workspaceInfoRes }] =
    WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetWorkspaceInfoQuery()
  const [changeVisibility] = WorkspaceApiRTQ.WorkspaceApiSlice.useChangeWorkspaceVisibilityMutation()
  const [deleteWorkspace] = WorkspaceApiRTQ.WorkspaceApiSlice.useDeleteWorkspaceMutation()
  const [showForm, setShowForm] = useState<boolean>(false)
  const [showDeleteWorkspaceForm, setShowDeleteWorkspaceForm] = useState<boolean>(false)
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState<string>('')
  const [resetUseStateManual, setResetUseStateManual] = useState<boolean>(false)
  useEffect(() => {
    getWorkspaceInfo({ id: '6609a3b0e9b24bc694e69cf8' }).then(() => {
      setWorkspaceInfo(workspaceInfoRes?.data)
    })
  }, [resetUseStateManual])

  const handleVisibilityChange = (newVisibility: string) => {
    changeVisibility({
      visibility: newVisibility,
      _id: workspaceInfo?._id
    }).then(() => setResetUseStateManual(!resetUseStateManual))
    setShowForm(false)
  }
  const handleDeleteWorkspace = () => {
    deleteWorkspace({
      workspace_id: workspaceInfo?._id || ''
    })
  }
  return (
    <>
      <WorkspaceHeader visibility={workspaceInfo?.visibility} />
      <div className='mx-14 mt-10 rounded px-[10%]'>
        <div>
          <h2 className={`mb-2 text-xl font-semibold`}>Workspace settings</h2>
        </div>

        <div className='space-y-1 '>
          <div>
            <h1 className={` border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-300'}  pb-2  font-semibold `}>
              Workspace visibility
            </h1>
          </div>
          <div className={`flex w-full flex-row justify-between `}>
            <div className={`mr-2 mt-1 flex w-full flex-row space-x-1`}>
              {workspaceInfo?.visibility === 'public' ? (
                <>
                  <p className='flex flex-row'>
                    <span>
                      {' '}
                      <MdPublic className='mr-1 mt-1 p-0 text-green-500' />
                    </span>{' '}
                    Public - This Workspace is public. It's visible to anyone with the link and will show up in search
                    engines like Google. Only those invited to the Workspace can add and edit Workspace boards.
                  </p>
                </>
              ) : (
                <>
                  <p className='flex flex-row'>
                    <span>
                      {' '}
                      <MdOutlineLock className='mr-1 mt-1 p-0 text-red-500' />
                    </span>{' '}
                    Private - This Workspace is private. It's not indexed or visible to those outside the Workspace
                  </p>
                </>
              )}
            </div>
            <div className={`relative mt-1`}>
              <button
                className={`flex items-center rounded px-5 py-2 ${
                  darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
                } `}
                onClick={() => setShowForm(!showForm)}
              >
                <p style={{ color: colors.text }} className={`font-semibold`}>
                  Change
                </p>
              </button>
              {showForm && (
                <div
                  style={{
                    color: colors.text
                  }}
                  className={`${darkMode ? 'border-gray-700 bg-[#282e33]' : 'border-gray-100 bg-white'} absolute -left-5 z-10 w-80 rounded-lg border  py-2 text-sm shadow-md`}
                >
                  <div className={`mb-2 flex items-center justify-between`}>
                    <div></div>
                    <div>
                      <p className={`ml-7 font-semibold`}>Select Workspace visibility</p>
                    </div>
                    <div
                      className={`mr-2 cursor-pointer rounded-lg p-2 ${darkMode ? 'hover:bg-[#333c43]' : 'hover:bg-[#dcdfe4]'}`}
                      onClick={() => setShowForm(false)}
                    >
                      <IoMdClose className={``} size={'17px '} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleVisibilityChange('private')}
                    className={`m-0 w-full py-1 ${darkMode ? ' hover:bg-[#333c43]' : ' hover:bg-[#dcdfe4]'}`}
                  >
                    <p className='flex flex-row items-center text-start'>
                      <span>
                        {' '}
                        <MdOutlineLock className='mr-1 p-0 text-red-500' />
                      </span>{' '}
                      Private
                      {workspaceInfo?.visibility === 'private' && (
                        <>
                          <span>
                            {' '}
                            <FaCheck className='ml-2 p-0' size={`12px`} />
                          </span>{' '}
                        </>
                      )}
                    </p>
                    <p className={`text-start text-[12px]`}>
                      This Workspace is private. It's not indexed or visible to those outside the Workspace
                    </p>
                  </button>
                  <button
                    onClick={() => handleVisibilityChange('public')}
                    className={`m-0 w-full py-1  ${darkMode ? ' hover:bg-[#333c43]' : ' hover:bg-[#dcdfe4]'}`}
                  >
                    <p className='flex flex-row items-center text-start'>
                      <span>
                        {' '}
                        <MdPublic className='mr-1 p-0 text-green-500' />
                      </span>{' '}
                      Public
                      {workspaceInfo?.visibility === 'public' && (
                        <>
                          <span>
                            {' '}
                            <FaCheck className='ml-2 p-0' size={`12px`} />
                          </span>{' '}
                        </>
                      )}
                    </p>
                    <p className={`text-start text-[12px]`}>
                      Public - This Workspace is public. It's visible to anyone with the link and will show up in search
                      engines like Google. Only those invited to the Workspace can add and edit Workspace boards.
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`relative my-5 ml-1 `}>
          <h3
            onClick={() => setShowDeleteWorkspaceForm(true)}
            className={` cursor-pointer font-semibold ${darkMode ? 'text-[#f87168]' : 'text-red-600'}  hover:text-blue-600 hover:underline`}
          >
            Delete this Workspace?
          </h3>
          {showDeleteWorkspaceForm && (
            <div
              style={{
                color: colors.text
              }}
              className={` ${darkMode ? 'border-gray-700 bg-[#282e33]' : 'border-gray-100 bg-white'} absolute left-48 top-0 z-10 w-72 rounded-lg border  px-3 py-2 text-sm shadow-md`}
            >
              <div className={`mb-2 flex items-center justify-between`}>
                <div></div>
                <div>
                  <p className={`ml-7 font-semibold`}>Delete Workspace?</p>
                </div>
                <div
                  className={`mr-0 cursor-pointer rounded-lg p-2 ${darkMode ? 'hover:bg-[#333c43]' : 'hover:bg-[#dcdfe4]'}`}
                  onClick={() => setShowDeleteWorkspaceForm(false)}
                >
                  <IoMdClose className={``} size={'17px '} />
                </div>
              </div>
              <div className={`mt-3`}>
                <h1 className={`text-base font-bold`}>Enter Workspace name "My Workspace" to delete</h1>
                <p className={`my-2 text-xs font-semibold`}>Things to know</p>
                <ul className={`ml-5 list-disc space-y-2`}>
                  <li className=''>
                    {/* <GoDotFill className={`mt-1`}/> */}
                    <p>This is permanent and can't be undone</p>
                  </li>
                  <li className=''>
                    {/* <GoDotFill className={`mt-1`}/> */}
                    <p className='cursor-pointer underline'>All boards in this workspace will be closed</p>
                  </li>
                  <li className=''>
                    {/* <GoDotFill className={`mt-1`}/> */}
                    <p>Board admins can reopen boards.</p>
                  </li>
                  <li className=''>
                    {/* <GoDotFill className={`mt-1`} /> */}
                    <p>Board members will not be able to interact with closed boards</p>
                  </li>
                </ul>
                <p className={`mb-1 mt-2 text-xs font-semibold`}>Enter the Workspace name to delete</p>
                <input
                  value={deleteWorkspaceName}
                  onChange={(e) => setDeleteWorkspaceName(e.target.value)}
                  style={{
                    color: colors.text
                  }}
                  type='text'
                  className={`w-full rounded-sm border-[3px]  ${darkMode ? 'border-[#738496] bg-[#1d2125] hover:bg-opacity-70' : 'border-[#9da6b5] bg-white hover:bg-gray-50'} p-1 px-2 focus:border-[3px] focus:border-blue-400 focus:outline-none`}
                />
                <button
                  onClick={() => handleDeleteWorkspace()}
                  disabled={deleteWorkspaceName !== 'My Workspace'}
                  className={`mt-2 flex w-full items-center justify-center rounded px-5 py-2
                ${
                  deleteWorkspaceName !== 'My Workspace'
                    ? darkMode
                      ? 'cursor-not-allowed bg-gray-800 opacity-50'
                      : 'cursor-not-allowed bg-gray-100 opacity-50'
                    : darkMode
                      ? 'bg-[#f87168] text-gray-700 hover:bg-red-300'
                      : 'bg-red-600 text-white hover:bg-red-700'
                }
          `}
                >
                  <p className={`font-semibold`}>Delete Workspace</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
