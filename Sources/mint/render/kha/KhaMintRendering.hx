package mint.render.kha;

import kha.Font;

typedef KhaMintRenderOptions = {
	var font : Font;
}

class KhaMintRendering extends Rendering{

	public var font : Font;
	public var viewportWidth : Int;
	public var viewportHeight : Int;
	public var renderManager : KhaMintRenderManager;

	public function new(options : KhaMintRenderOptions, viewportWidth : Int, viewportHeight : Int) {
		super();

		this.font = options.font;
		this.viewportWidth = viewportWidth;
		this.viewportHeight = viewportHeight;
		this.renderManager = new KhaMintRenderManager();

	}

	override public function get<T:Control, T1>( type:Class<T>, control:T ) : T1 {
		return cast switch(type) {
			case mint.Canvas:       new mint.render.kha.Canvas(this, cast control);
			case mint.Label:        new mint.render.kha.Label(this, cast control);
			case mint.Button:       new mint.render.kha.Button(this, cast control);
			case mint.Image:        new mint.render.kha.Image(this, cast control);
			case mint.List:         new mint.render.kha.List(this, cast control);
			case mint.Scroll:       new mint.render.kha.Scroll(this, cast control);
			case mint.Panel:        new mint.render.kha.Panel(this, cast control);
			case mint.Checkbox:     new mint.render.kha.Checkbox(this, cast control);
			case mint.Window:       new mint.render.kha.Window(this, cast control);
			case mint.TextEdit:     new mint.render.kha.TextEdit(this, cast control);
			case mint.Dropdown:     new mint.render.kha.Dropdown(this, cast control);
			case mint.Slider:       new mint.render.kha.Slider(this, cast control);
			case mint.Progress:     new mint.render.kha.Progress(this, cast control);
			case _:                 null;
		}
	}
}
