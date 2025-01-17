import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Tijdlijn() {
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef(null);
  const timelineLineRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("account_id");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/timeline/${userId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };
  

  const scrollTimeline = (index) => {
    if (timelineRef.current && events.length > 0) {
      const activeEvent = timelineRef.current.children[index];
      if (activeEvent) {
        const timelineWidth = timelineRef.current.offsetWidth;
        const eventWidth = activeEvent.offsetWidth;

        const scrollPosition = activeEvent.offsetLeft - (timelineWidth / 2) + (eventWidth / 2);

        const minScrollPosition = 0;

        const finalScrollPosition = Math.max(scrollPosition, minScrollPosition);

        timelineRef.current.style.transition = "transform 0.3s ease-out";
        timelineRef.current.style.transform = `translateX(-${finalScrollPosition}px)`;
      }
    }
  };

  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      const closestEventIndex = events.findIndex((event) => new Date(event.date) >= now);

      if (closestEventIndex === -1) {
        setActiveIndex(events.length - 1);
      } else {
        setActiveIndex(closestEventIndex);
      }
    }
  }, [events]);

  useEffect(() => {
    if (activeIndex !== null && events.length > 0) {
      scrollTimeline(activeIndex);
    }
  }, [activeIndex, events]);

  const scrollByDirection = (direction) => {
    let newIndex = activeIndex + direction;

    if (newIndex >= 0 && newIndex < events.length) {
      setActiveIndex(newIndex);
      scrollTimeline(newIndex);
    }
  };

  const getTimelineDatePosition = (index) => {
    return index % 2 === 0 ? { top: "20px" } : { bottom: "30px" };
  };

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100vh" }}>
      {loading && <p>Loading events...</p>}
      <div className="fade-right"></div>
      <div className="fade-left"></div>
  
      <div className="timeline-container">
        <div className="timeline-line" ref={timelineLineRef}></div>
        <div className="timeline" ref={timelineRef}>
          {events.map((event, index) => (
            <div
              key={index}
              className={`timeline-item ${index === activeIndex ? "active" : ""}`}
              onClick={() => handleItemClick(index)}
            >
              <div
                className={`timeline-circle ${index === activeIndex ? "active" : ""}`}
              ></div>
  
              <div className="timeline-date" style={{ position: "absolute", ...getTimelineDatePosition(index) }}>
                {new Date(event.date).toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
  
              <div className="timeline-box">
                {index === activeIndex && (
                  <div className="participant-bubbles">
                    {event.participants.slice(0, 5).map((participant, i) => (
                      <Link href={`/account/${participant._id}`} key={i}>
                        <div className="participant-container" style={{ position: "relative" }}>
                          <img
                            src={participant.profileImgUrl}
                            alt={`${participant.firstName} ${participant.lastName}`}
                          />
                          <div className="participant-name">
                            {participant.firstName} {participant.lastName}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <img
                  src={event.photo}
                  alt={`Event ${index + 1}`}
                  className="timeline-image"
                />
                {index === activeIndex && (
                  <div className="timeline-details m-2">
                    <div className="border-bottom">
                      <h4 className="display-6">{event.title}</h4>
                    </div>
                   
                    <button className="btn btn-primary w-100" onClick={() => router.push(`/evenementen/${event.id}`)}>Bekijken</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
  
      <div className="scroll-arrows">
        <button className="scroll-arrow left" onClick={() => scrollByDirection(-1)}>
          &#10094;
        </button>
        <button className="scroll-arrow right" onClick={() => scrollByDirection(1)}>
          &#10095;
        </button>
      </div>
    </div>
  );
  
}
