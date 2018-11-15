===============
Transactions
===============

The CyberMiles blockchain is fully backward compatible with the Ethereum protocol. That means 
all Ethereum transactions are supported on the CyberMiles blockchain. For developers, we recommend you use the
`web3-ec.js <https://github.com/CyberMiles/web3-ec.js/>`_ library interact with the blockchain. The ``web3-ec.js`` library is a customized version of the 
Ethereum `web3.js <https://github.com/ethereum/web3.js/>`_ library, with the ``eth`` module renamed to the ``ec`` module. 
The ``web3-ec.js`` library is integrated into the ``echoin`` client console by default.

..
  // send a transfer transaction
  web3.ec.sendTransaction(
    {
      from: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
      to: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
      value: web3.toWei(100, "ec")
    },
    (err, res) => {
      // ...
    }
  )
  
  // get the balance of an address
  var balance = web3.ec.getBalance("0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")


Beyond Ethereum, however, the most important transactions that are specific for the CyberMiles blockchain are for
DPoS staking operations and for blockchain governance operations.

Staking transactions
-------- 

A key characteristic of the CyberMiles blockchain is the DPoS consensus mechanism. You can read more about the 
`CyberMiles DPoS protocol <https://www.echoin.io/validator>`_. With the staking transactions, EC holders
can declare candidacy for validators, stake and vote for candidates, and unstake as needed. Learn more about the
`staking transactions for validators <https://echoin.github.io/web3-ec.js/api/#web3-ec-stake-validator>`_ and the 
`staking transactions for delegators <https://echoin.github.io/web3-ec.js/api/#web3-ec-stake-delegator>`_.


Governance transactions
-------- 

With the DPoS consensus mechanism, the CyberMiles validators can make changes to the blockchain network's
key parameters, deploy new `libENI libraries <https://www.litylang.org/performance/>`_, 
create `trusted contracts <https://www.litylang.org/trusted/>`_, and make other policy changes. Anyone on the blockchain
can propose governance changes, but only the current validators can vote. Learn more about the
`governance transactions <https://echoin.github.io/web3-ec.js/api/#web3-ec-governance>`_.




