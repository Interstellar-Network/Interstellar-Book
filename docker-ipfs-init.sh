#!/bin/sh
set -ex
# https://github.com/ipfs/kubo/issues/7667
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin  '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
