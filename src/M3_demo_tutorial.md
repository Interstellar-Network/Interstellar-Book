# M3 Demo Tutorial



## prerequiste docker or podman

install
- docker: https://docs.docker.com/engine/install/

 or 

- podman: 
https://podman.io/getting-started/installation.html

then compose

- docker-compose: https://docs.docker.com/compose/install/

or

- podman-compose: https://github.com/containers/podman-compose#podman-compose


## Set-up Demo

Create a repository to add the docker compose configuration file: [docker-compose.yml](https://github.com/Interstellar-Network/Interstellar-Book/blob/docker-compose/docker-compose.yml) in it

Then start docker or podman
```
sudo service docker start
```
and then launch the blockchain demo with `ipfs` and all api services i.e. `api_circuits` and `api_garble` with the following comands in the created repository
```
docker-compose down --timeout 1 && docker-compose up --force-recreate
```
> replace `docker-compose` with `podman-compose` if you are using podman instead of docker


## Demo purpose and used components


## Send a Currency

<img src="./fig/Send_Currency_Demo.gif" alt="wallet menu"  width="300"/>
