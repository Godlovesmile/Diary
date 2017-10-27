! function () {

  "use strict";

  var setup = {

    id: "tree",
    friction: 2,
    length: 300,
    // 代际节点尺寸倍率
    reduction: 1.234,
    // 节点尺寸
    dotSize: 10,
    rotationSpeed: 0.0005,
    // 尚未被点击的节点的背景颜色
    collapsedNodeColor: "rgba(255,255,255,.8)",
    // 默认节点背景颜色
    defaultNodeColor: "rgba(0,255,255,.8)",
    expandedNodeColor: "#666",
    // 连线颜色 尺寸
    line: { color: "#0ff", dasharray: "5,10" },
    // 节点描边
    defaultNodeStrokeColor: "#777",
    overNodeColor: "#F5436A",
    defaultTextColor: "#fff",
    selectedTextColor: "#000",
    textFont: "MicroSoft YaHei, Abel, tempus sans itc, cursive, Helvetica, sans-serif"

  }

  // ==== node constructor ====

  var Node = function (parent, label, col, link) {

    this.link = link;
    this.col = col;
    this.pR = 0;
    this.len = 0;
    this.lex = 0;
    this.angle = 0;
    this.expanded = false;
    this.children = [];
    this.parent = parent;
    this.visible = false;
    this.x = 0;
    this.y = 0;
    this.ini = {
      len: 0,
      lex: 0,
      angle: 0,
      parent: parent
    }

    if (parent != "") {

      // push child 

      parent.children.push(this);

      // calculate lengths & angles

      var a = (2 * Math.PI) / parent.children.length;
      var b = (parent != "") ? Math.random() : 0;

      for (var i in parent.children) {

        var c = parent.children[i];
        c.angle = c.ini.angle = Math.PI / 2 + a * i + b;
        c.len = c.ini.len = c.parent.ini.len / setup.reduction;

      }

    } else {

      // root

      this.visible = true;
      this.ini.len = setup.length * setup.reduction;

    }

    // create line & text elements 

    this.line = svg.createLine(2, setup.line);
    this.text = svg.createText(label, setup.textFont, false, setup.defaultTextColor);

  }

  // create plot (separately > z-index)

  Node.prototype.createPlot = function () {

    this.pR = Math.round(Math.max(5, setup.dotSize * this.ini.len / 200));
    this.plot = svg.createOval(this.pR * 2, true);
    this.plot.strokeColor(setup.defaultNodeStrokeColor);
    this.plot.strokeWidth(1);
    this.plot.obj = this;

    // font size
    this.text.fontSize(8 + this.pR);

  }

  // main animation 

  Node.prototype.run = function () {

    if (this.visible) {

      // parent coordinates

      var xp = this.parent ? this.parent.x : drag.x;
      var yp = this.parent ? this.parent.y : drag.y;

      // trigo

      var a = Math.atan2(
        (this.y + Math.sin(this.angle + rotation) * setup.friction) - yp,
        (this.x + Math.cos(this.angle + rotation) * setup.friction) - xp
      );

      if (this.lex < this.len) this.lex += (this.len - this.lex) * .1;
      this.x = xp + Math.cos(a) * this.lex;
      this.y = yp + Math.sin(a) * this.lex;

      // screen limits 

      if (this.x < this.pR) this.x = this.pR;
      else if (this.x > screen.width - this.pR) this.x = screen.width - this.pR;

      if (this.y < this.pR) this.y = this.pR;
      else if (this.y > screen.height - this.pR) this.y = screen.height - this.pR;

      // move elements

      this.line.move(this.x, this.y, xp, yp);
      this.plot.move(this.x, this.y, this.pR);
      this.text.move(this.x + this.pR + 5, this.y + this.pR * 0.25);

    }

  }

  // collapse node

  Node.prototype.collapse = function () {

    this.expanded = false;
    this.text.fillColor(this.parent && this.parent.children.length == 1 ? setup.selectedTextColor : setup.defaultTextColor);
    this.text.fontWeight(this.parent && this.parent.children.length == 1 ? "bold" : "normal");
    this.plot.fillColor((this.children.length) ? setup.collapsedNodeColor : this.col);

    for (var i = 0; i < this.children.length; i++) {

      var c = this.children[i];
      c.visible = false;
      c.lex = 0;
      c.line.move(-1, -1, -1, -2);
      c.plot.move(-1000, -1, 0);
      c.text.move(-1000, 0);
      c.expanded = false;
      c.collapse();

    }

  }

  // expand node

  Node.prototype.expand = function () {

    // close all other branches

    if (this.ini.parent != "") {

      for (var i = 0; i < this.ini.parent.children.length; i++) {

        this.ini.parent.children[i].collapse();

      }

    }

    // expand 

    this.expanded = true;
    this.text.fillColor(setup.selectedTextColor);
    this.text.fontWeight("bold");
    this.plot.fillColor(setup.expandedNodeColor);

    for (var i = 0; i < this.children.length; i++) {

      this.children[i].visible = true;
      this.children[i].lex = 0;

    }
  }

  // down 

  Node.prototype.down = function () {

    if (pointer.isDraging) return;

    // offset mouse 

    drag.ox = pointer.x - this.x;
    drag.oy = pointer.y - this.y;

    //  change root 

    if (drag.node != this) {

      // expanded color 

      this.text.fillColor(setup.selectedTextColor);
      this.plot.fillColor(setup.expandedNodeColor);

      // reset 

      var i = 0, node;
      while (node = nodes[i++]) {

        node.parent = node.ini.parent;
        node.len = node.ini.len;
        node.lex = node.ini.len;
        node.angle = node.ini.angle;

      }

      // search root path 

      var oc = [];
      var ow = this;
      oc.push(ow);

      while (ow.parent != "") {

        ow = ow.parent;
        oc.push(ow);

      }

      // inverse vectors 

      for (var i = 1; i < oc.length; i++) {

        oc[i].lex = oc[i - 1].ini.len;
        oc[i].len = oc[i - 1].ini.len;
        oc[i].angle = oc[i - 1].ini.angle - Math.PI;
        oc[i].parent = oc[i - 1];

      }

      // switch root 

      this.parent = "";
      this.len = 0;
      this.lex = 0;
      this.angle = 0;
      drag.node.plot.strokeColor(setup.defaultNodeStrokeColor);
      drag.node.plot.strokeWidth(1);
      drag.node = this;

    }

  }

  // main loop

  var run = function () {

    requestAnimationFrame(run);

    if (drag.ing) {

      drag.x = pointer.x - drag.ox,
        drag.y = pointer.y - drag.oy;

    }

    rotation += setup.rotationSpeed;

    var i = 0, node;

    while (node = nodes[i++]) {

      node.run();

    }


  }

  // parse menu

  var setMenuTree = function (theNode, parent) {

    if (theNode.tagName == "Q" || theNode.tagName == "A") {

      // Node Label 

      var s = theNode.innerHTML;
      var d = s.toUpperCase().indexOf("<Q");
      if (d > 0) s = s.substring(0, d);
      d = s.toUpperCase().indexOf("<A");
      if (d > 0) s = s.substring(0, d);

      // create Node 

      if (theNode.style.color != "") setup.defaultNodeColor = theNode.style.color;
      parent = new Node(parent, s, setup.defaultNodeColor, theNode.href);

      //  push Node 

      nodes.push(parent);

    }

    // recursive call 

    for (var i = 0; i < theNode.childNodes.length; i++) {

      setMenuTree(theNode.childNodes[i], parent);

    }
  }


  // initializations

  var screen = ge1doot.screen("screen");

  var screen = ge1doot.screen("screen");
  var pointer = screen.pointer;
  var nodes = [],
    drag = {

      x: 0,
      y: 0,
      ox: 0,
      oy: 0,
      node: false,
      ing: false

    },
    rotation = 0,
    nodeOver, setup;


  pointer.down = function (e) {

    if (e && e.target && e.target.obj) {
      drag.ing = true;
      e.target.obj.down();
    }

  }

  pointer.up = function (e) {

    drag.ing = false;

  }

  pointer.tap = function (e) {

    if (e && e.target && e.target.obj) {

      drag.ing = false;

      if (drag.node.link) {

        // open hyperlink

        window.open(drag.node.link, "_blank");

      } else {

        // expand / collapse

        if (drag.node.expanded) drag.node.collapse(); else drag.node.expand();

      }
    }
  }

  pointer.move = function (e) {

    if (e && e.target && e.target.obj) {

      var o = e.target.obj;

      if (nodeOver) {

        nodeOver.plot.strokeColor(setup.defaultNodeStrokeColor);
        nodeOver.plot.strokeWidth(1);

      }
      o.plot.strokeColor(setup.overNodeColor);
      o.plot.strokeWidth(Math.round(Math.max(2, o.pR / 3)));
      nodeOver = o;

    }

  }

  // create SVG container

  var svg = new ge1doot.SVGLib(screen.elem, true);

  if (svg) {

    // init menu 

    setup.length = Math.max(150, screen.height / 2);
    drag.x = screen.width / 2;
    drag.y = screen.height / 2;
    setMenuTree(document.getElementById(setup.id), "");

    // create plots

    var i = 0, node;
    while (node = nodes[i++]) {
      node.createPlot();
    }

    // expand 1st Node

    drag.node = nodes[0];
    nodes[0].collapse();
    nodes[0].expand();

    // start engine 

    run();

  }

}();