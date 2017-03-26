package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.Color;
import mint.core.Macros.*;

private typedef KhaMintScrollOptions = {
	var color: Null<Color>;
	var color_handles: Null<Color>;
}

class Scroll extends KhaRender{


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

		visual = new Visual(this.khaRendering.renderManager, control.x,control.y,control.w,control.h).color(color);
		scrollh = new Visual(this.khaRendering.renderManager, scroll.scrollh.x, scroll.scrollh.y, scroll.scrollh.w, scroll.scrollh.h)
			.color(color_handles);
		scrollv = new Visual(this.khaRendering.renderManager, scroll.scrollv.x, scroll.scrollv.y, scroll.scrollv.w, scroll.scrollv.h)
			.color(color_handles);

		scroll.onchange.listen(onchange);
		scroll.onhandlevis.listen(onhandlevis);
		scroll.scrollh.ondepth.listen(function(d){
			scrollh.depth = d;
		});
		scroll.scrollv.ondepth.listen(function(d){
			scrollv.depth = d;
		});
	}
	
	override function onvisible(visible : Bool){
		visual.visible(visible);
		scrollh.visible(visible);
		scrollv.visible(visible);
	}

	override function ondepth(d : Float){
		visual.depth = d;
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
