======================
Deploy a TestNet Node
======================

In this document, we will discuss how to connect to the CyberMiles Echoin TestNet. We will cover binary, Docker and "build from source" scenarios. If you are new to CyberMiles, deploying a Docker node is probably easier.

While we highly recommend you to run your own Echoin node, you can also ask for direct access to one of the nodes maintained by the CyberMiles Foundation. Send an email to echoin@echoin.io to apply for access credentials. You still need the ``echoin`` client either from Docker or source to access the node.

Binary
======

Make sure your os is Ubuntu 16.04 or CentOS 7

Download pre-built binaries from `release page <https://github.com/blockservice/echoin/releases/tag/vTestnet>`_
-----------------------------------------------------------------------------------------------------------

::

  mkdir -p $HOME/release
  cd $HOME/release
  
  # if your os is Ubuntu
  wget https://github.com/blockservice/echoin/releases/download/vTestnet/echoin_vTestnet_ubuntu-16.04.zip
  unzip echoin_vTestnet_ubuntu-16.04.zip

  # or if your os is CentOS
  wget https://github.com/blockservice/echoin/releases/download/vTestnet/echoin_vTestnet_centos-7.zip
  unzip echoin_vTestnet_centos-7.zip

Getting Echoin TestNet Config
-----------------------------

::

  rm -rf $HOME/.echoin
  cd $HOME/release
  ./echoin node init --env testnet
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init/config/config.toml > $HOME/.echoin/config/config.toml
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init/config/genesis.json > $HOME/.echoin/config/genesis.json


Change your name from default name ``local``

::

  cd $HOME/.echoin
  vim $HOME/.echoin/config/config.toml

  # here you can change your name
  moniker = "<your_custom_name>"

Copy libeni into the default Echoin data directory
--------------------------------------------------

::

  mkdir -p $HOME/.echoin/eni
  cp -r $HOME/release/lib/. $HOME/.echoin/eni/lib
  
  # set env variables for eni lib
  export ENI_LIBRARY_PATH=$HOME/.echoin/eni/lib
  export LD_LIBRARY_PATH=$HOME/.echoin/eni/lib

Start the Node and Join Echoin TestNet
--------------------------------------

::

  cd $HOME/release
  ./echoin node start


Docker
======

Prerequisite
------------
Please `setup docker <https://docs.docker.com/engine/installation/>`_.

Docker Image
------------
Docker image for Echoin is stored on `Docker Hub <https://hub.docker.com/r/blockservice/echoin/tags/>`_. TestNet environment is using the `'vTestnet' <https://github.com/blockservice/echoin/releases/tag/vTestnet>`_ release which can be pulled automatically from Echoin:

::

  docker pull blockservice/echoin:vTestnet

Note: Configuration and data will be stored at /echoin directory in the container. The directory will also be exposed as a volume. The ports 8545, 26656 and 26657 will be exposed for connection.

Getting Echoin TestNet Config
-----------------------------

::

  rm -rf $HOME/.echoin
  docker run --rm -v $HOME/.echoin:/echoin -t blockservice/echoin:vTestnet node init --env testnet --home /echoin
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init/config/config.toml > $HOME/.echoin/config/config.toml
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init/config/genesis.json > $HOME/.echoin/config/genesis.json

Start the Node and Join Echoin TestNet
--------------------------------------
First change your name from default name ``local``

::

  vim ~/.echoin/config/config.toml

  # here you can change your name
  moniker = "<your_custom_name>"

Run the docker Echoin application:

::

  docker run --name echoin -v $HOME/.echoin:/echoin -p 26657:26657 -p 8545:8545 -t blockservice/echoin:vTestnet node start --home /echoin

Now your node is syncing with TestNet, the output will look like the following. Wait until it completely syncs.

::

  INFO [07-20|03:13:26.229] Imported new chain segment               blocks=1 txs=0 mgas=0.000 elapsed=1.002ms   mgasps=0.000    number=3363 hash=4884c0…212e75 cache=2.22mB
  I[07-20|03:13:26.241] Committed state                              module=state height=3363 txs=0 appHash=3E0C01B22217A46676897FCF2B91DB7398B34262
  I[07-20|03:13:26.443] Executed block                               module=state height=3364 validTxs=0 invalidTxs=0
  I[07-20|03:13:26.443] Updates to validators                        module=state updates="[{\"address\":\"\",\"pub_key\":\"VPsUJ1Eb73tYPFhNjo/8YIWY9oxbnXyW+BDQsTSci2s=\",\"power\":27065},{\"address\":\"\",\"pub_key\":\"8k17vhQf+IcrmxBiftyccq6AAHAwcVmEr8GCHdTUnv4=\",\"power\":27048},{\"address\":\"\",\"pub_key\":\"PoDmSVZ/qUOEuiM38CtZvm2XuNmExR0JkXMM9P9UhLU=\",\"power\":27048},{\"address\":\"\",\"pub_key\":\"2Tl5oI35/+tljgDKzypt44rD1vjVHaWJFTBdVLsmcL4=\",\"power\":27048}]"

To access the TestNet type the following in a seperte terminal console to get your IP address then use your IP address to connect to the TestNet.

::

  docker inspect -f '{{ .NetworkSettings.IPAddress }}' echoin
  172.17.0.2
  docker run --rm -it blockservice/echoin:vTestnet attach http://172.17.0.2:8545

Now, you should see the web3-cmt JavaScript console, you can now jump to the "Test transactions" section to send test transactions.

Build from source
=================

Prerequisite
------------
Please `install Echoin via source builds <http://echoin.readthedocs.io/en/latest/getting-started.html#build-from-source>`_. (STOP before you connect to a local node)

Getting Echoin TestNet Config
-----------------------------

::

  rm -rf $HOME/.echoin
  echoin node init --env testnet
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init/config/config.toml > $HOME/.echoin/config/config.toml
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init/config/genesis.json > $HOME/.echoin/config/genesis.json

Start the Node and Join Echoin TestNet
--------------------------------------
Run the Echoin application:

::

  echoin node start --home ~/.echoin

Now your node is syncing with TestNet, the output will look like the following. Wait until it completely syncs.

::

  INFO [07-20|03:13:26.229] Imported new chain segment               blocks=1 txs=0 mgas=0.000 elapsed=1.002ms   mgasps=0.000    number=3363 hash=4884c0…212e75 cache=2.22mB
  I[07-20|03:13:26.241] Committed state                              module=state height=3363 txs=0 appHash=3E0C01B22217A46676897FCF2B91DB7398B34262
  I[07-20|03:13:26.443] Executed block                               module=state height=3364 validTxs=0 invalidTxs=0
  I[07-20|03:13:26.443] Updates to validators                        module=state updates="[{\"address\":\"\",\"pub_key\":\"VPsUJ1Eb73tYPFhNjo/8YIWY9oxbnXyW+BDQsTSci2s=\",\"power\":27065},{\"address\":\"\",\"pub_key\":\"8k17vhQf+IcrmxBiftyccq6AAHAwcVmEr8GCHdTUnv4=\",\"power\":27048},{\"address\":\"\",\"pub_key\":\"PoDmSVZ/qUOEuiM38CtZvm2XuNmExR0JkXMM9P9UhLU=\",\"power\":27048},{\"address\":\"\",\"pub_key\":\"2Tl5oI35/+tljgDKzypt44rD1vjVHaWJFTBdVLsmcL4=\",\"power\":27048}]"

To access the TestNet, type the following in a seperte terminal console (make sure that the seperate console also has echoin environment):

::

  echoin attach http://localhost:8545

You should now the see the web3-cmt JavaScript console and can now test some transactions.

Test transactions
=================

In this section, we will use the ``echoin`` client's web3-cmt JavaScript console to send some transactions and verify that the system is set up properly. You can't test transactions untill you are completely in sync with the TestNet. It might take hours to sync.

Create and fund a test account
-------------------------------

Once you attach the ``echoin`` to the node as above, create two accounts on the TestNet.

::

  Welcome to the Geth JavaScript console!
  > personal.newAccount()
  ...

Now you have created TWO accounts ``0x1234FROM`` and ``0x1234DEST`` on the Echoin TestNet. It is time to get some test CMTs. Please go visit the website below, and ask for 1000 TestNet CMTs for account ``0x1234FROM``. We will also send 1000 TEST tokens, issued by the TEST smart contract, to the account.

http://echoin-faucet.echoin.io
 

Test transactions
-----------------

You can test transactions between your two accounts. Remember to unlock both of your accounts.

::

  > personal.unlockAccount("0x1234FROM","password")
  true
  ...
  > cmt.sendTransaction({from:"0x1234FROM", to:"0x1234DEST",value:1000})
  ...
  > cmt.getBalance("0x1234DEST")
  ...
  
You can also test smart contract transactions for the TEST token as below.

::

  > abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
  > tokenContract = web3.cmt.contract(abi)
  > tokenInstance = tokenContract.at("0xb6b29ef90120bec597939e0eda6b8a9164f75deb")
  > tokenInstance.transfer.sendTransaction("0x1234DEST", 1000, {from: "0x1234FROM"})

After 10 seconds, you can check the balance of the receiving account as follows.

::

  > tokenInstance.balanceOf.call("0x1234DEST")

Fee free transactions
---------------------

On CyberMiles blockchain, we have made most transactions (except for heavy users or spammers) fee-free. You can try it like this in ``echoin`` client console.

::

  > cmt.sendTransaction({from:"0x1234FROM", to:"0x1234DEST",value:1000,gasPrice:0})
  ...

To try a fee-free smart contract-based token transaction, use the following in the ``echoin`` client console.

::

  > tokenInstance.transfer.sendTransaction("0x1234DEST", 1000, {from: "0x1234FROM", gasPrice: 0})


