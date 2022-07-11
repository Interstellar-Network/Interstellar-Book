# Mobile TEE Registry


This is the module in charge of the mobile device public key registration and management in the blockchain substrate framework.

When a TTVP Client/Wallet is created, a Public/Private key pair is generated in the mobile Hardware Enclave. The public key is send to this registry and the private key remain on the devices, not accessible by anyone, even when it is rooted. The signature of all messages to the blockchain is triggered with the user's biometrics (also managed with TEE).

This hardware-backed mobile private key on the device is used with unsigned transaction extrinsic with signed option to enable the verification of the message signatures with mobile public keys registered in this module. (cf [Trusted Transaction Validation Protocol](./TTVP.md))

This pallet will also register and manage all information related to the mobile TEE, security and identification of mobile devices when available. It includes the following  [key and ID Attestation](./HBMK.md) and other hardware protected  features like  [protected confirmation](.https://source.android.com/security/protected-confirmation), mobile app signing, etc...

