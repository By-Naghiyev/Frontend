import React from 'react'
import Header1Img from "../assets/img/header/header1.png"
// import Header2Img from "../assets/img/header/header2.png"

const Header = () => {
    return (
        <div className='Header-Group'>
            <div className="Header-Text-Group">
                <p>HAND MADE LUXURY</p>
                <h1>Transform your home WITH bY NAGHIYEV,
                    Products and change the energy!</h1>
                <div className="Button-Group">
                    <button className='ButtonOff'>dISCOVER cOLLECTION</button>
                    <button className='ButtonOn'>Order Now</button>
                </div>
            </div>
            <img src={Header1Img} alt="Header" />
        </div>
    )
}

export default Header