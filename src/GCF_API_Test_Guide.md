# GCF APIs Testing Guide

This is the test units related to the gRPC APIs call to the GCF external service gRPC tokio server.


## Prerequisites

The following software/libs are required to compile and run the 
- go
- ipfs
- cmake >= 3.22
- bison
- libreadline-dev
- libtcl-dev
- libtcl
- tcl8.6-dev
- tk8.6-dev
- liboost-filesystem-dev

 [Prerequiste Install if needed](./prerequiste_update.md)

## Repositories

- [Circuit APIs](https://github.com/Interstellar-Network/api_circuits)
- [Garble APIs](https://github.com/Interstellar-Network/api_garble)

### First clone the previous repositories with --recursive

e.g for Circuit API test
```sh
git clone --recursive https://github.com/Interstellar-Network/api_circuits/tree/main/tests
```
then launch `cargo test` that will run the unit tests








