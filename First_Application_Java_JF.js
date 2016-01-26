// Calls to one-time initialization operations.
function init() 
{
	//Find element from application code with id webgl-canvas and assign it to canvas. 
	var canvas = document.getElementById("webgl-canvas");
	//Creates a WebGL context and sets to gl.
	gl = WebGLUtils.setupWebGL(canvas);

	//If setupWebGL() succeeds, render.
	if (!gl) { return; }

	//Specifies the background color.
	gl.clearColor(1.0, 0.0, 1.0, 1.0);

	//Will clear all of the buffers of the window.
	gl.clear(gl.COLOR_BUFFER_BIT);

}

//This is the rendering loop function. It does drawing, is called for each frame of app's operation
//and uses current state of our app to position, scale, and animate objects in the scene. 
function render()
{

}

//Think of this as C++ main() function. It's called when the window's loaded. 
window.onload = init; 
