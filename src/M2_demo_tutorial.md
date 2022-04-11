# M2 Docker Demo Tutorial 



## Check prerquiste

[runtime prerequiste](./runtime_prerequisite.md)


## Set-up Demo
### Launch ipfs deamon

```sh
GO_IPFS_PATH=/usr/local/bin/ipfs

IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH init -p test
IPFS_PATH=/tmp/ipfs $GO_IPFS_PATH config Addresses.API /ip4/0.0.0.0/tcp/5001
```
```
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

#### Launch api_circuit docker

```sh
docker run -it --name api_circuits --rm -p 3000:3000 --env RUST_LOG="warn,info,debug" ghcr.io/interstellar-network/api_circuits:milestone1 /usr/local/bin/api_circuits --ipfs-server-multiaddr /ip4/172.17.0.1/tcp/5001
```



#### Launch api_garble docker

```sh
docker run -it --name api_garble --rm -p 3001:3000 --env RUST_LOG="warn,info,debug" ghcr.io/interstellar-network/api_garble:milestone1 /usr/local/bin/api_garble --ipfs-server-multiaddr /ip4/172.17.0.1/tcp/5001
```


### Launch substrate demo chain with OCW


```
git clone --branch=interstellar --recursive git@github.com:Interstellar-Network/subs trate-offchain-worker-demo.git
```
then
```
cd substrate-offchain-worker-demo 
````


build the substrate chain....

```sh
RUST_LOG="warn,info" cargo run -- --dev --tmp --enable-offchain-indexing=1
```
> IMPORTANT: you MUST use --enable-offchain-indexing=1 else it will always do nothing and show "[ocw-garble] nothing to do, returning..." and "[ocw-circuits] nothing to do, returning..." in the logs


### Launch a generic Substrate Fromt-end

Use the following [substrate link](https://github.com/substrate-developer-hub/substrate-front-end-template#installation) for installation
then use
```sh
Yarn start
```
to connect a locally running node


## Demo purpose and used components


In this demo, we want to demonstrate:

- How ocwCircuits and ocwGarble pallets can manage the production of the display garbled circuits. 
- How the Transaction Validation Protocol TTVP pallet will confirm transactions based on those circuit evaluations/execution.

`ocwCircuits`: manage the generation of the logical display circuit in `skcd format` used to configure the garbled circuit production.
> the generation of this configuartion display circuit use a Master File VHDL packages (pre-configured for that demo).

 `ocwGarble`: can generate for each transaction a randomized display garbled circuit (with random Keypad and one time code) with a customized message based on transaction parameters information.

`GCevaluator`: Evaluate the garbled circuit/display message and get the one time code to verify

`TTVP`: check that the one time code is correct




## Demo overview:

### 1. Generate with `ocwCircuits` pallet the configuration display circuit 
> This step will generate a logical circuit in skcd format cached in memory in the production pipeline


### 2. Generate with `ocwGarble` pallet a randomized display garble circuit 

> This step will use skcd cached file and input parameter to generate a randomized garbled circuit customized with transaction parameter
> in this demo we do not use yet, other circuit customization parameters like screen resolution, etc..


### 3. Evaluation of the display garbled circuit with `GCevaluator`and get One time code

### 4. Check one time code with `TTVP pallet`



# Start Demo

> IMPORTANT: When intracting with pallets you MUST use the Signed button in blue to sign all the transactions, not SUDO, neither Unsigned

> step 1,2 & 4 use pallet interactor in Substrate Front End

## 1. Generate with `ocwCircuits` the configuration display circuit 

### 1.1  Select ocwCircuits pallet and submitConfigDisplaySigned extrinsic

![circuit select](./fig/1ocwCircuitSelect.png)

### 1.2 Sign transaction

![circuit sign](./fig/2ocwCircuit.png)

### 1.3 Copy the ipfs hash/cid of the generated skcd file 

> it appears in Events (blue dot on this screenshot example)

![circuit sign](./fig/3ocwCircuitResult.png)




## 2. Generate with `ocwGarble` a randomized display garble circuit with transaction message and one time code


### 2.1 Select ocwGarble pallet and garbleAndStripSigned extrinsic

![garble select](./fig/1ocwGarbleSelect.png)


### 2.2 Input skcdCid and Transaction message

![garble input 2 ](./fig/2ocwGarbleInput.png)

#### 2.2.1 Paste the ipfs hash/cid of step 1.3 in field skcdCid



#### 2.2.2 Input the message in field txMsg


![garble input 3 ](./fig/3ocwGarbleInput.png)

> the skcd cid is still in Events, blue dot in this example
#### 2.2.3 Sign the transaction

#### 2.2.4 garbled circuit cid appear in Events

![garble result ](./fig/4ocwGarbleResult.png)

> the generated garbled circuit cid `NewGarbledIpfsCid`will then appear in Events (underlined in red line in this screenshot example)

### 2.3 Copy paste the hash of the generated display garbled circuit (ready to be avaluated)



> coment: You can specify any type of transaction message
not especially tied to a wallet transaction
It can be used for any sensitive operation that need a highly secure confirmtion

![garble result ex ](./fig/5ocwGarbleResult.png)

## 3. Evaluation of the display garbled circuit with `GCevaluator`and get One time code



## 4. Check one time code with `TTVP pallet`
