import Link from "next/link";
import { useState } from "react";

export default function registreren() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);


    };
    const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="container-fluid p-2 justify-content-center align-items-center col-xxl-8 col-xl-9">
      <form className="pe-5 ps-5 pt-4 pb-2 border shadow-lg rounded-5 mt-5 mb-5">

        <div className="form-group mb-4 d-flex justify-content-center align-items-center">
          <h1>Babbelo</h1>
        </div>

        <div className="form-group mb-2 fw-bold fs-5">
          <label>Persoonlijke gegevens:  </label>
        </div>

        <div className="form-group mb-4" style={{ 
            display: "flex", 
            gap: "25px" 
            }}>
            <div style={{ flex: 1 }}>
            <label>Voornaam: </label>
            <input
                type="text"
                className="form-control"
                placeholder="Vul hier je voornaam in"
                required
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px",
                }}
            />
        </div>

        <div style={{ 
            flex: 1 
            }}>
            <label>Achternaam: </label>
            <input
                type="text"
                className="form-control"
                placeholder="Vul hier je achternaam in"
                required
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px",
                }}
            />
        </div>
    </div>

    <div className="form-group mb-4" style={{ 
        display: "flex", 
        gap: "25px" 
        }}>
            <div style={{ flex: 1 }}>
            <label>Leeftijd: </label>
            <input
                type="date"
                id="date"
                className="form-control"
                placeholder="Vul hier je leeftijd in"
                required
                min="1900-01-01"
                max={currentDate}
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px"
                }}
            />
        </div>

        <div style={{ 
            flex: 1 
            }}>
            <label>Gender: </label>
            <select className="form-select" 
            aria-label="Default select example"
            required
            style={{
                borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px"
            }}>
                <option value="Man">Man</option>
                <option value="Vrouw">Vrouw</option>
                <option selected value="Onbekend">Specifeer ik liever niet</option>
            </select>
        </div>
    </div>

    <div className="form-group mb-4" 
    style={{ 
        display: "flex", 
        gap: "25px" 
        }}>
            <div style={{ 
                flex: 1 
                }}>
            <label>Adresgegevens: </label>
            <input
                type="text"
                className="form-control"
                placeholder="Vul hier je straatnaam in"
                required
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px",
                }}
            />
            <input
                type="text"
                className="form-control mt-2"
                placeholder="Vul hier je plaatsnaam in"
                required
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px",
                }}
            />
        </div>

        <div style={{ 
            flex: 1 
            }}>
            <label></label>
            <input
                type="text"
                className="form-control"
                placeholder="Vul hier je postcode in"
                required
                pattern="^[a-zA-Z]{4}[0-9]{2}"
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px",
                }}
            />
        </div>
    </div>
    
    <div className="form-group mb-4">
            <label>Telefoon nummer: </label>
            <input
                type="text"
                className="form-control"
                placeholder="vul hier je telefoon nummer in"
                required
                pattern="(?=.*[0-9]).{7,15}"
                title="De ingevoerde nummer is geen geldig telefoon nummer"
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px",
                }}
            />
        </div>

        <div className="form-group mb-2 fw-bold fs-5">
            <label>
                Inlog gegevens
            </label>
        </div>

        <div className="form-group mb-4">
            <label>Email: </label>
            <input
                type="email"
                className="form-control"
                placeholder="vul hier je emailadres in"
                required
                pattern="[a-z0-9._-\-]+@[a-z0-9._-]+\.[a-z]{2,}$"
                title="De ingevoerde emailadres is geen geldig emailadres"
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px",
                }}
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
            borderRadius: "10px 0 0 10px", // Rounded left corners
            padding: "15px",
            fontSize: "15px",
          }}
        />
        <span
          className="input-group-text"
          onClick={togglePasswordVisibility}
          style={{
            cursor: "pointer",
            borderRadius: "0 10px 10px 0", // Rounded right corners
          }}
        >
          <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
        </span>
      </div>
    </div>

        <div className="form-group mb-4 d-flex justify-content-end align-items-end">
          <button type="submit" className="btn btn-secondary">Registreren</button>
        </div>

        <div className="form-group mb-0 d-flex justify-content-center align-items-center">
          <p>Heb je al een account bij ons? Klik dan <Link href="/inloggen">hier</Link> om in te loggen</p>
        </div>
      </form>
    </div>
  );
}