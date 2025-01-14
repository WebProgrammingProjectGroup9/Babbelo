import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Sidebar() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="d-flex flex-column flex-lg-column vh-100 justify-content-between sidebar">
      <h1 className="d-none d-lg-block pt-5 ms-4 pb-2 text-center">Babbelo</h1>

      <ul className="nav flex-lg-column flex-row justify-content-around w-100 unstyled-list">
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

      <div className="mt-auto mb-3">
        {!isLoggedIn && (
          <div className="mb-2"> 
            <Link href="/inloggen">
              <button className="btn btn-secondary w-100">
                Inloggen
              </button>
            </Link>
          </div>
        )}
          <Link href="/profiel" className=" nav nav-link nav-item mb-2">
            <i className="bi bi-person-circle pe-2"></i>
            <span className="d-none d-lg-inline">Profiel</span>
          </Link>
        
      </div>
    </div>
  );
}
