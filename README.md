# Test Front with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Dependencies
- [react-image-mapper](https://www.npmjs.com/package/react-image-mapper): React Component to highlight interactive zones in images
- [react-image-crop](https://www.npmjs.com/package/react-image-crop): An image cropping tool for React, that is used for identify a zone in image

## Architecture
Typescript + [Hooks](https://reactjs.org/docs/hooks-intro.html)

In this test I have use some Hooks's function like: `UseState` , `UseEffect` and `useMemo` (for the image)

## Features

- Upload image
- Upload json file contain: image (base64), identified zone coordinates, description (example: `src/image.json`)
- Identify and modify zone
- Add description for the identified zone
- export to json (example: `src/image.json`)


- Feature we can do more: multi identified zones
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn test`

Launches the test runner in the interactive watch mode.\
