var brotli = require('brotli');
const fs = require('fs');

fs.writeFileSync(
  'redive_jp.db',
  brotli.decompress(fs.readFileSync('./redive_jp.db.br'))
);
