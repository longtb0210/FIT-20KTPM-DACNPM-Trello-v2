// components/Activity.tsx
import React, { useEffect, useState } from 'react'
// import { activityData, workspaceData } from '../testData'
import { MdOutlineLock } from 'react-icons/md'
import { MdPublic } from 'react-icons/md'
import { RxActivityLog, RxAvatar } from 'react-icons/rx'
import { SlPeople } from 'react-icons/sl'
import { useTheme } from '~/components/Theme/themeContext'
import { User } from '@trello-v2/shared/src/schemas/User'
import { BoardApiRTQ, CardlistApiRTQ, UserApiRTQ, WorkspaceApiRTQ } from '~/api'
import { Activity } from '@trello-v2/shared/src/schemas/Activity'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'
import { Board } from '@trello-v2/shared/src/schemas/Board'
import { TabPanel } from 'react-tabs'
import { Avatar, Box, ListItem } from '@mui/material'
import { stringAvatar } from '~/utils/StringAvatar'
import { formatDate, formatDateISO, formatDateTime } from '~/utils/fomatter'
interface ActivityProps {
  userInfo: User | undefined
}
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
export const ActivityComponent: React.FC<ActivityProps> = ({ userInfo }) => {
  const { colors, darkMode } = useTheme()
  const [activity, setActivity] = useState<Activity[]>()
  const [workspace, setWorkspace] = useState<Workspace[]>()
  const [activityCount, setActivityCount] = useState<number>(3)
  const [allWorkspaceId, setAllWorkspaceId] = useState<(string | undefined)[]>([])
  const [getActivityAPI, { data: activityData }] = UserApiRTQ.UserApiSlice.useLazyGetActivitiesQuery()
  const [getAllWorkspace, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllUserWorkspaceQuery()
  const [getAllWorkspaceByEmail, { data: WorkspaceData }] =
    WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()
  const [getAllBoard, { data: boardRes }] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByWorkspaceIdQuery()
  const [allBoardData, setAllBoardData] = useState<(string | undefined)[]>([])
  const [getCardlistByBoardId] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
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
    const data = workspaceData?.data.owner.concat(
      workspaceData?.data.admin,
      workspaceData?.data.member,
      workspaceData?.data.guest
    )
    const activityData = workspaceData?.data.owner.concat(workspaceData?.data.admin, workspaceData?.data.member)
    const uniqueWorkspaces = [...new Set(data)]
    const uniqueActivityData = [...new Set(activityData)]
    const workspaceIdArray = uniqueActivityData.map((data) => data._id)

    setWorkspace(uniqueWorkspaces)
    setAllWorkspaceId(workspaceIdArray)
  }, [workspaceData])
  useEffect(() => {
    for (const w of allWorkspaceId) {
      getAllBoard({ workspaceId: w })
    }
  }, [allWorkspaceId])
  const [getboardsByWorspaceId] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByWorkspaceIdQuery()
  const [allBoards, setAllBoards] = useState<any[]>([])
  const [actData, setActivityData] = useState<Activity[]>([])
  React.useEffect(() => {
    // Kiểm tra xem có dữ liệu từ API getAllWorkspaceByEmail hay không
    if (allWorkspaceId) {
      // Duyệt qua mỗi workspace trong dữ liệu
      allWorkspaceId.forEach(async (id) => {
        // Gọi hàm API để lấy danh sách boards của từng workspace và đợi kết quả trả về
        const boardsResponse = await getboardsByWorspaceId({ workspaceId: id })
        console.log(boardsResponse.data)
        // Kiểm tra xem boardsResponse có dữ liệu hay không
        if (boardsResponse?.data?.data) {
          // Lấy danh sách boards từ kết quả trả về và chuyển đổi thành một mảng
          const boards = Object.values(boardsResponse.data.data)
          // Cập nhật danh sách boards của tất cả các workspace
          const boardIdIndex = boards.map((board) => board._id)
          setAllBoardData((prevBoards) => [...prevBoards, ...boardIdIndex])
        }
      })
    }
  }, [allWorkspaceId, getboardsByWorspaceId])
  useEffect(() => {
    if (allBoardData) {
      allBoardData.forEach(async (boardId) => {
        getCardlistByBoardId({ id: boardId }).then((response) => {
          const activities: Activity[] = []
          if (response.data !== undefined) {
            response.data.data.forEach((cardlist: { cards: any[] }) => {
              cardlist.cards.forEach((card) => {
                if (card.activities && card.activities.length > 0) {
                  activities.push(...card.activities)
                }
              })
            })
          }
          // console.log('act ', activities)
          setActivityData((prev) => [...prev, ...activities])
        })
      })
    }
  }, [getCardlistByBoardId, allBoardData])
  useEffect(() => {
    console.log('act Data: ', actData)
  }, [actData])
  function getActivity(data: Activity[], count: number) {
    if (count < data.length) return data.slice(0, count)
    else return data
  }
  function addWorkSpaceName() {
    if (activityData && activityData.data) {
      const newData = getActivity(activityData?.data, activityCount)
      // const activityDataWithWorkspaceName = newData.map((activityItem) => {
      //   const workspaceItem = workspace?.find((workspace) => workspace._id === activityItem.workspace_id)
      //   const workspaceName = workspaceItem ? workspaceItem.name : 'Unknown Workspace'

      //   return {
      //     ...activityItem,
      //     workspace_name: workspaceName
      //   }
      // })
      setActivity(newData)
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
        <div>
          {actData.length > 0 &&
            actData.map((activity, index) => (
              <div key={index} className={`mb-2 ml-[35px]`}>
                <span dangerouslySetInnerHTML={{ __html: activity.content }} />
                <div className={`flex flex-row items-center space-x-2`}>
                  <p className={`text-sm font-light  `}>At {formatDateTime(activity.create_time.toString())} </p>
                 
                </div>
              </div>
            ))}
        </div>
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
