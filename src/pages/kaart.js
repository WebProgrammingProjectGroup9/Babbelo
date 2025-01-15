import { useEffect, useContext } from "react";
import { AuthContext } from "@/components/AuthContext";
export default function kaart() {
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
      if (!localStorage.getItem('token')) {
        router.push("/inloggen");
      }
    }, [isLoggedIn, router]);
    
    return (
      <div>
        <h2>Kaart</h2>
      </div>
    );
  }
  