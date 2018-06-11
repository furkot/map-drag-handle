var handle = require('../');

describe('handle', function () {
  before(function () {
    this.jsdom = require('jsdom-global')();
  });

  after(function () {
    this.jsdom();
  });

  it('create element', function () {
    handle();
    document.querySelectorAll('.furkot-map-drag-handle').should.have.property('length', 1);
  });

});
