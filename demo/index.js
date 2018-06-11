/* global mapboxgl */

mapboxgl.accessToken = 'pk.eyJ1IjoibWVsaXRlbGUiLCJhIjoiY2oxZ3BlcmZtMDAzNzJxb2hicndlOTU0eSJ9.6WFMFozvFpKUJA6bhLeiSA';

function bounds(points) {
  return points.reduce(function(points, pt) {
    var i;
    for (i = 0; i < 2; i++) {
      if(pt[i] < points[0][i]) {
        points[0][i] = pt[i];
      } else if (pt[i] > points[1][i]) {
        points[1][i] = pt[i];
      }
    }
    return points;
  }, [points[0].slice(), points[0].slice()]);
}

var maps = require('maps-facade').init({
  service: 'mapbox'
}, function () {

  var dataEl = document.querySelector('#data');
  var points = JSON.parse(dataEl.getAttribute('data-markers'));
  var bnds = bounds(points);
  var path = dataEl.getAttribute('data-polyline');

  function createHandle() {
    var h = document.createElement('div');
    h.className = 'drag-handle-other';
    document.body.appendChild(h);
    return h;
  }

  function dragstart() {
    var obj = this;
    if (obj.hideWhenDragging) {
      obj.option('visible', false);
    }
  }

  function dragend(event) {
    var obj = this;
    obj.option('visible', true);
    obj.position(event.ll);
  }

  var handle = require('..')({
    classElement: document.body,
    offset: [10, 10],
    prev: createHandle(),
    next: createHandle(),
    dragstart: dragstart
  });

  var map = maps.map(document.querySelector('.demo .map'), {
    style: 'mapbox://styles/mapbox/streets-v9',
    zoomControl: true,
    zoomControlOptions: { position: 'RB' },
    onReady: function () {
      var poly = maps.polyline({
        map: map,
        color: '#a21bab',
        path: path,
        draggable: true
      });
      handle.attach(poly, {
        visibleClass: 'drag-handle-on-polyline',
        draggingClass: 'dragging-polyline',
        zindex: function () {
          return poly.zindex() + (poly.zindexLevel || 0);
        }
      });
      [{
        url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIzMCI+PHBhdGggZD0iTTAgMEgyNlYyNkgxNkwxMyAzMEwxMCAyNkgwWiIgZmlsbD0iI2Y4MDAxMiIvPjxwYXRoIGQ9Ik0yIDJIMjRWMjRIMloiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjEuOCAxMC40TDcuNSA2LjZWNC40SDYuNFYxOS44SDQuMlYyMkg5LjdWMTkuOEg3LjVWMTQuM1oiIGZpbGw9IiNmODAwMTIiLz48L3N2Zz4=',
        size: [26, 30]
      }, {
        fillColor: 'violet',
        fillOpacity: 1,
        label: 'A',
        scale: 2
      }, {
        strokeColor: 'blue',
        strokeWeight: 3,
        scale: 5
      }, {
        fillColor: 'white',
        fillOpacity: 0.5,
        strokeColor: '#0074D9',
        strokeWeight: 1,
        path: 'M 2 0 L 2 0.28125 L 2 13.6875 L 2 14 L 0.59375 14 L 0 14 L 0 14.59375 L 0 15.375 L 0 16 ' +
          'L 0.59375 16 L 4.40625 16 L 5 16 L 5 15.375 L 5 14.59375 L 5 14 L 4.40625 14 L 3 14 L 3 13.6875 ' +
          'L 3 9 L 16 5.5 L 3 2 L 3 0.28125 L 3 0 L 2.6875 0 L 2.3125 0 L 2 0 z',
        rotation: -15,
        scale: 2,
        anchor: [1, 16]
      }].map(function (icon, i) {
        var mk = maps.marker({
          map: map,
          icon: icon,
          label: icon.label,
          position: points[i],
          clickable: true,
          draggable: true
        });
        mk.hideWhenDragging = true;
        handle.attach(mk, {
          visibleClass: 'drag-handle-on-marker',
          draggingClass: 'dragging-marker',
          markerClass: 'dragging-circle',
          icon: mk.icon() && mk.icon,
          zindex: function () {
            return mk.zindex() + (mk.zindexLevel || 0);
          },
          dragend: dragend
        });
      });
    }
  });
  map.fitBounds(bnds);
});
