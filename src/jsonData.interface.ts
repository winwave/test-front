import ReactCrop from 'react-image-crop';
import { mapArea } from "./App";

export interface JsonData {
  img: string;
  mapArea: mapArea;
  crop: ReactCrop.Crop;
  description: string
}
