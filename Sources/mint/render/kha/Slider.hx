package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.Color;
import mint.core.Macros.*;

private typedef KhaMintSliderOptions = {
	var color: Null<Color>;
	var color_bar: Null<Color>;
}

class Slider extends KhaRender{

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

		visual = new Visual(this.khaRendering.renderManager, control.x, control.y, control.w, control.h)
					.color(color);
		bar = new Visual(this.khaRendering.renderManager, control.x+slider.bar_x, control.y+slider.bar_y, slider.bar_w, slider.bar_h)
					.color(color_bar);

		slider.onchange.listen(onchange);
	}

	override function ondepth(d : Float){
		visual.depth = d;
		bar.depth = d + 0.01;
	}

	override function onvisible(visible : Bool){
		visual.visible(visible);
		bar.visible(visible);
	}

	override function ondestroy(){
		slider.onchange.remove(onchange);
		visual.destroy();
		bar.destroy();
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
			.pos(control.x + slider.bar_x,control.y + slider.bar_y)
			.clip(x,y,w,h);
	}
}
