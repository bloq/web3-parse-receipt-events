'use strict'

/* eslint-disable jsdoc/require-property-description */

/**
 * @typedef {object} AbiInput
 * @property {string} name
 * @property {string} type
 * @property {boolean} [indexed]
 */

/**
 * @typedef {object} AbiItem
 * @property {AbiInput[]} inputs
 * @property {string} name
 * @property {string} [signature]
 * @property {"function" | "constructor" | "event" | "fallback"} type
 */

/**
 * @typedef {object} RawLog
 * @property {string} data
 * @property {string[]} topics
 */

/**
 * @typedef {object} EventLog
 * @property {string} event
 * @property {string} address
 * @property {any} returnValues
 * @property {RawLog} [raw]
 */

/* eslint-disable jsdoc/check-types */

/**
 * @typedef {object} TransactionReceipt
 * @property {Object.<string, EventLog>} [events]
 */

/* eslint-enable jsdoc/check-types */
