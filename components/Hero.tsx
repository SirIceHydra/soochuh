import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroSlide1 from '../assets/slideshow/FA-SoochuhWeb-098-copy-1.jpg';
import heroSlide2 from '../assets/slideshow/FA-SoochuhWeb-138-copy.jpg';
import heroSlide3 from '../assets/slideshow/FA-SoochuhWeb-170-copy.jpg';
import { getSlideshow } from '../services/woocommerce';

interface HeroProps {
  onShopNow?: () => void;
}

interface HeroSlide {
  desktopImage: string;
  mobileImage?: string;
  subtitle: string;
  title: string;
  desc: string;
  align: 'left' | 'center' | 'right';
  buttonLabel: string;
  buttonLink: string;
}

interface ApiSlideImage {
  url?: string;
  url_full?: string;
  url_large?: string;
  url_medium?: string;
}

/** Backup slides when API returns none */
const BACKUP_SLIDES: HeroSlide[] = [
  {
    desktopImage: heroSlide1,
    mobileImage: heroSlide1,
    subtitle: "TECHNICAL COMFORT",
    title: "MEDICINE,\nMODERNIZED.",
    desc: "Proprietary FIONx™ technology. Maximum durability, ridiculous comfort.",
    align: "center",
    buttonLabel: "SHOP NOW",
    buttonLink: "/shop"
  },
  {
    desktopImage: heroSlide2,
    mobileImage: heroSlide2,
    subtitle: "NEW ARRIVALS",
    title: "THE POWER\nOF COLOR.",
    desc: "Introducing the new Martini Olive collection. Bold, earthy, and professional.",
    align: "left",
    buttonLabel: "SHOP NOW",
    buttonLink: "/shop"
  },
  {
    desktopImage: heroSlide3,
    mobileImage: heroSlide3,
    subtitle: "BEST SELLERS",
    title: "ENGINEERED\nTO LAST.",
    desc: "Tested by real medical professionals in the toughest environments.",
    align: "right",
    buttonLabel: "SHOP NOW",
    buttonLink: "/shop"
  }
];

function getBestImageUrl(img?: ApiSlideImage | null): string {
  if (!img) return '';
  return img.url || img.url_full || img.url_large || img.url_medium || '';
}

function mapApiSlideToHero(api: {
  id?: string;
  title?: string;
  description?: string;
  button_label?: string;
  button_link?: string;
  alignment?: string;
  image?: ApiSlideImage;
  image_desktop?: ApiSlideImage;
  image_mobile?: ApiSlideImage | null;
}): HeroSlide {
  const desktopImg = api.image_desktop || api.image || api.image_mobile || null;
  const mobileImg = api.image_mobile || api.image || api.image_desktop || null;
  const align = (api.alignment === 'left' || api.alignment === 'center' || api.alignment === 'right') ? api.alignment : 'center';
  return {
    desktopImage: getBestImageUrl(desktopImg),
    mobileImage: getBestImageUrl(mobileImg),
    subtitle: '',
    title: api.title || '',
    desc: api.description || '',
    align,
    buttonLabel: api.button_label || 'SHOP NOW',
    buttonLink: api.button_link || '/shop'
  };
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<HeroSlide[]>(BACKUP_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getSlideshow().then(({ data }) => {
      if (data && data.length > 0) {
        const mapped = data
          .map(mapApiSlideToHero)
          .filter((s) => s.desktopImage || s.mobileImage); // Skip slides without image
        if (mapped.length > 0) {
          setSlides(mapped);
          setCurrentSlide(0);
        }
      }
    });
  }, []);

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, []);

  // Function to start/restart the auto-rotation timer
  const startAutoRotation = () => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start new interval
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
  };

  // Function to pause the auto-rotation
  const pauseAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoRotation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reset elements
      gsap.set(contentRef.current, { opacity: 0, y: 20 });
      
      // Animate Image (Subtle zoom)
      gsap.fromTo(slideRef.current, 
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
      );

      // Animate Text
      const tl = gsap.timeline();
      tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5
      });
    });

    return () => ctx.revert();
  }, [currentSlide]);

  const slide = slides[currentSlide];
  const activeImageUrl =
    (isMobile && slide.mobileImage) ? slide.mobileImage : slide.desktopImage;

  return (
    <div className="relative h-screen w-full bg-zinc-950 overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0" ref={slideRef}>
         <div className="absolute inset-0 bg-black/20 z-10 mix-blend-multiply"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10"></div>
         <img 
           src={activeImageUrl} 
           alt={slide.title || 'Hero'} 
           className="w-full h-full object-cover opacity-90"
         />
      </div>

      {/* Content Overlay */}
      <div className={`absolute inset-0 z-20 container mx-auto px-4 sm:px-6 flex flex-col justify-center h-full ${
        slide.align === 'left' ? 'items-start text-left' : 
        slide.align === 'right' ? 'items-end text-right' : 'items-center text-center'
      }`}>
        <div 
          ref={contentRef} 
          className={`max-w-3xl relative group w-full flex flex-col ${
            slide.align === 'left' ? 'items-start' : 
            slide.align === 'right' ? 'items-end' : 'items-center'
          }`}
        >
          {slide.subtitle && (
            <h3 className="relative text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4 text-white/80 uppercase font-display drop-shadow-lg">
              {slide.subtitle}
            </h3>
          )}
          <h1 className="relative text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-3 sm:mb-5 font-display whitespace-pre-line text-white drop-shadow-xl [word-spacing:-0.02em]">
            {slide.title}
          </h1>
          <p className={`relative text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-medium max-w-lg mb-5 sm:mb-8 leading-relaxed drop-shadow-md ${
            slide.align === 'center' ? 'mx-auto' : 
            slide.align === 'right' ? 'ml-auto' : 'mr-auto'
          }`}>
            {slide.desc}
          </p>
          {slide.buttonLink.startsWith('http') ? (
            <a
              href={slide.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={pauseAutoRotation}
              onMouseLeave={startAutoRotation}
              className="relative inline-block bg-white text-black px-6 py-3 sm:px-12 sm:py-4 rounded-full font-bold tracking-widest text-xs sm:text-sm hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] border-2 border-transparent"
            >
              {slide.buttonLabel}
            </a>
          ) : (
            <button 
              onClick={() => navigate(slide.buttonLink)}
              onMouseEnter={pauseAutoRotation}
              onMouseLeave={startAutoRotation}
              className="relative bg-white text-black px-6 py-3 sm:px-12 sm:py-4 rounded-full font-bold tracking-widest text-xs sm:text-sm hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] border-2 border-transparent"
            >
              {slide.buttonLabel}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => {
              setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
              startAutoRotation();
            }}
            onMouseEnter={pauseAutoRotation}
            onMouseLeave={startAutoRotation}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/30 text-white transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => {
              setCurrentSlide((prev) => (prev + 1) % slides.length);
              startAutoRotation();
            }}
            onMouseEnter={pauseAutoRotation}
            onMouseLeave={startAutoRotation}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/30 text-white transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentSlide(idx);
              startAutoRotation(); // Reset timer when manually switching
            }}
            className={`h-1 transition-all duration-300 rounded-full ${
              idx === currentSlide ? 'w-8 bg-purple-500 box-shadow-[0_0_10px_rgba(147,51,234,0.8)]' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;