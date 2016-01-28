package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.graphics4.BlendingOperation;
import kha.graphics4.TextureFormat;
import kha.graphics2.Graphics;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;

private typedef KhaMintCanvasOptions = {
	var color: Null<Color>;
}

class Canvas extends KhaRenderer{

	public var canvas : mint.Canvas;

	public var color : Color;
	var visual : Visual;


	public function new( khaRendering: KhaMintRendering, control:mint.Canvas ) {

		super(khaRendering, control);
		canvas = control;

		var opt : KhaMintCanvasOptions = canvas.options.options;
		color = def(opt.color, Color.fromBytes(0,0,0,0) );

		visual = new Visual(control.x, control.y, control.w, control.h)
				.color(color);
	}

	override function onrender(){
		if(!canvas.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		g.setBlendingMode(BlendingOperation.SourceAlpha, BlendingOperation.InverseSourceAlpha);
		visual.draw(g);
		g.flush();
	}
}
