# CDM RPC

This is a project to explore the use of javascript and python to communicate with a new Remote Procedure Call (RPC) service, tentatively called `cdmr`.
`cdmr` is based on the [gRPC framework](https://grpc.io/).
The service and message structures are defined using [Protocol Buffers](https://developers.google.com/protocol-buffers), Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data.
Protocol Buffer message definition files (`.proto` files) can be compiled into source code for multiple languages using the `protoc` compiler.
gRPC services defined using Protocol Buffer definitions can be compiled into client and server code using additional compiler plugins.
This project uses the [protobuf-gradle-plugin](https://github.com/google/protobuf-gradle-plugin) to manage the generation of javascript and python source code for both the messages and service associated with `cdmr`.
Javascript gRPC code is generated using the [grpc-web](https://github.com/grpc/grpc-web) plugin, and python gRPC code is generated using the python gRPC plugin obtained from https://packages.grpc.io/.

## Requirements

JDK 8 or later

## Source Code Generation

From the top level directory of this repository, simply run:

~~~bash
./gradlew clean build
~~~

and gradle will do the rest.

Generated javascript code will appear under `grpc-web/src/main/js/generated`, and generated python code will appear under `grpc-python/src/main/python/generated`.
