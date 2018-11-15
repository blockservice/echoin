===============
Getting Started
===============

In this document, we will discuss how to create and run a single node CyberMiles blockchain on your computer. 
It allows you to connect and test basic features such as coin transactions, staking and unstaking for validators, 
governance, and smart contracts.


Use Docker
----------------------------

The easiest way to get started is to use our pre-build Docker images. Please make sure that you have 
`Docker installed <https://docs.docker.com/install/>`_ and that your `Docker can work without sudo <https://docs.docker.com/install/linux/linux-postinstall/>`_.

Initialize
``````````

Let’s initialize a docker image for the Echoin build first.

.. code:: bash

  docker run --rm -v ~/volumes/local:/echoin blockservice/echoin node init --home /echoin

The node’s data directory is ``~/volumes/local`` on the local computer. 

Run
```

Now you can start the CyberMiles Echoin node in docker.

.. code:: bash

  docker run --name echoin -v ~/volumes/local:/echoin -t -p 26657:26657 -p 8545:8545 blockservice/echoin node start --home /echoin

At this point, you can Ctrl-C to exit to the terminal and echoin will remain running in the background. 
You can check the CyberMiles Echoin node’s logs at anytime via the following docker command.

.. code:: bash

  docker logs -f echoin

You should see blocks like the following in the log.

.. code:: bash

  INFO [07-14|07:23:05] Imported new chain segment               blocks=1 txs=0 mgas=0.000 elapsed=431.085µs mgasps=0.000 number=163 hash=05e16c…a06228
  INFO [07-14|07:23:15] Imported new chain segment               blocks=1 txs=0 mgas=0.000 elapsed=461.465µs mgasps=0.000 number=164 hash=933b97…0c340c

Connect
```````

You can connect to the local CyberMiles node by attaching an instance of the Echoin client.

.. code:: bash

  # Get the IP address of the echoin node
  docker inspect -f '{{ .NetworkSettings.IPAddress }}' echoin
  172.17.0.2

  # Use the IP address from above to connect
  docker run --rm -it blockservice/echoin attach http://172.17.0.2:8545

It opens the web3-ec JavaScript console to interact with the virtual machine. The example below shows how to unlock the
coinbase account so that you have coins to spend.

.. code:: bash

  Welcome to the Echoin JavaScript console!

  instance: vm/v1.6.7-stable/linux-amd64/go1.9.3
  coinbase: 0x7eff122b94897ea5b0e2a9abf47b86337fafebdc
  at block: 231 (Sat, 14 Jul 2018 07:34:25 UTC)
   datadir: /echoin
   modules: admin:1.0 ec:1.0 eth:1.0 net:1.0 personal:1.0 rpc:1.0 web3:1.0
  
  > personal.unlockAccount('0x7eff122b94897ea5b0e2a9abf47b86337fafebdc', '1234')
  true
  > 

Build from source
----------------------------

Currently, we only support source builds for CentOS 7 and Ubuntu 16.04 linux distributions.

Prerequisite
````````````

You must have GO language version 1.10+ installed in order to build and run a Echoin node. 
The easiest way to get GO 1.10 is through the GVM. Below are the commands on a Linux server.

.. code:: bash

  $ bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
  $ vim ~/.bash_profile
  inset into the bash profile: source "$HOME/.bashrc"
  log out and log in
  $ sudo apt-get install bison
  $ gvm version
  output should look like: Go Version Manager v1.0.22 installed at /home/myuser/.gvm
  $ gvm install go1.10.3
  $ gvm use go1.10.3 --default


Build
`````

First we need to checkout the correct branch of Echoin from Github:

.. code:: bash

  go get github.com/blockservice/echoin (ignore if an error occur)
  cd $GOPATH/src/github.com/blockservice/echoin
  git checkout master

Next, we need to build libENI and put it into the default Echoin data directory ``~/.echoin/``.

.. code:: bash

  sudo rm -rf ~/.echoin
  wget -O $HOME/libeni.tgz https://github.com/CyberMiles/libeni/releases/download/v1.3.4/libeni-1.3.4_ubuntu-16.04.tgz
  tar zxvf $HOME/libeni.tgz -C $HOME
  mkdir -p $HOME/.echoin/eni
  cp -r $HOME/libeni-1.3.4/lib $HOME/.echoin/eni/lib

Currently libENI can only run on Ubuntu 16.04 and CentOS 7. If your operating system is CentOS, please change the downloading url. You can find it here: `https://github.com/CyberMiles/libeni/releases <https://github.com/CyberMiles/libeni/releases>`_

Now, we can build and install Echoin binary. It will populate additional configuration files into ``~/.echoin/``

.. code:: bash

  cd $GOPATH/src/github.com/blockservice/echoin
  make all

If the system cannot find glide at the last step, make sure that you have ``$GOPATH/bin`` under the ``$PATH`` variable.

Run
```

Let's start a  Echoin node locally using the ``~/.echoin/`` data directory.

.. code:: bash

  echoin node init
  echoin node start

Connect
```````

You can connect to the local CyberMiles node by attaching an instance of the Echoin client.

.. code:: bash

  echoin attach http://localhost:8545

It opens the web3-ec JavaScript console to interact with the virtual machine. The example below shows how to unlock the
coinbase account so that you have coins to spend.

.. code:: bash

  Welcome to the Echoin JavaScript console!

  instance: vm/v1.6.7-stable/linux-amd64/go1.9.3
  coinbase: 0x7eff122b94897ea5b0e2a9abf47b86337fafebdc
  at block: 231 (Sat, 14 Jul 2018 07:34:25 UTC)
   datadir: /echoin
   modules: admin:1.0 ec:1.0 eth:1.0 net:1.0 personal:1.0 rpc:1.0 web3:1.0
  
  > personal.unlockAccount('0x7eff122b94897ea5b0e2a9abf47b86337fafebdc', '1234')
  true
  > 

Test transactions
----------------------------

You can now send a transaction between accounts like the following.

.. code:: bash

  personal.unlockAccount("from_address")
  ec.sendTransaction({"from": "from_address", "to": "to_address", "value": web3.toWei(0.001, "ec")})

Next, you can paste the following script into the Echoin client console, at the > prompt.

.. code:: bash

  function checkAllBalances() {
    var totalBal = 0;
    for (var acctNum in ec.accounts) {
        var acct = ec.accounts[acctNum];
        var acctBal = web3.fromWei(ec.getBalance(acct), "ec");
        totalBal += parseFloat(acctBal);
        console.log("  ec.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal + " EC");
    }
    console.log("  Total balance: " + totalBal + "EC");
  };
  
You can now run the script in the console, and see the results.

.. code:: bash

  > checkAllBalances();
  ec.accounts[0]: 	0x6....................................230 	balance: 466.798526 EC
  ec.accounts[1]: 	0x6....................................244 	balance: 1531 EC
  Total balance: 1997.798526EC
  
 
 
