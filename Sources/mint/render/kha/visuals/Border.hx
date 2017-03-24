package mint.render.kha.visuals;

import kha.graphics4.BlendingOperation;
import kha.graphics2.Graphics;

class Border extends Visual{

	var innerX : Float;
	var innerY : Float;
	var innerW : Float;
	var innerH : Float;

	var borderLength : Float;

	public function new(innerX : Float, innerY : Float, innerW : Float, innerH : Float, borderLength : Float) {
		this.innerX = innerX;
		this.innerY = innerY;
		this.innerW = innerW;
		this.innerH = innerH;
		this.borderLength = borderLength;
		super(innerX-borderLength,innerY-borderLength,innerW+borderLength,innerH+borderLength);
	}

	public function inner(x : Float, y : Float, w : Float, h : Float) : Border{
		innerX = x;
		innerY = y;
		innerW = w;
		innerH = h;
		pos(innerX-borderLength,innerY-borderLength);
		size(innerW+borderLength,innerH+borderLength);
		return this;
	}

	public function length(length : Float) : Border{
		this.borderLength = length;
		pos(innerX-borderLength,innerY-borderLength);
		size(innerW+borderLength,innerH+borderLength);
		return this;
	}

	override public function draw(g: Graphics){
		if(!myVisibility) return;
		if(doClip){
			rx = Math.min(Math.max(cx, x), cx+cw);
			ry = Math.min(Math.max(cy, y), cy+ch);
			rw = Math.max(0, Math.min(w, cx+cw-x));
			rh = Math.max(0, Math.min(h, cy+ch-y));
		}else{
			rx = x;
			ry = y;
			rw = w;
			rh = h;
		}
		g.pushOpacity(myOpacity);
		g.color = myColor;
		g.drawScaledImage(Visual.baseImage,rx,ry,rw,borderLength);
		g.drawScaledImage(Visual.baseImage,rx,ry+rh,rw,borderLength);
		g.drawScaledImage(Visual.baseImage,rx,ry+borderLength,borderLength,rh);
		g.drawScaledImage(Visual.baseImage,rx+rw,ry,borderLength,rh+borderLength);
		g.popOpacity();
	}
}
