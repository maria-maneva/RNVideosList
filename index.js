/**
 * @format
 */

import { AppRegistry } from 'react-native';
import React from 'react';
import App from './src/App';
import { name as appName } from './app.json';
import { VideosProvider } from './src/store/videos.context';

const AppWrapper = () => (
  <VideosProvider>
    <App />
  </VideosProvider>
);

AppRegistry.registerComponent(appName, () => AppWrapper);
