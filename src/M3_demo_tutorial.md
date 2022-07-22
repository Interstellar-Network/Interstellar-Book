# M3 Demo Tutorial



## prerequiste: docker or podman

install
- docker: https://docs.docker.com/engine/install/

 or 

- podman: 
https://podman.io/getting-started/installation.html

then

- docker-compose: https://docs.docker.com/compose/install/

or

- podman-compose: https://github.com/containers/podman-compose#podman-compose


## Set-up Demo

### 1. Launch the blockchain
Create a directory

example:
```
mkdir blockchain_demo
```
 and add the following docker compose configuration file: [docker-compose.yml](https://github.com/Interstellar-Network/Interstellar-Book/blob/docker-compose/docker-compose.yml) in it.

Then start docker or podman
```
sudo service docker start
```
and then 
```
cd blockchain_demo
```
and launch the blockchain demo with `ipfs` and all api services i.e. `api_circuits` and `api_garble` with the following comand in the created directory.

```
docker-compose down --timeout 1 && docker-compose up --force-recreate
```
> replace `docker-compose` with `podman-compose` if you are using podman instead of docker

### 2. Install the wallet App




### 3. Ensure that wallet can connect Wallet to the blockchain





## Demo purpose 

The purpose of this demo is to show how a mobile wallet can use the [Trusted Transaction Protocol client](./TTVP_Client.md) to confirm a transaction in a higly secure way

## Send a Currency

<img src="./fig/Send_Currency_Demo.gif" alt="wallet menu"  width="300"/>
