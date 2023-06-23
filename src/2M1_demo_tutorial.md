# M1 Demo Tutorial (follow-up phase 2)

The goal of this demonstration is to showcase the new garbling scheme performance
> Please note, however, that the evaluation performance of the garbled circuit is depending of the circuit size and design that will be updated in the upcoming milestone

## prerequiste


| Install Docker | Install Podman |
| ------------   | -------------  |
|[docker](https://docs.docker.com/engine/install/)| [podman](https://podman.io/getting-started/installation.html) |
|[docker-compose](https://docs.docker.com/compose/install/)|[podman-compose](https://github.com/containers/podman-compose#podman-compose)|

NOTE: usually when using `docker` or `docker-compose` you MUST also use `sudo`; and conversely you MUST NOT be root with `podman` and `podman-compose`

- `sudo apt-get install jq curl wget `

## Demo with an android device

### 1. Launch the blockchain

- prepare a temp folder eg: `mkdir interstellar_demo && cd interstellar_demo`
- get the following docker compose file: [docker-compose.yml](https://github.com/Interstellar-Network/Interstellar-Book/blob/docker-compose/docker-compose.yml#L17)
eg: `curl -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/Interstellar-Book/docker-compose/docker-compose.yml`

- download the following `docker-ipfs-init.sh` eg: 
    `curl -o docker-ipfs-init.sh https://raw.githubusercontent.com/Interstellar-Network/Interstellar-Book/docker-compose/docker-ipfs-init.sh`
    - check that the file is in the same directory as docker compose
    ```
    ls -al
    total 20
    drwxr-xr-x  2 jll jll 4096 Feb  9 16:46 .
    drwxr-xr-x 13 jll jll 4096 Feb  8 19:11 ..
    -rw-r--r--  1 jll jll 6383 Feb  9 16:52 docker-compose.yml
    -rw-r--r--  1 jll jll  222 Feb  9 15:06 docker-ipfs-init.sh
    ```

- *needed only if using docker:* 
    - launch docker service:`sudo service docker start` 

  >podman does **not** require a service/daemon
- launch the full stack with the following command in the created directory: \
`sudo docker compose down --timeout 1 && sudo docker compose up --force-recreate` \
    >replace `docker compose` with `podman-compose` if you want to use podman instead of docker
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

> If you have some user interface issues - desactivate some browser extensions like password managers that can write on input fields ;




### 2. Install the wallet App i.e APK file on an android device or an emulator


#### 2.1 Retrieve the APK file
Download the [APK file](https://github.com/Interstellar-Network/wallet-app/releases/tag/milestone5)


#### 2.2 Install the APK
##### 2.2.1 on an android device

[How to install an APK on Android](https://www.lifewire.com/install-apk-on-android-4177185)

 WARNING: ensure that your device is configure for english.



##### 2.2.2 on an emulator

[Install Android studio](https://developer.android.com/studio/)

Install the pixel 5 API 31 emulator with Virtual Device Manager or any `x86_64` emulator.



###### 2.2.2.1 Launch the emulator

![Launch pixel 5 API 31 emulator](./fig/Android_device_manager.png)

Wait for the emulator to launch and emulated device to power on and drag and drop the APK file on the emulator to install the App.

#### 2. Ensure that wallet can connect to the blockchain

>The app is currently a dev version, so it expects the servers(RPC/WS, and IPFS) to be on localhost.

Which is obviously not the case when running on Device/Emulator.

To remedy `adb reverse` will expose "`localhost` of the desktop" as "`localhost` of the device".

>Then, IF the blockchain(docker-compose) are NOT running on the desktop, you need to expose them. It can be done e.g. using ssh port forwarding, or through some other means.

![config-localhost-device](./fig/config-localhost-device.svg)

Following is a configuration example with a windows desktop that run an android emulator and a WSL/VM running the blockchain(docker-compose)

adb is installed by default with android studio.
So you just need to set-up its path on the OS used, if it is not already set.

Just connect the phone with an USB port or through WiFi( cf android studio).

on the OS where the emulator is running or the device is connected:
```
adb reverse tcp:9990 tcp:9990
```
```
adb reverse tcp:2090 tcp:2090 
```
```
adb reverse tcp:5001 tcp:5001
```

to expose server desktop on emulator

on the OS where blocchain is installed:

example if  blockchain run on WSL2
```
 export WSL_HOST_IP="$(tail -1 /etc/resolv.conf | cut -d' ' -f2)"
 ```
and use SSH to connect to the emulator running on windows or android devices connected to adb through USB port or WiFi:
```
ssh -N -R 9990:localhost:9990 -R 5001:localhost:5001 -R 2090:localhost:2090 [windows_user_name]@$WSL_HOST_IP
```
>TROUBLESHOOTING: start the front-end
[substrate link](https://substrate-developer-hub.github.io/substrate-front-end-template/?rpc=ws://localhost:9990)
 on your Device/Emulator to check it works properly.
 Otherwise fix network issues.


#### 3. Launch Android App
Swipe from bottom to top and click on `Wallet Interstellar`


<img src="./fig/SelectAndroidApp.png" alt="wallet menu"  width="120"/>


#### 4. Send a Currency and wait for the Transaction confirmation screen to validate the transaction


##### 4.1 Select currency and contact
Following is an explicit video showing how to send a curency to a contact
on SEND screen.

<img src="./fig/Send_Currency_Demo.gif" alt="wallet menu"  width="300"/>

##### 4.2 Click on the blue Check icon

##### 4.3 Wait for the transaction validation screen to appear and type the two-digits one-time-code

##### 4.4 check Toast message order
- Processing...
- Registered
- [error] No circuits available after 10s; exiting!

[after taping one-time code digits]
- Validating transaction...
- Transaction done!

>The current performance of the Garbled Circuit evaluation makes it challenging to read the validation screen. As a result, you can either enter two digits to initiate verification or try to guess the correct code as a mental exercise ;-)

It is important to note that the wallet app is under development and there are still a few technical issues that need to be addressed, particularly between the low-level layers in Rust and C++, and in connecting the renderer with the Kotlin/Swift UI layer.

To demonstrate the execution of the validation screen based on the Garbled Circuits evaluation, we have implemented a shortcut. However, please keep in mind that this is temporary and some of the code will not be used in the final version.

At this time, the inputted amount and the transaction beneficiary are not displayed in the message. Despite this, the transaction validation screen is functional.

In the future, we plan to implement a trusted beneficiary feature. This will allow users to create a trusted beneficiary contact and register their public address in the blockchain through a secure operation message validation. This will prevent attackers from substituting the contact name with their own public key, making the wallet both user-friendly and safer.

