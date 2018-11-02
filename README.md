# Echoin
[![Build Status develop branch](https://echoin-ci.org/blockservice/echoin.svg?branch=develop)](https://echoin-ci.org/blockservice/echoin)

Please see the documentation for building and deploying Echoin nodes here: https://echoin.readthedocs.io/en/latest/getting-started.html

## Script
Below is a bash script which will get Lity, libENI and a Echoin node running on Ubuntu 16.04. Disclaimer: These instructions are for a brand-new disposable 16.04 Ubuntu test instance which has the sole purpose of running and testing the CyberMiles Lity compiler, CyberMiles libENI framework and the CyberMiles testnet called Echoin.

```
#/bin/bash

#Disclaimer: These instructions are for a brand-new disposable 16.04 Ubuntu test instance which has the sole purpose of running and testing the CyberMiles Lity compiler, CyberMiles libENI framework and the CyberMiles testnet called Echoin.

#To use this file copy this text into a file called install_echoin.sh in your fresh disposable Ubuntu 16.04 machine's home directory. Make the file executable by running "sudo chmod a+x ~/install_echoin.sh" and then finally execute the file by running "cd ~" and then "./install_echoin.sh"

#System preparation Ubuntu 16.04 LTS
cd ~
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y autoremove
sudo apt-get -y install gcc
sudo apt-get -y install git
sudo apt-get -y install make
sudo apt-get -y install curl
sudo apt-get -y install wget
sudo apt-get -y install cmake
sudo apt-get -y install bison
sudo apt-get -y install openssl
sudo apt-get -y install binutils
sudo apt-get -y install automake
sudo apt-get -y install libssl-dev
sudo apt-get -y install libboost-dev
sudo apt-get -y install libaudit-dev
sudo apt-get -y install libblkid-dev
sudo apt-get -y install e2fslibs-dev
sudo apt-get -y install build-essential
sudo apt-get -y install libboost-all-dev

#Installing Lity
cd ~
git clone https://github.com/CyberMiles/lity.git
cd lity
mkdir build
cd build
cmake ..
make
./lityc/lityc --help

#Installing SkyPat
cd ~
wget https://github.com/skymizer/SkyPat/archive/v3.1.1.tar.gz
tar -zxvf v3.1.1.tar.gz
cd SkyPat-3.1.1
./autogen.sh
./configure
make
sudo make install

#Installing Go
cd ~
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
source $HOME/.gvm/scripts/gvm
gvm install go1.10.3 -B
gvm use go1.10.3 --default
echo 'export GOPATH=~/.gvm/pkgsets/go1.10.3/global' >> ~/.bashrc
echo 'export GOBIN=$GOPATH/go/bin' >> ~/.bashrc
echo 'export PATH=$GOBIN:$PATH' >> ~/.bashrc
source ~/.bashrc

#Installing Echoin
go get github.com/blockservice/echoin

#PLEASE NOTE: The above will return an error such as "can't load package ... no Go file in ...",
#Please just ignore this error and continue on with the installation

cd $GOPATH/src/github.com/blockservice/echoin
git checkout master

#Incorporate libENI
sudo rm -rf ~/.echoin
wget -O ~/libeni.tgz https://github.com/CyberMiles/libeni/releases/download/v1.3.4/libeni-1.3.4_ubuntu-16.04.tgz
tar zxvf ~/libeni.tgz -C ~
mkdir -p ~/.echoin/eni
cp -r ~/libeni-1.3.4/lib ~/.echoin/eni/lib

#Continue installing Echoin
cd ~
cd $GOPATH/src/github.com/blockservice/echoin
make all

#Configuring Echoin test network settings
cd ~
git clone https://github.com/CyberMiles/testnet.git
cp -r testnet/echoin/init .echoin

#Starting Echoin test network node
cd ~
echoin node init --env testnet
curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init/config/config.toml > ~/.echoin/config/config.toml
curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init/config/genesis.json > ~/.echoin/config/genesis.json


#Please ensure that the system paths are known, or else the echoin command will not be found (you will get an error like this "The program 'echoin' is currently not installed")

echo 'export GOPATH=~/.gvm/pkgsets/go1.10.3/global' >> ~/.bashrc
echo 'export GOBIN=$GOPATH/go/bin' >> ~/.bashrc
echo 'export PATH=$GOBIN:$PATH' >> ~/.bashrc
source ~/.bashrc

echoin node start --home=./.echoin

```

You can now attach to the Echoin node using the following command

```
echoin attach http://localhost:8545
```

