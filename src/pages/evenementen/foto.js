import React, { useState, useRef, useEffect, useContext } from "react";
import ReactCrop, { makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useRouter } from "next/router";
import { AuthContext } from "@/components/AuthContext";

export default function Foto({ onPhotoSelect }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const previewCanvasRef = useRef(null);
  const aspectRatio = 580 / 387;
  const imageContainerRef = useRef(null);
  const router = useRouter();
  const { isLoggedIn } = useContext(AuthContext);
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        if (onPhotoSelect) {
          onPhotoSelect(reader.result);  
        }
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

    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      580 * scale,
      387 * scale
    );
  };

  const handleSave = () => {
    drawCanvas(); 
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
  
    canvas.toBlob((blob) => {
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
  
          localStorage.setItem('croppedPhoto', compressedBase64);
  
          setTimeout(() => {
            router.push("/evenementen/nieuw");
          }, 500);
            
        };
      };
      reader.readAsDataURL(blob);
    }, "image/png");
  };
  
  
  const handleZoomChange = (event) => {
    setScale(event.target.value);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push("/inloggen");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    drawCanvas(); 
  }, [completedCrop, scale]);

  return (
    <div className="container-fluid p-2 justify-content-center align-items-center col-xxl-8 col-xl-9">
      <div className="pe-5 ps-5 pt-4 pb-2 border shadow-lg rounded-5 mt-4">
      <div className="form-group mb-4 d-flex justify-content-center align-items-center">
          <h1>Babbelo</h1>
        </div>

        <div className="mb-4 container">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="form-control"
        />
      </div>

      {selectedImage && (
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
            }}
          >
            <div
              ref={imageContainerRef}
              style={{
                position: "relative",
                cursor: "move",
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              }}
            >
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
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={handleZoomChange}
              className="form-range"
            />
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
          
          <div className="text-center mt-4">
            <button onClick={handleSave} className="btn btn-primary">Opslaan</button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
