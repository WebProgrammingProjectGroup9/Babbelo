import { useState, useEffect } from "react";
import EvenementenTabs from "@/components/EvenementenTabs";

export default function evenementen() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEventsByCategory, setAllEventsByCategory] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3100/event");
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const sortedData = data.sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.time}`);
          const dateTimeB = new Date(`${b.date}T${b.time}`);
          return dateTimeA - dateTimeB;
        });

        const upcoming = sortedData.filter((event) => {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
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

  return (
    <div>
      <EvenementenTabs />
      <div className="evenementen-container">
        <h2 className="fixed-title m-4">aankomende evenementen</h2>
        <div className="row d-flex flex-nowrap scrollable-row">
          {upcomingEvents.map((event) => (
            <div key={event.eventNumber} className="card card-evenementen">
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
                  <li className="card-text">Tijd: {event.time}</li>
                  <li className="card-text">Organisator: {event.organisator}</li>
                  <li className="card-text">Beschrijving: {event.description}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        {Object.entries(allEventsByCategory).map(([category, events]) => (
          <div key={category}>
            <h2 className="m-4">{category}</h2>
            <div className="row d-flex flex-nowrap scrollable-row">
              {events.map((event) => (
                <div key={event.eventNumber} className="card card-evenementen">
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
                      <li className="card-text">Tijd: {event.time}</li>
                      <li className="card-text">Organisator: {event.organisator}</li>
                      <li className="card-text">Beschrijving: {event.description}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
