import React, { useEffect, useState, useRef } from 'react'

const Section = ({ children }) => {
    const childRefs = useRef([])
    const [scales, setScales] = useState([])
    const [radiuses, setRadiuses] = useState([])
    const [opacities, setOpacities] = useState([])

    useEffect(() => {
        const handleScroll = () => {
            const newScales = []
            const newRadiuses = []
            const newOpacities = []

            childRefs.current.forEach((el) => {
                if (!el) return

                const rect = el.getBoundingClientRect()
                const viewportHeight = window.innerHeight
                const elementHeight = rect.height

                let progress = 0

                // Child fully above viewport → finished animation
                if (rect.bottom <= 0) {
                    progress = 1
                } 
                // Child fully below viewport → no animation yet
                else if (rect.top >= viewportHeight) {
                    progress = 0
                } 
                // Child partially in viewport → calculate progress
                else {
                    const visibleTop = Math.max(rect.top, 0)
                    const visibleBottom = Math.min(rect.bottom, viewportHeight)
                    const visibleHeight = visibleBottom - visibleTop
                    progress = 1 - visibleHeight / elementHeight
                    progress = Math.min(Math.max(progress, 0), 1)
                }

                // Map progress to effects
                const maxRadius = 1000
                const newScale = 1 - progress * 0.2            // 1 → 0.8
                const newRadius = progress * maxRadius         // 0 → maxRadius
                const newOpacity = 1 - progress * 0.2        // 1 → 0.2

                newScales.push(newScale)
                newRadiuses.push(newRadius)
                newOpacities.push(newOpacity)
            })

            setScales(newScales)
            setRadiuses(newRadiuses)
            setOpacities(newOpacities)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // initialize on mount

        return () => window.removeEventListener('scroll', handleScroll)
    }, [children])

    return (
        <div className="Section-Group">
            {React.Children.map(children, (child, index) => (
                <div
                    key={index}
                    ref={(el) => (childRefs.current[index] = el)}
                    style={{
                        transform: `scale(${scales[index] ?? 1})`,
                        borderRadius: `${radiuses[index] ?? 0}px`,
                        opacity: opacities[index] ?? 1,
                        overflow: 'hidden',
                      
                        WebkitFilter: 'drop-shadow(2px 10px 15px rgba(0,0,0,0.2))',
                        filter: 'drop-shadow(2px 10px 15px rgba(0,0,0,0.2))',
                        transition: 'transform 0.1s ease-out, border-radius 0.1s ease-out, opacity 0.1s ease-out'
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    )
}

export default Section