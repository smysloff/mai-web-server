
// file: src/utils.mjs

const { isArray } = Array

/**
 * Checks if the provided data is an array.
 * @param {*} data - The data to check.
 * @returns {boolean} True if data is an array, false otherwise.
 */
export { isArray }

/**
 * Checks if the provided data is a function.
 * @param {*} data - The data to check.
 * @returns {boolean} True if data is a function, false otherwise.
 */
export function isFunction(data) {
  return typeof data === 'function'
}

/**
 * Checks if the provided data is a Promise.
 * @param {*} data - The data to check.
 * @returns {boolean} True if data is a Promise, false otherwise.
 */
export function isPromise(data) {
  return data instanceof Promise
}

/**
 * Checks if the provided data is a string.
 * @param {*} data - The data to check.
 * @returns {boolean} True if data is a string or String object, false otherwise.
 */
export function isString(data) {
  return typeof data === 'string'
      || data instanceof String
}

/**
 * Checks if the provided data is a string.
 * @param {*} data - The data to check.
 * @returns {boolean} True if data is a string or String object, false otherwise.
 */
export function getReadableIP(ip) {
  return ip?.startsWith('::ffff:')
    ? ip.substring(7)
    : ip
}

/**
 * Constructs a URL from host, path, and protocol.
 * @param {string} host - The hostname or host:port combination.
 * @param {string} path - The path portion of the URL.
 * @param {boolean} [isSecure=false] - Whether to use HTTPS protocol.
 * @returns {URL} The constructed URL object.
 */
export function getURL(host, path, isSecure = false) {
  const protocol = isSecure ? 'https' : 'http'
  const hostname = `${ protocol }://${ host }`
  return new URL(path, hostname)
}

/**
 * Pads a number with leading zeros to achieve the specified size.
 * @param {number|string} num - The number to pad.
 * @param {number} size - The desired total length of the string.
 * @returns {string} The padded string.
 */
export function padZeros(num, size) {
  return num.toString().padStart(size, '0')
}

/**
 * Formats a date into a string according to the specified pattern.
 *
 * Supported placeholders in the format string:
 * - %y — full year (e.g., 2025)
 * - %m — month with leading zero (01–12)
 * - %d — day of the month with leading zero (01–31)
 * - %h — hours with leading zero (00–23)
 * - %i — minutes with leading zero (00–59)
 * - %s — seconds with leading zero (00–59)
 *
 * @param {Date|string} [date=new Date()] Date object or format string (if using current date)
 * @param {string} [fmt='%y-%m-%d %h:%i:%s'] Output date format (used when first arg is Date)
 * @throws {TypeError} If the arguments are of incorrect types.
 * @throws {Error} If the provided date is invalid.
 * @returns {string} Formatted date string.
 */
export function getDateTime(date = new Date(), fmt = '%y-%m-%d %h:%i:%s') {

  if (!(date instanceof Date || isString(date))) {
    throw new TypeError(`The first argument of 'getDateTime' must be an instance of Date or a date-formatted string. Received type: ${ typeof date }.`)
  }

  if (!isString(fmt)) {
    throw new TypeError(`The second argument of 'getDateTime' must be a date-formatted string. Received type: ${ typeof fmt }.`)
  }

  if (isString(date)) {
    fmt = date
    date = new Date()
  }

  if (isNaN(date.getTime())) {
    throw new Error(`The provided date is invalid.`)
  }

  const y = date.getFullYear().toString()
  const m = padZeros(date.getMonth() + 1, 2)
  const d = padZeros(date.getDate(), 2)
  const h = padZeros(date.getHours(), 2)
  const i = padZeros(date.getMinutes(), 2)
  const s = padZeros(date.getSeconds(), 2)

  return fmt
    .replaceAll('%y', y)
    .replaceAll('%m', m)
    .replaceAll('%d', d)
    .replaceAll('%h', h)
    .replaceAll('%i', i)
    .replaceAll('%s', s)
}

export function throwTypeError(where, needle, passed) {

  if (typeof where !=== 'string') {
    throwTypeError('throwTypeError', 'string', typeof where)
  }

  if (typeof needle !== 'string') {
    throwTypeError('throwTypeError', 'string', typeof needle)
  }

  if (typeof passed !== 'string') {
    throwTypeError('throwTypeError', 'string', typeof passed)
  }

  throw new TypeError(`${ where } must be a type of ${ needle }, but passed ${ passed }`)

}
