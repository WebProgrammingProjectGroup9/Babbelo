import { useState, useEffect } from "react";
import Link from 'next/link';
import EvenementenTabs from "@/components/EvenementenTabs";
import { useRouter } from "next/router";

export default function evenementen() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEventsByCategory, setAllEventsByCategory] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  }, []);

  const handleNewEvent = () => {
    router.push("/evenementen/nieuw");
  }

  return (
    <div>
      <EvenementenTabs />
      <div className="evenementen-container">
        <h2 className="fixed-title m-4">Aankomende evenementen</h2>
        <div className="row d-flex flex-nowrap scrollable-row">
          {upcomingEvents.map((event) => (
            <Link href={`/evenementen/${event.id}`} className="detail-link">
              <div key={event.id} className="card event-card card-evenementen">
                <img
                  src={event.photo !== "none" ? event.photo : "/images/image.png"}
                  className="card-img-top"
                  alt={event.title}
                />
                <div className="card-body bordered shadow">
                  <h5 className="card-title">{event.title}</h5>
                  <ul>
                    <li className="card-text">Categorie: {event.category}</li>
                    <li className="card-text">Datum: {event.date}</li>
                    <li className="card-text">Starttijd: {event.startTime}</li>
                    <li className="card-text">Eindtijd: {event.endTime}</li>
                    <li className="card-text">Organisator: {event.organisator?.firstName} {event.organisator?.lastName}</li>
                    <li className="card-text">Beschrijving: {event.description}</li>
                  </ul>
                </div>
              </div>
              </Link>
          ))}
        </div>

        {Object.entries(allEventsByCategory).map(([category, events]) => (
          <div key={category}>
            <h2 className="m-4">{category}</h2>
            <div className="row d-flex flex-nowrap scrollable-row">
              {events.map((event) => (
                <Link href={`/evenementen/${event.id}`} className="detail-link">

                <div key={event.id} className="card card-evenementen">
                  <img
                    src={event.photo !== "none" ? event.photo : "/images/image.png"}
                    className="card-img-top"
                    alt={event.title}
                  />
                  <div className="card-body bordered shadow">
                    <h5 className="card-title">{event.title}</h5>
                    <ul>
                      <li className="card-text">Categorie: {event.category}</li>
                      <li className="card-text">Datum: {event.date}</li>
                      <li className="card-text">Starttijd: {event.startTime}</li>
                      <li className="card-text">Eindtijd: {event.endTime}</li>  
                      <li className="card-text">Organisator: {event.organisator?.firstName} {event.organisator?.lastName}</li>
                      <li className="card-text">Beschrijving: {event.description}</li>
                    </ul>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div class="fab-container">
        <button className="fab" onClick={handleNewEvent}><i class="bi bi-plus"></i></button>
      </div>
    </div>
  );
}
