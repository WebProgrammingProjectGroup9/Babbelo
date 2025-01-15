import { useEffect, useContext } from "react";
import { AuthContext } from "@/components/AuthContext";
import { useRouter } from "next/router";
export default function chats() {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
      if (!localStorage.getItem('token')) {
        router.push("/inloggen");
      }
    }, [isLoggedIn, router]);

    return (
      <div>
        <h2>Chats</h2>
      </div>
    );
  }
  