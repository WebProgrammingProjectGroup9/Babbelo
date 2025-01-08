import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Detail() {
	const router = useRouter();
	const { id } = router.query;
	const [event, setEvent] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [organisator, setOrganisator] = useState(null);
	const [catPic, setCat] = useState(null);

	useEffect(() => {
		if (!id) return; // Ensure `id` exists before fetching

		const fetchEvents = async () => {
			try {
				const cat = await fetch("https://api.thecatapi.com/v1/images/search");
				const catdata = await cat.json();
				setCat(catdata[0].url);
				const response = await fetch(`http://localhost:3100/event/${id}/participants`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjo2LCJpYXQiOjE3MzYxNjYyMjQsImV4cCI6MTczNzIwMzAyNH0.0lKe7ouafErWfsz7X3l_bm4--Z29DElLydn0xX0VX6g`,
					},
				});

				if (!response.ok) throw new Error("Failed to fetch events");

				const eventData = await response.json();
				setParticipants(eventData.participants);
				setEvent(eventData);
                console.log(eventData);

				const organisatorRes = await fetch(`http://localhost:3100/account/${eventData.organisator}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjo2LCJpYXQiOjE3MzYxNjYyMjQsImV4cCI6MTczNzIwMzAyNH0.0lKe7ouafErWfsz7X3l_bm4--Z29DElLydn0xX0VX6g`,
					},
				});
				if (!organisatorRes.ok) throw new Error("Failed to fetch organisator");
				const organisatorData = await organisatorRes.json();
				setOrganisator(organisatorData);
			} catch (error) {
				console.error("Error fetching event data:", error);
			}
		};

		fetchEvents();
	}, [id]);

	if (!id) return <p>Loading...</p>;
	if (!event) return <p>Loading event...</p>;
	if (!organisator) return <p>Loading organisator...</p>;
	if (!participants) return <p>Loading participants...</p>;

    return (
        <div className="container py-5 col-11">
            <header className="text-center mb-5">
                <h1 className="display-4">{event.title}</h1>
                <p className="h5">{event.category}</p>
            </header>
    
            <div className="row mb-5">
                <div className="col-md-6 mb-4">
                    <div className="bg-light p-4 rounded shadow-sm">
                        <h2 className="h4 mb-3">Details</h2>
                        <p>
                            <strong>Datum:</strong> {event.date}
                        </p>
                        <p>
                            <strong>Tijd:</strong> {event.startTime} - {event.endTime}
                        </p>
                        <p>{event.description}</p>
                    </div>
                </div>
    
                <div className="col-md-6 mb-4 text-center">
                    <img
                        className="img-fluid rounded shadow-sm"
                        src={catPic}
                        alt="A decorative image for the event (random cat image)."
                    />
                </div>
            </div>
    
            <div className="mb-5">
                <h2 className="text-center mb-4">Organisator</h2>
                <div className="d-flex flex-column flex-md-row align-items-start bg-light p-4 rounded shadow-sm">
                    <div className="me-md-4 mb-3 mb-md-0 text-center">
                        <img
                            className="rounded-circle object-fit-cover"
                            height="120px"
                            width="120px"
                            src={organisator.profileImgUrl}
                            alt={`Profile picture of ${organisator.firstName} ${organisator.lastName}`}
                        />
                    </div>
    
                    <div>
                        <p>
                            <strong>Naam:</strong> {organisator.firstName} {organisator.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {organisator.emailAddress}
                        </p>
                    </div>
                </div>
            </div>
    
            <div className="mb-5">
                <h2 className="text-center mb-4">Deelnemers</h2>
                <div className="d-flex flex-wrap justify-content-center gap-4">
                    {participants.map((participant) => (
                        <div
                            key={participant.id}
                            className="text-center bg-light p-3 rounded shadow-sm"
                            style={{ width: "150px", minHeight: "180px" }}
                        >
                            <img
                                className="rounded-circle object-fit-cover mb-3"
                                height="100px"
                                width="100px"
                                src={participant.profileImgUrl}
                                alt={`Profile picture of ${participant.firstName} ${participant.lastName}`}
                            />
                            <p className="mb-0">
                                <strong>{participant.firstName}</strong>
                            </p>
                            <p>{participant.lastName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
}
