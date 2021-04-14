# Javascript client

This gradle submodule holds example javascript code for talking with the gRPC based `cdmr` server.
The following instructions will assist you in running the example script.

## Environment setup

These instructions assume that Node is available on your system.
From the `grpc-web/src/main/js` directory of this repository, execute the following commands to install the necessary node modules:

~~~shell
npm install
~~~

This will install the dependencies in the `grpc-web/src/main/js/node_modules` directory.


## Running the Javascript example

Make sure a local server is running for development.
See [cdm-grpc-local/README.md](../cdm-grpc-local/README.md#spin-up) for details.
This also ensures that the gRPC and protobuf managed source code has been generated.
Next, package the example code by using npx webpack in the `grpc-web/src/main/js` directory:

~~~shell
npx webpack client.js
~~~

This will create a `grpc-web/src/main/js/dist` directory with the usable client javascript code.
Next, move into the `grpc-web/src/main/js/dist` directory and start a local webserver using python:

~~~sh
python -m http.server
~~~

(note, you might need to use `python3` instead of `python`)
You should see the following output:

~~~sh
> python -m http.server

Serving HTTP on :: port 8000 (http://[::]:8000/) ...
~~~

Finally, open a web browser and navigate to the example using `localhost` and the port number indicated by the output from the above python command.
For example, if the output was exactly as above, you would use `localhost:8000` in the url bar.
The page will be blank, and you might feel sad...but fear not!
Open the developer console of your browser (push `F12` and make sure the `console` tab is selected), and you should see the following output in the console:

~~~
response header:
    error: undefined
    version: 0

netcdf header:
    location: /data/grid/20210317090000-JPL-L4_GHRSST-SSTfnd-MUR25-GLOB-v02.0-fv04.2.nc
    title: 
    id: 

Root group name: /

Dimensions (name, size):
    time, 1
    lat, 720
    lon, 1440

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
            long_name: reference time of sst field
            standard_name: time
            coverage_content_type: coordinate
            axis: T
            units: seconds since 1981-01-01 00:00:00 UTC
            comment: Nominal time of analyzed fields
        data:
            shape: 1
            values: 1268816400
~~~

When you are finished, be sure to tear-down the local server.
See [cdm-grpc-local/README.md](../cdm-grpc-local/README.md#tear-down) for details.
