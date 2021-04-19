import {MapArea} from "./mapArea.interface";
import ReactCrop from 'react-image-crop';

export const cropDefault = ReactCrop.Crop = {
  unit: 'px',
  x: 0,
  y: 20,
  height: 50,
  width: 50
}

export const mapAreaDefault : MapArea = {
  name: 0,
  shape: "rect",
  coords: [0, 0, 0, 0],
  lineWidth: 2,
  preFillColor: "rgba(255, 255, 255, 0.3)"
}
