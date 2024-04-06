// components/Activity.tsx
import React, { useEffect, useState } from 'react'
// import { activityData, workspaceData } from '../testData'
import { MdOutlineLock } from 'react-icons/md'
import { MdPublic } from 'react-icons/md'
import { RxActivityLog, RxAvatar } from 'react-icons/rx'
import { SlPeople } from 'react-icons/sl'
import { useTheme } from '~/components/Theme/themeContext'
import { User } from '@trello-v2/shared/src/schemas/User'
import { UserApiRTQ, WorkspaceApiRTQ } from '~/api'
import { Activity } from '@trello-v2/shared/src/schemas/Activity'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'
interface ActivityProps {
  userInfo: User | undefined
}
export const ActivityComponent: React.FC<ActivityProps> = ({ userInfo }) => {
  const { colors, darkMode } = useTheme()
  const [activity, setActivity] = useState<Activity[]>()
  const [workspace, setWorkspace] = useState<Workspace[]>()
  const [activityCount, setActivityCount] = useState<number>(3)
  const [workspaceAll, setWorkspaceAll] = useState<Workspace[]>()
  const [getActivityAPI, { data: activityData }] = UserApiRTQ.UserApiSlice.useLazyGetActivitiesQuery()
  const [getAllWorkspace, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllUserWorkspaceQuery()
  useEffect(() => {
    getActivityAPI({
      email: userInfo?.email || ''
    })
    addWorkSpaceName()
  }, [activityCount])
  useEffect(() => {
    getAllWorkspace()
  }, [])
  useEffect(() => {
    setWorkspace(
      workspaceData?.data.owner.concat(workspaceData?.data.admin, workspaceData?.data.member, workspaceData?.data.guest)
    )
  }, [workspaceData])
  function getActivity(data: Activity[], count: number) {
    if (count < data.length) return data.slice(0, count)
    else return data
  }
  function addWorkSpaceName() {
    if (activityData && activityData.data) {
      const newData = getActivity(activityData?.data, activityCount)
      const activityDataWithWorkspaceName = newData.map((activityItem) => {
        const workspaceItem = workspace?.find((workspace) => workspace._id === activityItem.workspace_id)
        const workspaceName = workspaceItem ? workspaceItem.name : 'Unknown Workspace'

        return {
          ...activityItem,
          workspace_name: workspaceName
        }
      })
      setActivity(activityDataWithWorkspaceName)
    }
  }
  return (
    <div className={`mx-52 mt-4 max-w-2xl p-8`}>
      <div className={`mb-10`}>
        <div className={' mb-1 flex flex-row'}>
          <SlPeople size={'20px'} className={`mr-5 mt-1`} />
          <p className={`border-b-2 ${!darkMode ? 'border-gray-300' : 'border-gray-700'} pb-2  font-semibold`}>
            Workspaces
          </p>
          <div className={`flex-grow border-b-2 ${!darkMode ? 'border-gray-300' : 'border-gray-700'} pb-2`}></div>
        </div>

        {workspace?.map((w, index) => (
          <>
            <div key={index} className={`${index === 0 ? 'mb-1' : 'my-1'} mb-1 flex flex-row`}>
              <div className={`w-[40px]`}></div>
              <div className={` flex w-full cursor-pointer flex-row items-center space-x-4  py-1 hover:bg-gray-200`}>
                <p className={`ml-2  text-sm`}>{w.name}</p>

                {w.visibility === 'public' ? (
                  <MdPublic className='text-green-500' />
                ) : (
                  <MdOutlineLock className='text-red-500' />
                )}
              </div>
            </div>
            <hr className={`ml-[40px] border-t-2 ${!darkMode ? 'border-gray-300' : 'border-gray-700'}`}></hr>
          </>
        ))}
      </div>
      <div className={`mb-10`}>
        <div className={'mb-3 flex flex-row'}>
          <RxActivityLog size={'20px'} className={`mr-5 mt-1`} />
          <p className={`border-b-2 ${!darkMode ? 'border-gray-300' : 'border-gray-700'} pb-2 text-lg font-semibold`}>
            Activity
          </p>
          <div className={`flex-grow border-b-2 ${!darkMode ? 'border-gray-300' : 'border-gray-700'} pb-2`}></div>
        </div>
        {activity?.map((a, index) => (
          <div key={index} className='my-2 pb-2'>
            <div className={`flex flex-row items-center space-x-2`}>
              {/* <img
                src={avtPath} // Replace with your avatar image source
                alt='Avatar'
                className='-ml-2 mr-1 h-9 w-9 cursor-pointer rounded-full border hover:opacity-60'
              /> */}
              <RxAvatar className={`-ml-2 mr-1 h-9 w-9 cursor-pointer rounded-full  hover:opacity-60`} />
              <div>
                <p>{a.content}</p>
                <div className={`flex flex-row items-center space-x-2`}>
                  <p className={`text-sm font-light  `}>Jan 29 at 9.00 AM. On board </p>
                  <p className={`flex cursor-pointer flex-row items-center font-semibold`}>
                    <span
                      // style={{
                      //   borderBottom: '1px solid',
                      //   borderBottomColor: colors.text
                      // }}
                      className={`underline`}
                    >
                      My Board{' '}
                    </span>{' '}
                    <MdOutlineLock className='ml-2 text-red-500' size={'15px'} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {activityCount && activityData && activityData.data && activityCount < activityData.data.length && (
          <div className='my-5 ml-16'>
            <button
              className={`rounded ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} `}
              onClick={() => setActivityCount(activityCount + 3)}
            >
              <p
                style={{
                  color: colors.text
                }}
                className={`font-semibold`}
              >
                Load more activity
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
