import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function Tijdlijn() {
    const [events, setEvents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleEvents, setVisibleEvents] = useState([]);
    const timelineRef = useRef(null);
    const [centerIndex, setCenterIndex] = useState(0);
    const [adjacentIndex, setAdjacentIndex] = useState([-1, 1]);
    const [activeEvent, setActiveEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const debouncedHandleScroll = useRef(null);

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
            console.error("Fout bij het ophalen van evenementen:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleScroll = () => {
        if (!timelineRef.current || loading) return;

        const timelineWidth = timelineRef.current.offsetWidth;
        const timelineLeft = timelineRef.current.getBoundingClientRect().left;
        let newVisibleEvents = [];

        events.forEach((event, index) => {
            const eventElement = document.getElementById(`event-${index}`);
            if (eventElement) {
                const eventLeft = eventElement.getBoundingClientRect().left;
                const eventRight = eventLeft + eventElement.offsetWidth;

                if (eventRight >= timelineLeft && eventRight <= timelineLeft + timelineWidth) {
                    newVisibleEvents.push(index);
                }
            }
        });

        if (newVisibleEvents.length !== visibleEvents.length || newVisibleEvents.some((value, index) => value !== visibleEvents[index])) {
            setVisibleEvents(newVisibleEvents);
            handleScale(newVisibleEvents);
        }
    };

    const debounce = (func, delay) => {
        return (...args) => {
            if (debouncedHandleScroll.current) {
                clearTimeout(debouncedHandleScroll.current);
            }
            debouncedHandleScroll.current = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debouncedScrollHandler = debounce(handleScroll, 100);

    useEffect(() => {
        const scrollHandler = () => {
            debouncedScrollHandler();
        };

        if (timelineRef.current) {
            timelineRef.current.addEventListener("scroll", scrollHandler, { passive: true });
        }

        handleScroll();

        return () => {
            if (timelineRef.current) {
                timelineRef.current.removeEventListener("scroll", scrollHandler);
            }
            clearTimeout(debouncedHandleScroll.current);
        };
    }, [events, visibleEvents, loading]);

    const handleScale = (newVisibleEvents) => {
        if (newVisibleEvents.length > 0) {
            const centerEvent = newVisibleEvents[Math.floor(newVisibleEvents.length / 2)];
            const adjacentEvents = [centerEvent + 1, centerEvent - 1];
            setCenterIndex(centerEvent);
            setAdjacentIndex(adjacentEvents);
        } else {
            setCenterIndex(null);
            setAdjacentIndex([]);
        }
    };

    const handleItemClick = (index) => {
        if (index >= 0 && index < events.length) {
            setActiveIndex(index);
            setActiveEvent(events[index]);
        }
    };

    const scrollTimeline = (direction) => {
        if (timelineRef.current) {
            const scrollAmount = 350;
            const newScrollLeft = timelineRef.current.scrollLeft + direction * scrollAmount;
            const maxScrollLeft = timelineRef.current.scrollWidth - timelineRef.current.clientWidth;

            if (newScrollLeft >= 0 && newScrollLeft <= maxScrollLeft) {
                timelineRef.current.scrollLeft = newScrollLeft;
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', options);
    };

    return (
		<div>
            <div className="fade-right"></div>
        <div style={{ position: "relative", overflow: "hidden", height: "100vh" }}>
            <div className="fade-left"></div>
            <div className="timeline-container">
                <div className="timeline" ref={timelineRef}>
                    <div className="timeline-spacer" style={{ width: "340px", flexShrink: 0 }}></div>
                    <div className="timeline-line"></div>

                    {events.map((event, index) => (
                        <div
                            id={`event-${index}`}
                            key={index}
                            className={`timeline-item ${index === activeIndex ? "active" : ""} ${index === centerIndex ? "center" : ""} ${adjacentIndex.includes(index) ? "adjacent" : ""}`}
                            onClick={() => handleItemClick(index)}
                        >
                            <div className={`timeline-circle ${index === activeIndex ? "active" : ""}`}></div>
                            <p>{formatDate(event.date)}</p>

                            <div className="timeline-box">
                                <img src={event.photo} alt={`Event ${index}`} className="timeline-image" />
                                {index === activeIndex && (
                                    <div>
                                        <div>
                                            <h4 className="display-6 event-title mt-1">{event.title}</h4>
                                        </div>
                                        <div className="participants-bubbles">
                                            {event.participants.slice(0, 3).map((participant, idx) => (
                                                <div key={idx} className="participant-bubble">
                                                    <img src={participant.profileImgUrl} alt={`Participant ${idx}`} className="participant-image" />
                                                </div>
                                            ))}
                                        </div>
                                            <Link href={`/evenementen/${event.id}`}>
                                                <button className="btn timeline-btn w-100">
                                                    Lees meer
                                                </button>
                                            </Link>
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
		</div>
    );
}
