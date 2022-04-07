# Trusted Transaction Validation Protocol


## Trusted Transaction Validation Protocol architecture overview

This schema shows the main component of Interstellar blockchain including the modules related to Transaction Validation.
The following schema also includes future roadmap modules.

[TTVP overview](./TTV_overview_dark.svg)

## High level components of Interstellar blockchain

Those modules are based on Parity Substrate nodes and IntegriTEE workers. The following schema also includes future roadmap modules.

### Mobile Key Management
A Public/Private key pair is generated in the mobile Hardware Enclave. The private key is not accessible by anyone, even when the device is rooted. The signature is only triggered with the user's biometrics (also managed with TEE).
This mobile Private key and a set of Garbled Circuits are securely tied with the wallet private keys associated with the user's assets and managed in the blockchain hardware enclave TEE nodes. To prevent potential attacks on hardware enclaves on nodes, we will also use Multi Party Computation and especially Threshold Signature Scheme.

### Transaction Screen Management
The transaction screen is managed with Garbled Circuits that are pre-computed on TEE nodes and provisioned on the mobile by the nodes from time to time. The one-time code secret and keypad topology cannot be accessed during Garbled Circuit execution to display the Visual Cryptography secret frames that appears only in the users' eyes (thanks to persistence of vision)

 
#### Mobile TEE registry pallet
This is the module for the management of private keys on the devices that will be used for unsigned transaction extrinsic with signed option i.e. verification of message signatures with mobile public keys. This pallet will also register all information related to TEE, security and identification of mobile devices when available. It includes the following  key and ID Attestation and other hardware protected  features like  Protected confirmation mobile app signing, etc...

### Attestation management (roadmap)

Key and ID Attestation  |  Android Open Source Project, 
Verifying hardware-backed key pairs with Key Attestation (android.com)
java - How to check whether Android phone supports TEE? - Stack Overflow
 

### Behavioral Biometric (roadmap)
Each user has a unique typing pattern for a sequence of digits on a keypad. If a bad actor tries to replicate this pattern, it will be detected with a 98% success rate. This feature will be managed by TEE nodes with Machine Learnings classification models based on secret touch screen position inputs received by the nodes and their related authenticated timestamps.
USING USERS' TOUCH DYNAMICS BIOMETRICS TO ENHANCE AUTHENTICATION ON MOBILE DEVICES
2.2.1.4. Ongoing Research (roadmap)
Garbled circuits to generate proof of history of legitimate computation schemes to detect malware attacks to compromise the UI i.e. the building and execution of a fake User Interface by the attackers.