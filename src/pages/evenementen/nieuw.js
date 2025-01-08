import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Nieuw() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [information, setInformation] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [errors, setErrors] = useState(null);
  const [minDate, setMinDate] = useState(new Date().toISOString().split("T")[0]);

  const maxLength = 75;
  const informationMaxLength = 255;

  useEffect(() => {
    //Date
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    setDate(formattedDate);
  
    //Time
    const formattedTime = now.toTimeString().slice(0, 5); 
    setStartTime(formattedTime);
    setEndTime(formattedTime);
  }, []);
  
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleInformationChange = (e) => {
    setInformation(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setPhoto(photoUrl);
    }
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setErrors(null);
    
    try {   
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, date, startTime, endTime, description, information, category, photo }),
      });
    
      if (!response.ok) {
        throw new Error("Failed to submit the event");
      }
    
      const data = await response.json();
      console.log("Response:", data);

      router.push("/evenementen");

    } catch (error) {
      setErrors(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="container-fluid p-2 justify-content-center align-items-center col-xxl-8 col-xl-9">
      <form
        className="pe-5 ps-5 pt-4 pb-2 border shadow-lg rounded-5 mt-4"
        onSubmit={onSubmit}
      >
        {/* App name */}
        <div className="form-group mb-4 d-flex justify-content-center align-items-center">
          <h1>Babbelo</h1>
        </div>

        {/* Title */}
        <div className="row">
          <div className="col-12">
            <label className="form-label">Titel:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Date */}
        <div className="row mt-4">
          <div className="col-sm-12 col-lg-6 col-md-6">
            <label className="form-label">Datum:</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={minDate}
            />
          </div>
        </div>

        {/* Time */}
        <div className="row mt-4">
          <div className="col-sm-12 col-lg-6 col-md-6">
            <label className="form-label">Starttijd:</label>
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="col-sm-12 col-lg-6 col-md-6">
            <label className="form-label">Eindtijd:</label>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="row mt-4">
          <div className="col-12">
            <label className="form-label">Categorie:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Categorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="row mt-4">
          <div className="col-12">
            <label className="form-label">Beschrijving:</label>
            <textarea
              className="form-control"
              placeholder="Beschrijving"
              required
              maxLength={maxLength}
              rows={1}
              value={description}
              onChange={handleDescriptionChange}
              style={{ resize: "none" }}
            />
            <div className="text-muted">
              {description.length}/{maxLength}
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="row mt-4">
          <div className="col-12">
            <label className="form-label">Informatie:</label>
            <textarea
              className="form-control"
              placeholder="Informatie"
              required
              rows={3}
              maxLength={informationMaxLength}
              value={information}
              onChange={handleInformationChange}
              style={{ resize: "none" }}
            />
            <div className="text-muted">
              {information.length}/{informationMaxLength}
            </div>
          </div>
        </div>

        {/* Photo (File Input) */}
        <div className="row mt-4">
          <div className="col-12">
            <label className="form-label">Foto:</label>
            <input
              type="file"
              className="form-control"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <div className="form-group mb-4 d-flex justify-content-end align-items-center mt-4 ms-3">
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ backgroundColor: "#B90163", borderColor: "#B90163", textDecoration: "none" }}>
          <Link style={{textDecoration: "none", color: "white"}}href="/evenementen">Annuleren</Link>

          </button>
          <button className="btn btn-primary ms-3 "  style={{ backgroundColor: "#B90163", borderColor: "#B90163" }}>
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
}
