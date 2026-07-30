"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { products } from "../data/products";
import WhiteButton from "./WhiteButton";

const exclusiveProducts = products.filter((p) =>
  ["floral-keepsake-frame", "geode-wall-piece", "pressed-flower-pendant"].includes(p.slug)
);
export default function ExclusiveCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
    watchDrag: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((i: number) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section className="py-24">
      {/* Heading (kept aligned with page) */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <p className="text-xs tracking-[0.25em] text-[#B8933E] mb-3">CURATED</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
          Exclusive <span className="text-[#B8933E]">Pieces</span>
        </h2>
        <div className="w-16 h-[2px] bg-[#B8933E] mt-3"></div>
      </div>

      {/* Full-width carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {exclusiveProducts.map((product) => (
            <div key={product.slug} className="flex-[0_0_70%] min-w-0 px-3">
              <div className="relative h-96 rounded-3xl overflow-hidden bg-[#1D1D1F] flex items-end p-10">
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                  {product.images[0]}
                </div>
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                <div className="relative z-10 text-white max-w-md">
                  <p className="text-xs tracking-[0.2em] text-[#B8933E] mb-3">
                    {product.category.toUpperCase()}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">{product.description}</p>
                  <p className="text-xl font-light mt-4 mb-1">PKR {product.price}</p>
                  <Link href={`/products/${product.slug}`}>
                    <WhiteButton>
                      View piece <ArrowRight size={16} />
                    </WhiteButton>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button onClick={scrollPrev} className="w-10 h-10 flex items-center justify-center border border-[#B8933E]/40 text-[#B8933E] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] hover:border-[#B8933E] hover:text-white">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {exclusiveProducts.map((_, index) => (
            <button key={index} onClick={() => scrollTo(index)} className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${index === selectedIndex ? "w-8 bg-[#B8933E]" : "w-2 bg-gray-300 hover:bg-gray-400"}`} />
          ))}
        </div>
        <button onClick={scrollNext} className="w-10 h-10 flex items-center justify-center border border-[#B8933E]/40 text-[#B8933E] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] hover:border-[#B8933E] hover:text-white">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}