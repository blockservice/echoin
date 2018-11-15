#!/usr/bin/env bash
set -e

BASEDIR=$(dirname $0)
cd ./${BASEDIR}
BASEDIR=$(pwd)

# setup cluster
mkdir -p ~/volumes
git clone https://github.com/CyberMiles/testnet.git ~/volumes/testnet

cd ~/volumes/testnet/echoin/scripts
git checkout master
yes "" | sudo ./cluster.sh test 6 4
docker-compose up -d all
sleep 3
curl http://localhost:26657/status

# web3-ec
git clone https://github.com/CyberMiles/web3-ec.js ~/web3-ec.js
cd ~/web3-ec.js
git checkout master
yarn install
yarn link

# integration test
cd $BASEDIR
yarn install
yarn link "web3-ec"
yarn test

# cleanup
cd ~/volumes/testnet/echoin/scripts
docker-compose down
