const {HeaderRequest, DataType} = require('./cdmrNetcdf_pb.js');
const {CdmRemoteClient} = require('./cdmrServer_grpc_web_pb.js');

var cmdrService = new CdmRemoteClient('http://localhost:16110');

var request = new HeaderRequest();
request.setLocation('/data/grid/20210317090000-JPL-L4_GHRSST-SSTfnd-MUR25-GLOB-v02.0-fv04.2.nc')

cmdrService.getNetcdfHeader(request, {}, function(err, response) {
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
        console.log('    ' + Object.keys(DataType)[variable.getDatatype()] + ' ' + varName)
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
    console.log('            shape: ' + timeData.getShapeList())
    console.log('            values: ' + timeData.getIdataList())
    console.log('')
});
