import { useState, useEffect, useContext } from "react";
import Link from 'next/link';
import EvenementenTabs from "@/components/EvenementenTabs";
import { useRouter } from "next/router";
import { AuthContext } from "@/components/AuthContext";

export default function evenementen() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEventsByCategory, setAllEventsByCategory] = useState({});
  const router = useRouter();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push("/inloggen");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token available, skipping fetchEvents");
          return; 
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        });

        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const sortedData = data.sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.startTime}`);
          const dateTimeB = new Date(`${b.date}T${b.startTime}`);
          return dateTimeA - dateTimeB;
        });

        const upcoming = sortedData.filter((event) => {
          const eventDateTime = new Date(`${event.date}T${event.startTime}`);
          return eventDateTime >= today && eventDateTime <= nextWeek;
        });

        const groupedByCategory = sortedData.reduce((acc, event) => {
          if (!acc[event.category]) {
            acc[event.category] = [];
          }
          acc[event.category].push(event);
          return acc;
        }, {});

        setUpcomingEvents(upcoming);
        setAllEventsByCategory(groupedByCategory);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [isLoggedIn]); 


  const handleNewEvent = () => {
    router.push("/evenementen/nieuw");
  }

  return (
    <div>
      <EvenementenTabs />
      <div className="evenementen-container">
        <h2 className="fixed-title m-4">Aankomende evenementen</h2>
        <div className="row flex-nowrap scrollable-row mb-4  ms-2">
          {upcomingEvents.map((event) => (
            <Link href={`/evenementen/${event.id}`} className="detail-link">
              <div key={event.id} className="card event-card ">
                <img
                  src={event.photo !== "none" ? event.photo : "/images/image.png"}
                  className="card-img-top"
                  alt={event.title}
                />
                <div className="card-body bordered shadow">
                  <h5 className="display-6 text-center border-bottom pb-2">{event.title}</h5>
                  <ul className="list-unstyled">
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-calendar-event me-2"></i>Datum:</strong>
                          <span>{new Date(event.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-clock me-2"></i>Begintijd:</strong>
                          <span>{new Date(`2025-01-01T${event.startTime}`).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-clock-history me-2"></i>Eindtijd:</strong>
                          <span>{new Date(`2025-01-01T${event.endTime}`).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-geo-alt me-2"></i>Plaats:</strong>
                          <span>{event.address.city}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-bookmark me-2"></i>Categorie:</strong>
                          <span>{event.category}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1">
                      <strong className="d-block mb-1">
                        <i className="bi bi-info-circle me-2"></i>Korte beschrijving:
                      </strong>
                      <span>{event.description}</span>
                    </li>

                  </ul>
                </div>
              </div>
              </Link>
          ))}
        </div>

        {Object.entries(allEventsByCategory).map(([category, events]) => (
          <div key={category}>
            <h2 className="m-4">{category}</h2>
            <div className="row flex-nowrap scrollable-row mb-4 ms-2">
              {events.map((event) => (
                <Link href={`/evenementen/${event.id}`} className="detail-link">

                <div key={event.id} className="card card-evenementen">
                  <img
                    src={event.photo !== "none" ? event.photo : "/images/image.png"}
                    className="card-img-top"
                    alt={event.title}
                  />
                  <div className="card-body  shadow">
                  <h5 className="display-6 text-center border-bottom pb-2">{event.title}</h5>
                  <ul className="list-unstyled">
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-calendar-event me-2"></i>Datum:</strong>
                          <span>{new Date(event.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-clock me-2"></i>Begintijd:</strong>
                          <span>{new Date(`2025-01-01T${event.startTime}`).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-clock-history me-2"></i>Eindtijd:</strong>
                          <span>{new Date(`2025-01-01T${event.endTime}`).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-geo-alt me-2"></i>Plaats:</strong>
                          <span>{event.address.city}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                          <strong><i className="bi bi-bookmark me-2"></i>Categorie:</strong>
                          <span>{event.category}</span>
                      </li>
                      <li className="mb-3 border-bottom pb-1">
                      <strong className="d-block mb-1">
                        <i className="bi bi-info-circle me-2"></i>Korte beschrijving:
                      </strong>
                      <span>{event.description}</span>
                    </li>
                  </ul>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fab-container">
        <button className="fab" onClick={handleNewEvent}><i className="bi bi-plus"></i></button>
      </div>
    </div>
  );
}
