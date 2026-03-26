import React from 'react'
import Items1Svg from '../../public/_redirects/assets/svg/volunteer_activism.svg'
import Items2Svg from '../../public/_redirects/assets/svg/deployed_code.svg'
import Items3Svg from '../../public/_redirects/assets/svg/asterisk.svg'
import Items4Svg from '../../public/_redirects/assets/svg/psychiatry.svg'

const Category = () => {
  return (
    <div className='Category-Group'>
      <div className="CategoryItem">
        <img src={Items1Svg} />
        <h2>Hand Made</h2>
        <p>Carefully crafted by hand with attention to fine detail, ensuring every piece is unique.</p>
      </div>
      <div className="CategoryItem">
        <img src={Items2Svg} />
        <h2>Premium Materials</h2>
        <p>We use high-quality wax, resin, and plaster for durability, safety, and refined finish.</p>
      </div>
      <div className="CategoryItem">
        <img src={Items3Svg} />
        <h2>Modern Design</h2>
        <p>We use high-quality wax, resin, and plaster for durability, safety, and refined finish.</p>
      </div>
      <div className="CategoryItem">
        <img src={Items4Svg} />
        <h2>Eco Conscious</h2>
        <p>Thoughtfully sourced materials and responsible production practices.</p>
      </div>

    </div>
  )
}

export default Category