import React from 'react';
import { render, screen } from '@testing-library/react';
import UploadButton from "./UploadButton";

test('renders Select image button', () => {
  render(<UploadButton imgChange={() => null} jsonChange={() => null}/>);
  const inputLoadImgElement = screen.getByRole('button', {name: /Select image/i});
  expect(inputLoadImgElement).toBeInTheDocument();
});

test('renders Select Json Image file button ', () => {
  render(<UploadButton imgChange={() => null} jsonChange={() => null}/>);
  const inputLoadImgElement = screen.getByRole('button', {name: /Select Json Image file/i});
  expect(inputLoadImgElement).toBeInTheDocument();
});
