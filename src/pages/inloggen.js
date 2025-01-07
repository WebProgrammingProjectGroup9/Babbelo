import Link from "next/link"

export default function Inloggen() {
  return (
    <div className="container-fluid p-2 justify-content-center align-items-center col-xxl-8 col-xl-9">
      <form className="pe-5 ps-5 pt-4 pb-2 border shadow-lg rounded-5 mt-5">

        <div className="form-group mb-4 d-flex justify-content-center align-items-center">
          <h1>Babbelo</h1>
        </div>

        <div className="form-group mb-3 fs-5">
          <label>Inloggen bij Babbelo: </label>
        </div>

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
            />
        </div>

        <div className="form-group mb-4">
            <label>Wachtwoord: </label>
            <input
                type="password"
                className="form-control"
                placeholder="Vul hier je wachtwoord in"
                pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                title="Het wachtwoord moet minsten een nummer en een hoofdletter hebben en 8 karakters lang zijn"
                required
                style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "15px",
                }}
            />
        </div>

        <div className="form-group mb-4 d-flex justify-content-end align-items-end">
          <button type="submit" className="btn btn-secondary">Login</button>
        </div>

        <div className="form-group mb-0 d-flex justify-content-center align-items-center">
          <p>Ben je nog niet bekend bij ons? Maak dan eerst een nieuw account aan <Link href="/registreren">voor jezelf</Link> of <Link href="/registreren">je organisatie</Link>. </p>
        </div>
      </form>
    </div>
  );
}