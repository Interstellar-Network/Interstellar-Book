# Mobile TEE Registry


This is the module for the  Mobile Key Management

A Public/Private key pair is generated in the mobile Hardware Enclave. The private key is not accessible by anyone, even when the device is rooted. The signature is only triggered with the user's biometrics (also managed with TEE).

The management of private keys on the devices will be used for unsigned transaction extrinsic with signed option i.e. verification of message signatures with mobile public keys. (cf [Trusted Transaction Validation Protocol](./TTVP.md))

This pallet will also register all information related to TEE, security and identification of mobile devices when available. It includes the following  [key and ID Attestation](./HBMK.md) and other hardware protected  features like  Protected confirmation mobile app signing, etc...

