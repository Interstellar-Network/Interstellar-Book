# Prerequisite installation for compilation


## Update cmake  if < 3.22

Check your that your current cmake version is at least 3.22:
```sh
cmake --version
```
if not:
[check install](https://cmake.org/install/)

[download binaries](https://cmake.org/download/)

```sh
wget https://github.com/Kitware/CMake/releases/download/v3.22.3/cmake-3.22.3-linux-x86_64.sh
chmod +x cmake-3.22.3-linux-x86_64.sh
sudo mkdir /opt/cmake-3.22/
sudo ./cmake-3.22.3-linux-x86_64.sh --skip-license --prefix=/opt/cmake-3.22/
```

check the version
```sh
cmake --version
```
## Install ninja

```sh
wget https://github.com/ninja-build/ninja/releases/download/v1.10.2/ninja-linux.zip
apt-get install unzip
sudo Zip ninja-linux.zip -d /usr/local/bin
sudo chmod +x /usr/local/bin/ninja
```
## Add the following list of software/libs

```sh
apt-get install -y \
    bison \
    flex \
    libreadline-dev \
    libtcl \
    tcl8.6-dev \
    tcl-dev \
    tk8.6-dev \
    tk-dev \
    libboost-filesystem-dev \
```

