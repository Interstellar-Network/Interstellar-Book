# Trusted Transaction Validation Protocol

The purpose of the Trusted Transaction Validation Protocol is to provide a decentralized feature managed by a blockchain to authenticate and validate a transaction in a higly secure but frictionless way.

## Trusted Transaction Validation Protocol architecture - TTVP

The following schema shows the main components of Interstellar blockchain including the modules related to Trusted Transaction Validation protocol. It also includes future roadmap modules (briefly described)

![TTVP overview](./fig/Architecture-mobile-L1-L2-Signers.svg)

## High level components related to TTVP in Interstellar blockchain

Those modules are based on Parity Substrate nodes and IntegriTEE workers.

### Secure UI Layer - Transaction Screen Management
The mobile transaction screen is managed with Garbled Circuits that are computed on TEE nodes and provisioned on the mobile by the nodes. The one-time code secret and keypad topology cannot be accessed during Garbled Circuit execution to display the Visual Cryptography secret frames that appears only in the users' eyes.  Thanks to persistence of vision. (cf [Visual Cryptography Display](./VC-GC.md) and [Trusted Authentication and User Interface](./TAUI.md))


### Mobile Trusted Authentication - Mobile Key Management
A Public/Private key pair is generated in the mobile Hardware Enclave. The private key is not accessible by anyone, even when the device is rooted. The signature is only triggered with the user's biometrics (also managed with TEE).
The public Key is sent to the nodes and managed in the Mobile TEE registry (described below)

Actually we replace the wallet private keys by a TEE protected mobile private key. This protected key act as a proxy to all the keys owned by the user.

> It is securely tied to the user account. The wallet private keys associated with the user's assets are managed in the blockchain hardware enclave TEE nodes in `Trusted Keys and Asset Management & Signers` module.


In order to prevent potential attacks on hardware enclaves down the road, we will also use at later stage Multi Party Computation and especially Threshold Signature Scheme.

 
### Mobile TEE registry pallet
The [substrate module](./Mobile_Registry.md) in charge of mobile device public key registration and mobile device management. 

#### Attestation management (roadmap)

[Key and ID Attestation  |  Android Open source project](https://source.android.com/security/keystore/attestation)


[How to check whether Android phone supports TEE- Stack Overflow](https://stackoverflow.com/questions/61225795/how-to-check-whether-android-phone-supports-tee/64422042#64422042)
 

#### Behavioral Biometric (roadmap)
Each user has a unique typing pattern for a sequence of digits on a keypad. If a bad actor tries to replicate this pattern, it will be detected with a 98% success rate. This feature will be managed by TEE nodes with Machine Learnings classification models based on secret touch screen position inputs received by the nodes and their related authenticated timestamps.

[TOUCH DYNAMICS BIOMETRICS TO ENHANCE AUTHENTICATION ON MOBILE DEVICES](https://www.research.manchester.ac.uk/portal/files/159168194/FULL_TEXT.PDF)

#### Ongoing Research (roadmap)
Garbled circuits to generate proof of history of legitimate computation schemes to detect malware attacks to compromise the UI i.e. the building and execution of a fake User Interface by the attackers. (cf `Malware Detection` module in the mobile device)