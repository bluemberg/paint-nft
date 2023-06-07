import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
    const favoriteIcon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )

  return (
    <footer className='bg-base-200 text-base-content '>
      <div className='container '>
        <div className="footer py-10 md:py-16 grid-cols-2 sm:grid-cols-4 lg:grid-cols-auto">
          <div>
            <span className="footer-title">Solutions</span>
            <a href="#!" className="link link-hover">Marketing</a>
          </div>
          <div>
            <span className="footer-title">Services</span>
            <a href="#!" className="link link-hover">Branding</a>
          </div>
          <div>
            <span className="footer-title">Company</span>
            <a href="#!" className="link link-hover">About us</a>
            <a href="#!" className="link link-hover">Contact</a>
          </div>
          <div className='w-full col-span-full md:col-auto'>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter your email address</span>
              </label>
              <div className="relative">
                <input type="text" placeholder="user@site.com" className="input input-bordered w-full pr-16" />
                <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-center border-t border-base-300 py-4 gap-2'>
          <div className="flex-grow text-center sm:text-start">
            <p>© 2023 Tesus.</p>
          </div>
          <div className="grid grid-flow-col gap-4">
            <a href="https://github.com/cs173-tesus/paint-nft" className="btn btn-sm btn-github">
                <FaGithub className="inline-block mr-2" />
                Github
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}