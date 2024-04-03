import AddReactionIcon from '@mui/icons-material/AddReaction'
import { useTheme } from '~/components/Theme/themeContext'
import { IoEyeOutline } from 'react-icons/io5'
import { FaRegClock } from 'react-icons/fa6'
import { FaRegComment } from 'react-icons/fa'
import { IoIosMore } from 'react-icons/io'
import { PiPaperPlaneTilt } from 'react-icons/pi'
import Button from '@mui/material/Button'

const CardHightLightContent = () => {
  const { darkMode, colors } = useTheme()
  return (
    <li className='div-card-highlight'>
      <div className='main-card-highlight' style={{ width: '420px', border: '1px solid rgba(0,0,0,0.1)' }}>
        <div role='button'>
          <div
            className='backgound-card-highlight backgound-position-card-highlight border-card-highlight canonical-stretch xr5vOplBYFX_9k'
            style={{
              color: colors.text,
              backgroundSize: '100% 36px, cover',
              backgroundImage:
                'linear-gradient(0deg, rgba(33, 36, 37, 0.7) 50%, rgba(33, 36, 37, 0.7) 0%), url("https://trello-backgrounds.s3.amazonaws.com/SharedBackground/256x144/09b457ee43a8833c515e9d3d5796f59f/photo-1698859858637-9aa64302f629.jpg")'
            }}
          >
            <a
              href='/c/VyGIsv5S/11-prototype'
              className='canonical-stretch link-content-card-adjust link-content-card'
              style={{ textDecoration: 'none', backgroundColor: colors.backgroundSecond }}
            >
              <div className='title-card-highlight' style={{ color: colors.text }}>
                Prototype
              </div>
              <div className='div-info-card-highlight'>
                <span className='info-card-highlight'>
                  <div className='badge-card' data-test-class='badge-card-subscribed'>
                    <span className='badge-card-item' style={{ color: colors.text }}>
                      <IoEyeOutline size={25} />
                    </span>
                  </div>
                </span>
                <span
                  className='info-card-highlight'
                  style={{
                    backgroundColor: 'var(--ds-background-success, #61BD4F)',
                    color: 'var(--ds-text-success, #FFFFFF)'
                  }}
                >
                  <div className='badge-card' data-test-class='badge-due-date-completed'>
                    <span className='badge-card-item'>
                      <FaRegClock size={25} />
                    </span>
                    <span className='content-badge-card' data-test-class='badge-due-date-completed'>
                      Jan 21
                    </span>
                  </div>
                </span>
                <span className='info-card-highlight'>
                  <div className='badge-card'>
                    <span className='badge-card-item' style={{ color: colors.text }}>
                      <FaRegComment />
                    </span>
                    <span className='content-badge-card' style={{ color: colors.text }}>
                      3
                    </span>
                  </div>
                </span>
              </div>
              <div className='icon-member-joined' style={{ color: colors.text }}>
                <span
                  aria-label=''
                  role='img'
                  title=''
                  className='tab-member-size icon-member-position bg-member-icon'
                  style={{
                    backgroundImage: '',
                    height: '24px',
                    width: '24px',
                    lineHeight: '22px'
                  }}
                ></span>
                <span
                  aria-label=''
                  role='img'
                  title=''
                  className='tab-member-size icon-member-position bg-member-icon'
                  style={{
                    backgroundImage:
                      'url("https://trello-members.s3.amazonaws.com/648d2b3d0a2d2f07a6b6151f/73bcb88f45e4a03e42d7d43f32674d8a/50.png")',
                    height: '24px',
                    width: '24px',
                    lineHeight: '22px'
                  }}
                ></span>
              </div>
            </a>
            <div className='info-workspace-project'>
              <div className='info-workspace-project-content'>Âu Hồng Minh's workspace |&nbsp;</div>
              <div className='info-workspace-project-content2'>
                <a href='/b/nkiHj9Gg/project-trello' className='text-project'>
                  Project Trello
                </a>
                :&nbsp;
              </div>
              <div className='FqklyrheHtTvQm'>Week 2</div>
            </div>
          </div>
        </div>
        <div>
          <div
            className='canonical-comment rounded-b-lg'
            style={{ backgroundColor: colors.background, color: colors.text }}
          >
            <div className='tab-comment' style={{ backgroundColor: colors.background, color: colors.text }}>
              <div className='div-member-comment'>
                <span
                  aria-label=''
                  role='img'
                  title=''
                  className='tab-member-size icon-member-comment bg-member-icon'
                  style={{
                    backgroundImage:
                      'url("https://trello-members.s3.amazonaws.com/659d431a88de3dfb7125d877/d89bc89446cada8ea6cc1cdff85a4452/50.png")',
                    height: '32px',
                    width: '32px',
                    lineHeight: '30px'
                  }}
                ></span>
                <div className='info-member-joined'>
                  <div className='info-member-name' style={{ color: colors.text }}>
                    tdtien20
                  </div>
                  <div className='info-member-history' style={{ color: colors.text }}>
                    a month ago
                  </div>
                </div>
                <button
                  className='button-size detail-button-div canonical-overflow-button'
                  data-test-class='overflow-details-button'
                >
                  <span className='detail-icon' style={{ color: colors.text }}>
                    <IoIosMore size={25} />
                  </span>
                </button>
              </div>
              <div>
                <div className='comment-text-container' style={{ height: '24px' }}>
                  <div className='markeddown' style={{ margin: '0px 8px' }}>
                    <p>
                      <span className='atMention' title='longtrnbo2' style={{ color: colors.text }}>
                        @longtrnbo2
                      </span>{' '}
                      Okay
                    </p>
                  </div>
                </div>
              </div>
              <div className='div-react-icon' style={{ backgroundColor: colors.background, color: colors.text }}>
                <div className='reaction-piles reaction-piles-empty'>
                  <div className='reaction-pile-selector'>
                    <span className='reactions-add mod-with-border'>
                      <span title='Add reaction' className='icon-sm icon-add-reaction reactions-add-icon'>
                        <div className='mb-2' style={{ color: colors.text }}>
                          <AddReactionIcon fontSize='small' />
                        </div>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className='div-comment'>
                <Button
                  className={`w-[100%] border-gray-400 text-gray-400 ${darkMode ? 'dark:bg-slate-800' : ''}`}
                  variant='outlined'
                  color='inherit'
                >
                  <PiPaperPlaneTilt size={20} />
                  <span className='normal-case'>Reply</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default CardHightLightContent
