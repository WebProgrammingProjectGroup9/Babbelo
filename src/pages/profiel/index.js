import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthContext";
import { useRouter } from "next/router";

export default function Profile() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
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
    localStorage.removeItem("token");
    localStorage.removeItem("account_id");
    setTimeout(() => {
      router.push("/inloggen");
    }, 2000);
  };

  const formatDate = (dob) => {
    if (!dob) return "Onbekend";
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const birthDate = new Date(dob);
    return birthDate.toLocaleDateString("nl-NL", options);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Gegevens laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return userData?.organisationName ? (
    // wel org
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="profile-box border shadow-lg rounded-5 p-5">
        <div className="text-center">
          <div className="profile-picture">
            <img
              src={userData?.profileImgUrl || `https://eu.ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&size=250`}
              className="rounded-circle"
            />
          </div>
          <h3 className="mt-3">{userData?.organisationName}</h3>
        </div>
        <div className="profile-info mt-4">
          <ul className="list-unstyled">
          <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
              <strong>Contact Persoon:</strong>
              <span>{userData?.firstName + ' ' + userData?.lastName}</span>
            </li>
            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
              <strong>Gender:</strong>
              <span>{userData?.gender}</span>
            </li>
            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
              <strong>E-mailadres:</strong>
              <span>{userData?.emailAddress}</span>
            </li>
            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
              <strong>Telefoonnummer:</strong>
              <span>{userData?.phoneNumber}</span>
            </li>
            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
              <strong>Website:</strong>
              <span>{userData?.website || "geen website"}</span>
            </li>
            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
              <strong>KvK:</strong>
              <span>{userData?.chamberOfCommerce}</span>
            </li>
            <li className="list-group-item">
              <div className="row">
                <div className="col-4 text-start pe-4">
                  <strong>Adres gegevens:</strong>
                </div>
                <div className="col-8 text-end ps-4">
                  <div>{userData?.address.streetName + " " + userData?.address.houseNumber}</div>
                  <div>{userData?.address.city}</div>
                  <div>{userData?.address.zipCode}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-secondary me-4" onClick={handleLogout}>
            Uitloggen
          </button>
          <button className="btn btn-secondary" 
            onClick={() => router.push(`/profiel/vrienden?id=${localStorage.getItem("account_id")}`)}
            >Vrienden Bekijken
          </button>
        </div>
      </div>
    </div>
  ) : (
    // geen org
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="profile-box border shadow-lg rounded-5 p-5">
        <div className="text-center">
          <div className="profile-picture">
            <img
              src={userData?.profileImgUrl || `https://eu.ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&size=250`}
              className="rounded-circle"
            />
          </div>
          <h3 className="mt-3">{userData?.firstName} {userData?.lastName}</h3>
        </div>
        <div className="profile-info mt-4">
          <ul className="list-unstyled">
            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
              <strong>E-mailadres:</strong>
              <span>{userData?.emailAddress}</span>
            </li>
            <li className="mb-3 border-bottom pb-1 d-flex justify-content-between">
              <strong>Telefoonnummer:</strong>
              <span>{userData?.phoneNumber}</span>
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
        <div className="text-center mt-4">
          <button className="btn btn-secondary me-4" onClick={handleLogout}>
            Uitloggen
          </button>
          <button className="btn btn-secondary" 
            onClick={() => router.push(`/profiel/vrienden?id=${localStorage.getItem("account_id")}`)}
            >Vrienden Bekijken
          </button>
        </div>
      </div>
    </div>
  );
}
