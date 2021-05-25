"""gCDM: CDM access via gRPC"""

import grpc

from gcdm_server_pb2_grpc import GcdmStub
from gcdm_netcdf_pb2 import DataType, HeaderRequest

channel = grpc.insecure_channel('localhost:16111')
client = GcdmStub(channel)
# location is with respect to inside gcdm container
request_header = HeaderRequest(location='/data/grid/20210317090000-JPL-L4_GHRSST-SSTfnd-MUR25-GLOB-v02.0-fv04.2.nc')

response_header = client.GetNetcdfHeader(request_header)
print('response header:')
print('    error: {}'.format(response_header.error))
print('    version: {}\n'.format(response_header.version))

header = response_header.header
print('netcdf header:')
print('    location: {}'.format(header.location))
print('    title: {}'.format(header.title))
print('    id: {}\n'.format(header.id))

rootGroup = header.root
name = rootGroup.name
if name == '':
    name = '/'

print('Root group name: {}\n'.format(name))

dimensions = rootGroup.dims
print('Dimensions (name, size):')
for dim in dimensions:
    print('    ({}, {})'.format(dim.name, dim.length))
print()

variables = rootGroup.vars
time_variable = ''
print('Variables (data type, name):')
for var in variables:
    print('    {} {}'.format(DataType.Name(var.data_type), var.name))
    if var.name.lower() == 'time':
        time_variable = var
print()

print('    time:')
time_attributes = time_variable.atts
print('        attributes:')
for attr in time_attributes:
    print('            {}: {}'.format(attr.name, attr.data.sdata))

time_data = time_variable.data
print('        data:')
print('            shape: {}'.format(time_data.shapes))
print('            values: {}'.format(time_data.idata))
print()
