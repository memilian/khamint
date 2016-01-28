package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;

private typedef KhaMintSliderOptions = {
	var color: Null<Color>;
	var color_bar: Null<Color>;
}

class Slider extends KhaRenderer{

	var slider: mint.Slider;

	var visual: Visual;
	var bar: Visual;

	var color: Color;
	var color_bar: Color;

	public function new( render : KhaMintRendering, control : mint.Slider) {

		super(render, control);
		this.slider = control;

		var opt: KhaMintSliderOptions = slider.options.options;

		color = def(opt.color, Color.fromValue(0xff313139));
		color_bar = def(opt.color_bar, Color.fromValue(0xff9dca63));

		visual = new Visual(control.x, control.y, control.w, control.h)
					.color(color);
		bar = new Visual(control.x+slider.bar_x, control.y+slider.bar_y, slider.bar_w, slider.bar_h)
					.color(color_bar);

		slider.onchange.listen(onchange);
	}

	override function onrender(){
		if(!slider.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
		bar.draw(g);
	}

	override function ondestroy(){
		slider.onchange.remove(onchange);
		super.ondestroy();
	}

	function onchange(value : Float, prevValue : Float){
		bar.pos(slider.x+slider.bar_x, slider.y+slider.bar_y)
			.size(slider.bar_w, slider.bar_h);
	}

	override function onbounds(){
		visual.size(control.w,control.h)
			.pos(control.x,control.y);
		bar.size(slider.bar_w,slider.bar_h)
			.pos(slider.x+slider.bar_x, slider.y+slider.bar_y);
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.size(control.w,control.h)
			.pos(control.x,control.y)
			.clip(x,y,w,h);
		bar.size(slider.bar_w,slider.bar_h)
			.pos(slider.bar_x,slider.bar_y)
			.clip(x,y,w,h);
	}
}
