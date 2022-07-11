# M3 Demo Tutorial



## Check prerequiste

[runtime prerequiste](./runtime_prerequisite.md)


## Set-up Demo

### Launch ipfs deamon

```sh
export GO_IPFS_PATH=/usr/local/bin/ipfs
```
```sh
IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH init -p test
```
```sh
IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH config Addresses.API /ip4/0.0.0.0/tcp/5001
```
```sh
IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH daemon --enable-pubsub-experiment
```

```sh
Initializing daemon...
go-ipfs version: 0.11.0
Repo version: 11
System version: amd64/linux
Golang version: go1.16.12
Swarm listening on /ip4/127.0.0.1/tcp/46507
Swarm listening on /p2p-circuit
Swarm announcing /ip4/127.0.0.1/tcp/46507
API server listening on /ip4/0.0.0.0/tcp/5001
WebUI: http://0.0.0.0:5001/webui
Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/38297
Daemon is ready
```



### Launch dockers:

>--ipfs-server-multiaddr value depends on your own environment
The example value should work with a standard docker installation.

#### Launch api_circuit docker

```sh
docker run -it --name api_circuits --rm -p 3000:3000 --env RUST_LOG="warn,info,debug" ghcr.io/interstellar-network/api_circuits:milestone2 /usr/local/bin/api_circuits --ipfs-server-multiaddr /ip4/172.17.0.1/tcp/5001
```



#### Launch api_garble docker

```sh
docker run -it --name api_garble --rm -p 3001:3000 --env RUST_LOG="warn,info,debug" ghcr.io/interstellar-network/api_garble:milestone2 /usr/local/bin/api_garble --ipfs-server-multiaddr /ip4/172.17.0.1/tcp/5001
```


### Launch substrate demo chain with OCW


```
git clone --branch=master --recursive git@github.com:Interstellar-Network/substrate-offchain-worker-demo.git
```
then
```
cd substrate-offchain-worker-demo 
````


build and run the substrate chain....

```sh
RUST_LOG="warn,info" cargo run -- --dev --tmp --enable-offchain-indexing=1
```
> IMPORTANT: you MUST use --enable-offchain-indexing=1 else it will always do nothing and show "[ocw-garble] nothing to do, returning..." and "[ocw-circuits] nothing to do, returning..." in the logs


### Launch a generic Substrate Fromt-end

Use the following [substrate link](https://substrate-developer-hub.github.io/substrate-front-end-template/?rpc=ws%3A%2F%2Flocalhost%3A9944) to launch substrate front end

to connect to a locally running node

> avoid some browser extensions that could generate interface issues

## Demo purpose and used components



