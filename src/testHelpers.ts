import {act, fireEvent, screen} from "@testing-library/react";
import {JsonData} from "./jsonData.interface";

export const loadData = async (element: HTMLElement, blob: Blob | string, type: string) => await act(async () => {
  fireEvent.change(element, {
    target: {
      files: [new File([blob], 'filename', {type})],
    },
  })
})

export const assertLoadJson = async (json?: JsonData) => {
  const inputLoadImgElement = screen.getByAltText(/upload-json/i);
  const jsonsData = json || {
    img: 'data:image/png;base64,KOKMkOKWoV/ilqEp'
  };
  const blob = new Blob([JSON.stringify(jsonsData)], {type: "application/json"});

  await loadData(inputLoadImgElement, blob, 'application/json')
}
