====
EC Wallet - dApp SDK Developer Guideline
====

Introduction
====

This document user helps DApp developers access the EC Wallet DApp SDK. 

In general, DApp requires a hosting environment to interact with the user's wallet, just like metamask  EC Walelet provides this environment in the app.

In DApp browser, DApp can do the same and more things in Metamask.

To keep things simple, this document will use DApp browser for EC Walelet* DApp browser* , DApp for DApp webpage. 

Web3JS
====

EC Wallet DApp browser is fully compatible with metamask, you can migrate DApp directly to EC Wallet without even writing any code.
When the DApp is loaded by the DApp browser, we will inject a web3-ec.js, so the DApp does not have to have its own built-in web3-ec.js (but you can do the same), the web3 version we are currently injecting is 0.19, You can access this global object window.web3.
Dapp browser will set web3.ec.defaultAccount The value of the user is the current wallet address of the user, and the web3 HttpProvider is set to the same as the node configuration of the EC Wallet.


API
====

web3.ec.sendTransaction
For DApp, the most common operation is to send a transaction, usually calling the web3.ec.sendTransaction method of web3.js, DApp browser will listen to this method call, display a modal layer to let the user see the transaction information. The user can enter the password signature and then send the transaction. After the transaction is successful, it will return a txHash. If it fails, it will return the error value.

Common web3 api:
----
* Check the current active account on (web3.ec.coinbase)
* Get the balance of any account (web3.ec.getBalance)
* Send a transaction (web3.ec.sendTransaction)
* Sign the message with the private key of the current account (web3.personal.sign)

Error handling
----
The DApp browser only handles some errors (such as the user entering the wrong password), most of the transaction errors will be returned to the DApp, DApps should handle these errors and prompt the user. We have done i18n processing of the error content, most of the time You can pop up error.message directly.

The user cancels the operation and the Dapp browser returns the error code "1001"

window.ecwallet.closeDapp()
 Close the current DApp page and return to the discovery page

window.ecwallet.getCurrentLanguage()
 Get the user's current language settings. This information may be useful if the DApp needs to support multiple languages, but we have added the locale parameter to the DApp url. In most cases you don't need to call this API.
 Available locale:
 zh-CN
 en-US

window.ecwallet.getSdkVersion()
 Get the current EC Wallet Dapp SDK version number: 1

window.ecwallet.getPlatform()
  Get the current EC Wallet phone system:
  android
  ios

Developer mode
 In the ECWallet APP, by default you can't access the DApp by typing (or scanning) a url. You need to open the developer mode first (* Profile → About us → Click EC Wallet logo five times*).
 
 dApp development sample process：
  * 1.install Metamask for EC, switch testnet, get EC.
  * 2.go to Remix for EC, coding&deploy contract, get contract address/ABI/Binary Codes.
  * 3.coding in HTML5 and import web3-ec functions.
  * 4.test dApp and contact EC Community.
 
 `MetaMask for EC <https://www.echoin.io/metamask/>`_
-----------------------------------------------------------------------------------------------------------

 `Remix for EC <https://remix.echoin.io>`_
-----------------------------------------------------------------------------------------------------------

 `web3-ec.js <https://github.com/CyberMiles/web3-ec.js>`_
-----------------------------------------------------------------------------------------------------------

 `dApp SDK Example <https://cube-api.echoin.io/static/html/cw/ecwallet-dappsdk-example.html>`_
-----------------------------------------------------------------------------------------------------------

Smart Contract source code in SDK Example
::
  contract EasyMsg {
   string public msg;
   uint public age;
  
   function getData() public constant returns (string,uint){
      return (msg,age);
   }
  
   function setData(string _msg,uint _age) public {
       msg = _msg;
       age = _age;
   }
  
  }
 

