import React from 'react';

// Example placeholder images (replace with your own whiteboard images as needed)
const images = [
    '/whiteboard1.png',
    '/whiteboard2.png',
    '/whiteboard3.png',
    '/whiteboard4.png',
    '/whiteboard5.png',
];

export default function WhiteboardGalleryMarquee() {
    // Duplicate images for seamless looping
    const galleryImages = [...images, ...images];
    return (
        <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-0 overflow-x-hidden py-12 bg-transparent">
            {/* Subtle gradient fade left */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-10 z-10" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.15) 80%, transparent 100%)' }} />
            {/* Subtle gradient fade right */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-10 z-10" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.15) 80%, transparent 100%)' }} />
            <div className="whitespace-nowrap flex animate-marquee gap-16" style={{ minWidth: 'min-content' }}>
                {galleryImages.map((src, i) => (
                    <div key={i} className="inline-block rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-200 bg-white">
                        <img
                            src={src}
                            alt={`Whiteboard ${i + 1}`}
                            className="h-80 w-[48rem] object-cover object-center select-none pointer-events-none"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
        </div>
    );
} 