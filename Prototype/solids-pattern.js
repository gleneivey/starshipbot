window.solids = {};

(function () {
  var solids = window.solids;
  solids.getAStarship = function (material) {
    var solidClass = solidClasses[Math.floor(Math.random() * solidClasses.length)];
    return new solidClass(material);
  };


      //////// Cylinder
  var cylinderMaxExtent = 100;
  var Cylinder = function (material) {
    var min = 0.5;
    var max = Math.random() * (cylinderMaxExtent/4);
    this.radius = min + (Math.random() * (max-min));

    max = Math.random() * cylinderMaxExtent;
    this.length = min + (Math.random() * (max-min));

    var geometry = new THREE.CylinderGeometry(
        this.radius, this.radius, this.length, 100);
    this.object = new THREE.Mesh( geometry, material );
    this.object.rotation.z = -Math.PI/2;  // cylinder: make 'X' the long axis
  };

  Cylinder.prototype.scale = function () {
    return Math.min(
        Math.max.apply(null, this.bounds()) * 2,
        cylinderMaxExtent
    );
  };
  Cylinder.prototype.maxExtent = function () { return cylinderMaxExtent; };
  Cylinder.prototype.bounds = function () {
    return [this.length, this.radius, this.radius];
  };

  Cylinder.prototype.render = function (scene) {
    scene.add( this.object );
  };


      //////// Sphere
  var sphereMaxExtent = 100;
  var Sphere = function (material) {
    var max = Math.random() * sphereMaxExtent;
    this.radius = 0.5 + (Math.random() * (max-0.5));
  };

  Sphere.prototype.scale = function () { return sphereMaxExtent; };
  Sphere.prototype.maxExtent = function () { return sphereMaxExtent; };
  Sphere.prototype.bounds = function () {
    return [this.radius, this.radius, this.radius];
  };

  Sphere.prototype.render = function (scene) {
    var geometry = new THREE.SphereGeometry(this.radius, 100, 100);
    var object = new THREE.Mesh( geometry, material );
    scene.add( object );
  };


      //////// Tubes
  var Tubes = function (material) {
    var max = Math.floor(Math.random() * 5) + 2;
    this.partCount = Math.floor(Math.random() * max) + 2;
    this.parts = [];
    this.offsets = [];
    for (var i=0; i < this.partCount; i++) {
      var part = new Cylinder(material);
      this.parts.push(part);
    }

    var widestCylinderIndex = null;
    var maxRadius = 0;
    for (var i=0; i < this.partCount; i++) {
      if (maxRadius < this.parts[i].radius) {
        maxRadius = this.parts[i].radius;
        widestCylinderIndex = i;
      }
    }

    this.boundsArray = [0, 0, 0];
    for (var i=0; i < this.partCount; i++) {
      var part = this.parts[i];
      var bounds = part.bounds();

      for (j=0; j < 3; j++) {
        this.boundsArray[j] = Math.max(this.boundsArray[j], bounds[j]);
      }

      if (i === widestCylinderIndex) {
        this.offsets.push([0, 0, 0]);
      } else {
        var condition = Math.floor(Math.random() * 4);
        switch (condition) {
        case 0:
          part.object.position.x = part.length / 2;
          break;
        case 1:
          part.object.position.x = -part.length / 2;
          break;
        case 2:
          part.object.position.x = -part.length / 2;
          part.object.position.x += Math.random() * part.length;
          break;
        }
      }

      if (i !== widestCylinderIndex) {
        var condition = Math.floor(Math.random() * 4);
        var rho = Math.random() * maxRadius * 1.1;
        var theta = Math.random() * 2 * Math.PI;
        var y = rho * Math.cos(theta);
        var z = rho * Math.sin(theta);

        switch (condition) {
        case 0:
          part.object.position.y = y;
          break;
        case 1:
          part.object.position.z = z;
          break;
        case 2:
          part.object.position.y = y;
          part.object.position.z = z;
          break;
        }
      }
    }
  };

  Tubes.prototype.bounds = function () { return this.boundsArray; };
  Tubes.prototype.maxExtent = function () {
      return Math.max.apply(null, this.bounds());
  };
  Tubes.prototype.scale = function () { return this.maxExtent(); };

  Tubes.prototype.render = function (scene) {
    for (var i=0; i < this.partCount; i++) {
      scene.add(this.parts[i].object);
    }
  };


  var solidClasses = [Tubes];// = [Cylinder, Sphere, Tubes];
})();
