import React, { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "@/components/AuthContext";
import { useRouter } from "next/router";

const Tijdlijn = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
      if (!localStorage.getItem('token')) {
        router.push("/inloggen");
      }
    }, [isLoggedIn, router]);

  const events = [
    { date: "1-05-2025", image: "/images/image.png", title: "Event 1" },
    { date: "15-01-2025", image: "/images/image.png", title: "Event 2" },
    { date: "22-03-2025", image: "/images/image.png", title: "Event 3" },
    { date: "22-03-2025", image: "/images/image.png", title: "Event 4" },
    { date: "22-03-2025", image: "/images/image.png", title: "Event 5" },
    { date: "22-03-2025", image: "/images/image.png", title: "Event 6" },
    { date: "22-03-2025", image: "/images/image.png", title: "Event 7" },
      
  ];

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
      const scrollAmount = 300; 
      timelineRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="timeline-container">
        <div className="timeline" ref={timelineRef}>
          <div className="timeline-line"></div>
          {events.map((event, index) => (
            <div
              key={index}
              className={`timeline-item ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => handleItemClick(index)}
            >
              <div
                className={`timeline-circle ${
                  index === activeIndex ? "active" : ""
                }`}
              ></div>

              <div className="timeline-box">
                <img
                  src={event.image}
                  alt={`Event ${index + 1}`}
                  className="timeline-image"
                />
                {index === activeIndex && (
                  <div className="timeline-details">
                    <h4>{event.title}</h4>
                    <p>{event.date}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-arrows">
        <button className="scroll-arrow left" onClick={() => scrollTimeline(-1)}>
          &#10094;
        </button>
        <button className="scroll-arrow right" onClick={() => scrollTimeline(1)}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Tijdlijn;