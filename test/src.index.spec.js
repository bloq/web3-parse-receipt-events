'use strict'

const chai = require('chai')

const fixtures = require('./fixtures.json')
const parseReceiptEvents = require('..')

chai.should()

describe('Parse receipt events', function () {
  it('should parse sendTransaction logs into events', function () {
    const parsedReceipt = parseReceiptEvents(
      fixtures.buyMet.abi,
      fixtures.buyMet.address,
      fixtures.buyMet.receipt
    )
    parsedReceipt.events.should.have
      .property('LogAuctionFundsIn')
      .that.deep.equals(fixtures.buyMet.parsedEvent)
  })

  it('should parse unidentified events in contract call', function () {
    const parsedReceipt = parseReceiptEvents(
      fixtures.exportMet.abi,
      fixtures.exportMet.address,
      fixtures.exportMet.receipt
    )
    parsedReceipt.events.should.not.have.property('0')
    parsedReceipt.events.should.have
      .property('LogExportReceipt')
      .that.deep.equals(fixtures.exportMet.parsedEvent)
  })
})
