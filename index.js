#!/usr/bin/env node

const { program } = require('commander')
const axios = require('axios').default
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const { format } = require('@fast-csv/format')
const { stripHtml } = require('string-strip-html')

program
  .name('download-table-csv')
  .argument('<url>', 'remote URL to download')
  .argument('<selector>', 'CSS selector for table')
  .option('-c, --require-head-columns', 'require rows to have the same number of columns as the header')
  .option('-h, --header-row <header>', 'replace header row with custom text')

program.parse()
const options = program.opts()

const stream = format()
stream.pipe(process.stdout)

let headerRowCount = 0

axios.get(program.args[0])
  .then((r) => {
    const dom = new JSDOM(r.data)

    const table = dom.window.document.querySelector(program.args[1])

    if (!table) {
      console.error("Could not find selector")
      exit(-1)
    }

    for (const row of table.rows) {
      let values = []

      // If we're on the first row...
      if (headerRowCount == 0) {
        // Save the column count for the "-c" option
        headerRowCount = row.cells.length

        if (options.headerRow) {
          process.stdout.write(options.headerRow + "\n")
          continue
        }
      }

      for (const cell of row.cells) {
        const string = stripHtml(cell.innerHTML).result
        if (string.length > 0) values.push(string)
      }

      if (options.requireHeadColumns)
        if (values.length !== headerRowCount) continue

      stream.write(values)
    }
  })
