import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';
import {loadData} from "./testHelpers";

test('renders image when image loaded', async () => {
  render(<App />);
  const inputLoadImgElement = screen.getByAltText(/upload-img/i);

  await loadData(inputLoadImgElement, '(⌐□_□)', 'image/png');

  await waitFor(() => {
    expect(document.querySelector('img')).toBeTruthy();
  });
});



test('renders image when json loaded', async () => {
  render(<App />);
  const inputLoadImgElement = screen.getByAltText(/upload-json/i);
  const json = {
    img: 'data:image/png;base64,KOKMkOKWoV/ilqEp'
  };
  const blob = new Blob([JSON.stringify(json)], {type: "application/json"});

  await loadData(inputLoadImgElement, blob, 'application/json');

  await waitFor(() => {
    expect(document.querySelector('img')).toBeTruthy();
  });
});

test('renders identified zone', async () => {
  render(<App />);
  const inputLoadJsonElement = screen.getByAltText(/upload-json/i);
  const json = {
    img: 'data:image/png;base64,KOKMkOKWoV/ilqEp',
    mapAreas: [
      {
        name:"1",
        shape:"rect",
        coords:[182.5,148,468.5,340],
        lineWidth: 2,
        preFillColor: "rgba(255, 255, 255, 0.3)"
      }
    ]
  };
  const blob = new Blob([JSON.stringify(json)], {type: "application/json"});

  await loadData(inputLoadJsonElement, blob, 'application/json');

  await waitFor(() => {
    const area = document.querySelector('area');
    expect(area && area.coords).toBe('182.5,148,468.5,340');
    expect(area && area.shape).toBe('rect');
  });
});

test('renders the right number of identified zone', async () => {
  render(<App />);
  const inputLoadJsonElement = screen.getByAltText(/upload-json/i);
  const json = {
    img: 'data:image/png;base64,KOKMkOKWoV/ilqEp',
    mapAreas: [
      {
        name: 1,
        shape:"rect",
        coords:[182.5,148,468.5,340],
        lineWidth: 2,
        preFillColor: "rgba(255, 255, 255, 0.3)"
      },
      {
        name: 2,
        shape:"rect",
        coords:[20,148,468.5,340],
        lineWidth: 2,
        preFillColor: "rgba(255, 255, 255, 0.3)"
      }
    ]
  };
  const blob = new Blob([JSON.stringify(json)], {type: "application/json"});

  await loadData(inputLoadJsonElement, blob, 'application/json');

  await waitFor(() => {
    const areas = document.querySelectorAll('area');
    expect(areas.length).toBe(2);
  });
});
