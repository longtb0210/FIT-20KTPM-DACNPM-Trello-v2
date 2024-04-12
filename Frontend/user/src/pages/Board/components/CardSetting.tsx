import { FaCreditCard } from 'react-icons/fa'
import { MdLabelOutline } from 'react-icons/md'
import { IoPersonOutline } from 'react-icons/io5'
import { IoIosArrowRoundForward, IoMdCard, IoMdClose } from 'react-icons/io'
import { FaRegClock } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa'
import { MdOutlineContentCopy } from 'react-icons/md'
import { FiArchive } from 'react-icons/fi'
import { useState } from 'react'
import { CardFeature } from './CardSettingComponent/CardFeature'
import EditLabelForm from './CardSettingComponent/EditLabelForm'
import ChangeMemberForm from './CardSettingComponent/ChangeMembersForm'
import EditDateForm from './CardSettingComponent/EditDateForm'
import MoveForm from './CardSettingComponent/MoveForm'
type FeatureType = 'editLabel' | 'changeMember' | 'changeCover' | 'editDate' | 'move' | 'copy'
export default function CardSetting() {
  const [openFeature, setOpenFeature] = useState<FeatureType | null>(null)

  const handleOpenFeature = (feature: FeatureType) => {
    setOpenFeature(feature)
  }

  const handleCloseFeature = () => {
    setOpenFeature(null)
  }
  const features = {
    editLabel: false,
    changeMember: false,
    changeCover: false,
    editDate: false,
    move: false,
    copy: false
  }
  const [openFeatures, setOpenFeatures] = useState(features)
  // function handleOpenFeature(feature: string) {
  //   if (feature === 'edit label')
  //     setOpenFeatures({
  //       ...features,
  //       editLabel: true
  //     })
  //   if (feature === 'change member')
  //     setOpenFeatures({
  //       ...features,
  //       changeMember: true
  //     })
  //   if (feature === 'change cover')
  //     setOpenFeatures({
  //       ...features,
  //       changeCover: true
  //     })
  //   if (feature === 'edit date')
  //     setOpenFeatures({
  //       ...features,
  //       editDate: true
  //     })
  //   if (feature === 'move')
  //     setOpenFeatures({
  //       ...features,
  //       move: true
  //     })
  //   if (feature === 'copy')
  //     setOpenFeatures({
  //       ...features,
  //       copy: true
  //     })
  // }
  function closeOpenFeature() {
    setOpenFeatures(features)
  }

  return (
    <div
      className={`absolute left-[102%] z-10 flex w-max cursor-default flex-col items-start justify-center space-y-1 font-sans font-semibold`}
    >
      <div className={`relative`}>
        <CardFeature icon={<FaCreditCard />} title='Open card' onClick={() => alert('click')} />
      </div>
      <div className={`relative`}>
        <CardFeature icon={<MdLabelOutline />} title='Edit label' onClick={() => handleOpenFeature('editLabel')} />
        {openFeature === 'editLabel' && <EditLabelForm closeOpenFeature={closeOpenFeature} />}
      </div>
      <div className={`relative`}>
        <CardFeature
          icon={<IoPersonOutline />}
          title='Change member'
          onClick={() => handleOpenFeature('changeMember')}
        />
        {openFeature === 'changeMember' && <ChangeMemberForm closeOpenFeature={closeOpenFeature} />}
      </div>
      <div className={`relative`}>
        <CardFeature icon={<IoMdCard />} title='Change cover' onClick={() => handleOpenFeature('changeCover')} />
      </div>
      <div className={`relative`}>
        <CardFeature icon={<FaRegClock />} title='Edit date' onClick={() => handleOpenFeature('editDate')} />
        {openFeature === 'editDate' && <EditDateForm closeOpenFeature={closeOpenFeature} />}
      </div>
      <div className={`relative`}>
        <CardFeature icon={<FaArrowRight />} title='Move' onClick={() => handleOpenFeature('move')} />
        {openFeature === 'move' && <MoveForm closeOpenFeature={closeOpenFeature} />}
      </div>
      <div className={`relative`}>
        <CardFeature icon={<MdOutlineContentCopy />} title='Copy' onClick={() => handleOpenFeature('copy')} />
      </div>
      <div className={`relative`}>
        <CardFeature icon={<FiArchive />} title='Archive' onClick={() => alert('click')} />
      </div>
    </div>
  )
}
