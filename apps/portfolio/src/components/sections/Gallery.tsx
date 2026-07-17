"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X, Maximize2 } from "lucide-react";
import Image from "next/image";

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category?: string | null;
  display_order: number;
}

interface GalleryProps {
  items?: GalleryItem[];
}

const defaultGallery: GalleryItem[] = [
  {
    id: "1",
    title: "CAD Assembly Render",
    image_url: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80",
    category: "Design",
    display_order: 1
  }
];

export default function Gallery({ items = defaultGallery }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const displayItems = items && items.length > 0 ? items : defaultGallery;

  return (
    <section id="gallery" className="relative w-full bg-background-secondary py-40 px-6 lg:px-20 overflow-hidden z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-highlight mb-6 uppercase tracking-tighter">
            Visual <span className="text-accent-secondary">Portfolio</span>
          </h2>
          <div className="w-24 h-1 bg-accent-primary" />
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {displayItems.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
              className="relative group rounded-2xl overflow-hidden break-inside-avoid cursor-pointer border border-white/5 w-full h-80"
              onClick={() => setSelectedImage(item)}
            >
              <Image 
                src={item.image_url} 
                alt={item.title} 
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                <span className="text-accent-primary font-mono text-xs tracking-widest uppercase mb-1">
                  {item.category || "General"}
                </span>
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  {item.title}
                  <Maximize2 className="w-4 h-4 text-white/50" />
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full rounded-lg overflow-hidden flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] bg-black/50 rounded-t-lg">
              <Image 
                src={selectedImage.image_url} 
                alt={selectedImage.title} 
                fill
                className="object-contain" 
              />
            </div>
            <div className="bg-zinc-900 p-6 border-t border-white/10">
              <span className="text-accent-primary font-mono text-sm tracking-widest uppercase mb-2 block">
                {selectedImage.category || "General"}
              </span>
              <h3 className="text-2xl font-bold text-white">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
