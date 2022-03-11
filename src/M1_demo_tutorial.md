# M1 Docker Demo Tutorial

## Set-up Demo
### Launch ipfs deamon

```sh
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




```sh
RUST_LOG="warn,info" cargo run -- --dev --tmp
```
> Important: the node log will display some results i.e cid that you will have to copy paste to perform the demo


### Launch a generic Substrate Fromt-end

```sh
Yarn start
```


## Demo overview

> To avoid any ambiguities regarding the state of the pallet (for demo/eample purpose only - not production ready)

We named the two OCW pallets we interact with:

- ocwExample (to manage configuration/generation of logical circuit file)
- ocwDemo (to manage garbled circuit production)


### 1. write a verilog master/config file.v in IPFS and get its `VerilogCid`
`GCF: can be set-up` for production **with verilog master file**

### 2. signed extrinsic with `VerilogCid` of master File/config file.v to `ocwExample` pallet
`Request->GCF`: **OCW launch  the generation of the logical circuit file in GCF**

`Response<-GCF`: **OCW get the  `skcdCid` of the generated logical circui (.skcd)**

`GCF: GC production ready` for the production of Garbled Circuits: 
**OCW is configured with verilog master file**

>skcd file is cached in the production pipeline

### 3. signed extrinsic with `skcdCid` to `ocwDemo` pallet
`Request->GCF`: **OCW launch  the generation garbled circuit file(s) in GCF**

`Response<-GCF`: **OCW get the `gcCid` of the generated Garbled Circuit (ready to be evaluated)**



## Step 1: Upload Master/Config verilog (.v) file/ write in IPFS

```sh
curl -X POST -F file=@/REPLACEME/PATH/lib_circuits/data/verilog/adder.v "http://127.0.0.1:5001/api/v0/add?progress=true"
```

> Get the VerilogCid to use with pallet interactor


Files example:
very simple adder circuit

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

## Interact with Substrate Front End

We use Pallet Interactor to pilot the configuration and generation management of the circuits with GCF



## Step 2: Submit `VerilogCid` with pallet Interactor

#### 2.1 Go to `ocwExample` pallet and  and input the `VerilogCid` you got at step 1.

We use this pallet to submit the master file config file example.

![ocwExample](./fig/ocwExample.png)

GCF will generate the logical_file.skcd store it in IPFS and send  back skcdCid to the pallet.

#### 2.2 copy paste the skcdCid that appear in the log of the node



## Step 3: Submit `skcdCid` with  pallet Interactor

we use this pallet to submit the cid of the logical_file.skcd

#### 3.1 Go to `ocwDemo` pallet and input the `skcdCid` you got at step 2.2

![ocwDemo](./fig/ocwDemo.png)


### Step 3.2 Garbled Circuit cid appear in node log





