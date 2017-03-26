package mint.render.kha;

class KhaRender extends mint.render.Render{

	public var khaRendering: KhaMintRendering;

	public function new(rendering : KhaMintRendering, control : Control) {
		super(rendering, control);
		this.khaRendering = rendering;
	}
}
