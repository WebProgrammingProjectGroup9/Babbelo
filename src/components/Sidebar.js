import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="sidebar d-flex flex-column col-xxl-3 col-xl-4">
            <h1 className="d-flex justify-content-center my-5">Babbelo</h1>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link href="/evenementen" className="nav-link active m-3 my-4 ms-4 ps-5">
                        <i className="bi bi-cup-hot pe-3"></i>
                        Evenementen
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/kaart" className="nav-link active m-3 my-4 ms-4 ps-5">
                        <i className="bi bi-map pe-3"></i>
                        Kaart
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/tijdlijn" className="nav-link active m-3 my-4 ms-4 ps-5">
                        <i className="bi bi-calendar-heart pe-3"></i>
                        Tijdlijn
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/chats" className="nav-link active m-3 my-4 ms-4 ps-5">
                        <i className="bi bi-chat pe-3"></i>
                        Chats
                    </Link>
                </li>
            </ul>
            <div className="mt-auto d-flex justify-content-center mb-4">
                <Link href="/inloggen">
                    <button className="btn btn-secondary">Inloggen</button>
                </Link>
            </div>
        </div>
    );
}
