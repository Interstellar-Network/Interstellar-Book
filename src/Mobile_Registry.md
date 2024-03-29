# Mobile Registry


This is the module in charge of the mobile device public key registration and management in the blockchain substrate framework.



![mobile registration](./fig/Mobile_registration.svg)



When a [TTVP Client](./TTVP_client.md)/Wallet is created, a Proxy Public/Private key pair is generated in the mobile Hardware Enclave/Secure Element/TEE. The public key is send to this registry and the private key remains on the devices, not accessible by anyone, even when it is rooted. The signature of all messages to the blockchain is triggered with the user's biometrics (also hardware protected managed with TEE).

This [hardware-backed mobile private key](./HBMK.md) on the device is used to generate an unsigned transaction extrinsic with signed option and this signature is verified by the blockchain with mobiles public keys registered in this module. (cf [Trusted Transaction Validation Protocol](./TTVP.md))

This pallet also register and manage all information related to the mobile hardware enclave TEE, security and identification of mobile devices when available. It includes the following  [key and ID Attestation](./HBMK.md) and other hardware protected  features when avalaible like  [protected confirmation](https://source.android.com/security/protected-confirmation), mobile app signing, etc...

