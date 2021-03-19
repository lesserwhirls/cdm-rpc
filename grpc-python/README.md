# Python client

This gradle submodule holds example code for talking with the gRPC based `cdmr` server.
The following instructions will assist you in running the example script.

## Python environment setup

These instructions assume that Conda or Miniconda 3 is available on your system.
From the top level of the repository, execute the following commands to setup and activate the python environment:

~~~shell
conda env create -f ./environment.yml
conda activate cdm-grpc
~~~

That's it!

## Running the python example

First, make sure you are in the `cdm-grpc` Conda environment.
Next, make sure a local server is running for development.
See [cdm-grpc-local/README.md](../cdm-grpc-local/README.md#spin-up) for details.
Finally, from the top level of the repository, execute the example python script:

~~~sh
python .\grpc-python\src\main\python\cdmr_netcdf.py
~~~

You should see the following output:

~~~sh
response header:
    error:
    version: 0

netcdf header:
    location: /data/grid/20210317090000-JPL-L4_GHRSST-SSTfnd-MUR25-GLOB-v02.0-fv04.2.nc
    title:
    id:

Root group name: /

Dimensions (name, size):
    (time, 1)
    (lat, 720)
    (lon, 1440)

Variables (data type, name):
    INT time
    FLOAT lat
    FLOAT lon
    SHORT analysed_sst
    SHORT analysis_error
    BYTE mask
    BYTE sea_ice_fraction
    SHORT sst_anomaly

    time:
        attributes:
            long_name: ['reference time of sst field']
            standard_name: ['time']
            coverage_content_type: ['coordinate']
            axis: ['T']
            units: ['seconds since 1981-01-01 00:00:00 UTC']
            comment: ['Nominal time of analyzed fields']
        data:
            shape: [1]
            values: [1268816400]
~~~

When you are finished, be sure to tear-down the local server.
See [cdm-grpc-local/README.md](../cdm-grpc-local/README.md#tear-down) for details.
