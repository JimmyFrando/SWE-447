/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//  Edited by Jimmy Frando
//  Date 2/25/2016
//  Program: Solar System Simulation
//
/////////////////////////////////////////////////////////////////////////////

"use strict";

//---------------------------------------------------------------------------
//
//  Declare our "global" variables, including the array of planets (each of
//    which is a sphere)
//

var canvas = undefined;
var gl = undefined;

// The list of planets to render.  Uncomment any planets that you are 
// including in the scene For each planet in this list, make sure to 
// set its distance from the sun, as well its size and colors 
var Planets = {
  Sun : new Sphere(),
  Mercury : new Sphere(),
  Venus : new Sphere(),
  Earth : new Sphere(),
  Moon : new Sphere(),
  Mars : new Sphere(),
  Jupiter : new Sphere(),
  Saturn : new Sphere(),
  Uranus : new Sphere(),
  Neptune : new Sphere(),
  Pluto : new Sphere()
};

// Viewing transformation parameters
var V = undefined;  // matrix storing the viewing transformation

// Projection transformation parameters
var P = undefined;  // matrix storing the projection transformation
var near = 10;      // near clipping plane's distance
var far = 150;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

// An angular velocity that could be applied to 
var angularVelocity = Math.PI / 10;

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Initialize the planets in the Planets list, including specifying
  // necesasry shaders, shader uniform variables, and other initialization
  // parameters.  This loops adds additinoal properties to each object
  // in the Planets object;
  for (var name in Planets ) {
    
    var p = Planets[name];

    p.vertexShader = "Planet-vertex-shader";
    p.fragmentShader = "Planet-fragment-shader";

    p.init(18,8); 

    p.uniforms = { 
      color : gl.getUniformLocation(p.program, "color"),
      MV : gl.getUniformLocation(p.program, "MV"),
      P : gl.getUniformLocation(p.program, "P"),
    };
  }

  resize();

  window.requestAnimationFrame(render);  
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

function render() {
  time += timeDelta;

  var ms = new MatrixStack();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Specify the viewing transformation, and use it to initialize the 
  // matrix stack
  V = translate(0.0, 0.0, -0.5*(near + far));
  ms.load(V);  

  // Note: You may want to find a way to use this value in your
  //  application
  var angle = time * angularVelocity;
  var distanceScale = 30;

  //
  // Render the Sun.  Here we create a temporary variable to make it
  //  simpler to work with the various properties.
  //

  var Sun = Planets.Sun;
  var radius = SolarSystem.Sun.radius;
  var color = SolarSystem.Sun.color;

  ms.push();
  ms.scale(radius);
  gl.useProgram(Sun.program);
  gl.uniformMatrix4fv(Sun.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Sun.uniforms.P, false, flatten(P));
  gl.uniform4fv(Sun.uniforms.color, flatten(color));
  Sun.draw();
  ms.pop();

  //
  //  Add your code for more planets here!
  //

  //Set up Mercury variables 
  var Mercury = Planets.Mercury;
  var radius = SolarSystem.Mercury.radius;
  var color = SolarSystem.Mercury.color;

  // Start transforming Mercury relative to the Sun
  ms.push();
  ms.rotate(angle * 4.15,[0, 0, 1]);
  ms.translate( SolarSystem.Sun.radius + SolarSystem.Mercury.distance * distanceScale, 0,0 );
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Mercury.radius * 10);
  gl.useProgram(Mercury.program);
  gl.uniformMatrix4fv(Mercury.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Mercury.uniforms.P, false, flatten(P));
  gl.uniform4fv(Mercury.uniforms.color, flatten(color));
  Mercury.draw();
  ms.pop();


  //Set up Venus variables
  var Venus = Planets.Venus;
  var radius = SolarSystem.Venus.radius;
  var color = SolarSystem.Venus.color;

  // Start transforming Venus relative to the Sun
  ms.push();
  ms.rotate(angle * 1.63,[0, 0, 1]);
  ms.translate( SolarSystem.Sun.radius + SolarSystem.Venus.distance * distanceScale, 0,0 );
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Venus.radius);
  gl.useProgram(Venus.program);
  gl.uniformMatrix4fv(Venus.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Venus.uniforms.P, false, flatten(P));
  gl.uniform4fv(Venus.uniforms.color, flatten(color));
  Venus.draw();
  ms.pop();


  //Set up Earth variables
  var Earth = Planets.Earth;
  var radius = SolarSystem.Earth.radius;
  var color = SolarSystem.Earth.color;

  // Start transforming the Earth & the Moon relative to the Sun
  ms.push();
  ms.rotate(angle,[0, 0, 1]);
  ms.translate( SolarSystem.Sun.radius + SolarSystem.Earth.distance * distanceScale, 0,0);

  // Start  Draw the Earth
  ms.push();
  ms.rotate(angle,[1, 0, 0]);
  ms.scale(SolarSystem.Earth.radius);
  gl.useProgram(Earth.program);
  gl.uniformMatrix4fv(Earth.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Earth.uniforms.P, false, flatten(P));
  gl.uniform4fv(Earth.uniforms.color, flatten(color));
  Earth.draw();
  ms.pop();

  // Set up Moon variables
  var Moon = Planets.Moon;
  var radius = SolarSystem.Moon.radius;
  var color = SolarSystem.Moon.color;

  // Start  Transforming the Moon relative to the Earth
  ms.rotate( angle * 13.04, [0,0,1] );
  ms.translate( SolarSystem.Earth.radius + SolarSystem.Moon.distance * distanceScale * 10, 0,0 );
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Moon.radius);
  gl.useProgram(Moon.program);
  gl.uniformMatrix4fv(Moon.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Moon.uniforms.P, false, flatten(P));
  gl.uniform4fv(Moon.uniforms.color, flatten(color));
  Moon.draw();
  ms.pop();

  // Set up Mars variables
  var Mars = Planets.Mars;
  var radius = SolarSystem.Mars.radius;
  var color = SolarSystem.Mars.color;

  // Start transforming Mars relative to the Sun
  ms.push();
  ms.rotate(angle * 0.53,[0, 0, 1]);
  ms.translate(SolarSystem.Sun.radius + SolarSystem.Mars.distance * distanceScale, 0, 0);
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Mars.radius);
  gl.useProgram(Mars.program);
  gl.uniformMatrix4fv(Mars.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Mars.uniforms.P, false, flatten(P));
  gl.uniform4fv(Mars.uniforms.color, flatten(color));
  Mars.draw();
  ms.pop();


  //Set up Jupiter variables
  var Jupiter = Planets.Jupiter;
  var radius = SolarSystem.Jupiter.radius;
  var color = SolarSystem.Jupiter.color;

  // Start transforming Jupiter relative to the Sun
  ms.push();
  ms.rotate(angle * 0.09,[0, 0, 1]);
  ms.translate( SolarSystem.Sun.radius + SolarSystem.Jupiter.distance * distanceScale, 0,0 );
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Jupiter.radius);
  gl.useProgram(Jupiter.program);
  gl.uniformMatrix4fv(Jupiter.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Jupiter.uniforms.P, false, flatten(P));
  gl.uniform4fv(Jupiter.uniforms.color, flatten(color));
  Jupiter.draw();
  ms.pop();

  //Set up Saturn variables
  var Saturn = Planets.Saturn;
  var radius = SolarSystem.Saturn.radius;
  var color = SolarSystem.Saturn.color;

  // Start transforming Saturn relative to the Sun
  ms.push();
  ms.rotate(angle * 0.03,[0, 0, 1]);
  ms.translate( SolarSystem.Sun.radius + SolarSystem.Saturn.distance * distanceScale, 0,0 );
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Saturn.radius);
  gl.useProgram(Saturn.program);
  gl.uniformMatrix4fv(Saturn.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Saturn.uniforms.P, false, flatten(P));
  gl.uniform4fv(Saturn.uniforms.color, flatten(color));
  Saturn.draw();
  ms.pop();


  //Set up Uranus variables
  var Uranus = Planets.Uranus;
  var radius = SolarSystem.Uranus.radius;
  var color = SolarSystem.Uranus.color;

  // Start transforming Uranus relative to the Sun
  ms.push();
  ms.rotate(angle * 0.01,[0, 0, 1]);
  ms.translate( SolarSystem.Sun.radius + SolarSystem.Uranus.distance * distanceScale, 0,0 );
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Uranus.radius);
  gl.useProgram(Uranus.program);
  gl.uniformMatrix4fv(Uranus.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Uranus.uniforms.P, false, flatten(P));
  gl.uniform4fv(Uranus.uniforms.color, flatten(color));
  Uranus.draw();
  ms.pop();


  //Set up Neptune variables
  var Neptune = Planets.Neptune;
  var radius = SolarSystem.Neptune.radius;
  var color = SolarSystem.Neptune.color;

  // Start transforming Neptune relative to the Sun
  ms.push();
  ms.rotate(angle * 0.006,[0, 0, 1]);
  ms.translate( SolarSystem.Sun.radius + SolarSystem.Neptune.distance * distanceScale, 0,0 );
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Neptune.radius);
  gl.useProgram(Neptune.program);
  gl.uniformMatrix4fv(Neptune.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Neptune.uniforms.P, false, flatten(P));
  gl.uniform4fv(Neptune.uniforms.color, flatten(color));
  Neptune.draw();
  ms.pop();


  //Set up Pluto variables
  var Pluto = Planets.Pluto;
  var radius = SolarSystem.Pluto.radius;
  var color = SolarSystem.Pluto.color;

  // Start transforming Pluto relative to the Sun
  ms.push();
  ms.rotate(angle * 0.004,[0, 0, 1]);
  ms.translate( SolarSystem.Sun.radius + SolarSystem.Pluto.distance * distanceScale, 0,0 );
  ms.scale(SolarSystem.Earth.radius * SolarSystem.Pluto.radius * 10);
  gl.useProgram(Pluto.program);
  gl.uniformMatrix4fv(Pluto.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Pluto.uniforms.P, false, flatten(P));
  gl.uniform4fv(Pluto.uniforms.color, flatten(color));
  Pluto.draw();
  ms.pop();

  window.requestAnimationFrame(render);
}

//---------------------------------------------------------------------------
//
//  resize() - handle resize events
//

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;

  gl.viewport(0, 0, w, h);

  var fovy = 120.0; // degrees
  var aspect = w / h;

  P = perspective(fovy, aspect, near, far);
}

//---------------------------------------------------------------------------
//
//  Window callbacks for processing various events
//

window.onload = init;
window.onresize = resize;