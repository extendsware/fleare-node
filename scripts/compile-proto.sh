#!/bin/bash

# Create output directory
mkdir -p src/protobuf/compiled
# mkdir -p dist/protobuf

# Generate JavaScript and TypeScript definitions
protoc \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  --js_out=import_style=commonjs,binary:src/protobuf/compiled \
  --ts_out=src/protobuf/compiled \
  -I src/protobuf/proto \
  src/protobuf/proto/comm.proto