// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({11:[function(require,module,exports) {
const t=6378137;exports.geoToXyz=function({lat:n,lon:r,altitude:o}){var e=Math.cos(n*Math.PI/180),u=Math.sin(n*Math.PI/180),i=Math.cos(r*Math.PI/180),a=Math.sin(r*Math.PI/180),c=t,s=1/Math.sqrt(e*e+.9933056200196506*u*u);return{x:(c*s+o)*e*i,y:(c*s+o)*e*a,z:(c*(.9933056200196506*s)+o)*u}},exports.parseLatLonAltitude=function(t){const n=t.split(",");if(3!==n.length)throw new Error("Invalid LatLonAltitude string: "+t);return{lat:+n[0],lon:+n[1],altitude:+n[2]}},exports.getDescentVec=function(n,r,e){const c=a(i(n,y(0,0,t))),s=a(n),x=i(s,c),z=r*Math.PI/180,f=Math.cos(z),h=Math.sin(z),M=a(o(u(x,-f),u(c,-h)));return a(o(u(s,Math.tan(e*Math.PI/180)),M))};function n({x:t,y:n,z:r},{x:o,y:e,z:u}){return t*o+n*e+r*u}function r({x:t,y:n,z:r},{x:o,y:e,z:u}){return{x:t-o,y:n-e,z:r-u}}function o({x:t,y:n,z:r},{x:o,y:e,z:u}){return{x:t+o,y:n+e,z:r+u}}function e({x:t,y:n,z:r}){return Math.sqrt(t*t+n*n+r*r)}function u({x:t,y:n,z:r},o){return{x:t*o,y:n*o,z:r*o}}function i({x:t,y:n,z:r},{x:o,y:e,z:u}){return{x:n*u-r*e,y:r*o-t*u,z:t*e-n*o}}function a(t){return u(t,1/e(t))}function c({x:t,y:n,z:r},{x:o,y:e,z:u}){return t===o&&n===e&&r===u}function s(n){return e(n)-t}exports.parseLlaToXyz=function(t){return exports.geoToXyz(exports.parseLatLonAltitude(t))},exports.correctLanding=function(t,e,c){const x=r(t,c),y=r(c,t),z=(a(y),o(u(e,n(e,y)),t));return{goDown:s(c)-s(z),goLeft:n(a(i(c,x)),r(z,c))}};function x(t,n){if(!t)throw new Error(n)}function y(t,n,r){return{x:t,y:n,z:r}}exports.test=function(){x(1===e(y(0,1,0))),x(1===e(y(1,0,0))),x(1===e(y(0,0,1))),x(1.7320508075688772===e(y(1,1,1))),x(c(a(y(6,0,0)),y(1,0,0))),x(0===n(y(1,0,0),y(0,1,0))),x(c(i(y(1,0,0),y(0,1,0)),y(0,0,1)))};
},{}],12:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const t=exports.exampleRishon={llaText:"31.96750000, 34.75361111, 21",azimuth:359.84,descentAngle:3,tests:{notBad:"31.979500, 34.75391111, 89",tooLow:"31.979500, 34.75391111, 21",tooHigh:"31.979500, 34.75391111, 2100",turnLeft:"31.979500, 34.74891111, 89",turnRight:"31.979500, 34.75991111, 89",farther:"31.993439, 34.75526400, 161"}},e=exports.exampleTlv={llaText:"32.000169,34.893603,40",azimuth:121.7,descentAngle:3,tests:{notBad:"31.980072, 34.932144, 264.7",tooLow:"31.980072, 34.932144, 64.7",tooHigh:"31.980072, 34.932144, 464.7",turnLeft:"32.010072, 34.932144, 264.7",turnRight:"31.950072, 34.932144, 264.7"}};
},{}],7:[function(require,module,exports) {
var t,e,n=require("./geo"),o=require("./test-data"),i=null,a=!1;function l(e){var n=t.innerHTML;t.innerHTML="<p>"+e+"</p>"+n}function u(){var t={};return location.search.substr(1).split("&").forEach(function(e){var n=e.split("=");t[n[0]]=decodeURIComponent(n[1])}),t}function r(t,n){e.style.top=n+"%",e.style.left=t+"%"}function c(t,e,n){return e<t?t:e>n?n:e}function s(t){var e={lat:t.coords.latitude,lon:t.coords.longitude,altitude:t.coords.altitude},o=n.geoToXyz(e),a=n.geoToXyz({lat:i.lat,lon:i.lon,altitude:i.altitude}),u=n.getDescentVec(a,i.azimuth,i.descentAngle),s=n.correctLanding(a,u,o);l(JSON.stringify(e,null,4)),l(JSON.stringify(s,null,4));var d=c(-500,s.goLeft,500),g=c(-500,s.goDown,500);r(Math.floor(-d/10)+50,Math.floor(g/10)+50)}function d(t){output.innerHTML="Unable to retrieve your location",showAlert("Geo error - "+t.code+" - "+t.message)}function g(){t=document.getElementById("log")}function m(){if(!a)if(a=!0,navigator.geolocation)if(i){l(JSON.stringify(i,null,4)),l("Locating...123");navigator.geolocation.watchPosition(s,d,{enableHighAccuracy:!1,timeout:1e4,maximumAge:5e3})}else l("Define a landing strip first");else l("Geolocation is not supported by your browser")}function f(t){return{coords:{longitude:t.lon,latitude:t.lat,altitude:t.altitude}}}function p(t){const e=n.parseLlaToXyz(t.llaText);n.getDescentVec(e,t.azimuth,t.descentAngle);var o=[t.tests.notBad,t.tests.tooLow,t.tests.tooHigh,t.tests.turnLeft,t.tests.turnRight],i=0;function a(){i>=o.length||(s(f(n.parseLatLonAltitude(o[i]))),i+=1,setTimeout(a,1e3))}a()}function y(){(i=n.parseLatLonAltitude(o.exampleRishon.llaText)).azimuth=o.exampleRishon.azimuth,i.descentAngle=o.exampleRishon.descentAngle,p(o.exampleRishon)}function h(){document.getElementById("start-button").onclick=m,document.getElementById("test-button").onclick=y,e=document.getElementById("runway-icon")}function L(){g(),h();var t=u(),e=document.getElementById("parameters"),n=t.q||"";if(e.value=n,n){var o=n.split(",");i={lat:o[0],lon:o[1],altitude:o[2],azimuth:o[3],descentAngle:o[4]}}}"complete"===document.readyState||"loading"!==document.readyState?L():document.addEventListener("DOMContentLoaded",L);
},{"./geo":11,"./test-data":12}]},{},[7])