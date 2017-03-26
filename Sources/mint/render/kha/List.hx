package mint.render.kha;

import kha.Color;

private typedef KhaMintListOptions = {
	var color_selected: Color;
	var color_hover: Color;
}

class List extends KhaRender{

	var list : mint.List;

	public function new( render : KhaMintRendering, control : mint.List ) {
		super(render, control);
		this.list = control;
	}
}