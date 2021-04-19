import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import App from "../../App";
import React from "react";
import {assertLoadJson, loadData} from "../../testHelpers";

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
  
  await assertLoadJson();

  await waitFor(() => {
    expect(screen.getByText('Identify')).toBeTruthy();
    expect(screen.getByText('Export to json')).toBeTruthy();
  });
});

test('renders input description when click on Identify button', async () => {
  render(<App />);

  await assertLoadJson();

  await waitFor(() => {
    const identifyBtn = screen.getByText('Identify')
    fireEvent.click(identifyBtn);

    expect(screen.getByText('Description')).toBeTruthy()
  });
});

test('renders crop when click on Identify button', async () => {
  render(<App />);

  await assertLoadJson();

  await waitFor(() => {
    const identifyBtn = screen.getByText('Identify')
    fireEvent.click(identifyBtn);

    const crop =  document.getElementsByClassName('ReactCrop');
    expect(crop).toBeTruthy()
  });
});
