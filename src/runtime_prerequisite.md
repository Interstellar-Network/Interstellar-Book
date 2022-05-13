
# Prerequisite Installation for runtime



## Install IPFS
- [IPFS Desktop Install](https://github.com/ipfs/ipfs-desktop#install)
        - that way the full IPFS env is set up; alternatively you can just install go-ipfs
- [IPFS with go-ipfs client Install](https://docs.ipfs.io/install/command-line/#official-distributions)

Installing ipfs on linux (without desktop):
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
Set env var path and launch the ipfs deamon
```sh
GO_IPFS_PATH=/usr/local/bin/ipfs

IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH init -p test
IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH config Addresses.API /ip4/0.0.0.0/tcp/5001
IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH daemon --enable-pubsub-experiment
```
>"if you intend to use Docker you SHOULD be sure it is reachable by the containers
eg /ip4/0.0.0.0/tcp/5001"


deamon launch:
> wait for "Initializing daemon..." and "ID": "12D3KooWKDUcaDuzxqQeSvpwtE8kQKAGNFA1BdmNECk47iYMRA6F","

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





