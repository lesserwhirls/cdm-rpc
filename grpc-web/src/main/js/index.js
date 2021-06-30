import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Ol_Layer_Image from 'ol/layer/Image';
import Ol_Source_ImageCanvas from 'ol/source/ImageCanvas';
import {getCenter} from 'ol/extent';
import 'babel-polyfill';

//////////////////////////////
// gCDM calls to fetch data //
//////////////////////////////

const {GcdmClient} = require('./gcdm_server_grpc_web_pb');
const {GridDataRequest} = require('./gcdm_grid_pb');

var gcdmService = new GcdmClient('http://localhost:16110');
var datasetLocation = '/data/grid/20210317090000-JPL-L4_GHRSST-SSTfnd-MUR25-GLOB-v02.0-fv04.2.nc'

async function subset(gridName, lowerLeftLon, lowerLeftLat, lonWidth, latWidth) {
  var gridDataRequest = new GridDataRequest();
  gridDataRequest.setLocation(datasetLocation);
  // get empty map to hold subset parameters
  let subset = gridDataRequest.getSubsetMap(false);
  // request grid "gridName" for subset
  subset.set("gridName", gridName)
  // bounding box is defined as string "lat,lon,latWidth,lonWidth"
  let subsetString = lowerLeftLat + "," + lowerLeftLon + "," + latWidth + "," + lonWidth;
  // bug in netCDF-Java 6 - need to fix before this will work
  // set spatial subset
  //subset.set("latlonBB", subsetString)
  // set horizontal stride (stride in both lat and lon)
  subset.set("horizStride", "10");
  // set the subset map on the request
  gridDataRequest.subsetMap = subset;

  // make the request and obtain the return stream
  let dataStream = gcdmService.getGridData(gridDataRequest, {});

  // setup the handlers for the stream
  let data = dataStream.on('data', function(response) {
    let gridReferencedArray = response.getData();
    //console.log(gridReferencedArray.getGridName());
    let dataArray = gridReferencedArray.getData();
    //console.log(gridReferencedArray)
    let dataValues = dataArray.getDdataList();
    let csSubset = gridReferencedArray.getCsSubset();
    //console.log(csSubset);
    let projection = csSubset.getProjection();
    //console.log(projection);
    return dataValues;
  });

  dataStream.on('status', function(status) {
    console.log(status);
  });

  dataStream.on('end', function(end) {
    console.log('Stream finished!');
  });
  return data;
}
/////////////////////////////
// OpenLayers Mapping Code //
/////////////////////////////

// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
const width = 1200;
const height = 800;
const extent = [0, 0, width, height];

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
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

async function getCanvas(extent, resolution, pixelRatio, imageSize, projection) {
  // initialize canvas
  const canvas = document.createElement("canvas");
  canvas.width = width; // probably use imageSize here
  canvas.height = height; // probably use imageSize here
  const ctx =  canvas.getContext("2d");
  try {
    // get the data with grpc magic
    let data = subset('analysed_sst', 10,5,2,1.5);

    // create new data for the canvas using a Uint8ClampedArray because faster
    const octets = canvas.width * canvas.height * 4;
    const pixels = new Uint8ClampedArray(octets);
    for(let i = 0, di = 0; i < octets; i += 4, di += 1) {
      // assume we have 1 data value per pixel
      const rgba = mapDataValueToColor(data); // return [r,g,b,a]
      pixels[i] = rgba[0];
      pixels[i + 1] = rgba[1];
      pixels[i + 2] = rgba[2];
      pixels[i + 3] = rgba[3];
    }
    let imgData = ctx.createImageData(canvas.width, canvas.height);
    console.log(pixels);
    // stuff the new data back into the canvas
    imgData.data.set(pixels);
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }
  catch (err) {
    console.error(err);
    return canvas;
  }
}

function mapDataValueToColor(value) {
  // right now, just trying to get a rectangle to appear on the map
  return [128,128,128,128];
}

const imageLayer = new Ol_Layer_Image({
  source: new Ol_Source_ImageCanvas({
    canvasFunction: getCanvas,
    ratio: 1
  })
});

map.addLayer(imageLayer);
