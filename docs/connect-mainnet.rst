=====
Deploy a MainNet Node
=====

In this document, we will discuss how to connect to the CyberMiles Echoin MainNet. We will cover binary, Docker and "build from source" scenarios. If you are new to CyberMiles, deploying a Docker node is probably easier.

While we highly recommend you to run your own Echoin node, you can also ask for direct access to one of the nodes maintained by the CyberMiles Foundation. Send an email to echoin@echoin.io to apply for access credentials. You still need the ``echoin`` client either from Docker or source to access the node.

Binary
======

Make sure your os is Ubuntu 16.04 or CentOS 7

Download pre-built binaries from `release page <https://github.com/blockservice/echoin/releases>`_
-----------------------------------------------------------------------------------------------------------

::

  mkdir -p $HOME/release
  cd $HOME/release
  
  # if your os is Ubuntu
  wget https://github.com/blockservice/echoin/releases/download/v0.1.2-beta/echoin_v0.1.2-beta_ubuntu-16.04.zip
  unzip echoin_v0.1.2-beta_ubuntu-16.04.zip

  # or if your os is CentOS
  wget https://github.com/blockservice/echoin/releases/download/v0.1.2-beta/echoin_v0.1.2-beta_centos-7.zip
  unzip echoin_v0.1.2-beta_centos-7.zip

Getting Echoin MainNet Config
-----------------------------

::

  rm -rf $HOME/.echoin
  mkdir -p $HOME/.echoin
  cd $HOME/release

  ./echoin node init --env mainnet --home $HOME/.echoin
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init-mainnet/config.toml > $HOME/.echoin/config/config.toml
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init-mainnet/genesis.json > $HOME/.echoin/config/genesis.json

Change your name from default name ``local``, set persistent peers

::

  cd $HOME/.echoin
  vim $HOME/.echoin/config/config.toml
  # here you can change your name
  moniker = "<your_custom_name>"

  # find the seeds option and change its value
  seeds = "595fa3946078dc8dbd752fa139462735c67027c7@104.154.232.196:26656,d7694fef6eb96838fd91279298314b4fcfb9aa03@35.193.249.179:26656,11b4a29a26d55c09d96a0af6a6dbb40ec840c263@35.226.7.62:26656,96d43bc533313e9c6ba7303390f1b858f38c3c5a@35.184.27.200:26656,873d6befc7145b86e48cf6c23a8c5fd3aebec6a3@35.196.9.192:26656,499decf32125463826cbb7b6eab6697179396688@35.196.33.211:26656"

Copy libeni into the default Echoin data directory
--------------------------------------------------

::

  mkdir -p $HOME/.echoin/eni
  cp -r $HOME/release/lib/. $HOME/.echoin/eni/lib
  
  # set env variables for eni lib
  export ENI_LIBRARY_PATH=$HOME/.echoin/eni/lib
  export LD_LIBRARY_PATH=$HOME/.echoin/eni/lib

Start the Node and Join Echoin MainNet
--------------------------------------

::

  cd $HOME/release
  ./echoin node start --home $HOME/.echoin


Docker
======

Prerequisite
------------
Please `setup docker <https://docs.docker.com/engine/installation/>`_.

Docker Image
------------
Docker image for Echoin is stored on `Docker Hub <https://hub.docker.com/r/blockservice/echoin/tags/>`_. MainNet environment is using the `'v0.1.2-beta' <https://github.com/blockservice/echoin/releases/tag/v0.1.2-beta>`_ branch which can be pulled automatically from Echoin:

::

  docker pull blockservice/echoin:v0.1.2-beta

Note: Configuration and data will be stored at /echoin directory in the container. The directory will also be exposed as a volume. The ports 8545, 26656 and 26657 will be exposed for connection.

Getting Echoin MainNet Config
-----------------------------

::

  rm -rf $HOME/.echoin
  docker run --rm -v $HOME/.echoin:/echoin blockservice/echoin:v0.1.2-beta node init --env mainnet --home /echoin
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init-mainnet/config.toml > $HOME/.echoin/config/config.toml
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init-mainnet/genesis.json > $HOME/.echoin/config/genesis.json

Start the Node and Join Echoin MainNet
--------------------------------------
First change your name from default name ``local``, set persistent peers

::

  vim ~/.echoin/config/config.toml
  # here you can change your name
  moniker = "<your_custom_name>"

  # find the seeds option and change its value
  seeds = "595fa3946078dc8dbd752fa139462735c67027c7@104.154.232.196:26656,d7694fef6eb96838fd91279298314b4fcfb9aa03@35.193.249.179:26656,11b4a29a26d55c09d96a0af6a6dbb40ec840c263@35.226.7.62:26656,96d43bc533313e9c6ba7303390f1b858f38c3c5a@35.184.27.200:26656,873d6befc7145b86e48cf6c23a8c5fd3aebec6a3@35.196.9.192:26656,499decf32125463826cbb7b6eab6697179396688@35.196.33.211:26656"

Run the docker Echoin application:

::

  docker run --name echoin -v $HOME/.echoin:/echoin -t -p 26657:26657 blockservice/echoin:v0.1.2-beta node start --home /echoin


Snapshot
========

Make sure your os is Ubuntu 16.04 or CentOS 7

Download snapshot file from AWS S3 `echoin-ss-bucket <https://s3-us-west-2.amazonaws.com/echoin-ss-bucket>`_
------------------------------------------------------------------------------------------------------------

You can splice the file name from the bucket list. The downloading url will be like ``https://s3-us-west-2.amazonaws.com/echoin-ss-bucket/mainnet/echoin_ss_mainnet_1540723748_102028.tar.gz``. You must have found that the file name contains timestamp and block number at which the snapshot is made.

::

  mkdir -p $HOME/release
  cd $HOME/release
  wget https://s3-us-west-2.amazonaws.com/echoin-ss-bucket/mainnet/echoin_ss_mainnet_1540723748_102028.tar.gz
  tar xzf echoin_ss_mainnet_1540723748_102028.tar.gz

  # if your os is Ubuntu
  mv .echoin/app/echoin .
  mkdir .echoin/eni
  mv .echoin/app/lib .echoin/eni
  mv .echoin $HOME

  # or if your os is CentOS
  mv .echoin $HOME
  wget https://github.com/blockservice/echoin/releases/download/v0.1.2-beta/echoin_v0.1.2-beta_centos-7.zip
  unzip echoin_v0.1.2-beta_centos-7.zip
  mkdir -p $HOME/.echoin/eni
  cp -r $HOME/release/lib/. $HOME/.echoin/eni/lib

Set env variables for eni lib
--------------------------------------------------

::

  export ENI_LIBRARY_PATH=$HOME/.echoin/eni/lib
  export LD_LIBRARY_PATH=$HOME/.echoin/eni/lib

Start the Node and Join Echoin MainNet
--------------------------------------

::

  cd $HOME/release
  ./echoin node start --home $HOME/.echoin
  

Build from source
=================

Prerequisite
------------
Please `install Echoin via source builds <http://echoin.readthedocs.io/en/latest/getting-started.html#build-from-source>`_. (STOP before you connect to a local node)

Getting Echoin MainNet Config
-----------------------------

::

  rm -rf $HOME/.echoin
  mkdir -p $HOME/.echoin
  cd $HOME/release

  ./echoin node init --env mainnet --home $HOME/.echoin
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init-mainnet/config.toml > $HOME/.echoin/config/config.toml
  curl https://raw.githubusercontent.com/CyberMiles/testnet/master/echoin/init-mainnet/genesis.json > $HOME/.echoin/config/genesis.json

Change your name from default name ``local``, set persistent peers

::

  cd $HOME/.echoin
  vim $HOME/.echoin/config/config.toml
  # here you can change your name
  moniker = "<your_custom_name>"

  # find the seeds option and change its value
  seeds = "595fa3946078dc8dbd752fa139462735c67027c7@104.154.232.196:26656,d7694fef6eb96838fd91279298314b4fcfb9aa03@35.193.249.179:26656,11b4a29a26d55c09d96a0af6a6dbb40ec840c263@35.226.7.62:26656,96d43bc533313e9c6ba7303390f1b858f38c3c5a@35.184.27.200:26656,873d6befc7145b86e48cf6c23a8c5fd3aebec6a3@35.196.9.192:26656,499decf32125463826cbb7b6eab6697179396688@35.196.33.211:26656"

Start the Node and Join Echoin MainNet
--------------------------------------
Run the Echoin application:

::

  echoin node start --home ~/.echoin


Access the MainNet
==================

For the security concern, the rpc service is disabled by default, you can enable it by changing the config.toml:

::

  vim $HOME/.echoin/config/config.toml
  rpc = true

Then restart echoin service and type the following in a seperte terminal console (make sure that the seperate console also has echoin environment):

::

  echoin attach http://localhost:8545


You should now the see the web3-ec JavaScript console and have fun with MainNet.

We have deployed a rpc service for public to attach:

::

  rpc.echoin.io:8545
  
  
