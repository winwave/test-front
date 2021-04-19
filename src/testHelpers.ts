import {act, fireEvent} from "@testing-library/react";

export const loadData = async (element: HTMLElement, blob: Blob | string, type: string) => await act(async () => {
  fireEvent.change(element, {
    target: {
      files: [new File([blob], 'filename', {type})],
    },
  })
})
