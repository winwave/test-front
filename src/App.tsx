import React, { ReactNode, useEffect, useMemo, useState } from "react";
import ImageMapper from "react-image-mapper"
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import './App.css';
import { JsonData } from "./jsonData.interface";
import { MapArea } from "./mapArea.interface";

const cropDefault = ReactCrop.Crop = {
  unit: 'px',
  x: 0,
  y: 20,
  height: 50,
  width: 50
}

const mapAreaDefault : MapArea = {
  name: "area",
  shape: "rect",
  coords: [0, 0, 0, 0],
  lineWidth: 2,
  preFillColor: "rgba(255, 255, 255, 0.3)"
}

function App() {
  const [tagged, setTagged] = useState<boolean>(true);
  const [mapUpdated, setMapUpdated] = useState<boolean>(true);
  const [hoveredArea, setHoveredArea] = useState<object | null>(null);
  const [description, setDescription] = useState<string>('');
  const [img, setImg] = useState<string>('');
  const [crop, setCrop] = useState<ReactCrop.Crop>(cropDefault);
  const [mapAreas, setMapAreas] = useState<Array<MapArea> | []>([]);

  useEffect(() =>{
    setMapUpdated(true);
  }, [mapAreas])

  const onImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader: FileReader = new FileReader();
      reader.addEventListener('load', () => {
        setImg(reader.result as string);
        setMapUpdated(false);
        setMapAreas([]);
        setCrop(cropDefault);
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
          setImg(result.img);
          if (result.mapArea) {
            setMapUpdated(false);
            setMapAreas([result.mapArea]);
            setCrop(result.crop);
            setDescription(result.description);
          }
        }
      };
    }
  }

  const saveMap = () => {
    const newArea = {
      ...mapAreaDefault,
      coords: [crop.x, crop.y, crop.width+crop.x, crop.height + crop.y]
    }
    setMapAreas([newArea])
    setTagged(!tagged)
  }

  const getTooltipPosition = (area) => {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
  }

  const exportJson = () => {
    const json : JsonData = {
      img,
      mapArea: mapAreas[0],
      description,
      crop
    };
    let a = document.createElement('a');
    a.href = "data:application/json,"+encodeURIComponent(JSON.stringify(json));
    a.download = 'image.json';
    a.click();
  }

  const ImageMapperComponent : ReactNode = useMemo(
    () => (
      <ImageMapper
        data-test-id='ImageMapper'
        src={img}
        strokeColor="#6afd09"
        map={{
          name: 'map',
          areas: mapAreas,
        }}
        onMouseEnter={area => setHoveredArea(area)}
        onMouseLeave={() => setHoveredArea(null)}
      />
    ), [img, mapAreas]
  );
  return(
    <div className='app'>
      <div className="image">
        {img &&
        <div>
          {!tagged &&
          <div>
            <ReactCrop src={img} crop={crop} ruleOfThirds onChange={crop => setCrop(crop)} />
            <label>
              Description
              <input
                type="text"
                onChange={event =>setDescription(event.target.value)}
                value={description}
                className="desc-input"
              />
            </label>
          </div>
          }
          { mapUpdated && tagged && ImageMapperComponent }
          { description && hoveredArea && (
            <span
              className="tooltip"
              style={{ ...getTooltipPosition(hoveredArea) }}
            >
              { description }
            </span>
          )}
            <button onClick={() => saveMap()} className='btn-identify'>
              { tagged ? 'Identify' : 'Save' }
            </button>
          {
            tagged &&
            <button onClick={() => exportJson()}>
              Export to json
            </button>
          }
        </div>
        }
      </div>
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
    </div>
  )
}

export default App
