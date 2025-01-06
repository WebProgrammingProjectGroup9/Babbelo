import Link from "next/link"

export default function Sidebar() {
    return  (
        <div className="sidebar col-xxl-3 col-xl-4">
          <h1 className="m-5">Babbelo</h1>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/evenementen" className="nav-link active m-3 my-4 ms-5 ps-5">
                <i className="bi bi-cup-hot pe-3"></i>
                Evenementen
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/kaart" className="nav-link active m-3 my-4 ms-5 ps-5">
                <i className="bi bi-map pe-3"></i>
                Kaart
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/tijdlijn" className="nav-link active m-3 my-4 ms-5 ps-5">
                <i className="bi bi-calendar-heart pe-3"></i>
                Tijdlijn
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/chats" className="nav-link active m-3 my-4 ms-5 ps-5">
                <i className="bi bi-chat pe-3"></i>
                Chats
              </Link>
            </li>
          </ul>
          <div className="fixed-bottom position-absolute mb-3 ms-5">
            <Link href="/inloggen">
                <button className="btn btn-secondary m3 my-4 ms-5">Inloggen</button>
            </Link>
          </div>
        </div>
    )
}