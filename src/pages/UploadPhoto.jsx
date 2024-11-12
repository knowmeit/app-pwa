// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import useDisableBackNavigation from "../components/BackNavigationPreventer";

// const CapturePhoto = () => {
//   useDisableBackNavigation();
//   const [photoTaken, setPhotoTaken] = useState(null);
//   const [isPhotoTaken, setIsPhotoTaken] = useState(false);
//   const [screenHeight, setScreenHeight] = useState(window.innerHeight);
//   const [screenWidth, setScreenWidth] = useState(window.innerWidth);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const token = window.localStorage.getItem("token");
//   const [loading, set_loading] = useState(false);
//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: { ideal: "environment" },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });
//       videoRef.current.srcObject = stream;
//     } catch (err) {
//       console.error("Error accessing the camera: ", err);
//       alert("Please allow camera access in your browser settings.");
//     }
//   };

//   useEffect(() => {
//     startCamera();

//     const handleResize = () => {
//       setScreenHeight(window.innerHeight);
//       setScreenWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const takePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas
//       .getContext("2d")
//       .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

//     const photo = canvas.toDataURL("image/png");
//     setPhotoTaken(photo);
//     setIsPhotoTaken(true);
//   };

//   const sendPhotoToAPI = async () => {
//     if (photoTaken) {
//       set_loading(true);
//       try {
//         // Convert base64 to Blob
//         const byteString = atob(photoTaken.split(",")[1]);
//         const arrayBuffer = new ArrayBuffer(byteString.length);
//         const intArray = new Uint8Array(arrayBuffer);
//         for (let i = 0; i < byteString.length; i++) {
//           intArray[i] = byteString.charCodeAt(i);
//         }
//         const blob = new Blob([arrayBuffer], { type: "image/png" });

//         // Create FormData and append Blob as a file
//         const formData = new FormData();
//         formData.append("image_file", blob, "photo.png");

//         // Send the request with Content-Type as multipart/form-data
//         await axios
//           .post(
//             `${window.BASE_URL_KNOWME}/v2/sessions/upload/?token=${token}`,
//             formData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           )
//           .then((res) => {
//             set_loading(false);
//             if (res.status === 401) {
//               window.showToast("error", "نشست شما منقضی شده است!");
//             }
//             window.location.href = "/help";
//           })
//           .catch((e) => {
//             set_loading(false);
//             console.error("Error uploading photo:", e.response?.data);
//           });
//       } catch (error) {
//         set_loading(false);
//         console.error("Error uploading photo:", error);
//       }
//     } else {
//       console.error("No photo to upload");
//     }
//   };

//   const retakePhoto = () => {
//     setPhotoTaken(null);
//     setIsPhotoTaken(false);
//     startCamera();
//   };

//   // Determine width and height based on screen width
//   const videoWidth = screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85;
//   const videoHeight =
//     screenWidth > 600 ? screenHeight * 0.5 : screenHeight * 0.7;

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "10px",
//         boxSizing: "border-box",
//       }}
//     >
//       {isPhotoTaken ? null : (
//         <p style={{ fontSize: "17px", textAlign: "center" }}>
//           لطفا از کارت ملی خود عکس گرفته و سپس دکمه ارسال عکس را بزنید.
//         </p>
//       )}
//       {!isPhotoTaken ? (
//         <div
//           style={{
//             width: `${videoWidth}px`, // 50% or 85% of screen width
//             height: `${videoHeight}px`, // 30% or 70% of screen height
//             position: "relative",
//             overflow: "hidden",
//             flexGrow: 1,
//           }}
//         >
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               position: "absolute",
//             }}
//           ></video>

//           {/* Green box overlay slightly smaller than video box */}
//           <div
//             style={{
//               position: "absolute",
//               top: "5%", // Margin from the top
//               left: "5%", // Margin from the left
//               width: "90%", // 90% of video box width
//               height: "90%", // 90% of video box height
//               border: "2px solid green",
//               boxSizing: "border-box",
//             }}
//           ></div>
//         </div>
//       ) : (
//         <div
//           style={{
//             width: `${videoWidth}px`, // Match video box width
//             height: `${videoHeight}px`, // Match video box height
//           }}
//         >
//           <img
//             src={photoTaken}
//             alt="Captured"
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//             }}
//           />
//         </div>
//       )}

//       <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

//       <button
//         onClick={isPhotoTaken ? retakePhoto : takePhoto}
//         style={{
//           padding: "10px 20px",
//           fontSize: "16px",
//           marginTop: "20px",
//         }}
//       >
//         {isPhotoTaken ? "گرفتن مجدد عکس" : "گرفتن عکس"}
//       </button>

//       {isPhotoTaken && (
//         <button
//           onClick={sendPhotoToAPI}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             margin: "0",
//           }}
//           disabled={loading}
//         >
//           {loading ? "درحال ارسال عکس" : " ارسال عکس"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default CapturePhoto;

/******************* PART 6 */
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import useDisableBackNavigation from "../components/BackNavigationPreventer";
// import CustomFileInput from "../components/CustomeInput";

// const CapturePhoto = () => {
//   useDisableBackNavigation();
//   const [photoTaken, setPhotoTaken] = useState(null);
//   const [isPhotoTaken, setIsPhotoTaken] = useState(false);
//   const [screenHeight, setScreenHeight] = useState(window.innerHeight);
//   const [screenWidth, setScreenWidth] = useState(window.innerWidth);
//   const [document_type, set_document_type] = useState("national_card");
//   const [send_photo_type, set_send_photo_type] = useState("camera");
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const token = window.localStorage.getItem("token");
//   const [loading, set_loading] = useState(false);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: { ideal: "environment" },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });
//       videoRef.current.srcObject = stream;
//     } catch (err) {
//       console.error("Error accessing the camera: ", err);
//       alert("Please allow camera access in your browser settings.");
//     }
//   };

//   useEffect(() => {
//     if (send_photo_type === "camera") {
//       startCamera();
//     }

//     const handleResize = () => {
//       setScreenHeight(window.innerHeight);
//       setScreenWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [send_photo_type, document_type]);

//   const handleFileChange = (photo) => {
//     setPhotoTaken(photo); // Set the base64 image for preview
//     setIsPhotoTaken(true);
//   };

//   const takePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas
//       .getContext("2d")
//       .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

//     const photo = canvas.toDataURL("image/png");
//     setPhotoTaken(photo);
//     setIsPhotoTaken(true);
//   };

//   const sendPhotoToAPI = async () => {
//     if (photoTaken) {
//       set_loading(true);
//       try {
//         const byteString = atob(photoTaken.split(",")[1]);
//         const arrayBuffer = new ArrayBuffer(byteString.length);
//         const intArray = new Uint8Array(arrayBuffer);
//         for (let i = 0; i < byteString.length; i++) {
//           intArray[i] = byteString.charCodeAt(i);
//         }
//         const blob = new Blob([arrayBuffer], { type: "image/png" });

//         const formData = new FormData();
//         formData.append("image_file", blob, "photo.png");

//         await axios
//           .post(
//             `${window.BASE_URL_KNOWME}/v2/sessions/upload/?token=${token}`,
//             formData,
//             {
//               headers: { "Content-Type": "multipart/form-data" },
//             }
//           )
//           .then((res) => {
//             set_loading(false);
//             if (res.status === 401) {
//               window.showToast("error", "نشست شما منقضی شده است!");
//             }
//             window.location.href = "/help";
//           })
//           .catch((e) => {
//             set_loading(false);
//             console.error("Error uploading photo:", e.response?.data);
//           });

//         console.log("document_type : ", document_type);
//       } catch (error) {
//         set_loading(false);
//         console.error("Error uploading photo:", error);
//       }
//     } else {
//       console.error("No photo to upload");
//     }
//   };

//   const retakePhoto = () => {
//     setPhotoTaken(null);
//     setIsPhotoTaken(false);
//     if (send_photo_type === "camera") {
//       startCamera();
//     }
//   };

//   const videoWidth = screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85;
//   const videoHeight =
//     screenWidth > 600 ? screenHeight * 0.5 : screenHeight * 0.7;

//   // Handle checkbox changes to ensure only one checkbox can be selected at a time
//   const handleDocumentTypeChange = (value) => {
//     set_document_type(value === document_type ? "" : value);
//   };

//   const handleSendPhotoTypeChange = (value) => {
//     set_send_photo_type(value === send_photo_type ? "" : value);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "10px",
//         boxSizing: "border-box",
//       }}
//     >
//       <p style={{ fontSize: "17px", textAlign: "center" }}>
//         لطفا نوع مدرک ارسالی خود را مشخص کنید و سپس انتخاب کنید میخواهید با
//         استفاده از دوربین عکس گرفته یا عکس را از گالری خود ارسال کنید.
//       </p>

//       {/* National Card or Passport Selection */}
//       {!isPhotoTaken && (
//         <div style={{ marginBottom: "20px" }}>
//           <label>
//             <input
//               type="checkbox"
//               checked={document_type === "national_card"}
//               onChange={() => handleDocumentTypeChange("national_card")}
//             />
//             کارت ملی
//           </label>
//           <label style={{ marginLeft: "20px" }}>
//             <input
//               type="checkbox"
//               checked={document_type === "passport"}
//               onChange={() => handleDocumentTypeChange("passport")}
//             />
//             گذرنامه
//           </label>
//         </div>
//       )}

//       {/* Camera or Gallery Selection - Hidden if Photo Taken */}
//       {!isPhotoTaken && (
//         <div style={{ marginBottom: "20px" }}>
//           <label>
//             <input
//               type="checkbox"
//               checked={send_photo_type === "camera"}
//               onChange={() => handleSendPhotoTypeChange("camera")}
//             />
//             استفاده از دوربین
//           </label>
//           <label style={{ marginLeft: "20px" }}>
//             <input
//               type="checkbox"
//               checked={send_photo_type === "gallery"}
//               onChange={() => handleSendPhotoTypeChange("gallery")}
//             />
//             انتخاب عکس از گالری
//           </label>
//         </div>
//       )}

//       {send_photo_type === "camera" && !isPhotoTaken && (
//         <div
//           style={{
//             width: `${videoWidth}px`,
//             height: `${videoHeight}px`,
//             position: "relative",
//             overflow: "hidden",
//             flexGrow: 1,
//           }}
//         >
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               position: "absolute",
//             }}
//           ></video>
//           <div
//             style={{
//               position: "absolute",
//               top: "50%", // Center vertically
//               left: "50%", // Center horizontally
//               width: "90%",
//               height: document_type === "national_card" ? "60%" : "90%", // Adjust the height based on document_type
//               border: "2px solid green",
//               boxSizing: "border-box",
//               transform: "translate(-50%, -50%)", // Offset the box to be centered
//             }}
//           ></div>
//         </div>
//       )}

//       {send_photo_type === "gallery" && !isPhotoTaken && (
//         <CustomFileInput onFileChange={handleFileChange} />
//       )}

//       {isPhotoTaken && (
//         <div
//           style={{
//             width: `${videoWidth}px`,
//             height: `${videoHeight}px`,
//           }}
//         >
//           <img
//             src={photoTaken}
//             alt="Captured"
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//             }}
//           />
//         </div>
//       )}

//       <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

//       <button
//         onClick={isPhotoTaken ? retakePhoto : takePhoto}
//         style={{
//           padding: "10px 20px",
//           fontSize: "16px",
//           marginTop: "20px",
//         }}
//       >
//         {isPhotoTaken ? "گرفتن مجدد عکس" : "گرفتن عکس"}
//       </button>

//       {isPhotoTaken && (
//         <button
//           onClick={sendPhotoToAPI}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             margin: "0",
//           }}
//           disabled={loading}
//         >
//           {loading ? "درحال ارسال عکس" : " ارسال عکس"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default CapturePhoto;
/************ PART with crop */

// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import useDisableBackNavigation from "../components/BackNavigationPreventer";
// import CustomFileInput from "../components/CustomeInput";

// const CapturePhoto = () => {
//   useDisableBackNavigation();
//   const [photoTaken, setPhotoTaken] = useState(null);
//   const [isPhotoTaken, setIsPhotoTaken] = useState(false);
//   const [screenHeight, setScreenHeight] = useState(window.innerHeight);
//   const [screenWidth, setScreenWidth] = useState(window.innerWidth);
//   const [document_type, set_document_type] = useState("national_card");
//   const [send_photo_type, set_send_photo_type] = useState("camera");
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const token = window.localStorage.getItem("token");
//   const [loading, set_loading] = useState(false);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: { ideal: "environment" },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });
//       videoRef.current.srcObject = stream;
//     } catch (err) {
//       console.error("Error accessing the camera: ", err);
//       alert("Please allow camera access in your browser settings.");
//     }
//   };

//   useEffect(() => {
//     if (send_photo_type === "camera") {
//       startCamera();
//     }

//     const handleResize = () => {
//       setScreenHeight(window.innerHeight);
//       setScreenWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [send_photo_type, document_type]);

//   const handleFileChange = (photo) => {
//     setPhotoTaken(photo); // Set the base64 image for preview
//     setIsPhotoTaken(true);
//   };

//   const takePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     // Use 90% of the video width for both passport and national card
//     const greenBoxWidth = video.videoWidth * 1;

//     // Adjust the height based on document_type
//     const greenBoxHeight =
//       document_type === "national_card"
//         ? video.videoHeight * 0.6 // 80% of the video height for national card
//         : video.videoHeight * 0.9; // 90% of the video height for passport

//     canvas.width = greenBoxWidth;
//     canvas.height = greenBoxHeight;

//     // Calculate the top-left corner of the green box to center it
//     const startX = (video.videoWidth - greenBoxWidth) / 2;
//     const startY = (video.videoHeight - greenBoxHeight) / 2;

//     // Draw the cropped area from the video onto the canvas
//     canvas
//       .getContext("2d")
//       .drawImage(
//         video,
//         startX,
//         startY,
//         greenBoxWidth,
//         greenBoxHeight,
//         0,
//         0,
//         greenBoxWidth,
//         greenBoxHeight
//       );

//     // Convert the cropped image to base64
//     const photo = canvas.toDataURL("image/png");
//     setPhotoTaken(photo);
//     setIsPhotoTaken(true);
//   };

//   const sendPhotoToAPI = async () => {
//     if (photoTaken) {
//       set_loading(true);
//       try {
//         const byteString = atob(photoTaken.split(",")[1]);
//         const arrayBuffer = new ArrayBuffer(byteString.length);
//         const intArray = new Uint8Array(arrayBuffer);
//         for (let i = 0; i < byteString.length; i++) {
//           intArray[i] = byteString.charCodeAt(i);
//         }
//         const blob = new Blob([arrayBuffer], { type: "image/png" });

//         const formData = new FormData();
//         formData.append("image_file", blob, "photo.png");

//         await axios
//           .post(
//             `${window.BASE_URL_KNOWME}/v2/sessions/upload/?token=${token}`,
//             formData,
//             {
//               headers: { "Content-Type": "multipart/form-data" },
//             }
//           )
//           .then((res) => {
//             set_loading(false);
//             if (res.status === 401) {
//               window.showToast("error", "نشست شما منقضی شده است!");
//             }
//             window.location.href = "/help";
//           })
//           .catch((e) => {
//             set_loading(false);
//             console.error("Error uploading photo:", e.response?.data);
//           });

//         console.log("document_type : ", document_type);
//       } catch (error) {
//         set_loading(false);
//         console.error("Error uploading photo:", error);
//       }
//     } else {
//       console.error("No photo to upload");
//     }
//   };

//   const retakePhoto = () => {
//     setPhotoTaken(null);
//     setIsPhotoTaken(false);
//     if (send_photo_type === "camera") {
//       startCamera();
//     }
//   };

//   const videoWidth = screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85;
//   const videoHeight =
//     screenWidth > 600 ? screenHeight * 0.5 : screenHeight * 0.7;

//   // Handle checkbox changes to ensure only one checkbox can be selected at a time
//   const handleDocumentTypeChange = (value) => {
//     set_document_type(value === document_type ? "" : value);
//   };

//   const handleSendPhotoTypeChange = (value) => {
//     set_send_photo_type(value === send_photo_type ? "" : value);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "10px",
//         boxSizing: "border-box",
//       }}
//     >
//       <p style={{ fontSize: "17px", textAlign: "center" }}>
//         لطفا نوع مدرک ارسالی خود را مشخص کنید و سپس انتخاب کنید میخواهید با
//         استفاده از دوربین عکس گرفته یا عکس را از گالری خود ارسال کنید.
//       </p>

//       {/* National Card or Passport Selection */}
//       {!isPhotoTaken && (
//         <div style={{ marginBottom: "20px" }}>
//           <label>
//             <input
//               type="checkbox"
//               checked={document_type === "national_card"}
//               onChange={() => handleDocumentTypeChange("national_card")}
//             />
//             کارت ملی
//           </label>
//           <label style={{ marginLeft: "20px" }}>
//             <input
//               type="checkbox"
//               checked={document_type === "passport"}
//               onChange={() => handleDocumentTypeChange("passport")}
//             />
//             گذرنامه
//           </label>
//         </div>
//       )}

//       {/* Camera or Gallery Selection - Hidden if Photo Taken */}
//       {!isPhotoTaken && (
//         <div style={{ marginBottom: "20px" }}>
//           <label>
//             <input
//               type="checkbox"
//               checked={send_photo_type === "camera"}
//               onChange={() => handleSendPhotoTypeChange("camera")}
//             />
//             استفاده از دوربین
//           </label>
//           <label style={{ marginLeft: "20px" }}>
//             <input
//               type="checkbox"
//               checked={send_photo_type === "gallery"}
//               onChange={() => handleSendPhotoTypeChange("gallery")}
//             />
//             انتخاب عکس از گالری
//           </label>
//         </div>
//       )}

//       {send_photo_type === "camera" && !isPhotoTaken && (
//         <div
//           style={{
//             width: `${videoWidth}px`,
//             height: `${videoHeight}px`,
//             position: "relative",
//             overflow: "hidden",
//             flexGrow: 1,
//           }}
//         >
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               position: "absolute",
//             }}
//           ></video>
//           <div
//             style={{
//               position: "absolute",
//               top: "50%", // Center vertically
//               left: "50%", // Center horizontally
//               width: "90%",
//               height: document_type === "national_card" ? "60%" : "90%", // Adjust the height based on document_type
//               border: "2px solid green",
//               boxSizing: "border-box",
//               transform: "translate(-50%, -50%)", // Offset the box to be centered
//             }}
//           ></div>
//         </div>
//       )}

//       {send_photo_type === "gallery" && !isPhotoTaken && (
//         <CustomFileInput onFileChange={handleFileChange} />
//       )}

//       {isPhotoTaken && (
//         <div
//           style={{
//             width: `${videoWidth}px`,
//             height: `${videoHeight}px`,
//           }}
//         >
//           <img
//             src={photoTaken}
//             alt="Captured"
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//             }}
//           />
//         </div>
//       )}

//       <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

//       <button
//         onClick={isPhotoTaken ? retakePhoto : takePhoto}
//         style={{
//           padding: "10px 20px",
//           fontSize: "16px",
//           marginTop: "20px",
//         }}
//       >
//         {isPhotoTaken ? "گرفتن مجدد عکس" : "گرفتن عکس"}
//       </button>

//       {isPhotoTaken && (
//         <button
//           onClick={sendPhotoToAPI}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             margin: "0",
//           }}
//           disabled={loading}
//         >
//           {loading ? "درحال ارسال عکس" : " ارسال عکس"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default CapturePhoto;

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useDisableBackNavigation from "../components/BackNavigationPreventer";
import CustomFileInput from "../components/CustomeInput";

const CapturePhoto = () => {
  useDisableBackNavigation();
  const [photoTaken, setPhotoTaken] = useState(null);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [document_type, set_document_type] = useState("national_card");
  const [send_photo_type, set_send_photo_type] = useState("camera");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = window.localStorage.getItem("token");
  const [loading, set_loading] = useState(false);

  // const startCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: {
  //         facingMode: { ideal: "environment" },
  //         width: { ideal: 1280 },
  //         height: { ideal: 720 },
  //       },
  //     });
  //     videoRef.current.srcObject = stream;
  //   } catch (err) {
  //     console.error("Error accessing the camera: ", err);
  //     alert("Please allow camera access in your browser settings.");
  //   }
  // };
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" }, // Use the rear camera if available
          width: { ideal: 1920 }, // Request a higher resolution (Full HD)
          height: { ideal: 1080 }, // Request a higher resolution (Full HD)
        },
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing the camera: ", err);
      alert("Please allow camera access in your browser settings.");
    }
  };

  useEffect(() => {
    if (send_photo_type === "camera") {
      startCamera();
    }

    const handleResize = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [send_photo_type, document_type]);

  const handleFileChange = (photo) => {
    setPhotoTaken(photo); // Set the base64 image for preview
    setIsPhotoTaken(true);
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const photo = canvas.toDataURL("image/png");
    setPhotoTaken(photo);
    setIsPhotoTaken(true);
  };

  const sendPhotoToAPI = async () => {
    if (photoTaken) {
      set_loading(true);
      try {
        const byteString = atob(photoTaken.split(",")[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: "image/png" });

        const formData = new FormData();
        formData.append("image_file", blob, "photo.png");

        await axios
          .post(
            `${window.BASE_URL_KNOWME}/v2/sessions/upload/?token=${token}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
          .then((res) => {
            set_loading(false);
            if (res.status === 401) {
              window.showToast("error", "نشست شما منقضی شده است!");
            }
            window.location.href = "/help";
          })
          .catch((e) => {
            set_loading(false);
            console.error("Error uploading photo:", e.response?.data);
          });

        console.log("document_type : ", document_type);
      } catch (error) {
        set_loading(false);
        console.error("Error uploading photo:", error);
      }
    } else {
      console.error("No photo to upload");
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(null);
    setIsPhotoTaken(false);
    if (send_photo_type === "camera") {
      startCamera();
    }
  };

  const videoWidth = screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85;
  const videoHeight =
    screenWidth > 600 ? screenHeight * 0.5 : screenHeight * 0.7;

  // Handle checkbox changes to ensure only one checkbox can be selected at a time
  const handleDocumentTypeChange = (value) => {
    set_document_type(value === document_type ? "" : value);
  };

  const handleSendPhotoTypeChange = (value) => {
    set_send_photo_type(value === send_photo_type ? "" : value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <p style={{ fontSize: "17px", textAlign: "center" }}>
        لطفا نوع مدرک ارسالی خود را مشخص کنید و سپس انتخاب کنید میخواهید با
        استفاده از دوربین عکس گرفته یا عکس را از گالری خود ارسال کنید.
      </p>

      {/* National Card or Passport Selection */}
      {!isPhotoTaken && (
        <div style={{ marginBottom: "20px" }}>
          <label>
            <input
              type="checkbox"
              checked={document_type === "national_card"}
              onChange={() => handleDocumentTypeChange("national_card")}
            />
            کارت ملی
          </label>
          <label style={{ marginRight: "20px" }}>
            <input
              type="checkbox"
              checked={document_type === "passport"}
              onChange={() => handleDocumentTypeChange("passport")}
            />
            گذرنامه
          </label>
        </div>
      )}

      {/* Camera or Gallery Selection - Hidden if Photo Taken */}
      {!isPhotoTaken && (
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={send_photo_type === "camera"}
              onChange={() => handleSendPhotoTypeChange("camera")}
            />
            استفاده از دوربین
          </label>
          <label style={{ marginRight: "5px" }}>
            <input
              type="checkbox"
              checked={send_photo_type === "gallery"}
              onChange={() => handleSendPhotoTypeChange("gallery")}
            />
            انتخاب عکس از گالری
          </label>
        </div>
      )}

      {send_photo_type === "camera" && !isPhotoTaken && (
        <div
          style={{
            width: `${videoWidth}px`,
            height: `${videoHeight}px`,
            position: "relative",
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          ></video>
          <div
            style={{
              position: "absolute",
              top: "50%", // Center vertically
              left: "50%", // Center horizontally
              width: "90%",
              height: document_type === "national_card" ? "60%" : "90%", // Adjust the height based on document_type
              border: "2px solid green",
              boxSizing: "border-box",
              transform: "translate(-50%, -50%)", // Offset the box to be centered
            }}
          ></div>
        </div>
      )}

      {send_photo_type === "gallery" && !isPhotoTaken && (
        <CustomFileInput onFileChange={handleFileChange} />
      )}

      {isPhotoTaken && (
        <div
          style={{
            width: `${videoWidth}px`,
            height: `${videoHeight}px`,
          }}
        >
          <img
            src={photoTaken}
            alt="Captured"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <button
        onClick={isPhotoTaken ? retakePhoto : takePhoto}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        {isPhotoTaken ? "گرفتن مجدد عکس" : "گرفتن عکس"}
      </button>

      {isPhotoTaken && (
        <button
          onClick={sendPhotoToAPI}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            margin: "0",
          }}
          disabled={loading}
        >
          {loading ? "درحال ارسال عکس" : " ارسال عکس"}
        </button>
      )}
    </div>
  );
};

export default CapturePhoto;
