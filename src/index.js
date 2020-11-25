'use strict'

require('./typedefs')
/* global AbiItem, TransactionReceipt */

const debug = require('debug')('web3-parse-receipt-events')
const web3EthAbi = require('web3-eth-abi')
const web3Utils = require('web3-utils')

/**
 * Parse receipt events of the given contract.
 *
 * Web3 only parses the events of the contract that is returning the receipt. If
 * there are additional events logged by other contracts that were called during
 * the execution of the transaction, those will not be parsed automatically. For
 * those cases, additional parsing effort is required.
 *
 * @param {AbiItem[]} abi The ABI of the contract.
 * @param {string} address The address of the contract.
 * @param {TransactionReceipt} receipt The receipt to parse.
 * @returns {TransactionReceipt} The patched receipt.
 */
function parseReceiptEvents(abi, address, receipt) {
  const events = []

  if (receipt.logs) {
    debug('Parsing logs into events')

    receipt.events = {}

    receipt.logs.forEach(function (log) {
      log.returnValues = {}
      log.signature = null
      log.raw = {
        data: log.data,
        topics: log.topics
      }
      delete log.data
      delete log.topics

      const eventNumber = log.logIndex
      receipt.events[eventNumber] = log
    })

    debug('Parsed %s logs', receipt.logs.length)
    delete receipt.logs
  }

  debug('Parsing contract events')
  Object.keys(receipt.events).forEach(function (n) {
    const event = receipt.events[n]

    if (web3Utils.toChecksumAddress(event.address) 
        !== web3Utils.toChecksumAddress(address) || event.signature) {
      return
    }

    const descriptor = abi
      .filter(desc => desc.type === 'event')
      .map(desc => ({
        ...desc,
        signature: desc.signature || web3EthAbi.encodeEventSignature(desc)
      }))
      .find(desc => desc.signature === event.raw.topics[0])

    event.event = descriptor.name
    event.signature = descriptor.signature
    event.returnValues = web3EthAbi.decodeLog(
      descriptor.inputs,
      event.raw.data,
      event.raw.topics.slice(1)
    )
    events.push(event)

    debug('Decoded %s', event.event)

    delete event.returnValues.__length__
    delete receipt.events[n]
  })

  debug('Repopulating the events map')
  let count = 0
  events.forEach(function (ev) {
    if (ev.event) {
      if (receipt.events[ev.event]) {
        if (Array.isArray(receipt.events[ev.event])) {
          receipt.events[ev.event].push(ev)
        } else {
          receipt.events[ev.event] = [receipt.events[ev.event], ev]
        }
      } else {
        receipt.events[ev.event] = ev
      }
    } else {
      receipt.events[count] = ev
      count++
    }
  })

  return receipt
}

module.exports = parseReceiptEvents
