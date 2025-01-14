import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { useRouter } from "next/router";

export default function Profile() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push("/inloggen");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Geen token gevonden.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Fout bij het ophalen van profielgegevens.");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    alert("Je bent succesvol uitgelogd!");
    setTimeout(() => {
      router.push("/inloggen");
    }, 2000);
  };

  const formatDate = (dob) => {
    if (!dob) return "Onbekend";
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const birthDate = new Date(dob);
    return birthDate.toLocaleDateString('nl-NL', options);  
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="profile-box border shadow-lg rounded-5 p-5">
        <div className="text-center">
          <div className="profile-picture">
            <img
              src={userData?.profileImgUrl}
              className="rounded-circle"
            />
          </div>
          <h3 className="mt-3">{userData?.firstName} {userData?.lastName}</h3>
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
                        <span>
                        {userData?.emailAddress}
                        </span>
                    </li>
                    <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                        <strong>Telefoonnummer:</strong>
                        <span>
                            {userData?.phoneNumber}
                        </span>
                    </li>
                    <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                        <strong>Gender:</strong>
                        <span>{userData?.gender}</span>
                    </li>
                    <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                        <strong>Geboortedatum:</strong>
                        <span>{formatDate(userData?.dateOfBirth)}</span>
                    </li>
                    <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
                        <strong>Leeftijd:</strong>
                        <span>{calculateAge(userData?.dateOfBirth)}</span>
                    </li>
                </ul>
          </div>
        )}

        <div className="row">
            <div className="col">
            <div className="text-center mt-4">
          <button className="btn btn-secondary" onClick={handleLogout}>
            Uitloggen
          </button>
        </div>

            </div>
        </div>

        
      </div>
    </div>
  );
}
