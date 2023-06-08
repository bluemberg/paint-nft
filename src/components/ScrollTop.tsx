import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 50) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener('scroll', toggleVisibility);
  
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
  
    return (
      <button
        className={`fixed bottom-4 right-4 p-4 rounded-full bg-pink-500 text-black shadow-lg transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={scrollToTop}
      >
        <FaArrowUp />
      </button>
    );
  };
  
  export default ScrollToTopButton;