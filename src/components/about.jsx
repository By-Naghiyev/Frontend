import React, { useState, useEffect } from 'react'
import RightSvg    from "../../public/_redirects/assets/svg/right.svg"
import LeftSvg     from "../../public/_redirects/assets/svg/left.svg"
import LogoTextSvg from "../../public/_redirects/assets/svg/logo-text.svg"

const About = ({ aboutData }) => {
  const [title, setTitle] = useState('')
  const [paragraphs, setParagraphs] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title || '')
      setParagraphs(aboutData.paragraphs || [])
      
      // Normalize images - ensure the full path is preserved
      const normalizedImages = (aboutData.images || []).map((img, index) => {
        let imageUrl = img.url || img.src || '';
        
        // If the URL doesn't start with /_redirects, add it
        if (imageUrl && !imageUrl.startsWith('/_redirects') && !imageUrl.startsWith('http')) {
          imageUrl = `/_redirects${imageUrl}`;
        }
        
        return {
          id: img.id || index,
          src: imageUrl,
          alt: img.alt || 'About image'
        };
      });
      setImages(normalizedImages);
    }
  }, [aboutData]);

  const handleRight = () => {
    if (images.length === 0) return
    setImages(prev => {
      const a = [...prev]
      a.push(a.shift())
      return a
    })
  }

  const handleLeft = () => {
    if (images.length === 0) return
    setImages(prev => {
      const a = [...prev]
      a.unshift(a.pop())
      return a
    })
  }

  // Don't render if no data
  if (!aboutData || (!title && paragraphs.length === 0 && images.length === 0)) {
    return null
  }

  return (
    <div className='About-Group Section-Slot' id='about'>
      {title && <h1 className='Section-Title'>{title}</h1>}

      <div className="Slider-Group">
        <div className="SubSlider">
          {images.length > 0 && (
            <>
              <button className='ButtonOff2' onClick={handleLeft}>
                <img src={LeftSvg} alt="Left" />
              </button>

              <div className="ImageStacks">
                {images.map((img) => (
                  <img 
                    key={img.id} 
                    src={img.src} 
                    alt={img.alt}
                    onError={(e) => {
                      console.error(`Failed to load image: ${img.src}`);
                      // Optional: set a fallback image
                      // e.target.src = '/_redirects/assets/img/fallback.png';
                    }}
                  />
                ))}
              </div>

              <button className='ButtonOff2' onClick={handleRight}>
                <img src={RightSvg} alt="Right" />
              </button>
            </>
          )}
        </div>

        <div className="SubText">
          <p>The</p>
          <img src={LogoTextSvg} alt="By Naghiyev" />
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About