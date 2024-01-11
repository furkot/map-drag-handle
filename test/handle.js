var { describe, it, after, before } = require('node:test');
var should = require('should');

var handle = require('../');

describe('handle', function () {
  before(function () {
    this.jsdom = require('jsdom-global')();
  });

  after(function () {
    this.jsdom();
  });

  it('create element', function () {
    var h = handle();
    document.querySelectorAll('.furkot-map-drag-handle').should.have.property('length', 1);
    h.destroy();
    document.querySelectorAll('.furkot-map-drag-handle').should.have.property('length', 0);
  });

  it('use element', function () {
    document.body.innerHTML = '<div id="test">';
    var h = handle({
      el: document.getElementById('test')
    });
    document.querySelectorAll('.furkot-map-drag-handle').should.have.property('length', 0);
    h.destroy();
    document.querySelectorAll('.furkot-map-drag-handle').should.have.property('length', 0);
    should.exist(document.getElementById('test'));
  });

  it('attach element', function () {
    document.body.innerHTML = '<div id="test">';
    var el = document.getElementById('test'), h = handle({
      el: el,
      visibleClass: 'element-visible'
    });
    var handlers = {};
    h.attach({
      on: function (event, handler) {
        handlers[event] = handler;
      }
    });
    handlers.mouseenter({
      point: {
        x: 0,
        y: 0
      }
    });
    el.className.should.equal('element-visible');

    handlers.mouseleave({});
    el.className.should.equal('');
  });

});
