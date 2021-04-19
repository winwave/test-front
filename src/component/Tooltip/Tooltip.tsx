import React from "react";
import { MapArea } from "../../mapArea.interface";

function Tooltip({
  description,
  hoveredArea
} : {
  description: string
  hoveredArea: MapArea | null;
}) {

  const getTooltipPosition = (area) => {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
  }

  return (
    <span
      className="tooltip"
      style={{ ...getTooltipPosition(hoveredArea) }}
    >
      { description }
    </span>
  )
}

export default Tooltip
