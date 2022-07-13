# Trusted Transaction Validation Protocol client

This is the client software embedded in an app or browser in the future that  enables the secure confirmation of any transactions or sensitive operation with an hardware level security.
(cf [Tusted Transaction Validation Protocol](./TTVP.md))

It implements the [Trusted Authentication and User Interface Layer](./TAUI.md) combined with [Harware-backed Mobile Key](./HBMK.md) and is regsitered in the [Mobile TEE Registry](./Mobile_Registry.md)

## Architecture and Security
![App architecture](./fig/App_architecture.svg)

> Green boxes are secure as well as garbled circuit evaluation in Dark Grey
it prevents state of the art Banking trojan attacks on the mobile

This client is based on a substrate client on the mobile to communicate through unsigned extrinsic with signed option and substrate events with the blockchain. It enables the mobile to be registered with the mobile TEE registry pallet. 


It also include an IPFS client to retrieve the cid of the [Visual Cryptography Display](./VC-GC.md) i.e the one-time [Garbled Circuit](,/GC.md) program generated for each transaction  by the [Garbled Circuit Factory](./GCF.md) managed by the blockchain.

The previous circuit is used to compose the [Trusted Authentication and User Interface Layer](./TAUI.md) i.e `Secure UI Screen` that evaluates and renders the circuit to enable the user to confirm a transaction/sensitive operation with a `one-time code`

This Secure UI layer relies on a garbled circuit evaluator and a renderer to display the result of its evaluation directly to the framebuffer.
