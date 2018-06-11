/*global document */

module.exports = handle;

function handle(options) {
  var own, over;

  options = Object.assign({
    visibleClass: 'furkot-map-drag-handle-visible',
    offset: [0, 0]
  }, options);

  if (!options.el) {
    options.el = document.createElement('div');
    options.el.className = 'furkot-map-drag-handle';
    document.body.appendChild(options.el);
    own = true;
  }

  options.classElement = options.classElement || options.el;

  function destroy() {
    if (own) {
      options.el.parentNode.removeChild(options.el);
    }
  }

  function show(sh, opt, cl) {
    options.classElement.classList.toggle(opt[cl], sh);
  }

  function position(el, point, offset) {
    if (el && point) {
      el.style.left = point.x + offset[0] + 'px';
      el.style.top = point.y + offset[1] + 'px';
    }
  }

  function move(point, opt) {
    position(options.el, point, opt.offset);
    options.el.style.cursor = 'pointer';
    position(options.prev, point.prev, opt.offset);
    position(options.next, point.next, opt.offset);
  }

  function isBelow(o1, o2) {
    return o1.zindex() <= o2.zindex();
  }

  function mouseenter(opt, event) {
    if (over) {
      if (isBelow(opt, over.opt)) {
        return;
      }
      mouseleave.call(over.obj, over.opt);
    }
    over = {
      obj: this,
      opt: opt
    };
    move(event.featurePoint || event.point, opt);
    show(true, opt, 'visibleClass');
    if (opt.mouseenter) {
      opt.mouseenter.call(this, event);
    }
  }

  function mousemove(opt, event) {
    if (!over || opt !== over.opt) {
      if (over) {
        if (isBelow(opt, over.opt)) {
          return;
        }
        mouseleave.call(over.obj, over.opt);
      }
      mouseenter.call(this, opt, event);
      return;
    }
    move(event.featurePoint || event.point, opt);
    if (opt.mousemove) {
      opt.mousemove.call(this, event);
    }
  }

  function mouseleave(opt) {
    over = undefined;
    show(false, opt, 'visibleClass');
    if (opt.mouseleave) {
      opt.mouseleave.call(this, event);
    }
  }

  function attach(obj, opt) {
    opt = Object.assign(Object.assign({
      zindex: zindex
    }, options), opt || {});
    var handlers = [{
      event: 'mouseenter',
      fn: mouseenter.bind(obj, opt)
    }, {
      event: 'mousemove',
      fn: mousemove.bind(obj, opt)
    }, {
      event: 'mouseleave',
      fn: mouseleave.bind(obj, opt)
    }];
    handlers.forEach(function (h) {
      obj.on(h.event, h.fn);
    });
    return handlers;
  }

  function detach(obj, handlers) {
    handlers.forEach(function (h) {
      obj.off(h.event, h.fn);
    });
  }

  return {
    destroy: destroy,
    attach: attach,
    detach: detach
  };
}

function zindex() {
  return 0;
}