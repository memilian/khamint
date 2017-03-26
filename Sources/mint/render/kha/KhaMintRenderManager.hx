package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.graphics2.Graphics;

class KhaMintRenderManager{

	var visuals : Array<Visual>;

	public function new(){
		visuals = new Array<Visual>();
	}

	public function addVisual(v : Visual){
		visuals.push(v);
		 
	}

	inline function depthSort(va : Visual, vb : Visual){
		return va.depth > vb.depth ? 1 : va.depth < vb.depth ? -1 : 0;
	}

	public function removeVisual(v : Visual){
		visuals.remove(v);
	}

	public function render(g : Graphics){
		visuals.sort(depthSort);
		for(v in visuals){
			if(v.isVisible())
			v.draw(g);
		}
	}


}