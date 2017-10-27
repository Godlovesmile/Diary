// mini SVG library
// last modified: 1 August 2015 by ge1doot

var ge1doot = ge1doot || {};

ge1doot.SVGLib = function (o, antialias) {

  "use strict";

  var __SVG = false;
  var __svgNS = false;

  if (document.createElementNS) {

    var __svgNS = "http://www.w3.org/2000/svg";
    var __svg = document.createElementNS(__svgNS, "svg");
    var __SVG = (__svg.x != null);

  } else return false;

  this.screen = document.createElementNS(__svgNS, "svg");
  this.screen.style.position = "absolute";
  this.screen.style.width = this.screen.style.height = "100%";

  o.appendChild(this.screen);

  this.createLine = function (w, options) {

    var o = document.createElementNS(__svgNS, "line");
    o.setAttribute("shape-rendering", antialias ? "auto" : "optimizeSpeed");
    o.setAttribute("stroke-width", Math.round(w) + "px");
    if (options.color) o.setAttribute("stroke", options.color);
    if (options.linecap) o.setAttribute("stroke-linecap", options.linecap);
    if (options.dasharray) o.setAttribute("stroke-dasharray", options.dasharray);


    o.move = function (x1, y1, x2, y2) {

      this.setAttribute("x1", x1);
      this.setAttribute("y1", y1);
      this.setAttribute("x2", x2);
      this.setAttribute("y2", y2);

    }

    o.color = function (c) { this.setAttribute("stroke", c); }
    o.RGBcolor = function (R, G, B) { this.setAttribute("stroke", "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")"); }
    o.strokeWidth = function (s) { this.setAttribute("stroke-width", Math.round(s) + "px"); }
    this.screen.appendChild(o);

    return o;

  }

  this.createText = function (text, font, size, col) {

    var o = document.createElementNS(__svgNS, "text");
    o.setAttribute("shape-rendering", antialias ? "auto" : "optimizeSpeed");
    o.textContent = text;

    if (col) o.setAttribute("fill", col);
    if (size) o.setAttribute("font-size", size);
    if (font) o.setAttribute("font-family", font);

    o.move = function (x, y) {

      this.setAttribute("x", x);
      this.setAttribute("y", y);

    }

    o.fillColor = function (c) { this.setAttribute("fill", c); }
    o.fontSize = function (c) { this.setAttribute("font-size", c); }
    o.fontWeight = function (c) { this.setAttribute("font-weight", c); }

    this.screen.appendChild(o);

    return o;

  }

  this.createOval = function (diam, filled) {

    var o = document.createElementNS(__svgNS, "circle");
    o.setAttribute("shape-rendering", antialias ? "auto" : "optimizeSpeed");
    o.setAttribute("stroke-width", 0);
    o.setAttribute("r", Math.round(diam / 2));
    o.style.cursor = "pointer";

    o.move = function (x1, y1, radius) {

      this.setAttribute("cx", x1);
      this.setAttribute("cy", y1);
      this.setAttribute("r", radius);

    }

    o.strokeColor = function (col) { this.setAttribute("stroke", col); }
    o.fillColor = function (col) { this.setAttribute("fill", col); }
    o.strokeWidth = function (sw) { this.setAttribute("stroke-width", sw); }
    this.screen.appendChild(o);

    return o;
  }
}