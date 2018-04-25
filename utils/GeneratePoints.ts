import * as fs from 'fs';

const numGenes = 1000;

for (let i = 0; i < numGenes; ++i) {
  for (let j = 0; j < numGenes; ++j) {
    fs.appendFileSync('contacts_monomer.csv', `${i},${j},${Math.random()}\n`);
  }
}
