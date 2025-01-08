import { useRouter } from 'next/router';
import Link from 'next/link';

export default function EvenementenTabs() {
    const router = useRouter();
    const { pathname } = router;

    return (
        <ul className="nav nav-tabs pt-4 ms-n1 d-flex">
            <li className="nav-item ps-4">
                <Link href="/evenementen" className={`nav-link ${pathname === '/evenementen' ? 'active' : ''}`} aria-current="page">
                    Evenementen
                </Link>
            </li>
            <li className="nav-item ps-3">
                <Link href="/evenementen/aangemeld" className={`nav-link ${pathname === '/evenementen/aangemeld' ? 'active' : ''}`} aria-current="page">
                    Aangemeld
                </Link>
            </li>
            <li className="nav-item ps-3 ">
                <Link href="/evenementen/swipen" className={`nav-link ${pathname === '/evenementen/swipen' ? 'active' : ''}`} aria-current="page">
                    Verras me
                </Link>
            </li>
            <li className="nav-item ps-3">
                <Link href="/evenementen/nieuw" className={`nav-link ${pathname === '/evenementen/nieuw' ? 'active' : ''}`} aria-current="page">
                    Nieuw
                </Link>
            </li>
        </ul>
    );
}
