import React from "react";
import {JsonData} from "../../jsonData.interface";

function ZoneButton({
  identifyZone,
  json
} : {
  identifyZone: () => void;
  json: JsonData;
}) {

  const exportJson = (json: JsonData) => {
    let a = document.createElement('a');
    a.href = "data:application/json,"+encodeURIComponent(JSON.stringify(json));
    a.download = 'image.json';
    a.click();
  }

  return (
    <div>
      <button onClick={() => identifyZone()} className='btn-identify'>
        Identify
      </button>
      <button onClick={() => exportJson(json)}>
        Export to json
      </button>
    </div>
  )
}

export default ZoneButton
