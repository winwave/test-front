import ReactCrop from 'react-image-crop';
import { MapArea } from "./mapArea.interface";

export interface JsonData {
  img: string;
  mapArea: MapArea;
  crop: ReactCrop.Crop;
  description: string
}
