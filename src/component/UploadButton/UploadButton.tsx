import {JsonData} from "../../jsonData.interface";
import React from "react";

function UploadButton({
                        imgChange,
                        jsonChange
                      } : {
  imgChange: (result: string) => void;
  jsonChange: (result: JsonData) => void;
}) {
  const onImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader: FileReader = new FileReader();
      reader.addEventListener('load', () => {
        imgChange(reader.result as string);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  const onJsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader: FileReader = new FileReader();
      reader.readAsText(event.target.files[0], "UTF-8");
      reader.onload = (e : ProgressEvent<FileReader>) => {
        if (e.target) {
          const result : JsonData = JSON.parse(e.target.result as string)
          jsonChange(result);
        }
      };
    }
  }
  return (
    <div className='btn-upload'>
      <button className="upload-img">
        <input type="file" accept="image/*" onChange={onImgChange} alt="upload-img"/>
        Select image
      </button>
      <button className="upload-json">
        <input type="file" accept="application/json" onChange={onJsonChange}  alt="upload-json"/>
        Select Json Image file
      </button>
    </div>
  )
}

export default UploadButton
