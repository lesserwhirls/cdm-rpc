const {HeaderRequest, DataType} = require('./gcdm_netcdf_pb');
const {GcdmClient} = require('./gcdm_server_grpc_web_pb');
const {GridDatasetRequest, GridDataRequest} = require('./gcdm_grid_pb');

var gcdmService = new GcdmClient('http://localhost:16110');
var datasetLocation = '/data/grid/20210317090000-JPL-L4_GHRSST-SSTfnd-MUR25-GLOB-v02.0-fv04.2.nc'

function ncdumpIsh() {
    let headerRequest = new HeaderRequest();
    headerRequest.setLocation(datasetLocation)
    gcdmService.getNetcdfHeader(headerRequest, {}, function (err, response) {
        console.log('response header:')
        console.log('    error: ' + response.getError())
        console.log('    version: ' + response.getVersion())
        console.log('')

        var header = response.getHeader()
        console.log('netcdf header:')
        console.log('    location: ' + header.getLocation())
        console.log('    title: ' + header.getTitle())
        console.log('    id: ' + header.getId())
        console.log('')

        var rootGroup = header.getRoot()
        var name = rootGroup.getName()
        if (name === '') {
            name = '/'
        }
        console.log('Root group name: ' + name)
        console.log('')

        console.log('Dimensions (name, size):')
        var dimensions = rootGroup.getDimsList()
        dimensions.forEach(dim => console.log('    ' + dim.getName() + ', ' + dim.getLength()));
        console.log('')

        var variables = rootGroup.getVarsList()
        var timeVariable = ''
        console.log('Variables (data type, name):')
        variables.forEach(function (variable) {
            var varName = variable.getName()
            console.log('    ' + Object.keys(DataType)[variable.getDataType()] + ' ' + varName)
            if (varName.toLowerCase() === 'time') {
                timeVariable = variable
            }
        });
        console.log('')

        console.log('    time:')
        var timeAttributes = timeVariable.getAttsList()
        console.log('        attributes:')
        timeAttributes.forEach(function (att) {
            console.log('            ' + att.getName() + ': ' + att.getData().getSdataList())
        });
        var timeData = timeVariable.getData()
        console.log('        data:')
        console.log('            shape: ' + timeData.getShapesList())
        console.log('            values: ' + timeData.getIdataList())
        console.log('')
    });
}

function listGrids() {
    var gridDatasetRequest = new GridDatasetRequest();
    gridDatasetRequest.setLocation(datasetLocation)
    gcdmService.getGridDataset(gridDatasetRequest, {}, function (err, response) {
        let gridDataset = response.getDataset();
        gridDataset.getGridsList().forEach(function(grid) {
            console.log(grid.getName());
        });
    });
}

function subset(gridName, lowerLeftLon, lowerLeftLat, lonWidth, latWidth) {
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
    var dataStream = gcdmService.getGridData(gridDataRequest, {});

    // setup the handlers for the stream
    dataStream.on('data', function(response) {
        var gridReferencedArray = response.getData();
        console.log(gridReferencedArray.getGridName());
        var dataArray = gridReferencedArray.getData();
        console.log(gridReferencedArray)
        var dataValues = dataArray.getDdataList();
        console.log(dataValues)
        var csSubset = gridReferencedArray.getCsSubset();
        console.log(csSubset);
        var projection = csSubset.getProjection();
        console.log(projection);
    });

    dataStream.on('status', function(status) {
        console.log(status);
    });

    dataStream.on('end', function(end) {
        console.log('Stream finished!');
    });
}

// sort of like an ncdump -h...ish
ncdumpIsh()

// list grids in the dataset
listGrids()

// make a subset of one grid
subset('analysed_sst', 10,5,2,1.5);
