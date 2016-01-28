package mint.render.kha;

import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;


private typedef KhaMintListOptions = {
	var color_selected: Color;
	var color_hover: Color;
}

class List extends KhaRenderer{


	var list : mint.List;

	public function new( render : KhaMintRendering, control : mint.List ) {

		super(render, control);
		this.list = control;

		var opt: KhaMintListOptions = list.options.options;


	}

	override function ondestroy(){
		super.ondestroy();
	}

	override function onrender(){

	}

	override function onbounds(){
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
	}
}