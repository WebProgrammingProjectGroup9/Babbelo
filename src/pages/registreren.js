import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { useRouter } from "next/router";

export default function Registreren() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Onbekend");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [streetName, setStreetName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [chamberOfCommerce, setChamberOfCommerce] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selected, setSelected] = useState("particulier");

  const { login } = useContext(AuthContext);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("De wachtwoorden komen niet overeen.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
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
          emailAddress: emailAddress.toLowerCase(),
          password,
          streetName,
          houseNumber,
          zipCode,
          city,
          organisationName,
          website,
          chamberOfCommerce
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
      setConfirmPassword("");
      setZipCode("");
      setStreetName("");
      setHouseNumber("");
      setCity("");
      setChamberOfCommerce("");
      setOrganisationName("");
      setWebsite("");

      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress: emailAddress.toLowerCase(), password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Account is aangemaakt, maar automatisch inloggen is mislukt.");
      }

      const loginData = await loginResponse.json();

      localStorage.setItem("account_id", loginData.id);
      login(loginData.token); 
      localStorage.setItem("token", loginData.token); 
      setSuccess("Je bent succesvol ingelogd!");

      setTimeout(() => {
        router.push("/evenementen");
      }, 500);

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
          <label>Registreren als:</label>
        </div>

        <div class="form-check form-check-inline mb-4">  
          <input 
          class="form-check-input" 
          type="radio" 
          name="inlineRadioOptions" 
          id="radioUser" 
          value="particulier" 
          checked={selected === "particulier"}
          onChange={(e) => setSelected(e.target.value)}
          />
          <label class="form-check-label" for="radioUser" >Particulier</label>
        </div>

        <div class="form-check form-check-inline">
          <input  
          class="form-check-input" 
          type="radio" 
          name="inlineRadioOptions" 
          id="radioOrg" 
          value="organisatie" 
          checked={selected === "organisatie"}
          onChange={(e) => setSelected(e.target.value)}
          />
          <label class="form-check-label" for="radioOrg">Organisatie</label>
        </div>

        {selected === "organisatie" ? (
          <div className="form-group mb-4 fw-bold fs-5">
          <label>Organisatie gegevens:</label>
        </div>
        ) : (
          <div className="form-group mb-4 fw-bold fs-5">
            <label>Persoonlijke gegevens:</label>
          </div>
        )}

        

        {selected === "organisatie" && (
          <>
          <div className="row form-group mb-4">
            <div className="col">
              <label>Organisatienaam:</label>
              <input
              type="text"
              className="form-control"
              placeholder="Organisatienaam"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
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
          </>
        )}

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
          {selected === "particulier" && (
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
          )}

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

        <div className="row mb-2">
          <div className="col-md-6">
            <label>Adresgegevens:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Straat"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
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
              onChange={(e) => setHouseNumber(e.target.value)}
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
              onChange={(e) => setZipCode(e.target.value)}
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

        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Plaats"
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
            pattern="^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="De ingevoerde emailadres is geen geldig emailadres"
            style={{
              borderRadius: "10px",
              padding: "15px",
              fontSize: "15px",
              marginTop: "10px",
            }}
          />
        </div>

        {selected === "organisatie" && (
          <>

          {/* <div className="row form-group mb-4">
            <div className="col">
              <label>Organisatienaam:</label>
              <input
              type="text"
              className="form-control"
              placeholder="Organisatienaam"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px",
              }}
              />
            </div>
          </div> */}

          <div className="row form-group mb-4">
            <div className="col">
              <label>Website:</label>
              <input
              type="text"
              className="form-control"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "15px",
                fontSize: "15px",
                marginTop: "10px",
              }}
              />
            </div>
          </div>

          <div className="row form-group mb-4">
            <div className="col">
              <label>KVK-nummer:</label>
              <input
              type="text"
              className="form-control"
              placeholder="KVK-nummer"
              value={chamberOfCommerce}
              onChange={(e) => setChamberOfCommerce(e.target.value)}
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
          </>
        )}

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

        <div className="form-group mb-4">
          <label htmlFor="confirmPassword">Bevestig Wachtwoord:</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              className="form-control"
              placeholder="Bevestig Wachtwoord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClick={toggleConfirmPasswordVisibility}
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
