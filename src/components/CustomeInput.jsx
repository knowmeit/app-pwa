import { useRef, useState } from "react";

const CustomFileInput = ({ onFileChange }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("فایلی انتخاب نشده است");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // Read the file and call onFileChange with the base64 image
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileChange(e.target.result); // Send the base64 image to the parent component
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("فایلی انتخاب نشده است");
    }
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <button
        onClick={openFileSelector}
        style={{
          marginBottom: "10px",
          backgroundColor: "#D3D3D3",
          color: "black",
        }}
      >
        انتخاب فایل
      </button>
      <span>{fileName}</span>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default CustomFileInput;
