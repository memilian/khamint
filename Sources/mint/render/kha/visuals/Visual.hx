package mint.render.kha.visuals;

import kha.math.FastMatrix3;
import kha.Scaler;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.graphics4.Usage;
import kha.graphics4.TextureFormat;
import kha.graphics2.Graphics;
import kha.Image;

class Visual {

	static public var baseImage(default, null) : Image;

	//visual rectangle
	var w : Float;
	var h : Float;
	var x : Float;
	var y : Float;

	//clip rectangle
	var cw : Float;
	var ch : Float;
	var cx : Float;
	var cy : Float;

	//drawed rectangle, after clip
	var rx : Float;
	var ry : Float;
	var rw : Float;
	var rh : Float;

	var doClip = false;

	public var myColor(default, null) : Color = Color.White;
	public var myOpacity(default, null) : Float = -1.0;
	var myVisibility = true;

	public function new(x : Float, y : Float, width : Float, height : Float) {
		this.x = x;
		this.y = y;
		w = width;
		h = height;
		cx = x;
		cy = y;
		cw = w;
		ch = h;
		refreshClip();
		if(baseImage == null){
			baseImage = Image.createRenderTarget(1,1);
			var g : Graphics = baseImage.g2;
			g.begin();
			g.color = Color.White;
			g.fillRect(0,0,1,1);
			g.end();
		}
	}

	public function color(color : Color) : Visual{
		this.myColor = color;
		if(myOpacity == -1) myOpacity = myColor.A;
		return this;
	}

	public function opacity(opacity : Float) : Visual{
		this.myOpacity = opacity;
		return this;
	}

	public function size(width : Float, height : Float) : Visual{
		w = width;
		h = height;
		refreshClip();
		return this;
	}

	public function pos(x : Float, y : Float) : Visual{
		this.x = x;
		this.y = y;
		refreshClip();
		return this;
	}

	public function visible(visible : Bool) : Visual{
		myVisibility = visible;
		return this;
	}

	public function isVisible() : Bool{
		return myVisibility;
	}

	public function clip(_x : Null<Float>, _y : Null<Float>, _w : Null<Float>, _h : Null<Float>){
		cx = _x;
		cy = _y;
		cw = _w;
		ch = _h;
		doClip = _x != null && _y != null && _w != null && _h != null;
		refreshClip();
	}


	function refreshClip(){
		if(doClip){
			rx = Math.min(Math.max(cx, x), cx+cw);
			ry = Math.min(Math.max(cy, y), cy+ch);
			rw = Math.max(0, Math.min(cx+cw,x+w)-Math.max(cx,x));
			rh = Math.max(0, Math.min(cy+ch,y+h)-Math.max(cy,y));
		}else{
			rx = x;
			ry = y;
			rw = w;
			rh = h;
		}
	}

	public function draw(g : Graphics){

		if(!myVisibility) return;

		g.pushOpacity(myOpacity);
		g.color = myColor;
		g.setBlendingMode(BlendingOperation.SourceAlpha, BlendingOperation.InverseSourceAlpha);
		//need gl.enable(SCISSOR_TEST);
		//g.setScissor(Std.int(cx),Std.int(cy),Std.int(cw),Std.int(ch));
		g.drawScaledImage(baseImage,rx,ry,rw,rh);
		g.popOpacity();
	}

}
