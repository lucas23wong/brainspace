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
            <div className="pointer-events-none absolute top-0 left-0 h-full w-10 z-10" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.15) 80%, transparent)' }}></div>
            {/* Subtle gradient fade right */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-10 z-10" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.15) 80%, transparent)' }}></div>
            <div className="whitespace-nowrap flex animate-marquee gap-12">
                {galleryImages.map((src, i) => (
                    <div key={i} className="inline-block rounded-2xl shadow-xl bg-white p-3">
                        <img
                            src={src}
                            alt={`Whiteboard example ${i + 1}`}
                            className="h-72 w-auto object-contain rounded-xl border border-gray-200"
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
          animation: marquee 40s linear infinite;
        }
      `}</style>
        </div>
    );
} 