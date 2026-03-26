import React, { useState } from 'react'
import RightSvg    from "../assets/svg/right.svg"
import LeftSvg     from "../assets/svg/left.svg"
import LogoTextSvg from "../assets/svg/logo-text.svg"
import About1Img   from "../assets/img/about/about1.png"
import About2Img   from "../assets/img/about/about2.png"
import About3Img   from "../assets/img/about/about3.png"

const DEFAULT_DATA = {
  title: "About us",
  paragraphs: [
    "The Azerbaijani brand. It is engaged in the production of decorative items for the home, scented and variously designed candles, epoxy pots.",
    "The products are handmade, made to order. Delivery to any address is possible. Hurry up to order.",
    "With By Naghiyev products, you can also give your home an aesthetic touch and change the energy!",
  ],
  images: [
    { id: '1', url: About1Img, alt: 'About 1' },
    { id: '2', url: About2Img, alt: 'About 2' },
    { id: '3', url: About3Img, alt: 'About 3' },
  ]
}

const About = ({ aboutData }) => {
  const d = aboutData ?? DEFAULT_DATA
  const rawImages = d.images ?? []

  // Normalise & fill fallback
  const allImages = rawImages.map((img, i) => ({
    ...img,
    src: img.src || img.url || [About1Img, About2Img, About3Img][i] || About1Img,
  }))

  const [images, setImages] = useState(allImages)

  // Sync when data changes externally
  React.useEffect(() => {
    const normalised = (d.images ?? []).map((img, i) => ({
      ...img,
      src: img.src || img.url || [About1Img, About2Img, About3Img][i] || About1Img,
    }))
    setImages(normalised)
  }, [d.images])

  const handleRight = () => setImages(prev => { const a = [...prev]; a.push(a.shift()); return a })
  const handleLeft  = () => setImages(prev => { const a = [...prev]; a.unshift(a.pop()); return a })

  return (
    <div className='About-Group Section-Slot' id='about'>
      <h1 className='Section-Title'>{d.title}</h1>

      <div className="Slider-Group">
        <div className="SubSlider">
          <button className='ButtonOff2' onClick={handleLeft}>
            <img src={LeftSvg} alt="Left" />
          </button>

          <div className="ImageStacks">
            {images.map((img) => (
              <img key={img.id} src={img.src} alt={img.alt} />
            ))}
          </div>

          <button className='ButtonOff2' onClick={handleRight}>
            <img src={RightSvg} alt="Right" />
          </button>
        </div>

        <div className="SubText">
          <p>The</p>
          <img src={LogoTextSvg} alt="By Naghiyev" />
          {(d.paragraphs ?? []).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About