# Mobile Wallet Demo App




The mobile wallet demo app include mainly a [Trusted Transaction Validation Protocol client](./TTVP_client.md) that is securely linked with the blockchain through [mobile registry](./Mobile_Registry.md)


![App architecture](./fig/App_architecture.svg)

This client is based on a substrate client on the mobile to communicate through unsigned extrinsic with signed option and substrate events with the blockchain. It enables the mobile to be registered with the mobile TEE registry pallet. 


It also include an IPFS client to retrieve the cid of the [Visual Cryptography Display](./VC-GC.md) i.e the one-time [Garbled Circuit](,/GC.md) program generated for each transaction  by the [Garbled Circuit Factory](./GCF.md).

The previous circuit is used to compose the [Trusted Authenticated User Interface](./TAUI.md) i.e `Secure UI Screen` that evaluates and renders the circuit to enable the user to confirm a transaction/sensitive operation with a `one-time code`

In order to ensure that this secure UI layer relies on a garbled circuit evaluator and a renderer to display the result of its evaluation directly to the framebuffer.

