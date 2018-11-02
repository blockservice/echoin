# Echoin
We just forked the Echoin project from master branch of CyberMiles/travis project

## Install

### System preparation Ubuntu 16.04 LTS
```
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
```

### Installing Go
```
cd ~
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
source $HOME/.gvm/scripts/gvm
gvm install go1.10.3 -B
gvm use go1.10.3 --default
echo 'export GOPATH=~/.gvm/pkgsets/go1.10.3/global' >> ~/.bashrc
echo 'export GOBIN=$GOPATH/go/bin' >> ~/.bashrc
echo 'export PATH=$GOBIN:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Installing Echoin
```
go get github.com/blockservice/echoin

#PLEASE NOTE: The above will return an error such as "can't load package ... no Go file in ...",
#Please just ignore this error and continue on with the installation

cd $GOPATH/src/github.com/blockservice/echoin
git checkout master

#Continue installing Echoin
cd ~
cd $GOPATH/src/github.com/blockservice/echoin
make all
```

Configuring Echoin test network settings
```
cd ~
git clone https://github.com/blockservice/testnet.git
cp -r testnet/echoin/init .echoin

#Starting Echoin test network node
cd ~
echoin node init --env testnet
curl https://github.com/blockservice/testnet/master/echoin/init/config/config.toml > ~/.echoin/config/config.toml
curl https://github.com/blockservice/testnet/master/echoin/init/config/genesis.json > ~/.echoin/config/genesis.json

//Please ensure that the system paths are known, or else the echoin command will not be found (you will get an error like this "The program 'echoin' is currently not installed")

echo 'export GOPATH=~/.gvm/pkgsets/go1.10.3/global' >> ~/.bashrc
echo 'export GOBIN=$GOPATH/go/bin' >> ~/.bashrc
echo 'export PATH=$GOBIN:$PATH' >> ~/.bashrc
source ~/.bashrc

echoin node start --home=./.echoin


//You can now attach to the Echoin node using the following command


echoin attach http://localhost:8545
```

