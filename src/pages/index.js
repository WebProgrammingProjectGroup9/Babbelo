import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("token");

    if (isLoggedIn) {
      router.push("/evenementen"); 
    } else {
      router.push("/inloggen");
    }
  }, [router]);

  return (
    <div className="m-5">
      <h2>Redirecting...</h2>
    </div>
  );
}
