# M1 Docker Demo Tutorial

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
RUST_LOG="warn,info" cargo run -- --dev --tmp
```
> Important: the node log will display some results i.e cid that you will have to copy paste to perform the demo


### Launch a generic Substrate Fromt-end

Use the following [substrate link](https://github.com/substrate-developer-hub/substrate-front-end-template#installation) for installation
then use
```sh
Yarn start
```
to connect a locally running node


## Demo purpose


In this demo, we want to demonstrate how OCW pallets can interact with the Garbled Circuit Factory to pilot the mass production of garbled circuits.

To avoid any ambiguities regarding the pallets delivered for this milestone (for demo/example purpose only), we named the two OCW pallets we interact with:

- ocwExample: to provide an example of how we can configure the GCF with a simple verilog file that will be used as a master file for production.
- ocwDemo: to demomstrate how we can launch the production of the garbled circuits in the GCF.


## Demo overview:

### 1. write a verilog master/config file.v in IPFS and get its `VerilogCid`
`GCF: can be set-up` for production **with verilog master file**

### 2. signed extrinsic with `VerilogCid` of master/config file.v to `ocwExample` pallet
`Request->GCF`: **OCW launch  the generation of the logical circuit file in GCF**

`Response<-GCF`: **OCW get the  `skcdCid` of the generated logical circuit (.skcd)**

`GCF: GC production ready` for the production of Garbled Circuits: 
**OCW is configured with verilog master file**

>skcd file is cached in the production pipeline

### 3. signed extrinsic with `skcdCid` to `ocwDemo` pallet
`Request->GCF`: **OCW launch  the generation of the garbled circuit files in GCF**

`Response<-GCF`: **OCW get the `gcCid` of the generated garbled circuits (ready to be evaluated)**

> As the purpose of the demo is to illustrate the interaction between the OCWs and the GCF, we will lauch the garbled circuit production manualy using Pallet Interactor.

## Step 1: add the master/config verilogfile.v in IPFS

As an example, we provide a very simple adder circuit:

adder.v
```verilog,editable
// https://www.geeksforgeeks.org/full-adder-using-verilog-hdl/

// Code your design : Full Adder
module full_add(a,b,cin,sum,cout);
  input a,b,cin;
  output sum,cout;
  wire x,y,z;

// instantiate building blocks of full adder
  half_add h1(.a(a),.b(b),.s(x),.c(y));
  half_add h2(.a(x),.b(cin),.s(sum),.c(z));
  or o1(cout,y,z);
endmodule : full_add

// code your half adder design
module half_add(a,b,s,c);
  input a,b;
  output s,c;

// gate level design of half adder
  xor x1(s,a,b);
  and a1(c,a,b);
endmodule :half_add
```
create a file `adder.v` eg
- use your editor of choice eg `code adder.v` or `nano adder.v` etc
- copy paste the content above

then

```sh
curl -X POST -F file=@adder.v "http://127.0.0.1:5001/api/v0/add?progress=true"
```
The command result is:
```
{"Name":"adder.v","Bytes":527}
{"Name":"adder.v","Hash":"QmYAFySLrUXwf4wVb7QGMxA7nXAoueXtQCYpyReFp5NKsx","Size":"538"}
```

![curl add adder result](./fig/curladderresult.png)

the "hash" ie QmYAFySLrUXwf4wVb7QGMxA7nXAoueXtQCYpyReFp5NKsx is the  value expected for the 'VerilogCid' field in the pallet interactor 

## Interact with Substrate Front End

We use Pallet Interactor to pilot the configuration and generation management of the circuits with GCF


## Step 2: Submit `VerilogCid` with pallet Interactor

#### 2.1 Go to `ocwExample` pallet and  and input the `VerilogCid` you got at step 1.

We use this pallet to submit the master/config  file example.

> please use the signed button

![ocwExample](./fig/ocwExample.png)

GCF will generate the related skcd logical circuit file,  add it in IPFS and send back its hash i.e skcdCid to the `ocwExample` pallet.


#### 2.2 The skcdCid of the master file should appear in the log of the node ([example] Hello from pallet-ocw)

```sh
2022-03-11 18:38:35 💤 Idle (0 peers), best: #12141 (0x61dd…ab06), finalized #12139 (0xe4bf…9f35), ⬇ 0 ⬆ 0    
2022-03-11 18:38:36 🙌 Starting consensus session on top of parent 0x61dd629bedb966389196018cf2cafacd9d529ec26d304545b283454e6d2dab06    
2022-03-11 18:38:36 🎁 Prepared block for proposing at 12142 [hash: 0xa463c744bce8948476af640d07031460646d1b48c8823e5ba4618da5be72175b; parent_hash: 0x61dd…ab06; extrinsics (1): [0x3f1f…b797]]    
2022-03-11 18:38:36 🔖 Pre-sealed block for proposal at 12142. Hash now 0xa72ffa4ced99481ebeeae2a14668ac719669d694a1e5fcfbf6a68fd64b909501, previously 0xa463c744bce8948476af640d07031460646d1b48c8823e5ba4618da5be72175b.    
2022-03-11 18:38:36 ✨ Imported #12142 (0xa72f…9501)    
2022-03-11 18:38:36 [example] Hello from pallet-ocw.    
2022-03-11 18:38:36 [example] sending body b64: AAAAADAKLlFtWExtUWJwZkRkWjRZc0ZBS2tzOXFQcUtiNVRaWlN3VG81RTd6SHhqUTFBNUc=    
2022-03-11 18:38:36 [example] status code: 200    
2022-03-11 18:38:36 [example] header: content-type application/grpc-web+proto    
2022-03-11 18:38:36 [example] header: transfer-encoding chunked    
2022-03-11 18:38:36 [example] header: date Fri, 11 Mar 2022 17:38:36 GMT    
2022-03-11 18:38:36 [example] Got gRPC trailers: grpc-status:0
    
2022-03-11 18:38:36 [example] Got IPFS hash: QmZ9UJbraZTjnkCYy7FTZWDaiv2s6qWTzfFNhFLgHJRfuh    
2022-03-11 18:38:36 [example] fetch_n_parse: QmZ9UJbraZTjnkCYy7FTZWDaiv2s6qWTzfFNhFLgHJRfuh    
2022-03-11 18:38:36 [example] FINAL got result IPFS hash : [b8, 51, 6d, 5a, 39, 55, 4a, 62, 72, 61, 5a, 54, 6a, 6e, 6b, 43, 59, 79, 37, 46, 54, 5a, 57, 44, 61, 69, 76, 32, 73, 36, 71, 57, 54, 7a, 66, 46, 4e, 68, 46, 4c, 67, 48, 4a, 52, 66, 75, 68] 
```

#### 2.3 Copy the skcdCid in the log
The `skcdCid` is displayed in the logs after [example] Got IPFS hash:

it's value for this example is: QmZ9UJbraZTjnkCYy7FTZWDaiv2s6qWTzfFNhFLgHJRfuh



## Step 3: Submit `skcdCid` with  pallet Interactor



We want to submit the cid of the skcd file to the pallet that will manage the production of garbled circuits.

#### 3.1 Go to `ocwDemo` pallet and input the `skcdCid` copied (step 2.3)

> please use the signed button

![ocwDemo](./fig/ocwDemo.png)

The ocwDemo now will use with this logical circuit file  to produce garbled circuits.

#### 3.2 The Garbled Circuits cids appear in node log ([ocw] Hello from pallet-ocw) 

The garbled circuits cids produced by the GCF are received by the `ocwDemo` pallet.


```sh, editable   
2022-03-11 18:38:36 [ocw] Hello from pallet-ocw.    
2022-03-11 18:38:36 [ocw] encode_body2: [51, 6d, 5a, 39, 55, 4a, 62, 72, 61, 5a, 54, 6a, 6e, 6b, 43, 59, 79, 37, 46, 54, 5a, 57, 44, 61, 69, 76, 32, 73, 36, 71, 57, 54, 7a, 66, 46, 4e, 68, 46, 4c, 67, 48, 4a, 52, 66, 75, 68]    
2022-03-11 18:38:36 [ocw] sending body b64: AAAAADAKLlFtWjlVSmJyYVpUam5rQ1l5N0ZUWldEYWl2MnM2cVdUemZGTmhGTGdISlJmdWg=    
2022-03-11 18:38:36 [ocw] status code: 200    
2022-03-11 18:38:36 [ocw] header: content-type application/grpc-web+proto    
2022-03-11 18:38:36 [ocw] header: transfer-encoding chunked    
2022-03-11 18:38:36 [ocw] header: date Fri, 11 Mar 2022 17:38:36 GMT    
2022-03-11 18:38:36 [ocw] Got gRPC trailers: grpc-status:0
    
2022-03-11 18:38:36 [ocw] Got IPFS hash: QmPUDRnaJG6wp22hMALAWKpyAwTZDts3vCZJmHZWWkXZJj    
2022-03-11 18:38:36 [ocw] fetch_n_parse: QmPUDRnaJG6wp22hMALAWKpyAwTZDts3vCZJmHZWWkXZJj    
2022-03-11 18:38:36 [ocw] FINAL got result IPFS hash : [b8, 51, 6d, 50, 55, 44, 52, 6e, 61, 4a, 47, 36, 77, 70, 32, 32, 68, 4d, 41, 4c, 41, 57, 4b, 70, 79, 41, 77, 54, 5a, 44, 74, 73, 33, 76, 43, 5a, 4a, 6d, 48, 5a, 57, 57, 6b, 58, 5a, 4a, 6a]   
```

