import React, { ReactNode, useEffect, useMemo, useState } from "react";
import ImageMapper from "react-image-mapper"
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import './App.css';
import {JsonData} from "./jsonData.interface";

const cropDefault = ReactCrop.Crop = {
  unit: 'px',
  x: 0,
  y: 20,
  height: 50,
  width: 50
}

const mapAreaDefault = {
  name: 1,
  shape: "rect",
  coords: [0, 0, 0, 0],
  lineWidth: 2,
  preFillColor: "rgba(255, 255, 255, 0.3)"
}

export type mapArea = typeof mapAreaDefault

function App() {
  const [tagged, setTagged] = useState<boolean>(true);
  const [mapUpdated, setMapUpdated] = useState<boolean>(true);
  const [hoveredArea, setHoveredArea] = useState<object | null>(null);
  const [description, setDescription] = useState<string>('');
  const [img, setImg] = useState<string>('');
  const [crop, setCrop] = useState<ReactCrop.Crop>(cropDefault);
  const [mapAreas, setMapAreas] = useState<Array<mapArea> | []>([]);

  useEffect(() =>{
    setMapUpdated(true)
  }, [mapAreas])

  const onImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader: FileReader = new FileReader();
      reader.addEventListener('load', () => {
        setImg(reader.result as string);
        setMapAreas([])
        setCrop(cropDefault)
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  const onJsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader: FileReader = new FileReader();
      reader.readAsText(event.target.files[0], "UTF-8");
      reader.onload = (e : ProgressEvent<FileReader>) => {
        // @ts-ignore
        const result : JsonData = JSON.parse(e.target.result as string)
        setImg(result.img);
        setMapUpdated(false)
        setMapAreas([result.mapArea]);
        setCrop(result.crop);
        setDescription(result.description);
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

  const enterArea = (area) => {
    setHoveredArea(area)
  }
  const leaveArea = (area) => {
    setHoveredArea(null)
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
        src={img}
        strokeColor="#6afd09"
        map={{
          name: 'map',
          areas: mapAreas,
        }
        }
        onMouseEnter={area => enterArea(area)}
        onMouseLeave={area => leaveArea(area)}
      />
    ), [img, mapAreas]
  );
  return(
    <div>
      <div className="image">
        {img &&
        <div>
          {!tagged &&
          <div>
              <ReactCrop src={img} crop={crop} ruleOfThirds onChange={crop => setCrop(crop)} />
              <label>
                  Description
                  <input type="text" onChange={event =>setDescription(event.target.value)} value={description}/>
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
            <button onClick={() => saveMap()}>
              { tagged ? 'Identify' : 'Save' }
            </button>
          {
            tagged &&
            <button onClick={() => exportJson()}>
                export to json
            </button>
          }
        </div>
        }
      </div>
      <div className='btn-upload'>
        <button>
          <input type="file" accept="image/*" onChange={onImgChange} />
          Select images
        </button>
        <button>
          <input type="file" accept="application/json" onChange={onJsonChange} />
          Select Json file
        </button>
      </div>
    </div>
  )
}

export default App
