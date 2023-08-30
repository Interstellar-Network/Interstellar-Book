# M2 Demo Tutorial (follow-up phase 2)

The goal of this demonstration is to showcase the new circuit design that incorporate new circuits modules LFSR_comb and bit counter to replace xorexpand. This enables to select probabilities to display the segments ON whithin a range of differents probabilities 0.5 to 0.9 and higher.

So, to simplify and streamline the demo, we have compiled differents apps in an offline demo mode. This mode utilizes differents pre-computed test circuit generated with the new circuit design and does not require the app to connect with the blockchain like in M5.

> notes


## Demo with an android device or an emulator


### 1. Install the wallet Apps i.e APK files on an android device or an emulator


#### 1.1.2 Retrieve the APK files (segments ON with 0.9+ probabilities)
Download the [APK file 0.9+](https://github.com/Interstellar-Network/wallet-app/releases/tag/w3f-phase2-milestone1)

#### 1.1.2 Retrieve the APK files (segments ON with 0.8 probabilities)
Download the [APK file 0.8](https://github.com/Interstellar-Network/wallet-app/releases/tag/w3f-phase2-milestone1)

#### 1.1.2 Retrieve the APK files (segments ON with 0.5 probabilities)
Download the [APK file 0.5](https://github.com/Interstellar-Network/wallet-app/releases/tag/w3f-phase2-milestone1)



#### 1.2 Install the APK
##### 1.2.1 on an android device

[How to install an APK on Android](https://www.lifewire.com/install-apk-on-android-4177185)

 WARNING: ensure that your device is configure for english.


##### 1.2.2 on an emulator

[Install Android studio](https://developer.android.com/studio/)

[Install an Android Virtual Device](https://developer.android.com/studio/run/managing-avds#createavd)

Choose the pixel 5 API 31 emulator with Virtual Device Manager.

![Launch pixel 5 API 31 emulator](./fig/Android_device_manager.png)

Wait for the emulator to launch and emulated device to power on and drag and drop the APK file on the emulator to install the App.

### For each APKs

### 2.Launch the Android App
Swipe from bottom to top and click on `Wallet Interstellar`


<img src="./fig/SelectAndroidApp.png" alt="wallet menu"  width="120"/>


### 3. Send a Currency and wait for the Transaction confirmation screen to validate the transaction


#### 3.1 Select currency and contact
Following is an explicit video showing how to send a curency to a contact on SEND screen.

<img src="./fig/Send_Currency_Demo.gif" alt="wallet menu"  width="300"/>

#### 3.2 Click on the blue Check icon

#### 3.3 Wait for the transaction validation screen to appear

#### 3.4 Just check the UX and experience different cognitive loads required by the brain depending on the probability to display segments ON/OFF.
