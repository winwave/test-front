import React, { ReactNode, useEffect, useMemo, useState } from "react";
import ImageMapper from "react-image-mapper"
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import './App.css';
import { JsonData } from "./jsonData.interface";
import { MapArea } from "./mapArea.interface";
import UploadButton from "./component/UploadButton/UploadButton";
import Tooltip from "./component/Tooltip/Tooltip";
import ZoneButton from "./component/ZoneButton/ZoneButton";
import {cropDefault, mapAreaDefault} from "./store";

function App() {
  const [tagged, setTagged] = useState<boolean>(true);
  const [mapUpdated, setMapUpdated] = useState<boolean>(true);
  const [hoveredArea, setHoveredArea] = useState<MapArea | null>(null);
  const [description, setDescription] = useState<string | undefined>('');
  const [img, setImg] = useState<string>('');
  const [crop, setCrop] = useState<ReactCrop.Crop>(cropDefault);
  const [mapAreas, setMapAreas] = useState<Array<MapArea> | []>([]);

  useEffect(() =>{
    setMapUpdated(true);
  }, [mapAreas])

  const imageChange = (img: string) => {
    setImg(img);
    setMapUpdated(false);
    setMapAreas([]);
    setCrop(cropDefault);
  }

  const jsonChange = (result: JsonData) => {
    setImg(result.img);
    if (result.mapAreas) {
      setMapUpdated(false);
      setMapAreas(result.mapAreas);
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
          { description && hoveredArea && (<Tooltip description={description} hoveredArea={hoveredArea} />)}
          { hoveredArea && <div className='tip'> click to modify the identified zone !</div> }
          { !tagged && <button onClick={() => saveMap()} className='btn-identify'>Save</button> }
          { tagged && <ZoneButton identifyZone={() => identifyZone()} json={{img, mapAreas: mapAreas}} /> }
        </div>
        }
      </div>
      <UploadButton imgChange={img => imageChange(img)} jsonChange={result => jsonChange(result)} />
    </div>
  )
}

export default App
