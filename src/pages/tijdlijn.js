import React, { useState, useRef, useEffect } from "react";

const Tijdlijn = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [visibleEvents, setVisibleEvents] = useState([]);
	const timelineRef = useRef(null);
	const timelineCon = useRef(null);
	const [centerIndex, setCenterIndex] = useState(0);
	const [adjacentIndex, setAdjacentIndex] = useState([-1, 1]);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const events = [
		{ date: "0-05-2025", image: "/images/image.png", title: "Event 0", participants: [{ name: "Henk Jan", profileImgUrl: "https://weekbladparty.nl/wp-content/uploads/generated-images/20487/Henkjan-Smits-1275x0.png" }] },
		{ date: "1-01-2025", image: "/images/image.png", title: "Event 1", participants: [{ name: "Henk Jan", profileImgUrl: "https://weekbladparty.nl/wp-content/uploads/generated-images/20487/Henkjan-Smits-1275x0.png" }] },
		{ date: "2-03-2025", image: "/images/image.png", title: "Event 2" },
		{ date: "3-03-2025", image: "/images/image.png", title: "Event 3" },
		{ date: "4-03-2025", image: "/images/image.png", title: "Event 4" },
		{ date: "5-03-2025", image: "/images/image.png", title: "Event 5" },
		{ date: "6-03-2025", image: "/images/image.png", title: "Event 6" },
		{ date: "7-03-2025", image: "/images/image.png", title: "Event 7" },
		{ date: "8-03-2025", image: "/images/image.png", title: "Event 8" },
		{ date: "9-03-2025", image: "/images/image.png", title: "Event 9" },
		{ date: "10-03-2025", image: "/images/image.png", title: "Event 10" },
	];

	const debouncedHandleScroll = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
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

		const throttledScrollHandler = () => {
			const now = Date.now();
			const throttleDelay = 200;

			if (!debouncedHandleScroll.current || now - debouncedHandleScroll.current >= throttleDelay) {
				debouncedHandleScroll.current = now;
				handleScroll();
			}
		};

		window.addEventListener("resize", throttledScrollHandler, { passive: true });
		timelineRef.current.addEventListener("scroll", throttledScrollHandler, { passive: true });

		handleScroll();

		return () => {
			timelineCon.current.removeEventListener("scroll", throttledScrollHandler);
			window.removeEventListener("resize", throttledScrollHandler);
		};
	}, [visibleEvents]);

	useEffect(() => {
		if (activeIndex !== null && !visibleEvents.includes(activeIndex)) {
			setActiveIndex(null);
		}
	}, [visibleEvents, activeIndex]);

	useEffect(() => {
		console.log("joe");
		if (activeIndex !== null) {
			const eventElement = document.getElementById(`event-${activeIndex}`);
			if (eventElement) {
				console.log(activeIndex);
				const item = eventElement.getBoundingClientRect();
				const timeline = timelineRef.current.getBoundingClientRect();
				const itemCenter = item.left + item.width / 2;
				const timelineCenter = timeline.left + timeline.width / 2;
				const scroll = itemCenter - timelineCenter;

				timelineRef.current.scrollTo({
					left: timelineRef.current.scrollLeft + scroll,
				});
			}
		}
	}, [activeIndex]);

	const handleItemClick = (index) => {
		console.log("index", index);
		setActiveIndex(index);
	};




	const handleEventClick = (index) => {
		setSelectedEvent(events[index])
		const modal = new window.bootstrap.Modal(document.getElementById("eventModal"));
		modal.show();
	}

	const handleScale = (newVisibleEvents) => {
		const centerEvent = newVisibleEvents[Math.floor(newVisibleEvents.length / 2)];
		const adjacentEvents = [centerEvent + 1, centerEvent - 1];
		setCenterIndex(centerEvent);
		setAdjacentIndex(adjacentEvents);
	};

	const scrollTimeline = (direction) => {
		if (timelineRef.current) {
			const scrollAmount = 350;
			timelineRef.current.scrollLeft += direction * scrollAmount;
		}
	};



	return (
		<div style={{ position: "relative", overflowY: "hidden", height: "100vh" }}>
			<div className="fade-right"></div>
			<div className="fade-left"></div>
			<div className="timeline-container" ref={timelineCon}>
				<div className="timeline" ref={timelineRef}>
					<div className="timeline-spacer" style={{ width: "400px", flexShrink: 0 }}></div>
					<div className="timeline-line"></div>

					{events.map((event, index) => (
						<div id={`event-${index}`} key={index} className={`timeline-item ${index === activeIndex ? "active" : ""} ${index === centerIndex ? "center" : ""} ${adjacentIndex.includes(index) ? "adjacent" : ""}`} onClick={() => handleItemClick(index)}>
							<div className={`timeline-circle ${index === activeIndex ? "active" : ""}`}></div>
							<p>{event.date}</p>
							<div className="timeline-box">
								<img src={event.image} alt={`Event ${index}`} className="timeline-image" />
								{index === activeIndex && (
									<div className="timeline-details">
										<h4>{event.title}</h4>
									</div>
								)}
								{index === activeIndex && (
									<button type="button" onClick={()=> handleEventClick(index)}>
										Lees meer
									</button>
								)}
							</div>

							{index === activeIndex && event.participants && event.participants.length > 0 ? (
								event.participants.map((participant, index) => (
									<div key={index} className="timeline-participants">
										<img src={participant.profileImgUrl} alt={participant.name} />
									</div>
								))
							) : (
								<p></p>
							)}
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
			<div className="modal fade" id="eventModal" tabIndex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="eventModalLabel">{selectedEvent ? selectedEvent.title : "Loading..."}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {selectedEvent ? (
                <>
                  <p>{selectedEvent.date}</p>
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="img-fluid" />
                  <p>Details about the event...</p>
                </>
              ) : (
                <p>Loading event details...</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
			
		</div>
	);
};

export default Tijdlijn;
