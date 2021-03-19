# Local servers for development

Before running example code, we need to make sure that a `cdmr` server is accessible.
This gradle subproject manages the creation of a local server for development purposes.

<a id="spin-up" />

## Spinning-up a local server

An easy way to do that right now is to spin-up a local server.
We can use gradle to do that, thanks to Avast's [gradle-docker-compose](https://github.com/avast/gradle-docker-compose-plugin) plugin.
This requires that docker and docker-compose is available for use.

_Note: If you are running docker on a linux host, please see the comments at the end of `cdm-grpc-local/envoy.yaml`, as you will need to make an adjustment to that file before starting a local server._

From the top level of the repository, execute:

~~~shell
./gradlew :cdm-grpc-local:composeUp
~~~

If the spin-up is successful, you should see output that looks like:

~~~shell
+----------+----------------+-----------------+
| Name     | Container Port | Mapping         |
+----------+----------------+-----------------+
| cdmrpc_1 | 16111          | localhost:16111 |
+----------+----------------+-----------------+
| envoy_1  | 16110          | localhost:16110 |
| envoy_1  | 9901           | localhost:9901  |
+----------+----------------+-----------------+
~~~

after which, you will be returned to the command prompt.

The local `cdmr` server will be available at `localhost` on port _16111_.
All non-JavaScript clients will connect directly to the `cdmr` server.
For JavaScript development, a proxy server is needed to handle the _HTTP/1_ / _HTTP/2_ communications, as gRPC requires _HTTP/2_.
We use the proxy server [envoy](https://www.envoyproxy.io/).
It is available at `localhost` on port _16110_, which is the host and port that should be used to interact with the `cdmr` server.

<a id="tear_down" />

## Tearing-down the local server

To tear-down the local sever, use the following command from the top level of the repository:

~~~shell
./gradlew :cdm-grpc-local:composeDown
~~~

This will stop and destroy the local container used to run the server environment.
Note that this will not remove the base `adoptOpenJdk` and `envoy` images used to create the container.

# Test data

Currently, one data file (stored in `netCDF-4`) is made available on the server for testing.
A local copy of the file can be found at `cdm-grpc-local/sample_data/grid/20210317090000-JPL-L4_GHRSST-SSTfnd-MUR25-GLOB-v02.0-fv04.2.nc`.
This file is made available inside the container at `/data/grid/`.
This is a daily product from the [GHRSST Level 4 MUR 0.25 degree Global Foundation Sea Surface Temperature Analysis (v4.2)]() dataset (https://doi.org/10.5067/GHM25-4FJ42) for March 17th, 2001.

**JPL MUR MEaSUREs Project. 2019.** _GHRSST Level 4 MUR 0.25 deg Global Foundation Sea Surface Temperature Analysis. Ver. 4.2._, PO.DAAC, CA, USA. Dataset accessed 2021-03-18 at <https://doi.org/10.5067/GHM25-4FJ42>.
