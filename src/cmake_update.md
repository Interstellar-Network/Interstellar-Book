### Update cmake  if < 3.22

[check install](https://cmake.org/install/)

[download binaries](https://cmake.org/download/)

Or on Ubuntu
Uninstall it with:
```sh
sudo apt remove cmake
```

Install build tools and libraries that CMake depends on:
```sh
sudo apt-get install build-essential libssl-dev
```
Go to the temp directory:
```sh
cd /tmp
```

get the last version ex:
```sh
wget https://github.com/Kitware/CMake/releases/download/v3.22.3/cmake-3.22.3.tar.gz
```
Visit https://cmake.org/download/ and download the latest tar.gz

Once the tar.gz file is downloaded, enter the following command to extract it:
```sh
tar -zxvf cmake-3.22.3.tar.gz
```
Then move to the extracted folder as follows:

```sh
cd cmake-3.22.3
```
Finally, run the following commands to compile and install CMake:
```sh
./bootstrap
```
You can now make it using the following command:
```sh
make
```
And then install it as follows:
```sh
sudo make install
```
check the version
```sh
cmake --version
```