
// src/Env.mjs

import { readFile } from 'node:fs/promises'
import { EOL } from 'node:os'

export default class Env {

  static #privateSymbol = Symbol('privateSymbol')

  static async parse(filename = '.env') {

    const env = new Env(this.#privateSymbol)

    try {

      const file = await readFile(filename, { encoding: 'utf8' })

      file.split(EOL)
          .filter((line) => line.trim() !== '')
          .forEach((line) => {
            let [ key, value ] = line.split('=')
            key = key.trim().toLowerCase()
            value = value.trim()
            env[key] = isNaN(value) ? value : Number(value)
          })

    } catch (error) {
      console.error(`Can't read file ${ filename }:`, error.message)
    }

    return Object.freeze(env)
  }

  constructor(privateSymbol) {
    if (privateSymbol !== Env.#privateSymbol) {
      throw new Error(`Attempt to use private constructor. Use static method(s) instead.`)
    }
  }

}
