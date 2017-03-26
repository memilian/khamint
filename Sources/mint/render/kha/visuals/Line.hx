package mint.render.kha.visuals;

import kha.graphics2.Graphics;

class Line extends Visual{

	var lx : Float;
	var ly : Float;
	var lw : Float;
	var lh : Float;

	public function new(manager : KhaMintRenderManager, x : Float, y : Float, lx : Float, ly : Float, lw : Float, lh : Float)	{
		super(manager, x, y, 0, 0);
		this.lx = lx;
		this.ly = ly;
		this.lw = lw;
		this.lh = lh;
	}

	override public function draw(g : Graphics){
		g.color = myColor;
		g.pushOpacity(myOpacity);
		g.drawLine(x + lx, y + ly, x + lx + lw, y + ly + lh, 2);
		g.popOpacity();
	}
}