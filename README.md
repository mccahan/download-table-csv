# download-table-csv

Downloads websites and outputs a table as a CSV.

## Installation

`npm install -g get-table-csv`

## Usage

`get-table-csv <url> <selector>`

Options:
- `-c` to require the rows to have the same number of columns as the first row. Helps strip out extra rows, e.g. footnotes at the end.

## Example

Download the [Local Area Unemployment Statistics](https://www.bls.gov/web/metro/laummtrk.htm) figures by MSA from the U.S. Bureau of Labor Statistics

`get-table-csv https://www.bls.gov/web/metro/laummtrk.htm '#laummtrk' -c`
