import EvenementenTabs from "@/components/EvenementenTabs";
import { AuthContext } from "@/components/AuthContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

export default function aangemeld() {
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
        <h1>Aangemeld</h1>
        </div>
      </div>
    );
  }
  