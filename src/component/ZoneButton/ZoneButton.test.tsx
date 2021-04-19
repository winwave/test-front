import {render, screen, waitFor} from "@testing-library/react";
import App from "../../App";
import React from "react";
import {loadData} from "../../testHelpers";

test('renders Identify button and Export to json button when image loaded', async () => {
  render(<App />);
  const inputLoadImgElement = screen.getByAltText(/upload-img/i);

  await loadData(inputLoadImgElement, '(⌐□_□)', 'image/png');

  await waitFor(() => {
    expect(screen.getByText('Identify')).toBeTruthy();
    expect(screen.getByText('Export to json')).toBeTruthy();
  });
});

test('renders Identify button and Export to json button when json loaded', async () => {
  render(<App />);
  const inputLoadImgElement = screen.getByAltText(/upload-json/i);
  const json = {
    img: 'data:image/png;base64,KOKMkOKWoV/ilqEp'
  };
  const blob = new Blob([JSON.stringify(json)], {type: "application/json"});

  await loadData(inputLoadImgElement, blob, 'application/json')

  await waitFor(() => {
    expect(screen.getByText('Identify')).toBeTruthy();
    expect(screen.getByText('Export to json')).toBeTruthy();
  });
});
