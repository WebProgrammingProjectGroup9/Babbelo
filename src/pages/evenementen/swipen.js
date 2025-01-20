import EvenementenTabs from "@/components/EvenementenTabs";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/components/AuthContext";
import { useRouter } from "next/router";


export default function swipen() {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
      if (!localStorage.getItem('token')) {
        router.push("/inloggen");
      }
    }, [isLoggedIn, router]);

    return (
      <div>
        <EvenementenTabs />
        <div className="evenementen-container">
        <h1>Swipen</h1>
        </div>
      </div>
    );
  }
  