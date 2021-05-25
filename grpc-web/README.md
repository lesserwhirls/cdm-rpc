# Javascript client

This gradle submodule holds example javascript code for talking with the gRPC based `gCDM` server.
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
See [gcdm-local/README.md](../gcdm-local/README.md#spin-up) for details.
This also ensures that the gRPC and protobuf managed source code has been generated.

Next, use npm to build the bundle.
The command we will use is `npm run build`, and should be executed in the `grpc-web/src/main/js` directory.
You should see something similar to the following in your terminal:

~~~shell
> npm run build

> grpc-web-commonjs-example@1.0.0 build C:\Users\Sarms\dev\unidata\repos\thredds\cdm-rpc\grpc-web\src\main\js
> parcel build --public-url . index.html                                                                                                                                                                                                        √  Built in 5.68s.
                                                                                                                        dist\js.b6d8ade2.js.map        ‼  1.99 MB     82ms
dist\client.96fb2162.js.map     943.47 KB     68ms
dist\js.b6d8ade2.js             554.61 KB    346ms
dist\client.96fb2162.js         395.24 KB    3.21s
dist\index.html                     251 B    1.81s
~~~

After the build, you can use the command `npm start` to run the demo application.
You should see the following in output in the terminal:

~~~shell
> npm start

> grpc-web-commonjs-example@1.0.0 start C:\Users\Sarms\dev\unidata\repos\thredds\cdm-rpc\grpc-web\src\main\js
> parcel index.html

Server running at http://localhost:1234
√  Built in 6.81s.
~~~

Finally, open a web browser and navigate to the example using `localhost` and the port number indicated by the output from the above npm command.
For example, if the output was exactly as above, you would use `localhost:1234` in the url bar.
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
See [gcdm/README.md](../gcdm-local/README.md#tear-down) for details.
