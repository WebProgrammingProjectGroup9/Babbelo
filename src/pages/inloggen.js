import Link from "next/link";
import { useState } from "react";

export default function Inloggen() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(""); 
    setSuccess(""); 

    try {
      const response = await fetch("http://localhost:3100/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress, password }),
      });

      if (!response.ok) {
        throw new Error("Ongeldige inloggegevens."); 
      }

      const data = await response.json();
      setSuccess("Je bent succesvol ingelogd!");
      console.log("Bearer Token:", data.token);

      localStorage.setItem("token", data.token);

      setTimeout(() => {
        window.location.href = "/evenementen";
      }, 300);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid p-2 flex-d justify-content-center align-items-center col-xxl-8 col-xl-9 d-flex justify-content-center align-items-center vh-100">
      <form
        className="pe-5 ps-5 pt-4 pb-2 border shadow-lg rounded-5"
        onSubmit={handleLogin}
      >
        <div className="form-group mb-4 d-flex justify-content-center align-items-center">
          <h1>Babbelo</h1>
        </div>
  
        <div className="form-group mb-3 fs-5">
          <label>Inloggen bij Babbelo: </label>
        </div>
  
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
  
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
  
        <div className="form-group mb-4">
          <label>Email: </label>
          <input
            type="email"
            className="form-control"
            placeholder="vul hier je emailadres in"
            required
            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
            title="De ingevoerde emailadres is geen geldig emailadres"
            style={{
              borderRadius: "10px",
              padding: "15px",
              fontSize: "15px",
            }}
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>
  
        <div className="form-group mb-4">
          <label htmlFor="password">Wachtwoord:</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              className="form-control"
              placeholder="Vul hier je wachtwoord in"
              pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
              title="Het wachtwoord moet minstens een nummer en een hoofdletter hebben en 8 karakters lang zijn"
              required
              style={{
                borderRadius: "10px 0 0 10px",
                padding: "15px",
                fontSize: "15px",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="input-group-text"
              onClick={togglePasswordVisibility}
              style={{
                cursor: "pointer",
                borderRadius: "0 10px 10px 0",
              }}
            >
              <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </span>
          </div>
        </div>
  
        <div className="form-group mb-4 d-flex justify-content-end align-items-end">
          <button type="submit" className="btn btn-secondary">
            Login
          </button>
        </div>
  
        <div className="form-group mb-0 d-flex justify-content-center align-items-center">
        <p>
            Ben je nog niet bekend bij ons? Maak dan eerst een nieuw account aan{' '}
            <Link href="/registreren">voor jezelf</Link> of{' '}
            <Link href="/registreren">je organisatie</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}  