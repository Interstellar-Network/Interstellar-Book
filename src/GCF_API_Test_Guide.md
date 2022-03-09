# GCF APIs Testing Guide


this is the test units related to the gRPC APIs call to the GCF external service gRPC tokio server.

Required the installation of go (to use go-ipfs) and ipfs

## prerequisites (Go and IPFS)

### Install Go:
- Install Go with download of the [last version](https://go.dev/doc/install)

- Installing Go on Ubuntu 20.04 with version `go1.17.8.linux-amd64` #

you can replace the tar file with its last version in the following command.
```sh
wget -c https://dl.google.com/go/go1.17.8.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local
```
check version
```,sh,editable
go version
```


### Install IPFS
- [IPFS Desktop Install](https://github.com/ipfs/ipfs-desktop#install)
        - that way the full IPFS env is set up; alternatively you can just install go-ipfs
- [IPFS with go-ipfs client Install](https://docs.ipfs.io/install/command-line/#official-distributions)

Installing ipfs on linux (whithout desktop):
```sh
wget https://dist.ipfs.io/go-ipfs/v0.11.0/go-ipfs_v0.11.0_linux-amd64.tar.gz
```
```sh
tar -xvzf go-ipfs_v0.11.0_linux-amd64.tar.gz
```
```,sh
cd go-ipfs
sudo bash install.sh
```
check ipfs
```sh
ipfs --version
```

set env var path and launch the ipfs deamon

```sh
GO_IPFS_PATH=/usr/local/bin/ipfs

IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH init -p test
IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH config Addresses.API /ip4/127.0.0.1/tcp/5001
IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH daemon --enable-pubsub-experiment
```

deamon launch
```sh
Initializing daemon...
go-ipfs version: 0.12.0
Repo version: 12
System version: amd64/linux
Golang version: go1.16.12
Swarm listening on /ip4/127.0.0.1/tcp/40319
Swarm listening on /p2p-circuit
Swarm announcing /ip4/127.0.0.1/tcp/40319
API server listening on /ip4/127.0.0.1/tcp/45167
WebUI: http://127.0.0.1:45167/webui
Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/34533
Daemon is ready
```
json config:
```json
{
    "ID": "12D3KooWKDUcaDuzxqQeSvpwtE8kQKAGNFA1BdmNECk47iYMRA6F",
    "PublicKey": "CAESIIuk1CX4SOWG29N7DxhOuFYpzX0KUgsLi6EWVNnoylMU",
    "Addresses": [
    "/ip4/127.0.0.1/tcp/40319/p2p/12D3KooWKDUcaDuzxqQeSvpwtE8kQKAGNFA1BdmNECk47iYMRA6F"
    ],
    "AgentVersion": "go-ipfs/0.12.0/",
    "ProtocolVersion": "ipfs/0.1.0",
    "Protocols": [
            "/floodsub/1.0.0",
            "/ipfs/bitswap",
            "/ipfs/bitswap/1.0.0",
            "/ipfs/bitswap/1.1.0",
            "/ipfs/bitswap/1.2.0",
            "/ipfs/id/1.0.0",
            "/ipfs/id/push/1.0.0",
            "/ipfs/lan/kad/1.0.0",
            "/ipfs/ping/1.0.0",
            "/libp2p/autonat/1.0.0",
            "/libp2p/circuit/relay/0.1.0",
            "/libp2p/circuit/relay/0.2.0/stop" ,
            "/meshsub/1.0.0",
            "/meshsub/1.1.0",
            "/p2p/id/delta/1.0.0",
            "/x/"
    ]
}
```

## Test repositories


[Circuit APIs](https://github.com/Interstellar-Network/api_circuits/tree/main/tests)


[Garble APIs](https://github.com/Interstellar-Network/api_garble/tree/main/tests)

