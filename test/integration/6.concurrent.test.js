const async = require("async")
const chai = require("chai")
const expect = chai.expect

const logger = require("./logger")
const { Settings } = require("./constants")
const Utils = require("./global_hooks")
const Globals = require("./global_vars")

let A, B, C, V
const EC1 = web3.toWei(1, "ec")
const EC2 = web3.toWei(2, "ec")
const TIMES = 2

describe("Concurrent Test", function() {
  before(function() {
    A = web3.ec.defaultAccount
    B = Globals.Accounts[0]
    C = Globals.Accounts[3]
  })
  after(function(done) {
    // transfer back
    let balance = web3.toWei(web3.toBigNumber(50000), "ec").minus(web3.ec.getBalance(B, "latest"))
    if (balance > 0) Utils.transfer(C, B, balance)
    balance = web3.ec
      .getBalance(C, "latest")
      .minus(balance)
      .minus(web3.toWei(50000, "ec"))
    if (balance > 0) Utils.transfer(C, A, balance)
    Utils.waitBlocks(done, 1)
  })

  describe("Gov: TransferFund", function() {
    before(function(done) {
      // clear all balance of A and B
      let balance = web3.ec.getBalance(A, "latest")
      if (balance > 0) Utils.transfer(A, C, balance)
      balance = web3.ec.getBalance(B, "latest")
      if (balance > 0) Utils.transfer(B, C, balance)

      Utils.waitBlocks(done, 1)
    })

    describe("A send 2 requests(B->C) at the same time", function() {
      it("if A and B don't have enough ECs, fail", function(done) {
        multiTransFund((err, res) => {
          expect(res.length).to.equal(TIMES)
          for (let i = 0; i < TIMES; ++i) {
            Utils.expectTxFail(res[i])
          }
          done()
        })
      })
      it("if B has enough ECs, but A only has gas fee for one tx", function(done) {
        Utils.transfer(C, B, EC2)
        Utils.transfer(C, A, Utils.gasFee("proposeTransferFund"), Globals.Params.gas_price)
        Utils.waitBlocks(done, 1)
      })
      it("one of the 2 requests will fail", function(done) {
        multiTransFund((err, res) => {
          logger.debug(res)
          expect(res.length).to.equal(TIMES)
          expect(
            (res[1].height > 0 && (res[0].height == 0 || res[0].deliver_tx.code > 0)) ||
              (res[0].height > 0 && (res[1].height == 0 || res[1].deliver_tx.code > 0))
          ).to.be.true
          done()
        })
      })
      it("if A has enough ECs, but B has gas fee for only one tx", function(done) {
        Utils.transfer(
          C,
          A,
          Utils.gasFee("proposeTransferFund").plus(Utils.gasFee("proposeTransferFund")),
          Globals.Params.gas_price
        )
        Utils.waitBlocks(done, 1)
      })
      it("one of the 2 requests will fail", function(done) {
        multiTransFund((err, res) => {
          logger.debug(res)
          expect(res.length).to.equal(TIMES)
          expect(
            (res[1].height > 0 && (res[0].height == 0 || res[0].deliver_tx.code > 0)) ||
              (res[0].height > 0 && (res[1].height == 0 || res[1].deliver_tx.code > 0))
          ).to.be.true
          done()
        })
      })
    })
  })

  describe.skip("Stake: UpdateCandidacy", function() {
    before(function(done) {
      // clear all balance of A
      let balance = web3.ec.getBalance(A, "latest")
      if (balance > 0) Utils.transfer(A, C, balance)
      Utils.waitBlocks(done, 1)
    })
    describe("A send 2 requests at the same time", function() {
      it("if A don't have enough ECs, fail", function(done) {
        multiUpdateCandidacy((err, res) => {
          expect(res.length).to.equal(2)
          for (let i = 0; i < TIMES; ++i) {
            Utils.expectTxFail(res[i])
          }
          done()
        })
      })
      it("if A has only gas fee for one tx", function(done) {
        Utils.transfer(C, A, Utils.gasFee("updateCandidacy"), Globals.Params.gas_price)
        Utils.waitBlocks(done, 1)
      })
      it("one of the 2 requests will fail", function(done) {
        multiUpdateCandidacy((err, res) => {
          logger.debug(res)
          expect(res.length).to.equal(TIMES)
          expect(
            (res[1].height > 0 && (res[0].height == 0 || res[0].deliver_tx.code > 0)) ||
              (res[0].height > 0 && (res[1].height == 0 || res[1].deliver_tx.code > 0))
          ).to.be.true
          done()
        })
      })
    })
  })

  describe.skip("Stake: SetCompRate", function() {
    before(function(done) {
      // clear all balance of A
      let balance = web3.ec.getBalance(A, "latest")
      if (balance > 0) Utils.transfer(A, C, balance)
      Utils.waitBlocks(done, 1)
    })
    describe("A send 2 requests at the same time", function() {
      it("if A don't have enough ECs, fail", function(done) {
        multiSetCompRate((err, res) => {
          expect(res.length).to.equal(2)
          for (let i = 0; i < TIMES; ++i) {
            Utils.expectTxFail(res[i])
          }
          done()
        })
      })
      it("if A has only gas fee for one tx", function(done) {
        Utils.transfer(C, A, Utils.gasFee("setCompRate"), Globals.Params.gas_price)
        Utils.waitBlocks(done, 1)
      })
      it("one of the 2 requests will fail", function(done) {
        multiSetCompRate((err, res) => {
          logger.debug(res)
          expect(res.length).to.equal(TIMES)
          expect(
            (res[1].height > 0 && (res[0].height == 0 || res[0].deliver_tx.code > 0)) ||
              (res[0].height > 0 && (res[1].height == 0 || res[1].deliver_tx.code > 0))
          ).to.be.true
          done()
        })
      })
    })
  })

  describe("Stake: Delegator Withdraw", function() {
    describe("B send 2 requests at the same time", function() {
      before(function(done) {
        // clear all balance of B
        let balance = web3.ec.getBalance(B, "latest")
        if (balance > 0) Utils.transfer(B, C, balance)
        Utils.waitBlocks(done, 1)
      })
      before(function(done) {
        // make balance of B = EC1
        Utils.transfer(C, B, EC1, Globals.Params.gas_price)
        Utils.waitBlocks(done, 1)
      })
      before(function(done) {
        // B delegate EC1 to A
        Utils.delegatorAccept(B, A, EC1)
        Utils.waitBlocks(done, 1)
      })
      it("one of the 2 requests will fail", function(done) {
        multiDeleWithdraw((err, res) => {
          logger.debug(res)
          expect(res.length).to.equal(TIMES)
          expect(
            (res[1].height > 0 && (res[0].height == 0 || res[0].deliver_tx.code > 0)) ||
              (res[0].height > 0 && (res[1].height == 0 || res[1].deliver_tx.code > 0))
          ).to.be.true
          done()
        })
      })
    })
  })

  describe.skip("Stake: Delegator Accept from one account", function() {
    before(function(done) {
      // clear all balance of B
      let balance = web3.ec.getBalance(B, "latest")
      if (balance > 0) Utils.transfer(B, C, balance)
      Utils.waitBlocks(done, 1)
    })
    describe("B Send 2 requests at the same time", function() {
      it("if B don't have enough ECs, fail", function(done) {
        multiDeleAccept(EC1, (err, res) => {
          expect(res.length).to.equal(2)
          for (let i = 0; i < TIMES; ++i) {
            Utils.expectTxFail(res[i])
          }
          done()
        })
      })
      it("if B has ECs for only one tx", function(done) {
        Utils.transfer(C, B, EC1, Globals.Params.gas_price)
        Utils.waitBlocks(done, 1)
      })
      it("one of the 2 requests will fail", function(done) {
        multiDeleAccept(EC1, (err, res) => {
          logger.debug(res)
          expect(res.length).to.equal(TIMES)
          expect(
            (res[1].height > 0 && (res[0].height == 0 || res[0].deliver_tx.code > 0)) ||
              (res[0].height > 0 && (res[1].height == 0 || res[1].deliver_tx.code > 0))
          ).to.be.true
          done()
        })
      })
    })
  })

  describe("Stake: Delegator Accept from two account", function() {
    let deleAmount
    before(function() {
      let r = web3.ec.stake.validator.query(A)
      deleAmount = web3
        .toBigNumber(r.data.max_shares)
        .minus(r.data.shares)
        .dividedToIntegerBy(2)
        .plus(1)
        .toString(10)
    })
    describe("B and C delegate >1/2 shares left on A at the same time", function() {
      it("one of the 2 requests will fail", function(done) {
        let nonceB = web3.ec.getTransactionCount(B)
        let nonceC = web3.ec.getTransactionCount(C)
        let arr = [{ from: B, nonce: nonceB, deleAmount }, { from: C, nonce: nonceC, deleAmount }]

        async.map(arr, deleAccept, (err, res) => {
          logger.debug(res)
          expect(res.length).to.equal(2)
          expect(
            (res[1].height > 0 && (res[0].height == 0 || res[0].deliver_tx.code > 0)) ||
              (res[0].height > 0 && (res[1].height == 0 || res[1].deliver_tx.code > 0))
          ).to.be.true
          done()
        })
      })
    })
  })

  describe("Stake: DeclareCandidacy", function() {
    before(function() {
      V = web3.personal.newAccount(Settings.Passphrase)
      web3.personal.unlockAccount(V, Settings.Passphrase)
    })
    after(function() {
      let r = web3.ec.stake.validator.withdraw({ from: V })
      logger.debug(r)
      logger.debug(`validator ${V} removed`)
    })
    describe("V send 2 requests at the same time", function() {
      it("if V don't have enough ECs, fail", function(done) {
        multiDeclareCandidacy((err, res) => {
          expect(res.length).to.equal(2)
          for (let i = 0; i < TIMES; ++i) {
            Utils.expectTxFail(res[i])
          }
          done()
        })
      })
      it("if V has only ECs for one tx", function(done) {
        Utils.transfer(C, V, Utils.gasFee("declareCandidacy").plus(10), Globals.Params.gas_price)
        Utils.waitBlocks(done, 1)
      })
      it("one of the 2 requests will fail", function(done) {
        multiDeclareCandidacy((err, res) => {
          logger.debug(res)
          expect(res.length).to.equal(TIMES)
          expect(
            (res[1].height > 0 && (res[0].height == 0 || res[0].deliver_tx.code > 0)) ||
              (res[0].height > 0 && (res[1].height == 0 || res[1].deliver_tx.code > 0))
          ).to.be.true
          done()
        })
      })
    })
  })
})

const multiTransFund = callback => {
  let nonce = web3.ec.getTransactionCount(A)
  let arr = [nonce, nonce + 1]
  async.map(
    arr,
    (nonce, cb) => {
      let payload = {
        from: A,
        nonce: "0x" + nonce.toString(16),
        transferFrom: B,
        transferTo: C,
        amount: EC1
      }
      logger.debug(payload)
      web3.ec.governance.proposeRecoverFund(payload, cb)
    },
    callback
  )
}

const multiUpdateCandidacy = callback => {
  let nonce = web3.ec.getTransactionCount(A)
  let arr = [nonce, nonce + 1]
  async.map(
    arr,
    (nonce, cb) => {
      let payload = {
        from: A,
        nonce: "0x" + nonce.toString(16)
      }
      logger.debug(payload)
      web3.ec.stake.validator.update(payload, cb)
    },
    callback
  )
}

const multiDeleWithdraw = callback => {
  let nonce = web3.ec.getTransactionCount(B)
  let arr = [nonce, nonce + 1]
  async.map(
    arr,
    (nonce, cb) => {
      let payload = {
        from: B,
        validatorAddress: A,
        amount: EC1,
        nonce: "0x" + nonce.toString(16)
      }
      logger.debug(payload)
      web3.ec.stake.delegator.withdraw(payload, cb)
    },
    callback
  )
}

const multiDeleAccept = (amount, callback) => {
  let nonce = web3.ec.getTransactionCount(B)
  let arr = [nonce, nonce + 1]
  async.map(
    arr,
    (nonce, cb) => {
      let payload = {
        from: B,
        validatorAddress: A,
        amount: amount.toString(10),
        cubeBatch: Globals.CubeBatch,
        sig: Utils.cubeSign(B, nonce),
        nonce: "0x" + nonce.toString(16)
      }
      logger.debug(payload)
      web3.ec.stake.delegator.accept(payload, cb)
    },
    callback
  )
}

const multiDeclareCandidacy = callback => {
  let nonce = web3.ec.getTransactionCount(V)
  let arr = [nonce, nonce + 1]
  async.map(
    arr,
    (nonce, cb) => {
      let pubKey = "r7fTVtIlliUUCfGEHuj4qnHcxB7dfRC1fFUDkSHYIA" + nonce + "="
      let payload = {
        from: V,
        pubKey: pubKey,
        maxAmount: "0x64",
        compRate: "0.2",
        nonce: "0x" + nonce.toString(16)
      }
      logger.debug(payload)
      web3.ec.stake.validator.declare(payload, cb)
    },
    callback
  )
}

var deleAccept = (obj, cb) => {
  let from = obj.from
  let nonce = obj.nonce
  let deleAmount = obj.deleAmount
  let sig = Utils.cubeSign(from, nonce)

  let payload = {
    from: from,
    nonce: "0x" + nonce.toString(16),
    validatorAddress: A,
    amount: deleAmount,
    cubeBatch: Globals.CubeBatch,
    sig: sig
  }
  logger.debug(payload)
  web3.ec.stake.delegator.accept(payload, cb)
}

const multiSetCompRate = callback => {
  let nonce = web3.ec.getTransactionCount(A)
  let arr = [nonce, nonce + 1]
  async.map(
    arr,
    (nonce, cb) => {
      let payload = {
        from: A,
        delegatorAddress: A,
        nonce: "0x" + nonce.toString(16),
        compRate: "0.1"
      }
      logger.debug(payload)
      web3.ec.stake.validator.setCompRate(payload, cb)
    },
    callback
  )
}
