package mint.render.kha;

import kha.Assets;
import kha.math.Vector4;
import mint.render.kha.visuals.Sprite;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;

private typedef KhaMintImageOptions = {
	@:optional var uv: Vector4;
	@:optional var color: Color;
	@:optional var image: kha.Image;
	@:optional var sizing: String; //:todo: type
}

class Image extends KhaRender{

	public var imageCtrl : mint.Image;
	public var visual : Sprite;
	public var color : Color;

	var ratioW : Float = 1.0;
	var ratioH : Float = 1.0;

	var textureLoaded = false;

	public function new( render : KhaMintRendering, control : mint.Image ) {
		super(render, control);
		imageCtrl = control;

		var opt : KhaMintImageOptions = imageCtrl.options.options;
		color = def(opt.color, Color.fromValue(0xffffffff));
		color = def(opt.color, Color.fromValue(0xffffffff));

		var resourceName = imageCtrl.options.path;

		var texture : kha.Image = null;

		visual = new Sprite(khaRendering.renderManager, control.x, control.y, control.w * ratioW, control.h * ratioH);

		var ontextureloaded = function(image){
			texture = image;

			if(opt.sizing != null){
				switch(opt.sizing){
					case 'fit' :
						if(texture.width > texture.height)
							ratioH = texture.height/texture.width;
						else
							ratioW = texture.width/texture.height;
					case 'cover' :
						var rx = 1.0;
						var ry = 1.0;
						if(texture.width > texture.height)
							rx = texture.height/texture.width;
						else
							ry = texture.width/texture.height;
						opt.uv = new Vector4(0, 0, rx, ry);
				}
			}

			var newVisual = new Sprite(this.khaRendering.renderManager, control.x, control.y, control.w * ratioW, control.h * ratioH)
			.texture(texture)
			.visible(visual.isVisible())
			.color(color);
			newVisual.depth = visual.depth;
			var tmp = visual;
			visual = cast newVisual;
			tmp.destroy();


			if(opt.uv != null)
				visual.setUv(opt.uv);

			if(control.clip_with != null)
				visual.clip(control.clip_with.x, control.clip_with.y, control.clip_with.w, control.clip_with.h);

			textureLoaded = true;
		};

		if(Reflect.hasField(Assets.images, resourceName))
			Assets.loadImage(resourceName, ontextureloaded);
		else
			Assets.loadImageFromPath(resourceName,true, ontextureloaded);
	}

	override function ondepth(d : Float){
		visual.depth = d;
	}

	override function onvisible(visible : Bool){
		visual.visible(visible);
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.clip(x,y,w,h);
	}

	override function onbounds(){
		visual.pos(control.x, control.y)
		.size(control.w, control.h);
	}

	override public function ondestroy() {
		visual.destroy();
		super.ondestroy();
	}
}
