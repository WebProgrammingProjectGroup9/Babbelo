import EvenementenTabs from "@/components/EvenementenTabs";
import { AuthContext } from "@/components/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';

export default function Aangemeld() {
  const { isLoggedIn } = useContext(AuthContext);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("account_id");
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/inloggen");
      return;
    }

    const fetchRegisteredEvents = async () => {
      try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/timeline/${userId}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        method: "GET",
      });

        if (!response.ok) throw new Error("Failed to fetch registered events");

        const data = await response.json();

        const sortedEvents = data.sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.startTime}`);
          const dateTimeB = new Date(`${b.date}T${b.startTime}`);
          return dateTimeA - dateTimeB;
        });

        setRegisteredEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      }
    };

    fetchRegisteredEvents();
  }, [isLoggedIn, router]);

  return (
    <div>
      <EvenementenTabs />
      <div className="evenementen-container">
        <h2 className="m-4">Mijn Aangemelde Evenementen</h2>
        {registeredEvents.length > 0 ? (
          <div className="row flex-nowrap scrollable-row mb-4 ms-2">
            {registeredEvents.map((event) => (
              <Link key={event.id} href={`/evenementen/${event.id}`} className="detail-link">
                <div className="card event-card">
                  <img
                    src={event.photo !== "none" ? event.photo : "/images/image.png"}
                    className="card-img-top"
                    alt={event.title}
                  />
                  <div className="card-body shadow">
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
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="m-4">Je bent nog niet aangemeld voor evenementen.</p>
        )}
      </div>
    </div>
  );
}
