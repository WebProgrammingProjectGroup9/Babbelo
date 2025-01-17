import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/components/AuthContext";

export default function AccountDetail() {
    const [userInfo, setUserInfo] = useState(null);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const { id } = router.query;
    const { isLoggedIn } = useContext(AuthContext);

    const loggedInAccountId = localStorage.getItem("account_id");

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            console.log("No token found, redirecting to login.");
            router.push("/inloggen");
        }
    }, [isLoggedIn, router]);

    useEffect(() => {
        const account_id = localStorage.getItem("account_id");

        if (account_id === id) {
            console.log("Logged-in user is visiting their own profile, redirecting to /profiel.");
            router.push("/profiel");
            return;
        }

        const fetchUserInfo = async () => {
            try {
                console.log("Fetching user info for id:", id);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user info");
                }
                const data = await response.json();
                console.log("User info fetched successfully:", data);
                setUserInfo(data);
            } catch (err) {
                console.error("Error fetching user info:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchFriends = async () => {
            try {
                console.log("Fetching friends for logged-in account ID:", loggedInAccountId);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neo4j/friend/${loggedInAccountId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch friends");
                }

                const data = await response.json();
                console.log("Friends fetched successfully:", data);
                setFriends(data);
            } catch (err) {
                console.error("Error fetching friends:", err);
            }
        };

        if (id) {
            fetchUserInfo();
            fetchFriends();
        }
    }, [id]);

    const handleAddFriend = async () => {
        const visitingAccountId = parseInt(id, 10);

        try {
            console.log("Sending friend request from", loggedInAccountId, "to", visitingAccountId);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neo4j/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    id1: parseInt(loggedInAccountId, 10),
                    id2: visitingAccountId,
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to add friend: ${responseData.message}`);
            }

            console.log("Friend request sent successfully:", responseData);

            setFriendRequests((prevRequests) => [...prevRequests, parseInt(loggedInAccountId, 10)]);
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    const handleUnfriend = async () => {
        const visitingAccountId = parseInt(id, 10);

        try {
            console.log("Sending unfriend request from", loggedInAccountId, "to", visitingAccountId);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neo4j/unfriend`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    id1: parseInt(loggedInAccountId, 10),
                    id2: visitingAccountId,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to unfriend: ${errorText}`);
            }

            console.log("Unfriend request processed successfully");

            setFriends((prevFriends) =>
                prevFriends.filter((friendId) => friendId !== visitingAccountId)
            );
        } catch (error) {
            console.error("Error unfriending:", error);
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return "Onbekend";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dob) => {
        if (!dob) return "Onbekend";
        const options = { day: "2-digit", month: "long", year: "numeric" };
        const birthDate = new Date(dob);
        return birthDate.toLocaleDateString("nl-NL", options);
    };

    const isFriendRequestSent = friendRequests.includes(parseInt(loggedInAccountId, 10));
    const isFriend = friends.includes(parseInt(id, 10));

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
            <div className="profile-box border shadow-lg rounded-5 p-5">
                <div className="text-center">
                    <div className="profile-picture">
                        <img
                            src={userInfo?.profileImgUrl}
                            className="rounded-circle"
                        />
                    </div>
                    <h3 className="mt-3">
                        {userInfo?.firstName} {userInfo?.lastName}
                    </h3>
                </div>

                {loading ? (
                    <p>Gegevens laden...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div className="profile-info mt-4">
                        <ul className="list-unstyled">
                            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                                <strong>E-mailadres:</strong>
                                <span>{userInfo?.emailAddress}</span>
                            </li>
                            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                                <strong>Telefoonnummer:</strong>
                                <span>{userInfo?.phoneNumber}</span>
                            </li>
                            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                                <strong>Gender:</strong>
                                <span>{userInfo?.gender}</span>
                            </li>
                            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                                <strong>Geboortedatum:</strong>
                                <span>{formatDate(userInfo?.dateOfBirth)}</span>
                            </li>
                            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                                <strong>Leeftijd:</strong>
                                <span>{calculateAge(userInfo?.dateOfBirth)}</span>
                            </li>
                        </ul>
                        {!isFriendRequestSent && !isFriend && id !== loggedInAccountId && (
                            <button className="btn btn-secondary" onClick={handleAddFriend}>
                                Vriend Toevoegen
                            </button>
                        )}
                        {isFriend && id !== loggedInAccountId && (
                            <button className="btn btn-secondary" onClick={handleUnfriend}>
                                Vriend Verwijderen
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
