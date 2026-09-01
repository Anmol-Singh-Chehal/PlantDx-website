import { ArrowRight, Leaf } from 'lucide-react';
import React from 'react'
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import { FaLeaf } from "react-icons/fa";
import { useTheme } from 'next-themes';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  const {theme, setTheme} = useTheme(); 

  return (
    <footer className="bg-paper-2">

      <section className='py-15 flex flex-col justify-center items-center gap-2 sm:px-4 lg:px-10'>
        <h1 className='sm:text-2xl lg:text-xl font-medium text-primary text-center font-primary'>Got a leaf that doesn't look right?</h1>
        <p className='sm:text-[16px] lg:text-lg font-secondary text-secondary text-center'>Run your first scan in under a minute, or reach out to our agronomy team for a second opinion.</p>
        <div className='flex lg:gap-4 sm:gap-4'>
            <NavLink to={"/detection"} className={`font-medium bg-muted ${theme==="light"? "text-white" : "text-paper-1"} flex lg:gap-2 items-center lg:px-4 lg:py-2 lg:text-lg rounded-md cursor-pointer ring-2 ring-muted sm:text-sm sm:px-2 sm:py-2 sm:gap-1 font-primary transition-all duration-400 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50`}>
              <h3>Try Image Detection</h3>
              <ArrowRight className='sm:size-4'/>
            </NavLink>
            <NavLink to={"/about-us"} className={`font-medium text-muted flex lg:gap-2 items-center lg:px-4 lg:py-2 lg:text-lg rounded-md ring-2  hover:bg-muted transition-all duration-400 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50 ${theme==="light"? "hover:text-white" : "hover:text-paper-1"} hover:ring-2 hover:ring-muted bg-muted/10 ring-muted/40 cursor-pointer sm:text-sm sm:px-2 sm:py-2 sm:gap-1 font-primary`}>Learn About Us</NavLink>
        </div>
      </section>

      <section className='grid sm:grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr] gap-10 sm:px-4 lg:px-10'>
        
        <div className='flex flex-col gap-4'>
          <div  className="flex items-center gap-1 cursor-pointer w-fit">
            <Leaf className='text-muted sm:size-6'/>
            <h1 className="sm:text-xl text-muted font-medium">PlantDx</h1>
          </div>

          <p className='sm:text-md font-secondary text-primary text-left'>An AI assistant that scans Mango, Cherry, Grape, and Apple leaves for disease, so you catch trouble before it spreads.</p>

          <div className='flex gap-2'>
            <a href='' className='ring-1 ring-secomdary/30 rounded-full sm:size-7 flex justify-center items-center hover:bg-muted hover:ring-muted group cursor-pointer duration-200 ease-in-out group'>
              <FaFacebookF className="sm:size-4 text-secondary  group-hover:text-white"/>
            </a>
            <a href='' className='ring-1 ring-secomdary/30 rounded-full sm:size-7 flex justify-center items-center hover:bg-muted hover:ring-muted group cursor-pointer duration-200 ease-in-out group'>
              <FaXTwitter className="sm:size-4 text-secondary  group-hover:text-white"/>
            </a>
            <a href='' className='ring-1 ring-secomdary/30 rounded-full sm:size-7 flex justify-center items-center hover:bg-muted hover:ring-muted group cursor-pointer duration-200 ease-in-out group'>
              <FaInstagram className="sm:size-4 text-secondary  group-hover:text-white"/>
            </a>
            <a href='' className='ring-1 ring-secomdary/30 rounded-full sm:size-7 flex justify-center items-center hover:bg-muted hover:ring-muted group cursor-pointer duration-200 ease-in-out group'>
              <FaYoutube className="sm:size-4 text-secondary  group-hover:text-white"/>
            </a>
            
          </div>

        </div>

        <div className='flex flex-col gap-3'>
          <h3 className='sm:text-lg font-medium text-primary font-secondary'>Explore</h3>
          <NavLink to={"/"} className='text-secondary font-secondary sm:text-sm hover:text-muted w-fit'>Disease Detection</NavLink>
          <NavLink to={"/"} className='text-secondary font-secondary sm:text-sm hover:text-muted w-fit'>Disease Library</NavLink>
          <NavLink to={"/"} className='text-secondary font-secondary sm:text-sm hover:text-muted w-fit'>Crop Information</NavLink>
          <NavLink to={"/"} className='text-secondary font-secondary sm:text-sm hover:text-muted w-fit'>Dashboard</NavLink>
        </div>

        <div className='flex flex-col gap-3'>
          <h3 className='sm:text-lg font-medium text-primary font-secondary'>Company</h3>
          <NavLink to={"/about-us"} className='text-secondary font-secondary sm:text-sm hover:text-muted w-fit'>About Us</NavLink>
          <NavLink to={"/about-us"} className='text-secondary font-secondary sm:text-sm hover:text-muted w-fit'>FAQ</NavLink>
          <NavLink to={"/contact-us"} className='text-secondary font-secondary sm:text-sm hover:text-muted w-fit'>Contact Us</NavLink>
          <NavLink to={"/"} className='text-secondary font-secondary sm:text-sm hover:text-muted w-fit'>How It Works ?</NavLink>
        </div>
      </section>

      <div className="flex justify-center items-center gap-4 py-5  sm:px-4 lg:px-10">
        <div className="flex-1 h-px bg-[linear-gradient(to_right,#5b6a5f,transparent)]"></div>
        <FaLeaf className="text-secondary opacity-80 sm:icon-sm" />
        <div className="flex-1 h-px bg-[linear-gradient(to_left,#5b6a5f,transparent)]"></div>
      </div>
      
      <section className='sm:text-sm text-secondary flex flex-col gap-4 sm:px-4 lg:px-10 pb-6 md:flex-row justify-center items-center'>
        <span>© 2026 PlantDx Labs. All rights reserved.</span>
        <span>Sample UI — no live predictions are made.</span>
      </section>
    </footer>
  )
}
