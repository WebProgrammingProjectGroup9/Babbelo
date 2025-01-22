import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Vrienden() {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendError, setFriendError] = useState("");
    const [requestError, setRequestError] = useState("");
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const account_id = localStorage.getItem("account_id");
        const token = localStorage.getItem("token");

        if (!account_id) {
            console.error("No account_id found in localStorage");
            return;
        }

        if (account_id !== id) {
            router.push("/profiel");
            return;
        }

        const fetchFriends = async () => {
            try {
                console.log("Fetching friends for account:", account_id);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neo4j/friend/${account_id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch friends list (Status: ${response.status})`);
                }
                
                const friendIds = await response.json();
                console.log("Received Friend IDs:", friendIds);

                if (!Array.isArray(friendIds)) {
                    throw new Error("Invalid response format for friends list");
                }

                const friendDetails = [];
                for (const friendId of friendIds) {
                    try {
                        console.log("Fetching friend details for:", friendId);
                        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/${friendId}`, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            method: "GET",
                        });

                        if (!userResponse.ok) {
                            console.error(`Failed to fetch details for friend ID: ${friendId} (Status: ${userResponse.status})`);
                            continue;
                        }

                        const userData = await userResponse.json();
                        console.log("Fetched Friend Details:", userData);
                        friendDetails.push(userData);
                    } catch (userErr) {
                        console.error("Error fetching individual friend details:", userErr);
                    }
                }

                console.log("Final Friend List:", friendDetails);
                setFriends(friendDetails);
            } catch (err) {
                console.error("Error fetching friends:", err);
                setFriendError(err.message);
            }
        };

        const fetchRequests = async () => {
            try {
                console.log("Fetching friend requests for account:", account_id);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neo4j/request/${account_id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch friend requests (Status: ${response.status})`);
                }

                const requestIds = await response.json();
                console.log("Received Friend Requests:", requestIds);

                if (!Array.isArray(requestIds)) {
                    throw new Error("Invalid response format for friend requests");
                }

                const requestDetails = [];
                for (const requestId of requestIds) {
                    try {
                        console.log("Fetching account details for:", requestId);
                        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/${requestId}`, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            method: "GET",
                        });

                        if (!userResponse.ok) {
                            console.error(`Failed to fetch account details for ID: ${requestId} (Status: ${userResponse.status})`);
                            continue;
                        }

                        const userData = await userResponse.json();
                        console.log("Fetched account details:", userData);
                        requestDetails.push(userData);
                    } catch (userErr) {
                        console.error("Error fetching individual request details:", userErr);
                    }
                }

                console.log("Friend Request Details:", requestDetails);
                setRequests(requestDetails);
            } catch (err) {
                console.error("Error fetching friend requests:", err);
                setRequestError(err.message);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            
            await fetchFriends();
            console.log("Waiting before fetching friend requests...");
            await new Promise((resolve) => setTimeout(resolve, 400));
            await fetchRequests();

            setLoading(false);
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleRequestApprove = async (id) => {
        console.log("handleRequestApprove called with id:", id);
    
        const id1 = parseInt(localStorage.getItem("account_id"), 10);
        const id2 = parseInt(id, 10);
    
        console.log("Parsed id1 from localStorage:", id1);
        console.log("Parsed id2 from argument:", id2);
    
        if (!id1) {
            console.error("No account_id found in localStorage");
            return;
        }
    
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
    
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("API URL is missing in environment variables");
            return;
        }
    
        try {
            console.log("Sending request to:", `${apiUrl}/neo4j/friend`);
    
            const response = await fetch(`${apiUrl}/neo4j/friend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id1: id2,
                    id2: id1
                }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to accept friend request (Status: ${response.status}):`, errorText);
                return;
            }
    
            console.log("Friend request accepted successfully");
    
            const acceptedFriend = requests.find(request => request._id === id);
    
            if (acceptedFriend) {
                setFriends(prevFriends => [...prevFriends, acceptedFriend]);
    
                setRequests(prevRequests => prevRequests.filter(request => request._id !== id));
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleRequestReject = async (id) => {
        console.log("handleRequestReject called with id:", id);
    
        const id1 = parseInt(localStorage.getItem("account_id"), 10);
        const id2 = parseInt(id, 10); 
    
        console.log("Parsed id1 from localStorage:", id1);
        console.log("Parsed id2 from argument:", id2);
    
        if (!id1) {
            console.error("No account_id found in localStorage");
            return;
        }
    
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
    
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("API URL is missing in environment variables");
            return;
        }
    
        try {
            console.log("Sending deny request to:", `${apiUrl}/neo4j/deny`);
    
            const response = await fetch(`${apiUrl}/neo4j/deny`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id1: id2, 
                    id2: id1,
                }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to deny friend request (Status: ${response.status}):`, errorText);
                return;
            }
    
            console.log("Friend request denied successfully");
    
            setRequests((prevRequests) =>
                prevRequests.filter((request) => request._id !== id)
            );
        } catch (error) {
            console.error("Error denying friend request:", error);
        }
    };
    
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
            <div className="row w-75 d-flex justify-content-center">
                <div className="col-md-12 col-lg-6 d-flex justify-content-center mb-3 mb-lg-0">
                    <div className="profile-box border shadow-lg rounded-5 p-5 w-100">
                        <h3 className="text-center">Vrienden</h3>
                        {loading ? (
                            <p>Gegevens laden...</p>
                        ) : friendError ? (
                            <p className="text-danger">{friendError}</p>
                        ) : (
                            <ul className="list-unstyled">
                                {friends.length > 0 ? (
                                    friends.map((friend, index) => (
                                        <Link
                                            href={`/account/${friend._id}`}
                                            key={friend.id}
                                            className="detail-link"
                                        >
                                            <li key={index} className="my-4 border-bottom pb-3 d-flex align-items-center">
                                                <img src={friend.profileImgUrl || `https://eu.ui-avatars.com/api/?name=${friend.firstName}+${friend.lastName}&size=250`} 
                                                    alt={`${friend.firstName} ${friend.lastName}`} 
                                                    className="rounded-circle me-3" width="50" height="50" />
                                                <span className="p-4 mb-2 d-none d-lg-none d-lg-inline d-xl-inline">{friend.firstName} {friend.lastName}</span>
                                            </li>
                                        </Link>
                                    ))
                                ) : (
                                    <p>Je hebt nog geen vrienden toegevoegd.</p>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="col-md-12 col-lg-6 d-flex justify-content-center mb-3 mb-lg-0">
                <div className="profile-box border shadow-lg rounded-5 p-5 w-100">
                    <h3 className="text-center">Verzoeken</h3>
                    {loading ? (
                        <p>Gegevens laden...</p>
                    ) : requestError ? (
                        <p className="text-danger">{requestError}</p>
                    ) : (
                        <ul className="list-unstyled">
                            {requests.length > 0 ? (
                                requests.map((request, index) => (
                                    <li
                                        key={index}
                                        className="my-4 border-bottom pb-3 d-flex align-items-center flex-wrap"
                                    >
                                        <div className="mx-3 gap-3">
                                            <Link
                                                href={`/account/${request._id}`}
                                                className="detail-link"
                                            >
                                                <img
                                                    src={request.profileImgUrl || `https://eu.ui-avatars.com/api/?name=${request.firstName}+${request.lastName}&size=250`}
                                                    alt={`${request.firstName} ${request.lastName}`}
                                                    className="rounded-circle"
                                                    width="50"
                                                    height="50"
                                                />
                                            </Link>
                                        </div>
                                        <span className="p-4 d-flex gap-3 flex-wrap">
                                            <button
                                                className="btn btn-primary mt-1"
                                                style={{
                                                    color: "white",
                                                    fontSize: "14px",
                                                    padding: "5px 15px",
                                                    borderRadius: "5px",
                                                    width: "100px",
                                                    height: "35px",
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log(
                                                        "Accept button clicked for request:",
                                                        request._id
                                                    );
                                                    handleRequestApprove(request._id);
                                                }}
                                            >
                                                Accepteren
                                            </button>
                                            <button
                                                className="btn btn-primary mt-1"
                                                style={{
                                                    color: "white",
                                                    fontSize: "14px",
                                                    padding: "5px 15px",
                                                    borderRadius: "5px",
                                                    width: "100px",
                                                    height: "35px",
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log(
                                                        "Reject button clicked for request:",
                                                        request._id
                                                    );
                                                    handleRequestReject(request._id);
                                                }}
                                            >
                                                Afwijzen
                                            </button>
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p>Je hebt geen nieuwe verzoeken.</p>
                            )}
                        </ul>
                    )}
                </div>

                </div>
            </div>
        </div>
    );
}
