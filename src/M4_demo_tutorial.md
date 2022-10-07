# M3 Demo Tutorial

This goal of this milestone was to port security-critical pallets to Integritee.

Therefore it is a backend-oriented milestone, and the demo takes the form of script like https://github.com/integritee-network/worker/tree/master/cli

## prerequiste


| Install Docker                                             | Install Podman                                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [docker](https://docs.docker.com/engine/install/)          | [podman](https://podman.io/getting-started/installation.html)                 |
| [docker-compose](https://docs.docker.com/compose/install/) | [podman-compose](https://github.com/containers/podman-compose#podman-compose) |

## Demo

### 1. Launch the blockchain

- prepare a temp folder eg: `mkdir interstellar_demo && cd interstellar_demo`
- get the following docker compose file: [docker-compose.yml](https://github.com/Interstellar-Network/Interstellar-Book/blob/docker-compose/docker-compose.yml) \
eg: `curl -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/Interstellar-Book/docker-compose/docker-compose.yml`
- *needed only if using docker:* `sudo service docker start` \
  podman does **not** require a service/daemon
- launch the full stack with the following command in the created directory: \
`docker-compose down --timeout 1 && docker-compose up --force-recreate` \
**NOTE:** replace `docker-compose` with `podman-compose` if you want to use podman instead of docker
- wait a few seconds until you see this kind of lines repeating:
```
2022-10-05 14:17:12 [ocw-circuits] Hello from pallet-ocw-circuits.
2022-10-05 14:17:12 [ocw-circuits] nothing to do, returning...
2022-10-05 14:17:12 💤 Idle (0 peers), best: #6 (0x369f…bfea), finalized #3 (0xa66a…6fa2), ⬇ 0 ⬆ 0
[+] Received finalized header update (4), syncing parent chain...
[+] Found 1 block(s) to sync
Synced 4 out of 4 finalized parentchain blocks
[+] Found 0 block(s) to sync
```


### [optional] 1.5 Launch a generic Substrate Front-end

Use the following [substrate link](https://substrate-developer-hub.github.io/substrate-front-end-template/?rpc=ws://localhost:9990) or [polkadot](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2Flocalhost%3A9990#/chainstate) to launch a substrate front end
that will connect to the node running in `docker-compose`

> when using WSL: you **MUST** use `localhost` **NOT** `127.0.0.1` else the forwarding windows -> wsl -> docker/podman will not work [if you directly clicked on the given links it is already set, but be careful if you use another front-end]

> avoid some browser extensions that could generate interface issues


### 2. Run the integritee demo script

- create a docker/podman volume:\
    `docker volume create KeyStoreVolume1`
- get the demo script:
    * for consistency, make sure you are in the directory created at "prepare a temp folder" above
    * `curl https://raw.githubusercontent.com/Interstellar-Network/integritee-worker/interstellar/cli/demo_interstellar.sh -o demo_interstellar.sh`
    * `chmod +x demo_interstellar.sh`
- check which network docker-compose/podman-compose is using:\
  `docker container inspect --format '{{range $net,$v := .NetworkSettings.Networks}}{{printf "%s\n" $net}}{{end}}' blockchain_demo_ipfs_1`
  - it should return for example: `blockchain_demo_default`
  - if it fails: use `docker ps` and replace `blockchain_demo_ipfs_1` in the previous command by the correct name
- run the demo (twice): `CLIENT_BIN="docker run --network blockchain_demo_default --name integritee_cli -v KeyStoreVolume1:/usr/local/bin/my_trusted_keystore --rm ghcr.io/interstellar-network/integritee_cli:milestone4" ./demo_interstellar.sh -V wss://integritee_service -p 9990 -u ws://integritee_node -P 2090` \
  **IMPORTANT** the `--network` parameter MUST match the result of the previous command `docker container inspect`\
  **NOTE** replace `docker` by `podman` in `CLIENT_BIN=` if needed
    * the first time you start the demo it should say:
    ```
    [...]
    OCW_CIRCUITS_STORAGE: null
    OCW_CIRCUITS_STORAGE is NOT initialized
    MUST call extrinsic 'ocwCircuits::submitConfigDisplayCircuitsPackageSigned'
    Calling 'ocwCircuits::submitConfigDisplayCircuitsPackageSigned'
    Extrinsic started: wait a few seconds(~5-10s) and restart this script
    ```
    * wait a few seconds
    * check docker-compose/podman-compose logs; you should see something like
    ```
    2022-10-05T14:35:08.974284Z DEBUG hyper::proto::h1::conn: incoming body is chunked encoding
    2022-10-05T14:35:08.974294Z DEBUG hyper::proto::h1::decode: incoming chunked header: 0x82 (130 bytes)
    2022-10-05T14:35:09.019290Z DEBUG hyper::proto::h1::conn: incoming body completed
    2022-10-05T14:35:09.019378Z DEBUG hyper::proto::h1::role: response with HTTP2 version coerced to HTTP/1.1
    2022-10-05T14:35:09.019433Z DEBUG hyper::proto::h1::io: flushed 220 bytes
    2022-10-05 14:35:09 [fetch_from_remote_grpc_web] status code: 200, content_type: application/grpc-web+proto
    2022-10-05 14:35:09 [fetch_from_remote_grpc_web] header: content-type application/grpc-web+proto
    2022-10-05 14:35:09 [fetch_from_remote_grpc_web] header: transfer-encoding chunked
    2022-10-05 14:35:09 [fetch_from_remote_grpc_web] header: date Wed, 05 Oct 2022 14:35:08 GMT
    2022-10-05 14:35:09 [ocw-circuits] callback_new_skcd_signed sent number : 1
    ```
    it MUST say "callback_new_skcd_signed sent number : **1**" NOT **0**
- re-run the script
- when asked for inputs `Inputs to use? [space separated list of int; eg 0 1 2 3]`
    * enter a space-separated list of digits eg `4 2`
    * if you used invalid inputs, you will see eg `Trusted call 0x7275e5e0fe5812ee9560a6b23469fe3007af3a080b11f88ad71c66364393f6d8 is Invalid`
    * if the used the correct code, you will see eg `Trusted call 0xbd86033441f672f15d6cfedd3180d1da21c86aa46469e0d4eadb6daa673b87bc is InSidechainBlock(0xb8795299ef99d5501f6d9767b9fee012c6342be2435440a598bebd6b49260951)`

#### NOTE: How to get the correct code

When the script is waiting for inputs, check the docker-compose logs for something like:
```
[2022-10-05T14:41:43Z INFO  pallet_tx_validation::pallet] [tx-validation] store_metadata_aux: who = , message_pgarbled_cid = "QmbcKoDVkFQDQRDJgwd7HWMgbJ5GnurEZgDEUivn9Fsf5Y", message_digits = [9, 7], pinpad_digits = [8, 4, 6, 7, 3, 1, 5, 2, 9, 0]
```

* In this example the correct code is `[9, 7]` and the permutation of the pinpad are `[8, 4, 6, 7, 3, 1, 5, 2, 9, 0]`
    * NOTE: if you go back to the previous milestone demo, that is the order of the digit displayed on the Android app

* `9` is the <u>eighth</u> digit in the list(0-indexed) and `7` the <u>third</u> one
* you must enter `8 3` when prompted
