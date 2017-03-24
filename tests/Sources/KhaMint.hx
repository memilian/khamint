package;

import kha.System;
import kha.Assets;
import mint.focus.Focus;
import mint.Canvas;
import kha.Framebuffer;
import kha.Color;
import kha.Scheduler;
import haxe.Timer;
import kha.input.Keyboard;
import mint.render.kha.KhaMintAdapter;
import kha.input.Mouse;
import kha.Key;
import kha.FontStyle;
import haxe.PosInfos;
import mint.layout.margins.Margins;
import mint.render.kha.KhaMintRendering;
import kha.Font;

class KhaMint {

	//	public static var disp : Text;
	public static var canvas: Canvas;
	public static var rendering: KhaMintRendering;
	public static var kmAdapter : KhaMintAdapter;
	public static var layout: Margins;
	public static var focus: Focus;

	public static var font : Font;
	public static var fontSm: Font;

	public static var canvasDebug = "";
	public static var debugControlBounds = false;

	public var initialized = false;

	var kitchenSink : KitchenSink;

	var lastUpdate : Float;

	public function new() {
		Assets.loadEverything(init);
	}

	public function init() : Void {

		Keyboard.get(0).notify(onkeydown, onkeyup);
		Mouse.get(0).notify(onmousedown, onmouseup, onmousemove, onmousewheel);

		kmAdapter = new KhaMintAdapter();

		font = Assets.fonts.cnr;

		rendering = new KhaMintRendering({
			font:font
		}, System.windowWidth(), System.windowHeight());

		layout = new Margins();

		canvas = new mint.Canvas({
			name:'canvas',
			rendering: rendering,
			renderable:true,
			x: 0, y:0, w: System.windowWidth(), h: System.windowHeight()
		});

		focus = new Focus(canvas);

		kitchenSink = new KitchenSink();

		initialized = true;
	}

	public function update() {
		if(!initialized) return;
		kitchenSink.update();
	}

	public function render(frame : Framebuffer){
		if(!initialized) return;
		kitchenSink.render(frame);
	}

	public function onkeyup(k : Key, c : String) {
		canvas.keyup( kmAdapter.keyUp(k,c) );

		switch(c){
			case 'd':
				debugControlBounds = !debugControlBounds;
		}
	}

	public function onkeydown(k : Key, c : String) {
		if(k == Key.CHAR)
			canvas.textinput(kmAdapter.textEvent(k,c));
		canvas.keydown( kmAdapter.keyDown(k,c) );
	}

	public function onmousemove(x : Int, y : Int, a : Int, b : Int){
		canvas.mousemove( kmAdapter.mouseMoveEvent(x,y) );
		updateDebugInfos();
	}

	public function onmousedown(button : Int, x : Int, y : Int){
		canvas.mousedown( kmAdapter.mouseDownEvent(button, x, y) );
	}

	public function onmouseup(button : Int, x : Int, y : Int){
		canvas.mouseup( kmAdapter.mouseUpEvent(button, x, y) );
	}

	public function onmousewheel(w : Int){
		canvas.mousewheel( kmAdapter.mouseWheelEvent(w) );
	}

	function updateDebugInfos(){
		var s = '';
		s += 'canvas nodes: ' + (canvas != null ? '${canvas.nodes}' : 'none');
		s += '\n';
		s += 'captured: ' + (canvas.captured != null ? '${canvas.captured.name} [${canvas.captured.nodes}]' : 'none');
		s += (canvas.captured != null ? ' / depth: '+canvas.captured.depth : '');
		s += '\n';
		s += 'marked: ' + (canvas.marked != null ?  canvas.marked.name : 'none');
		s += '\n';
		s += 'focused: ' + (canvas.focused != null ? canvas.focused.name : 'none');
		s += '\n\n';

		canvasDebug = s;
	}

}
