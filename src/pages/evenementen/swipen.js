import EvenementenTabs from "@/components/EvenementenTabs";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/AuthContext";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import styles from "@/styles/SwipeAnimation.module.css";

export default function Swipen() {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [noMoreEvents, setNoMoreEvents] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(""); 
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/inloggen");
    } else {
      fetchEvents();
    }
  }, [token]);

  const fetchEvents = async () => {
    const accountId = localStorage.getItem("account_id");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/swipe/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(data);
        setCurrentEventIndex(0);
        setNoMoreEvents(false);
      } else {
        console.error("Unexpected response format", data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleLike = () => {
    setSwipeDirection("right");
    setTimeout(() => {
      const event = events[currentEventIndex];
      if (event) {
        router.push(`/evenementen/${event.id}`);
      }
    }, 300);
  };

  const handleDislike = () => {
    setSwipeDirection("left");
    setTimeout(() => {
      if (currentEventIndex < events.length - 1) {
        setCurrentEventIndex((prevIndex) => prevIndex + 1);
      } else {
        setNoMoreEvents(true);
      }
      setSwipeDirection("");
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleDislike(),
    onSwipedRight: () => handleLike(),
    preventDefaultTouchmoveEvent: true,
  });

  const event = events[currentEventIndex];

  return (
    <div>
      <EvenementenTabs />
      <div className="evenementen-container">
        {noMoreEvents ? (
          <h5 className="display-6 text-center border-bottom pb-2">Geen evenementen meer</h5>
        ) : (
          event && (
            <div
              className={`swipe-container container shadow-lg rounded px-0 pb-1 ${
                swipeDirection === "left" ? styles.swipeLeft : swipeDirection === "right" ? styles.swipeRight : ""
              }`}
              {...handlers}
            >
              <img
                src={event.photo !== "none" ? event.photo : "/images/image.png"}
                className="card-img-top rounded-top pb-3"
                alt={event.title}
              />
              <h5 className="display-6 text-center border-bottom pb-2">{event.title}</h5>
              <ul className="list-unstyled">
                <li className="mb-3 mx-3 border-bottom pb-1 d-flex justify-content-between">
                  <strong>
                    <i className="bi bi-calendar-event me-2"></i>Datum:
                  </strong>
                  <span>{new Date(event.date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</span>
                </li>
                <li className="mb-3 mx-3 border-bottom pb-1 d-flex justify-content-between">
                  <strong>
                    <i className="bi bi-clock me-2"></i>Begintijd:
                  </strong>
                  <span>{new Date(`2025-01-01T${event.startTime}`).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</span>
                </li>
                <li className="mb-3 mx-3 border-bottom pb-1 d-flex justify-content-between">
                  <strong>
                    <i className="bi bi-clock-history me-2"></i>Eindtijd:
                  </strong>
                  <span>{new Date(`2025-01-01T${event.endTime}`).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</span>
                </li>
                <li className="mb-3 mx-3 border-bottom pb-1 d-flex justify-content-between">
                  <strong>
                    <i className="bi bi-geo-alt me-2"></i>Plaats:
                  </strong>
                  <span>{event.address.city}</span>
                </li>
                <li className="mb-3 mx-3 border-bottom pb-1 d-flex justify-content-between">
                  <strong>
                    <i className="bi bi-bookmark me-2"></i>Categorie:
                  </strong>
                  <span>{event.category}</span>
                </li>
                <li className="mb-3 mx-3 border-bottom pb-3">
                  <strong className="d-block mb-1"></strong>
                    <i className="bi bi-info-circle me-2"></i><strong>Korte beschrijving: </strong>
                  <span>{event.description}</span>
                </li>
              </ul>
            </div>
          )
        )}
        {!noMoreEvents && (
          <div className="d-flex justify-content-between mt-3">
            <button className="btn-swipedislike btn btn-primary rounded-circle" onClick={handleDislike}>
              <i className="bi bi-x-lg h1"></i>
            </button>
            <button className="btn-swipelike btn btn-primary rounded-circle" onClick={handleLike}>
              <i className="bi bi-heart-fill h1"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
