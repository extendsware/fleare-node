#!/bin/bash

# Create output directory
mkdir -p libs/compiled
# mkdir -p dist/protobuf

# Generate JavaScript and TypeScript definitions
protoc \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  --js_out=import_style=commonjs,binary:libs/compiled \
  --ts_out=libs/compiled \
  -I libs/proto \
  libs/proto/comm.proto
