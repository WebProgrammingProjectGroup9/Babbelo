import Link from "next/link";
import { useState } from "react";

export default function Registreren() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Onbekend");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:3100/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          gender,
          phoneNumber,
          emailAddress,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Registratie mislukt. Controleer je gegevens.");
      }

      const data = await response.json();
      setSuccess("Je account is succesvol aangemaakt!");
      console.log("Response:", data);

      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setGender("Onbekend");
      setPhoneNumber("");
      setEmailAddress("");
      setPassword("");
    
      setTimeout(() => {
        window.location.href = "/inloggen";
      }, 300);
    } catch (err) {
      setError(err.message);
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container-fluid p-2 justify-content-center align-items-center col-xxl-8 col-xl-9">
      <form
        className="pe-5 ps-5 pt-4 pb-2 border shadow-lg rounded-5 mt-5 mb-5"
        onSubmit={handleRegister}
      >
        <div className="form-group mb-4 d-flex justify-content-center align-items-center">
          <h1>Babbelo</h1>
        </div>

        <div className="form-group mb-2 fw-bold fs-5">
          <label>Persoonlijke gegevens:</label>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label>Voornaam:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Voornaam"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px",
              }}
            />
          </div>

          <div className="col-md-6">
            <label>Achternaam:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Achternaam"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px",
              }}
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label>Leeftijd:</label>
            <input
              type="date"
              id="date"
              className="form-control"
              placeholder="Leeftijd"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              min="1900-01-01"
              max={currentDate}
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px",
              }}
            />
          </div>

          <div className="col-md-6">
            <label>Gender:</label>
            <select
              className="form-select"
              aria-label="Default select example"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px",
              }}
            >
              <option value="Man">Man</option>
              <option value="Vrouw">Vrouw</option>
              <option value="Onbekend">Specifeer ik liever niet</option>
            </select>
          </div>
        </div>

        {/* <div className="row mb-2">
          <div className="col-md-6">
            <label>Adresgegevens:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Straat"
              value={streetName}
              required
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px"
              }}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-3">
          <input
              type="text"
              className="form-control"
              placeholder="Huisnummer"
              value={houseNumber}
              required
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px"
              }}
            />
          </div>
          <div className="col-md-3">
          <input
              type="text"
              className="form-control"
              placeholder="Postcode"
              value={zipCode}
              required
              pattern="^[a-zA-Z]{4}[0-9]{2}"
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px"
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Plaats"
              value={city}
              required
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px"
              }}
            />
          </div>
        </div> */}

        <div className="form-group mb-4 mt-4">
          <label>Telefoonnummer:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Telefoonnummer"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            pattern="(?=.*[0-9]).{7,15}"
            title="Het ingevoerde nummer is geen geldig telefoon nummer"
            style={{
              borderRadius: "10px",
              padding: "15px",
              fontSize: "15px",
              marginTop: "10px",
            }}
          />
        </div>

        <div className="form-group mb-4">
          <label>E-mail:</label>
          <input
            type="email"
            className="form-control"
            placeholder="E-mailadres"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
            pattern="[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="De ingevoerde emailadres is geen geldig emailadres"
            style={{
              borderRadius: "10px",
              padding: "15px",
              fontSize: "15px",
              marginTop: "10px",
            }}
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="password">Wachtwoord:</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              className="form-control"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
              title="Het wachtwoord moet minstens een nummer en een hoofdletter hebben en 8 karakters lang zijn"
              required
              style={{
                borderRadius: "10px 0 0 10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px",
              }}
            />
            <span
              className="input-group-text"
              onClick={togglePasswordVisibility}
              style={{
                cursor: "pointer",
                borderRadius: "0 10px 10px 0",
                marginTop: "10px",
              }}
            >
              <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
            </span>
          </div>
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

        <div className="form-group mb-4 d-flex justify-content-end align-items-end">
          <button type="submit" className="btn btn-secondary">
            Registreren
          </button>
        </div>

        <div className="form-group mb-0 d-flex justify-content-center align-items-center">
          <p>
            Heb je al een account bij ons? Klik dan{" "}
            <Link href="/inloggen">hier</Link> om in te loggen
          </p>
        </div>
      </form>
    </div>
  );
}
