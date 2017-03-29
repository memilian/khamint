package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.Color;
import mint.core.Macros.*;

private typedef KhaMintCanvasOptions = {
	var color: Null<Color>;
}

class Canvas extends KhaRender{

	public var canvas : mint.Canvas;

	public var color : Color;
	var visual : Visual;


	public function new( khaRendering: KhaMintRendering, control:mint.Canvas ) {

		super(khaRendering, control);
		canvas = control;

		var opt : KhaMintCanvasOptions = canvas.options.options;
		color = def(opt.color, Color.fromBytes(0,0,0,0) );

		visual = new Visual(this.khaRendering.renderManager, control.x, control.y, control.w, control.h)
				.color(color);
	}

	override function ondepth(d : Float){
		visual.depth = d;
	}

	override function onvisible(visible : Bool){
		visual.visible(visible);
	}

	override function ondestroy(){
		visual.destroy();
	}
}
