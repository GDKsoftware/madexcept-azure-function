const { assert } = require('chai');
const fs = require('fs-extra');
const { describe, it } = require('mocha');

const { BugreportParser } = require('../bugreport-parser');

describe('Parser test', () => {
  it('can parse datetime', () => {
    const parser = new BugreportParser();

    assert.equal('2021-10-20 07:57:39.195',
      parser.fixDateTimeString('2021-10-20, 07:57:39, 195ms'));

    assert.equal('2021-07-22 09:01',
      parser.fixDateTimeString('2021-07-22 09:01'));
  });

  it('can parse bugreport', async () => {
    const parser = new BugreportParser();

    const buffer = await fs.readFile('resources/bugreport.txt');
    parser.parsefromString(buffer.toString('utf-8'));

    const info = parser.getLokiInfo();

    assert.deepEqual(info,
      {
        job: 'madexcept',
        message: 'Hello, World.',
        labels: {
          executable: 'project2.exe',
          exception_class: 'CustomException',
        },
      });
  });
});
