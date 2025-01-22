import Link from "next/link";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../components/AuthContext";
import { useRouter } from "next/router";
import ReactCrop, { makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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
	const [profileImgUrl, setProfileImgUrl] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [selected, setSelected] = useState("particulier");
	const [cropping, setCropping] = useState(true);
	const [selectedImage, setSelectedImage] = useState(null);
	const [crop, setCrop] = useState(null);
	const [completedCrop, setCompletedCrop] = useState(null);
	const [imageRef, setImageRef] = useState(null);
	const [scale, setScale] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const previewCanvasRef = useRef(null);
	const aspectRatio = 400 / 400;
	const imageContainerRef = useRef(null);

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
		try {
			setError("");
			setSuccess("");

			if (password !== confirmPassword) {
				setError("De wachtwoorden komen niet overeen.");
				return;
			}
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
					chamberOfCommerce,
					profileImgUrl,
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
			setProfileImgUrl("");

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
		canvas.width = 400 * pixelRatio;
		canvas.height = 400 * pixelRatio;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = "high";

		ctx.drawImage(imageRef, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, 400 * scale, 400 * scale);
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

					const maxWidth = 400;
					const maxHeight = 400;
					const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
					const width = img.width * ratio;
					const height = img.height * ratio;

					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0, width, height);

					const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
					if (typeof compressedBase64 === "string" && compressedBase64.startsWith("data:image/jpeg;base64,")) {
						setProfileImgUrl(compressedBase64);
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
		drawCanvas();
	}, [completedCrop, scale]);

	const currentDate = new Date().toISOString().split("T")[0];

	return (
		<div className="container-fluid p-2 justify-content-center align-items-center col-xxl-8 col-xl-9">
			<form className="pe-5 ps-5 pt-4 pb-2 border shadow-lg rounded-5 mt-5 mb-5" onSubmit={handleRegister}>
				<div className="form-group mb-4 d-flex justify-content-center align-items-center">
					<h1>Babbelo</h1>
				</div>

				<div className="form-group mb-2 fw-bold fs-5">
					<label>Registreren als:</label>
				</div>

				<div class="form-check form-check-inline mb-4">
					<input class="form-check-input" type="radio" name="inlineRadioOptions" id="radioUser" value="particulier" checked={selected === "particulier"} onChange={(e) => setSelected(e.target.value)} />
					<label class="form-check-label" for="radioUser">
						Particulier
					</label>
				</div>

				<div class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="inlineRadioOptions" id="radioOrg" value="organisatie" checked={selected === "organisatie"} onChange={(e) => setSelected(e.target.value)} />
					<label class="form-check-label" for="radioOrg">
						Organisatie
					</label>
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
							}}>
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
								marginTop: "10px",
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
								marginTop: "10px",
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
								marginTop: "10px",
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
								marginTop: "10px",
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
							}}>
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
							}}>
							<i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
						</span>
					</div>
				</div>
				<div className="form-group mb-4">
					<input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
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
								width: 400,
								height: 400,
								borderRadius: "8px",
							}}
						/>
					</div>
				)}

				{selected === "organisatie" && (
					<>
						<div className="form-group mb-2 fw-bold fs-5">
							<label>Organisatie gegevens:</label>
						</div>

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
						Heb je al een account bij ons? Klik dan <Link href="/inloggen">hier</Link> om in te loggen
					</p>
				</div>
			</form>
		</div>
	);
}
