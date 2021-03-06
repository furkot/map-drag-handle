/*global document */

module.exports = handle;

function handle(options) {
  let own, dragged, mouseleaveHandlers = [];

  options = Object.assign({
    visibleClass: 'furkot-map-drag-handle-visible',
    draggingClass: 'furkot-map-drag-handle-dragged',
    markerClass: 'furkot-map-drag-handle-marker',
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
      options.el.remove();
    }
  }

  function reset() {
    mouseleaveHandlers.forEach((fn) => fn({
      type: 'mouseleave'
    }));
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

  function mouseenter(opt, event) {
    if (dragged) {
      return;
    }
    move(event.featurePoint || event.point, opt);
    show(true, opt, 'visibleClass');
    if (opt.mouseenter) {
      opt.mouseenter.call(this, event);
    }
  }

  function mousemove(opt, event) {
    if (dragged) {
      return;
    }
    move(event.featurePoint || event.point, opt);
    show(true, opt, 'visibleClass');
    if (opt.mousemove) {
      opt.mousemove.call(this, event);
    }
  }

  function mouseleave(opt, event) {
    if (dragged) {
      return;
    }
    show(false, opt, 'visibleClass');
    if (opt.mouseleave) {
      opt.mouseleave.call(this, event);
    }
  }

  function createIcon(opt) {
    let { icon } = opt;
    if (!icon) {
      return;
    }
    icon = icon();
    if (icon && icon.url && icon.size) {
      const el = document.createElement('img');
      el.className = 'furkot-map-drag-image';
      options.el.appendChild(el);
      el.src = icon.url;
      el.width = icon.size[0];
      el.height = icon.size[1];
      opt.offset = icon.offset || opt.offset;
      return true;
    }
  }

  function dragstart(opt, event) {
    if (dragged) {
      return;
    }
    mouseenter.call(this, opt, event);
    dragged = true;
    if (!createIcon(opt)) {
      show(true, opt, 'markerClass');
    }
    show(true, opt, 'draggingClass');
    move(event.point, opt);
    if (opt.dragstart) {
      opt.dragstart.call(this, event);
    }
  }

  function drag(opt, event) {
    if (!dragged) {
      return;
    }
    move(event.point, opt);
    if (opt.drag) {
      opt.drag.call(this, event);
    }
  }

  function dragend(opt, event) {
    if (!dragged) {
      return;
    }
    cleanup(opt, event);
    if (opt.dragend) {
      opt.dragend.call(this, event);
    }
  }

  function dragcancel(opt, event) {
    if (!dragged) {
      return;
    }
    cleanup(opt, event);
    if (opt.dragcancel) {
      opt.dragcancel.call(this, event);
    }
  }

  function cleanup(opt, event) {
    dragged = undefined;
    mouseleave.call(this, opt, event);
    show(false, opt, 'draggingClass');
    const el = options.el.querySelector('img.furkot-map-drag-image');
    if (el) {
      el.remove();
    }
    else {
      show(false, opt, 'markerClass');
    }
  }

  function attach(obj, opt) {
    opt = Object.assign({}, options, opt);
    const mouseleaveHandler = mouseleave.bind(obj, opt);
    const handlers = [{
      event: 'mouseenter',
      fn: mouseenter.bind(obj, opt)
    }, {
      event: 'mousemove',
      fn: mousemove.bind(obj, opt)
    }, {
      event: 'mouseleave',
      fn: mouseleaveHandler
    }, {
      event: 'dragstart',
      fn: dragstart.bind(obj, opt)
    }, {
      event: 'drag',
      fn: drag.bind(obj, opt)
    }, {
      event: 'dragend',
      fn: dragend.bind(obj, opt)
    }, {
      event: 'dragcancel',
      fn: dragcancel.bind(obj, opt)
    }];
    handlers.forEach(h => obj.on(h.event, h.fn));
    handlers.mouseleave = mouseleaveHandler;
    mouseleaveHandlers.push(mouseleaveHandler);
    return handlers;
  }

  function detach(obj, handlers) {
    handlers.mouseleave({
      type: 'mouseleave'
    });
    const idx = mouseleaveHandlers.indexOf(handlers.mouseleave);
    if (idx > -1) {
      mouseleaveHandlers.splice(idx, 1);
    }
    handlers.forEach(h => obj.off(h.event, h.fn));
  }

  return {
    destroy,
    reset,
    attach,
    detach
  };
}
