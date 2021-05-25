# CDM RPC

This is a project to explore the use of javascript and python to communicate with a new Remote Procedure Call (RPC) service, tentatively called `gCDM`.
`gCDM` is based on the [gRPC framework](https://grpc.io/).
The service and message structures are defined using [Protocol Buffers](https://developers.google.com/protocol-buffers), Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data.
Protocol Buffer message definition files (`.proto` files) can be compiled into source code for multiple languages using the `protoc` compiler.
gRPC services defined using Protocol Buffer definitions can be compiled into client and server code using additional compiler plugins.
This project uses the [protobuf-gradle-plugin](https://github.com/google/protobuf-gradle-plugin) to manage the generation of javascript and python source code for both the messages and service associated with `gCDM`.
Javascript gRPC code is generated using the [grpc-web](https://github.com/grpc/grpc-web) plugin, and python gRPC code is generated using the python gRPC plugin obtained from https://packages.grpc.io/.

## Minimum Requirements

* JDK 8 or later
* `docker` and `docker-compose`

## Source Code Generation

From the top level directory of this repository, simply run:

~~~bash
./gradlew clean build
~~~

and gradle will do the rest.

Generated javascript code will appear under `grpc-web/src/main/js/`, and generated python code will appear under `grpc-python/src/main/python/`.
These generated files are removed when the _clean_ task is called.
Generated python files will end with `_pb2.py` or `_pb2_grpc.py`.
Generated JavaScript files will end with `_pb.js`.
Be sure that you do not name your development files in a way that uses those endings!
`git` will ignore them by default, and they will be removed by the _clean_ task (bad times).

## Local servers for development

In order to develop code that speaks to a `gCDM` server, you will need to spin-up a local server for development.
Please see [gcdm-local/README.md](gcdm-local/README.md) for more information on how to use gradle and docker to manage this without (hopefully) much heartache.
