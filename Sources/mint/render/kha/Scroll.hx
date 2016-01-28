package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;

private typedef KhaMintScrollOptions = {
	var color: Null<Color>;
	var color_handles: Null<Color>;
}

class Scroll extends KhaRenderer{


	public var scroll : mint.Scroll;

	public var visual : Visual;
	public var scrollh : Visual;
	public var scrollv : Visual;

	public var color: Color;
	public var color_handles: Color;

	public function new( render : KhaMintRendering, control : mint.Scroll ) {
		super(render, control);
		this.scroll = control;

		var _opt: KhaMintScrollOptions = scroll.options.options;

		color = def(_opt.color, Color.fromValue(0xff343434));
		color_handles = def(_opt.color_handles, Color.fromValue(0xff9dca63));

		visual = new Visual(control.x,control.y,control.w,control.h).color(color);
		scrollh = new Visual(scroll.scrollh.x, scroll.scrollh.y, scroll.scrollh.w, scroll.scrollh.h)
			.color(color_handles);
		scrollv = new Visual(scroll.scrollv.x, scroll.scrollv.y, scroll.scrollv.w, scroll.scrollv.h)
			.color(color_handles);

		scroll.onchange.listen(onchange);
		scroll.onhandlevis.listen(onhandlevis);
	}

	override function onrender(){
		if(!control.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
		scrollh.draw(g);
		scrollv.draw(g);
	}

	override function ondestroy(){
		scroll.onchange.remove(onchange);
		scroll.onhandlevis.remove(onhandlevis);
		super.ondestroy();
	}

	function onhandlevis(_h:Bool, _v:Bool) {
		scrollh.visible(_h && scroll.visible);
		scrollv.visible(_v && scroll.visible);
	}

	function onchange() {
		scrollh.pos(scroll.scrollh.x, scroll.scrollh.y);
		scrollv.pos(scroll.scrollv.x, scroll.scrollv.y);
	}

	override function onbounds(){
		visual.size(control.w,control.h).pos(control.x,control.y);
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.size(control.w,control.h).pos(control.x,control.y).clip(x,y,w,h);
	}

}
