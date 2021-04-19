import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from "../../App";
import {assertLoadJson, loadData} from "../../testHelpers";

test('renders tooltip description when mouse enter identified zone', async () => {
  render(<App />);
  const json = {
    img: 'data:image/png;base64,KOKMkOKWoV/ilqEp',
    mapAreas: [
      {
        name: 1,
        shape:"rect",
        coords:[182.5,148,468.5,340],
        lineWidth: 2,
        preFillColor: "rgba(255, 255, 255, 0.3)",
        description: "description test"
      }
    ]
  };

  await assertLoadJson(json);

  await waitFor(() => {
    const area = document.querySelector('area');
    // @ts-ignore
    fireEvent.mouseEnter(area)
    expect(screen.getByText("description test")).toBeTruthy()
  });
});
