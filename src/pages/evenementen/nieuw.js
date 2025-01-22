import React, { useEffect, useState, useContext, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "@/components/AuthContext";
import ReactCrop, { makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function Nieuw() {
	const router = useRouter();
	const [cropping, setCropping] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [description, setDescription] = useState("");
	const [information, setInformation] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [streetName, setStreetName] = useState("");
	const [houseNumber, setHouseNumber] = useState("");
	const [city, setCity] = useState("")
	const [category, setCategory] = useState("");
	const [photo, setPhoto] = useState("");
	const [errors, setErrors] = useState(null);
	const [minDate, setMinDate] = useState(new Date().toISOString().split("T")[0]);
	const { isLoggedIn } = useContext(AuthContext);
	const [selectedImage, setSelectedImage] = useState(null);
	const [crop, setCrop] = useState(null);
	const [completedCrop, setCompletedCrop] = useState(null);
	const [imageRef, setImageRef] = useState(null);
	const [scale, setScale] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const previewCanvasRef = useRef(null);
	const aspectRatio = 580 / 387;
	const imageContainerRef = useRef(null);

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			router.push("/inloggen");
		}
	}, [isLoggedIn, router]);

	const maxLength = 75;

	useEffect(() => {
		const now = new Date();
		const formattedDate = now.toISOString().split("T")[0];
		setDate(formattedDate);

		
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
				body: JSON.stringify({ title, date, startTime, endTime, description, information, category, photo, streetName, houseNumber, zipCode, city }),
			});

			if (!response.ok) {
				throw new Error("Failed to submit the event");
			}

			const data = await response.json();
			localStorage.removeItem("croppedPhoto");
			router.push(`/evenementen/${data.id}`);
		} catch (error) {
			setErrors(error.message);
		} finally {
			setIsLoading(false);
		}
	}
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setSelectedImage(reader.result);
				setCropping(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const onImageLoad = (event) => {
		const { width, height } = event.currentTarget;
		const initialCrop = makeAspectCrop(
			{
				unit: "%",
				width: 90,
			},
			aspectRatio,
			width,
			height
		);
		setCrop(initialCrop);
		setImageRef(event.currentTarget);
	};

	const drawCanvas = () => {
		if (!completedCrop || !imageRef || !previewCanvasRef.current) {
			return;
		}

		const canvas = previewCanvasRef.current;
		const ctx = canvas.getContext("2d");

		const scaleX = imageRef.naturalWidth / imageRef.width;
		const scaleY = imageRef.naturalHeight / imageRef.height;

		const pixelRatio = window.devicePixelRatio;
		canvas.width = 580 * pixelRatio;
		canvas.height = 387 * pixelRatio;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = "high";

		ctx.drawImage(imageRef, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, 580 * scale, 387 * scale);
	};

	const handleSave = () => {
		drawCanvas();
		const canvas = previewCanvasRef.current;
		if (!canvas) return;

		canvas.toBlob((blob) => {
			if (!blob) {
				console.error("Failed to create Blob from canvas");
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64data = reader.result;

				const img = new Image();
				img.src = base64data;
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");

					const maxWidth = 800;
					const maxHeight = 533;
					const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
					const width = img.width * ratio;
					const height = img.height * ratio;

					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0, width, height);

					const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

					if (typeof compressedBase64 === "string" && compressedBase64.startsWith("data:image/jpeg;base64,")) {
						setPhoto(compressedBase64);
						setCropping(false);
					} else {
						console.error("Invalid Base64 image data");
					}
				};
			};
			reader.readAsDataURL(blob);
		}, "image/jpeg");
	};

	const handleZoomChange = (event) => {
		setScale(event.target.value);
	};

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			router.push("/inloggen");
		}
	}, [isLoggedIn, router]);

	useEffect(() => {
		drawCanvas();
	}, [completedCrop, scale]);

	return (
		<div className="container-fluid p-2 justify-content-center align-items-center col-xxl-8 col-xl-9">
			<form className="pe-5 ps-5 pt-4 pb-2 border shadow-lg rounded-5 mt-4" onSubmit={onSubmit}>
				<div className="form-group mb-4 d-flex justify-content-center align-items-center">
					<h1>Babbelo</h1>
				</div>

				<div className="row">
					<div className="col-12">
						<label className="form-label">Titel:</label>
						<input type="text" className="form-control" placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} required />
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-sm-12 col-lg-6 col-md-6">
						<label className="form-label">Datum:</label>
						<input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required min={minDate} />
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-sm-12 col-lg-6 col-md-6">
						<label className="form-label">Starttijd:</label>
						<input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
					</div>

					<div className="col-sm-12 col-lg-6 col-md-6">
						<label className="form-label">Eindtijd:</label>
						<input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-12">
						<label className="form-label">Straatnaam:</label>
						<input type="text" className="form-control" placeholder="Straatnaam" value={streetName} onChange={(e) => setStreetName(e.target.value)} required />
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-6">
						<label className="form-label">Huisnummer:</label>
						<input type="text" className="form-control" placeholder="Huisnummer" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} required />
					</div>
					<div className="col-6">
						<label className="form-label">Postcode:</label>
						<input type="text" className="form-control" placeholder="Postcode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-12">
						<label className="form-label">Stad:</label>
						<input type="text" className="form-control" placeholder="Stad" value={city} onChange={(e) => setCity(e.target.value)} required />
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-12">
						<label className="form-label">Categorie:</label>
						<input type="text" className="form-control" placeholder="Categorie" value={category} onChange={(e) => setCategory(e.target.value)} required />
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-12">
						<label className="form-label">Korte beschrijving:</label>
						<textarea className="form-control" placeholder="Korte beschrijving" required maxLength={maxLength} rows={1} value={description} onChange={handleDescriptionChange} style={{ resize: "none" }} />
						<div className="text-muted">
							{description.length}/{maxLength}
						</div>
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-12">
						<label className="form-label">Meer informatie:</label>
						<textarea className="form-control" placeholder="Meer informatie" required rows={17} value={information} onChange={handleInformationChange} />
					</div>
				</div>

				{photo && (
					<div className="row mt-4">
						<div className="col-12">
							<img src={photo} alt="Geselecteerde afbeelding" className="img-fluid rounded" />
						</div>
					</div>
				)}
				<div>
					<div className="row my-4">
            <div className="col-9">
						<input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
            </div>
						<button type="button" onClick={handleSave} className="btn btn-primary col-3">
							Foto Opslaan
						</button>
					</div>

					{selectedImage && cropping && (
						<div className="text-center">
							<ReactCrop
								crop={crop}
								onChange={(newCrop) => setCrop(newCrop)}
								onComplete={(c) => setCompletedCrop(c)}
								aspect={aspectRatio}
								style={{
									maxWidth: "100%",
									maxHeight: "400px",
									position: "relative",
									margin: "0 auto",
								}}>
								<div
									ref={imageContainerRef}
									style={{
										position: "relative",
										cursor: "move",
										transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
									}}>
									<img
										src={selectedImage}
										onLoad={onImageLoad}
										alt="Crop afbeelding"
										style={{
											maxWidth: "100%",
											maxHeight: "400px",
											borderRadius: "8px",
											transform: `scale(${scale})`,
											transformOrigin: "top left",
										}}
									/>
								</div>
							</ReactCrop>

							<div className="mt-4">
								<label>Zoom:</label>
								<input type="range" min="1" max="3" step="0.1" value={scale} onChange={handleZoomChange} className="form-range" />
							</div>

							<canvas
								ref={previewCanvasRef}
								style={{
									display: "none",
									width: 580,
									height: 387,
									borderRadius: "8px",
								}}
							/>
						</div>
					)}
				</div>

				<div className="form-group mb-4 d-flex justify-content-end align-items-center mt-4 ms-3">
					<button className="btn btn-primary" disabled={isLoading} style={{ backgroundColor: "#B90163", borderColor: "#B90163", textDecoration: "none" }}>
						<Link style={{ textDecoration: "none", color: "white" }} href="/evenementen">
							Annuleren
						</Link>
					</button>
					<button type="submit" className="btn btn-primary ms-3" style={{ backgroundColor: "#B90163", borderColor: "#B90163" }}>
						Opslaan
					</button>
				</div>
			</form>
		</div>
	);
}
