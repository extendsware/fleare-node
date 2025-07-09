#!/bin/bash

# Create output directory
mkdir -p libs/protobuf/compiled
# mkdir -p dist/protobuf

# Generate JavaScript and TypeScript definitions
protoc \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  --js_out=import_style=commonjs,binary:libs/protobuf/compiled \
  --ts_out=libs/protobuf/compiled \
  -I libs/protobuf/proto \
  libs/protobuf/proto/comm.proto