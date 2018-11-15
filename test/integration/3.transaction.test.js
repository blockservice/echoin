const expect = require("chai").expect
const Utils = require("./global_hooks")
const Globals = require("./global_vars")

describe("Transaction Test", function() {
  let balance_old = new Array(4),
    balance_new = new Array(4)
  let value = 1000, //wei
    gasLimit = 21000,
    gasPrice,
    gas

  before(function() {
    gasPrice = Globals.Params.gas_price
    gas = web3.toBigNumber(gasPrice).times(gasLimit)
  })

  beforeEach(function() {
    // balance before
    balance_old = Utils.getBalance()
  })

  describe("Free EC TX from A to B to C to D, and then back", function() {
    it("From A to B to C to D", function(done) {
      let arrHash = []
      for (i = 0; i < 3; ++i) {
        let hash = Utils.transfer(
          Globals.Accounts[i],
          Globals.Accounts[i + 1],
          value
        )
        arrHash.push(hash)
      }

      Utils.waitMultiple(arrHash, (err, res) => {
        expect(err).to.be.null
        expect(res.length).to.equal(3)
        expect(res).to.not.include(null)

        // balance after
        balance_new = Utils.getBalance()
        // check balance change
        expect(balance_new[0].minus(balance_old[0]).toNumber()).to.equal(-value)
        expect(balance_new[1].minus(balance_old[1]).toNumber()).to.equal(0)
        expect(balance_new[2].minus(balance_old[2]).toNumber()).to.equal(0)
        expect(balance_new[3].minus(balance_old[3]).toNumber()).to.equal(value)

        done()
      })
    })

    it("From D to C to B to A", function(done) {
      let arrHash = []
      for (i = 0; i < 3; ++i) {
        let hash = Utils.transfer(
          Globals.Accounts[3 - i],
          Globals.Accounts[2 - i],
          value
        )
        arrHash.push(hash)
      }

      Utils.waitMultiple(arrHash, (err, res) => {
        expect(err).to.be.null
        expect(res.length).to.equal(3)
        expect(res).to.not.include(null)

        // balance after
        balance_new = Utils.getBalance()
        // check balance change
        expect(balance_new[0].minus(balance_old[0]).toNumber()).to.equal(value)
        expect(balance_new[1].minus(balance_old[1]).toNumber()).to.equal(0)
        expect(balance_new[2].minus(balance_old[2]).toNumber()).to.equal(0)
        expect(balance_new[3].minus(balance_old[3]).toNumber()).to.equal(-value)

        done()
      })
    })
  })

  describe("Fee EC TX from A to B to C to D, and then back", function() {
    it("From A to B to C to D", function(done) {
      let arrHash = []
      for (i = 0; i < 3; ++i) {
        let hash = Utils.transfer(
          Globals.Accounts[i],
          Globals.Accounts[i + 1],
          value,
          gasPrice
        )
        arrHash.push(hash)
      }

      Utils.waitMultiple(arrHash, (err, res) => {
        expect(err).to.be.null
        expect(res.length).to.equal(3)
        expect(res).to.not.include(null)

        // balance after
        balance_new = Utils.getBalance()
        // check balance change
        expect(balance_new[0].minus(balance_old[0]).toNumber()).to.equal(
          -gas.plus(value).toNumber()
        )
        expect(balance_new[1].minus(balance_old[1]).toNumber()).to.equal(
          -gas.toNumber()
        )
        expect(balance_new[2].minus(balance_old[2]).toNumber()).to.equal(
          -gas.toNumber()
        )
        expect(balance_new[3].minus(balance_old[3]).toNumber()).to.equal(value)

        done()
      })
    })

    it("From D to C to B to A", function(done) {
      let arrHash = []
      for (i = 0; i < 3; ++i) {
        let hash = Utils.transfer(
          Globals.Accounts[3 - i],
          Globals.Accounts[2 - i],
          value,
          gasPrice
        )
        arrHash.push(hash)
      }

      Utils.waitMultiple(arrHash, (err, res) => {
        expect(err).to.be.null
        expect(res.length).to.equal(3)
        expect(res).to.not.include(null)

        // balance after
        balance_new = Utils.getBalance()
        // check balance change
        expect(balance_new[0].minus(balance_old[0]).toNumber()).to.equal(value)
        expect(balance_new[1].minus(balance_old[1]).toNumber()).to.equal(
          -gas.toNumber()
        )
        expect(balance_new[2].minus(balance_old[2]).toNumber()).to.equal(
          -gas.toNumber()
        )
        expect(balance_new[3].minus(balance_old[3]).toNumber()).to.equal(
          -gas.plus(value).toNumber()
        )

        done()
      })
    })
  })

  describe("Send free EC TX from A to B 3 times within 10s", function() {
    it("expect only the first one will succeed", function(done) {
      let arrHash = [],
        times = 3
      for (i = 0; i < times; ++i) {
        let hash = Utils.transfer(
          Globals.Accounts[0],
          Globals.Accounts[1],
          value,
          0
        )
        arrHash.push(hash)
      }
      // 2nd and 3rd will fail
      expect(arrHash[1]).to.be.null
      expect(arrHash[2]).to.be.null

      Utils.waitMultiple(arrHash, (err, res) => {
        // 1st one will succeed
        expect(res.length).to.eq(1)
        expect(res[0]).to.not.be.null
        expect(res[0].blockNumber).to.be.gt(0)

        // balance after
        balance_new = Utils.getBalance()
        // check balance change
        expect(balance_new[0].minus(balance_old[0]).toNumber()).to.equal(-value)

        done()
      })
    })
  })

  describe("Send fee EC TX from A to B 3 times within 10s", function() {
    it("expect all to succeed", function(done) {
      let arrHash = [],
        times = 3
      for (i = 0; i < times; ++i) {
        let hash = Utils.transfer(
          Globals.Accounts[0],
          Globals.Accounts[1],
          value,
          gasPrice
        )
        arrHash.push(hash)
      }

      Utils.waitMultiple(arrHash, (err, res) => {
        // all success
        expect(err).to.be.null
        expect(res.length).to.equal(3)
        expect(res).to.not.include(null)

        // balance after
        balance_new = Utils.getBalance()
        // check balance change
        expect(balance_new[0].minus(balance_old[0]).toNumber()).to.equal(
          -gas
            .plus(value)
            .times(times)
            .toNumber()
        )
        expect(balance_new[1].minus(balance_old[1]).toNumber()).to.equal(
          value * times
        )

        done()
      })
    })
  })
})
