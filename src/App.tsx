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
  name: 0,
  shape: "rect",
  coords: [0, 0, 0, 0],
  lineWidth: 2,
  preFillColor: "rgba(255, 255, 255, 0.3)"
}

function App() {
  const [tagged, setTagged] = useState<boolean>(true);
  const [mapUpdated, setMapUpdated] = useState<boolean>(true);
  const [hoveredArea, setHoveredArea] = useState<object | null>(null);
  const [description, setDescription] = useState<string | undefined>('');
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
          if (result.mapAreas) {
            setMapUpdated(false);
            setMapAreas(result.mapAreas);
          }
        }
      };
    }
  }

  const saveMap = () => {
    const newArea = {
      ...mapAreaDefault,
      name: mapAreas.length ? mapAreas[mapAreas.length - 1].name +1 : 1,
      description,
      coords: [crop.x, crop.y, crop.width+crop.x, crop.height + crop.y]
    }
    setCrop(cropDefault);
    setMapAreas([...mapAreas, newArea])
    setTagged(true)
  }

  const getTooltipPosition = (area) => {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
  }

  const exportJson = () => {
    const json : JsonData = {
      img,
      mapAreas: mapAreas
    };
    let a = document.createElement('a');
    a.href = "data:application/json,"+encodeURIComponent(JSON.stringify(json));
    a.download = 'image.json';
    a.click();
  }

  const onClickZone = (area: MapArea) => {
    setCrop(ReactCrop.Crop={
      unit: 'px',
      x: area.coords[0],
      y: area.coords[1],
      width: area.coords[2] - area.coords[0],
      height: area.coords[3] - area.coords[1]
    })
    setDescription(area.description);
    setMapAreas(mapAreas.filter(obj => obj.name !== area.name));
    setHoveredArea(null);
    setTagged(false);
  }

  const mouseEnter = (area: MapArea) => {
    setDescription(area.description);
    setHoveredArea(area);
  }

  const identifyZone = () => {
    setDescription('');
    setTagged(false);
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
        onMouseEnter={area => mouseEnter(area)}
        onMouseLeave={() => setHoveredArea(null)}
        onClick={area => onClickZone(area)}
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
          {hoveredArea && <div className='tip'> click to modify the identified zone !</div>}
          {!tagged && <button onClick={() => saveMap()} className='btn-identify'>
              Save
            </button>}
          {
            tagged &&
            <div>
                <button onClick={() => identifyZone()} className='btn-identify'>
                    Identify
                </button>
                <button onClick={() => exportJson()}>
                    Export to json
                </button>
            </div>
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
