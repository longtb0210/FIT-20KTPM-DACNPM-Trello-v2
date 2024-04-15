import { useSortable } from '@dnd-kit/sortable'
import { CardComponentProps } from '../type'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef, useState } from 'react'
import { BsPencil } from 'react-icons/bs'
import CardSetting from './CardSetting'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { useTheme } from '~/components/Theme/themeContext'
import randomColor from 'randomcolor'
import { CardApiRTQ, CardlistApiRTQ } from '~/api'
import { Avatar, Typography } from '@mui/material'
import { stringAvatar } from '~/utils/StringAvatar'
import { useParams } from 'react-router-dom'
import { createMembersArray, isValidEmail } from '~/utils/fomatter'
export default function CardComponent({ card, cardSelected, setOpenCardSetting }: CardComponentProps) {
  const { colors, darkMode } = useTheme()
  const [bgColorEmailWatcher, setBgColorEmailWatcher] = useState<Array<string>>([])
  const [updateCard] = CardApiRTQ.CardApiSlice.useUpdateCardMutation()
  const [editedName, setEditedName] = useState<string>() // State to track edited name
  const [profile, setProfile] = useState({ email: '', name: '' })
  const params = useParams()
  const boardId = params.boardId
  const [cardMembers, setCardMembers] = useState<string[]>([])
  const [getCardListByBoardId, { data: cardlistDataByBoardId }] =
    CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const storedProfile = localStorage.getItem('profile')

  useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    setProfile({ ...profileSave })
  }, [profile.email, storedProfile])
  useEffect(() => {
    if (card.member_email && card.member_email.length > 0) {
      const arrayMembers = createMembersArray(card.member_email)
      setCardMembers(arrayMembers)
    }
  }, [card])
  useEffect(() => {
    const bgColorCode = []
    setEditedName(card.name)
    for (let i = 0; i < card.watcher_email.length; i++) {
      const randomBgColor = randomColor({ luminosity: 'dark' })
      bgColorCode.push(randomBgColor)
    }
    setBgColorEmailWatcher(bgColorCode)
  }, [])
  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditedName(event.target.value) // Update edited name state
  }

  const { attributes, transition, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: card._id,
    data: { ...card },
    animateLayoutChanges: () => false
  })
  const styleList = {
    transform: CSS.Translate.toString(transform),
    // height: '100%',
    transition,
    opacity: isDragging ? 0.5 : undefined
    // border: isDragging ? 0.5 : undefined
  }
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered_SaveBtn, setIsHovered_SaveBtn] = useState(false)
  const [cardSettingOpen, setCardSettingOpen] = useState<string>('')
  const [isHoveredWatcher, setIsHoveredWatcher] = useState<string>()
  // const [isHoveredTextInput, setIsHoveredTextInput] = useState<boolean>(false)
  // const avtPath = '/src/assets/Profile/avt.png'

  let hoverTimeout: NodeJS.Timeout | undefined

  const handleMouseOver = (watcher: string) => {
    hoverTimeout = setTimeout(() => {
      setIsHoveredWatcher(watcher)
    }, 1) // Set the delay to 1000 milliseconds (1 second)
  }
  // useEffect(() => {
  //   if (cardSettingOpen) {
  //     document.body.classList.add('overlay-hidden')
  //   } else {
  //     document.body.classList.remove('overlay-hidden')
  //   }
  // }, [cardSettingOpen])
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout)
    setIsHoveredWatcher('')
  }
  const componentRef = useRef<HTMLDivElement>(null)
  // const cardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        // Clicked outside of Component A, hide it
        setIsHovered(false)
        setCardSettingOpen('')
        setOpenCardSetting('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  function editCardName() {
    updateCard({
      cardlist_id: card.list_id,
      card_id: card._id,
      name: editedName,
      cover: card.cover
    }).then(() => {
      setIsHovered_SaveBtn(false)
      setIsHovered(false)
      setCardSettingOpen('')
      setOpenCardSetting('')
      getCardListByBoardId({ id: boardId })
    })
  }
  return (
    <div>
      {card && !card.archive_at && (
        <div>
          {!cardSettingOpen && (
            <div ref={setNodeRef} style={styleList} {...attributes} {...listeners}>
              <div
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  border: '1px solid',
                  borderColor: isHovered ? colors.card_border : colors.background
                }}
                className={`mx-3  space-y-2 rounded-lg  p-2  ${darkMode ? `` : ' shadow-sm shadow-gray-300'} ${card.placeHolder ? 'invisible h-[40px]' : 'visible'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => cardSelected(card)}
              >
                <div className={`flex flex-row items-center justify-between`}>
                  <p className={` text-left`}>{card.name}</p>
                  {isHovered && (
                    <BsPencil
                      className=''
                      onClick={(e) => {
                        e.stopPropagation() // Prevent click event from bubbling up
                        setCardSettingOpen(card._id)
                        setOpenCardSetting(card._id)
                      }}
                    />
                  )}
                </div>
                {card &&
                  ((card.watcher_email &&
                    card.watcher_email.length > 0 &&
                    card.watcher_email.includes(profile.email)) ||
                    (card.member_email && card.member_email.length > 0)) && (
                    <div className={`flex flex-row items-center justify-between`}>
                      <div className='flex-grow'>
                        {card.watcher_email.includes(profile.email) && <MdOutlineRemoveRedEye className={``} />}
                      </div>
                      <div className={`flex flex-row items-center justify-between space-x-1`}>
                        {cardMembers &&
                          card.member_email.includes(profile.email) &&
                          cardMembers.map((member, index) => (
                            <div key={index} className={`relative z-10 flex flex-row items-center justify-center`}>
                              <div onMouseEnter={() => handleMouseOver(member)} onMouseLeave={handleMouseLeave}>
                                <Typography variant='h4' className='text-center'>
                                  <Avatar {...stringAvatar(member)} className={`font-bold`} />
                                </Typography>
                                {isHoveredWatcher && isHoveredWatcher === member && isValidEmail(member) && (
                                  <div className='absolute -bottom-10 left-2 z-20 ml-6 bg-yellow-200 p-1 text-black hover:bg-gray-100'>
                                    {member}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
          {cardSettingOpen && cardSettingOpen === card._id && (
            <div className={` pointer-events-auto relative `}>
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black color
                  zIndex: 10 // Ensure it's above other content
                }}
              ></div>
              <div ref={componentRef} className={`flex flex-col`}>
                <div
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    zIndex: 10
                  }}
                  className={`relative mx-3  ${darkMode ? `` : ' shadow-sm shadow-gray-300'} flex rounded-lg`}
                >
                  <div
                    className={` w-full space-y-2 rounded-lg   p-2  ${card.placeHolder ? 'invisible m-0 h-0 border-0 p-0' : 'visible'}`}
                    // onMouseEnter={() => setIsHoveredTextInput(true)}
                    // onMouseLeave={() => setIsHoveredTextInput(false)}
                  >
                    <div className={`flex flex-row items-center   justify-between`}>
                      <input
                        style={{
                          backgroundColor: colors.background,
                          color: colors.text
                        }}
                        className={` w-full border-0 px-2 pb-7 text-left focus:border-0 focus:outline-none  `}
                        autoFocus
                        value={editedName}
                        onChange={handleNameChange}
                      ></input>
                    </div>
                    {card &&
                      ((card.watcher_email &&
                        card.watcher_email.length > 0 &&
                        card.watcher_email.includes(profile.email)) ||
                        (card.member_email && card.member_email.length > 0)) && (
                        <div className={`flex flex-row items-center justify-between`}>
                          <div className='flex-grow'>
                            {card.watcher_email.includes(profile.email) && <MdOutlineRemoveRedEye className={``} />}
                          </div>
                          <div className={`flex flex-row items-center justify-between space-x-1`}>
                            {card.watcher_email.includes(profile.email) &&
                              cardMembers.map((member, index) => (
                                <div key={index} className={`relative z-10 flex flex-row items-center justify-center`}>
                                  <div onMouseEnter={() => handleMouseOver(member)} onMouseLeave={handleMouseLeave}>
                                    <Typography variant='h4' className='text-center'>
                                      <Avatar {...stringAvatar(member)} className={`font-bold`} />
                                    </Typography>
                                    {isHoveredWatcher && isHoveredWatcher === member && isValidEmail(member) && (
                                      <div className='absolute -bottom-10 left-2 z-20 ml-6 bg-yellow-200 p-1 text-black hover:bg-gray-100'>
                                        {member}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <CardSetting />
                </div>
                <button
                  style={{
                    backgroundColor: !isHovered_SaveBtn ? colors.save_card : colors.save_card_hover,
                    color: darkMode ? 'black' : 'white',
                    zIndex: 10
                  }}
                  onMouseEnter={() => setIsHovered_SaveBtn(true)}
                  onMouseLeave={() => setIsHovered_SaveBtn(false)}
                  className={`absolute top-full ml-3 mt-2 w-[65px] rounded-md py-2`}
                  onClick={() => {
                    editCardName()
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
