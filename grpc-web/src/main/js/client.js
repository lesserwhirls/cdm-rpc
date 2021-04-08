const {HeaderRequest, HeaderResponse} = require('./cdmrNetcdf_pb.js');
const {CdmRemoteClient} = require('./cdmrServer_grpc_web_pb.js');

var cmdrService = new CdmRemoteClient('http://localhost:16110');

var request = new HeaderRequest();
request.setLocation('/data/grid/20210317090000-JPL-L4_GHRSST-SSTfnd-MUR25-GLOB-v02.0-fv04.2.nc')

cmdrService.getNetcdfHeader(request, {}, function(err, response) {
    console.log('Version ' + response.getVersion());
});