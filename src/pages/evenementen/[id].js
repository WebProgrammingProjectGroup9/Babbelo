import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthContext } from "@/components/AuthContext";

export default function Detail() {
  const [event, setEvent] = useState(null);
  const [joined, setJoined] = useState(false); 
  const [loadingJoin, setLoadingJoin] = useState(false); 
  const router = useRouter();
  const { id } = router.query; 
  const [currentUser, setCurrentUser] = useState(null)
  const { isLoggedIn } = useContext(AuthContext);
  
  
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push("/inloggen");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const userId = localStorage.getItem("account_id");
    setCurrentUser(userId);
    
  }, []);

  useEffect(() => {
    if (!id || !currentUser) return;
  
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

       
  
        const eventData = await response.json();
        setEvent(eventData);
        console.log("Response:", eventData);
        const userJoined = eventData.participants.some(p => String(p.id) === String(currentUser));
        setJoined(userJoined);

      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
  
    fetchEvent();
  }, [id, currentUser]); 
  

  const handleJoin = async () => {
    setLoadingJoin(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to join event");
      }
      
      setJoined(true);
      
      setTimeout(() => {
        router.push(`/evenementen`);
      }, 300);
  
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Er is een fout opgetreden bij het aanmelden.");
    } finally {
      setLoadingJoin(false);
    }
  };

  if (!event) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border spinner" role="status">
            <span className="visually-hidden">Aan het laden...</span>
          </div>
          <p className="fs-1 fw-bold text-dark mt-3">Aan het laden...</p>
        </div>
      </div>
    );
  }

  const isOrganisator = String(event.organisator.id) === String(currentUser);
  
  return (
    <div className="container mt-5">
        <div className="row align-items-center g-1">
          <div className="col-lg-6 col-md-12 col-sm-12 p-3">
              <img
                  src={event.photoBase64}
                  alt={`${event.title}'s image`}
                  className="img-fluid shadow-lg rounded"
              />
          </div>

          <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="card bg-light shadow-lg shadow-lg p-3 detail-card">
                  <h1 className="display-5 text-center border-bottom pb-2">{event.title}</h1>
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
                          <strong><i className="bi bi-bookmark me-2"></i>Categorie:</strong>
                          <span>{event.category}</span>
                      </li>
                  </ul>
                  {!joined && !isOrganisator && (
                      <div className="mb-3">
                          <button
                              className="btn btn-primary w-100 p-3 rounded"
                              onClick={handleJoin}
                              disabled={loadingJoin}
                          >
                              {loadingJoin ? "Aanmelden..." : `Aanmelden voor ${event.title}`}
                          </button>
                      </div>
                  )}

                  {joined && (
                      <div className="alert alert-success text-center">
                          U bent al aangemeld voor {event.title}!
                      </div>
                  )}

                  {isOrganisator && (
                      <div className="alert alert-info text-center ">
                          U bent de organisator van dit event.
                      </div>
                  )}

              </div>
          </div>
        </div>

        {event.organisator && (
          <div className="row mt-5 mb-5">
            <div className="col-6">
              <div className="card shadow-lg">
                <div className="card-header bg-white">
                  <h3 className="display-6 text-center">Organisator</h3>
                </div>
                <div className="card-body">
                  <Link href={`/account/${event.organisator.id}`} className="detail-link">
                  <div className="d-flex align-items-center p-1 mb-4">
                    <img 
                      src={event.organisator.profileImgUrl} 
                      alt={`${event.organisator.firstName} ${event.organisator.lastName} profile image`} 
                      className="img-fluid rounded-circle me-3 profile-img" 
                    />
                    <div className="ps-2">
                      <h5 className="mb-1 fw-bold">
                        {event.organisator.firstName} {event.organisator.lastName}
                      </h5>
                      <p className="mb-0 text-muted">
                        <i className="bi bi-envelope me-2"></i>
                        {event.organisator.emailAddress || 'Geen e-mailadres beschikbaar'}
                      </p>
                      <p className="mb-0 text-muted">
                        <i className="bi bi-telephone me-2"></i>
                        {event.organisator.phoneNumber || 'Geen telefoonnummer beschikbaar'}
                      </p>
                    </div>
                  </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="row mt-5">
          <div className="col-6">
            <div className="card shadow-lg">
              <div className="card-header bg-white">
                <h3 className="display-6 text-center">Korte beschrijving</h3>
              </div>
              <div className="card-body">
                <p className="text-justify">{event.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5 mb-5">
        <div className="col-12">
          <div className="card shadow-lg">
            <div className="card-header bg-white">
              <h3 className="display-6 text-center">Extra informatie</h3>
            </div>
            <div className="card-body">
              <p className="text-justify">{event.information}</p>
            </div>
          </div>
        </div>
      </div>


      {event.participants && event.participants.length > 0 && (
        <div className="row mt-5 mb-5">
          <div className="col-12">
            <div className="card shadow-lg">
              <div className="card-header bg-white text-center">
                <h3 className="display-6">Deelnemers</h3>
              </div>
              <div className="card-body">
                <div className="row mt-3">
                  {event.participants.map((participant, index) => (
                    <Link href={`/account/${participant.id}`} key={participant.id} className="detail-link">
                    <div
                      className="col-12 col-md-6 col-lg-4 mb-4"
                      key={participant.id}
                    >
                      <div className="d-flex flex-row align-items-center p-3 h-100">
                        <img
                          src={participant.profileImgUrl}
                          alt={`${participant.firstName} ${participant.lastName} profile image`}
                          className="img-fluid rounded-circle me-3 profile-img"
                        />
                        <div>
                          <h5 className="mb-1">{participant.firstName} {participant.lastName}</h5>
                          <p className="mb-0 text-muted">
                            <i className="bi bi-envelope me-2"></i>
                            {participant.emailAddress || 'Geen e-mailadres beschikbaar'}
                          </p>
                          <p className="mb-0 text-muted">
                            <i className="bi bi-telephone me-2"></i>
                            {participant.phoneNumber || 'Geen telefoonnummer beschikbaar'}
                          </p>
                        </div>
                      </div>
                    </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
