import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export default function Sidebar() {
  const { isLoggedIn } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
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
          throw new Error("Fout bij het ophalen van gebruikersgegevens.");
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
      fetchUserData();
    }
  }, [isLoggedIn]);

  return (
    <div className="d-flex flex-column flex-lg-column vh-100 justify-content-between sidebar">
      <h1 className="pt-5 ms-4 pb-2 text-center d-none d-lg-inline">Babbelo</h1>

      {isLoggedIn && (
        <ul className="nav flex-lg-column flex-column  flex-row justify-content-around w-100 unstyled-list">
          <li className="nav-item">
            <Link href="/evenementen" className="nav-link mt-3 pb-5">
              <i className="bi bi-cup-hot pe-2"></i>
              <span className="d-none d-lg-inline">Evenementen</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/kaart" className="nav-link pb-5">
              <i className="bi bi-map pe-2"></i>
              <span className="d-none d-lg-inline">Kaart</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/tijdlijn" className="nav-link pb-5">
              <i className="bi bi-calendar-heart pe-2"></i>
              <span className="d-none d-lg-inline">Tijdlijn</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/chats" className="nav-link pb-5">
              <i className="bi bi-chat pe-2"></i>
              <span className="d-none d-lg-inline">Chats</span>
            </Link>
          </li>
        </ul>
      )}

      <div className="mt-auto mb-5">
        {!isLoggedIn && (
          <div className="mb-2">
            <Link href="/inloggen">
              <button className="btn btn-secondary w-100">Inloggen</button>
            </Link>
          </div>
        )}
        {isLoggedIn && !loading && userData && (
          <Link href="/profiel" className="nav nav-link nav-item mb-2">
            <img
              src={userData.profileImgUrl || `https://eu.ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&size=250`}
              alt="Profiel afbeelding"
              className="rounded-circle me-2"
              style={{ width: "50px", height: "50px" }}
            />
            <span className="d-none d-lg-inline">{userData.firstName} {userData.lastName}</span>
          </Link>
        )}
        {isLoggedIn && loading && (
          <div className="nav nav-link nav-item mb-2">
            <i className="bi bi-person-circle pe-2"></i>
            <span className="d-none d-lg-inline">Laden...</span>
          </div>
        )}
        {isLoggedIn && error && (
          <div className="nav nav-link nav-item mb-2 text-danger">
            <i className="bi bi-person-circle pe-2"></i>
            <span className="d-none d-lg-inline">Fout</span>
          </div>
        )}
      </div>
    </div>
  );
}
