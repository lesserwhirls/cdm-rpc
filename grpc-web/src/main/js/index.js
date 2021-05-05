import 'ol/ol.css';
import {Map, View} from 'ol';
import Projection from 'ol/proj/Projection';
import Image from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';
import ImageStatic from 'ol/source/ImageStatic';
import OSM from 'ol/source/OSM';
import {getCenter} from 'ol/extent';

// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
var width = 1024;
var height = 968;
var extent = [0, 0, width, height];
var projection = new Projection({
  code: 'EPSG:4326',
  units: 'degrees',
  extent: extent
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var canvas = document.createElement('canvas');
// canvas.width = width;
// canvas.height = height;
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(width, height);
for (let i = 0; i < imageData.data.length; i += 4) {
  // Modify pixel data
  imageData.data[i + 0] = getRandomInt(255);  // R value
  imageData.data[i + 1] = getRandomInt(255);    // G value
  imageData.data[i + 2] = getRandomInt(255);  // B value
  imageData.data[i + 3] = 255;  // A value
}
// Draw image data to the canvas
ctx.putImageData(imageData, 0, 0);
var dataURL = canvas.toDataURL();

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new Image({
      source: new ImageStatic({
        url: dataURL,
        projection: projection,
        imageExtent: extent
      })
    })
  ],
  target: 'map',
  view: new View({
    projection: 'EPSG:4326',
    center: getCenter(extent),
    zoom: 2,
    maxZoom: 8
  })
});