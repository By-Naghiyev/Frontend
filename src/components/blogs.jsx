import React, { useState, useEffect } from 'react'
import RightSvg from "../assets/svg/right.svg"
import LeftSvg from "../assets/svg/left.svg"
import BgBodySvg from "../assets/svg/bg-body1.svg"
import Product1Img from "../assets/img/blogs/blogs1.png"

const Blogs = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);

    // Sample blog data
    const blogs = [
        { id: 1, name: "Blog Post 1", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 2, name: "Blog Post 2", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 3, name: "Blog Post 3", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 4, name: "Blog Post 4", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 5, name: "Blog Post 5", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 6, name: "Blog Post 6", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 7, name: "Blog Post 7", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 8, name: "Blog Post 8", description: "Natural Waxes & Essential Oils", image: Product1Img },
    ];

    // Handle responsive items per slide
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else {
                setItemsToShow(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle next slide
    const nextSlide = () => {
        setStartIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex >= blogs.length ? 0 : nextIndex;
        });
    };

    // Handle previous slide
    const prevSlide = () => {
        setStartIndex((prevIndex) => {
            const prevIndexCalc = prevIndex - 1;
            return prevIndexCalc < 0 ? blogs.length - 1 : prevIndexCalc;
        });
    };

    // Get current items to display
    const getVisibleBlogs = () => {
        const visible = [];
        for (let i = 0; i < itemsToShow; i++) {
            const index = (startIndex + i) % blogs.length;
            visible.push(blogs[index]);
        }
        return visible;
    };

    const visibleBlogs = getVisibleBlogs();

    return (
        <div className='About-Group FreeResponsive-Group Section-Slot' id='blogs'>
            <h1 className='Section-Title'>Blogs</h1>

            <div className="Slider-Group">
                <div className="SubSlider">
                    <button className='ButtonOff2' onClick={prevSlide}>
                        <img src={LeftSvg} alt="Left" />
                    </button>

                    <div className="ItemStacks">
                        {visibleBlogs.map((blog, idx) => {
                            const globalIndex = (startIndex + idx) % blogs.length;
                            
                            return (
                                <div 
                                    key={`${blog.id}-${globalIndex}`} 
                                    className="ItemStack ItemStackShort"
                                >
                                    {/* <div className="ItemShareLink">
                                        <p>Share via Link</p>
                                        <img src={RightSvg} alt="" srcset="" />
                                    </div> */}
                                    <img src={blog.image} alt={blog.name} />
                                    <h2>{blog.name}</h2>
                                    <p>{blog.description}</p>
                                    <div className="ButtonInteract">
                                        <button className='ButtonOn'>
                                            <p>Read more</p>
                                        </button>
                                    </div>
                                    <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                                </div>
                            );
                        })}
                    </div>

                    <button className='ButtonOff2' onClick={nextSlide}>
                        <img src={RightSvg} alt="Right" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Blogs