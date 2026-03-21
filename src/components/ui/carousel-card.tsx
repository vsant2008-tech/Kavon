'use client'
import { useState, useEffect, useRef } from "react";

interface CardData {
  id: number;
  imgUrl: string;
  content: string;
}

interface CardProps {
  data: CardData[];
  showCarousel?: boolean;
  cardsPerView?: number;
}

const Card = ({ data, showCarousel = true, cardsPerView = 3 }: CardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSingleCard, setIsSingleCard] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSingleCard(data?.length === 1);
  }, [data]);

  const cardWidth = 75 / cardsPerView;

  const nextSlide = () => {
    if (isAnimating || !showCarousel || !data) return;

    if (data.length <= cardsPerView) return;

    setIsAnimating(true);
    const nextIndex = (currentIndex + 1) % data.length;

    if (containerRef.current) {
      containerRef.current.style.transition = "transform 500ms ease";
      containerRef.current.style.transform = `translateX(-${cardWidth}%)`;

      setTimeout(() => {
        setCurrentIndex(nextIndex);
        if (containerRef.current) {
          containerRef.current.style.transition = "none";
          containerRef.current.style.transform = "translateX(0)";

          void containerRef.current.offsetWidth;

          setIsAnimating(false);
        }
      }, 500);
    }
  };

  const prevSlide = () => {
    if (isAnimating || !showCarousel || !data) return;
    if (data.length <= cardsPerView) return;

    setIsAnimating(true);
    const prevIndex = (currentIndex - 1 + data.length) % data.length;

    if (containerRef.current) {
      containerRef.current.style.transition = "none";
      containerRef.current.style.transform = `translateX(-${cardWidth}%)`;

      setCurrentIndex(prevIndex);

      void containerRef.current.offsetWidth;

      containerRef.current.style.transition = "transform 500ms ease";
      containerRef.current.style.transform = "translateX(0)";

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const getVisibleCards = () => {
    if (!showCarousel || !data) return data || [];

    const visibleCards = [];
    const totalCards = data.length;

    for (let i = 0; i < cardsPerView + 1; i++) {
      const index = (currentIndex + i) % totalCards;
      visibleCards.push(data[index]);
    }

    return visibleCards;
  };

  if (!data || data.length === 0) {
    return <div>No card data available</div>;
  }

  return (
    <div className="w-full px-4">
      <div className={`relative ${isSingleCard ? 'max-w-sm mx-auto' : 'w-full'}`}>
        {showCarousel && data.length > cardsPerView && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
              disabled={isAnimating}
              aria-label="Previous slide"
            >
              &lt;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
              disabled={isAnimating}
              aria-label="Next slide"
            >
              &gt;
            </button>
          </>
        )}

        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex"
            style={{
              transform: "translateX(0)",
              width: showCarousel ? `${(cardsPerView + 1) * 100 / cardsPerView}%` : '100%'
            }}
          >
            {getVisibleCards().map((card, idx) => (
              <div
                key={`card-${currentIndex}-${idx}`}
                style={{
                  width: showCarousel ? `${100 / (cardsPerView + 1)}%` : `${100 / Math.min(cardsPerView, data.length)}%`
                }}
                className="px-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-md group h-full">
                  <div className="w-full h-64">
                    <img
                      src={card.imgUrl}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/80 text-white p-4 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0 overflow-y-auto">
                    <p className="text-sm">{card.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
