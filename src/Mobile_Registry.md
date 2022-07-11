# Mobile TEE Registry

This is the module for the management of private keys on the devices that will be used for unsigned transaction extrinsic with signed option i.e. verification of message signatures with mobile public keys. 

This pallet will also register all information related to TEE, security and identification of mobile devices when available. It includes the following  key and ID Attestation and other hardware protected  features like  Protected confirmation mobile app signing, etc...




## Hardware Keystore

[Hardware-backed Keystore](https://source.android.com/security/keystore)



![access keymaster](./fig/access_to_keymaster.png)



## Attestation management

[Key and ID Attestation | Android Open Source Project](https://source.android.com/security/keystore/attestation)
Verifying hardware-backed key pairs with Key Attestation

[How to check whether Android phone supports TEE](https://stackoverflow.com/questions/61225795/how-to-check-whether-android-phone-supports-tee/64422042#64422042)