package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.Image;

class KhaRenderer extends mint.render.Render{

	public var khaRendering: KhaMintRendering;

	var prevW : Float;
	var prevH : Float;

	public function new(rendering : KhaMintRendering, control : Control) {
		super(rendering, control);
		this.khaRendering = rendering;

		prevW = control.w;
		prevH = control.h;

		control.onrender.listen(onrender);
	}


	override function ondestroy() {
		control.onrender.remove(onrender);
	}

	function onrender(){}

}
