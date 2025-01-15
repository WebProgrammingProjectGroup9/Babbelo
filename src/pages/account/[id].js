import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AccountDetail() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const account_id = localStorage.getItem("account_id");

        if (account_id === id) {
            router.push("/profiel");
            return;
        }

        const fetchUserInfo = async () => {
            try {
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
                setUserInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserInfo();
        }
    }, [id]);

    const handleAddFriend = async () => {
        const loggedInAccountId = parseInt(localStorage.getItem("account_id"), 10);
        const visitingAccountId = parseInt(id, 10);
    
        console.log("Account 1:", loggedInAccountId, "Account 2:", visitingAccountId);
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neo4j/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    id1: loggedInAccountId,
                    id2: visitingAccountId
                })
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                throw new Error(`Failed to add friend: ${responseData.message}`);
            }
    
            console.log("Friend request sent successfully:", responseData);
        } catch (error) {
            console.error("Error adding friend:", error);
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
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const birthDate = new Date(dob);
        return birthDate.toLocaleDateString('nl-NL', options);  
    };

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
                    <h3 className="mt-3">{userInfo?.firstName} {userInfo?.lastName}</h3>
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
                        <button className="btn btn-secondary"onClick={handleAddFriend}>Vriend toevoegen</button>
                    </div>  
                )}
            </div>
        </div>
    );
}