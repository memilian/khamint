package mint.render.kha;


import kha.Key;
import haxe.Timer;
import mint.types.Types;

class KhaMintAdapter {

	public var scrollSpeed = 5;

	var modState : mint.types.ModState;
	var prevMouseX = 0;
	var prevMouseY = 0;

	public function new(){
		modState = {
			none : true,
			lshift : false,
			rshift : false,
			lctrl : false,
			rctrl : false,
			lalt : false,
			ralt : false,
			lmeta : false,
			rmeta : false,
			num : false,
			caps : false,
			mode : false,
			ctrl : false,
			shift : false,
			alt : false,
			meta : false
		};

	}



	/** from luxe.Input.Key to mint.KeyCode */
/*	public static function key_code( _keycode:Int ) : mint.types.KeyCode {

		return switch(_keycode) {

			case Key.left:      mint.types.KeyCode.left;
			case Key.right:     mint.types.KeyCode.right;
			case Key.up:        mint.types.KeyCode.up;
			case Key.down:      mint.types.KeyCode.down;
			case Key.backspace: mint.types.KeyCode.backspace;
			case Key.delete:    mint.types.KeyCode.delete;
			case Key.tab:       mint.types.KeyCode.tab;
			case Key.enter:     mint.types.KeyCode.enter;
			case _:             mint.types.KeyCode.unknown;

		} //_keycode

	} //key_code
*/
/*	public static function text_event_type( _type:TextEventType ) : mint.types.TextEventType {

		return switch(_type) {
			case luxe.TextEventType.unknown: mint.types.TextEventType.unknown;
			case luxe.TextEventType.edit:    mint.types.TextEventType.edit;
			case luxe.TextEventType.input:   mint.types.TextEventType.input;
		}

	} //text_event_type
*/
	/** from luxe.Input.ModState to mint.ModState */
/*	public static function mod_state( _mod:ModState ) : mint.types.ModState {

		return {
			none:   _mod.none,
			lshift: _mod.lshift,
			rshift: _mod.rshift,
			lctrl:  _mod.lctrl,
			rctrl:  _mod.rctrl,
			lalt:   _mod.lalt,
			ralt:   _mod.ralt,
			lmeta:  _mod.lmeta,
			rmeta:  _mod.rmeta,
			num:    _mod.num,
			caps:   _mod.caps,
			mode:   _mod.mode,
			ctrl:   _mod.ctrl,
			shift:  _mod.shift,
			alt:    _mod.alt,
			meta:   _mod.meta
		};

	} //mod_state
*/

	function keyCode(k : Key, c : String) : Int{
		var keycode = switch(k){
			case Key.ALT: 			18;
			case Key.BACKSPACE:		8;
			case Key.CTRL:			17;
			case Key.DEL:			46;
			case Key.DOWN:			40;
			case Key.ESC:			27;
			case Key.ENTER:			13;
			case Key.LEFT:			37;
			case Key.RIGHT:			39;
			case Key.SHIFT:			16;
			case Key.TAB:			9;
			case Key.UP:			38;
			case Key.CHAR|Key.BACK:	-1;
		};

		if(keycode == -1 && c.length>0)
			keycode = c.charCodeAt(0);
		return keycode;
	}

	function mintKeyCode(k : Key){
		return switch(k){
			case Key.LEFT :			mint.types.KeyCode.left;
			case Key.RIGHT:			mint.types.KeyCode.right;
			case Key.UP :			mint.types.KeyCode.up;
			case Key.DOWN :			mint.types.KeyCode.down;
			case Key.BACKSPACE :	mint.types.KeyCode.backspace;
			case Key.DEL :			mint.types.KeyCode.delete;
			case Key.TAB :			mint.types.KeyCode.tab;
			case Key.ENTER :		mint.types.KeyCode.enter;
			case _ :				mint.types.KeyCode.unknown;
		};
	}

	function checkMods(k : Key, down : Bool){
		switch(k){
			case Key.ALT: 		modState.alt = down;
			case Key.CTRL:		modState.ctrl = down;
			case Key.SHIFT:		modState.shift = down;
			case _:
		};
	}

	public function keyDown(k : Key, c : String) : mint.types.KeyEvent{
		checkMods(k,true);
		return {
			state       : mint.types.InteractState.down,
			keycode     : keyCode(k,c),
			timestamp   : Timer.stamp(),
			key         : mintKeyCode(k),
			mod         : modState,
			bubble      : true
		};
	}

	public function keyUp(k : Key, c : String) : mint.types.KeyEvent{
		checkMods(k,false);
		return {
			state       : mint.types.InteractState.up,
			keycode     : keyCode(k,c),
			timestamp   : Timer.stamp(),
			key         : mintKeyCode(k),
			mod         : modState,
			bubble      : true
		};
	}

	public function textEvent(k : Key, c : String) : mint.types.TextEvent{
		return {
			text      : c,
			type      : mint.types.TextEventType.input,
			timestamp : Timer.stamp(),
			start     : 0,
			length    : c.length,
			bubble    : true
		};
	}

	public function mouseButton( button:Int ) : mint.types.MouseButton {
		return switch(button) {
			case 0: mint.types.MouseButton.left;
			case 1: mint.types.MouseButton.right;
			case 2: mint.types.MouseButton.middle;
			case _: mint.types.MouseButton.none;
		}
	} //mouse_button

	public function mouseDownEvent(button : Int, x : Int, y : Int) : mint.types.MouseEvent {

		return {
			state       : mint.types.InteractState.down,
			button      : mouseButton(button),
			timestamp   : Timer.stamp(),
			x           : x,
			y           : y,
			xrel        : 0,
			yrel        : 0,
			bubble      : true
		};

	}//mouseDownEvent

	public function mouseUpEvent(button : Int, x : Int, y : Int) : mint.types.MouseEvent {

		return {
			state       : mint.types.InteractState.up,
			button      : mouseButton(button),
			timestamp   : Timer.stamp(),
			x           : x,
			y           : y,
			xrel        : 0,
			yrel        : 0,
			bubble      : true
		};

	}//mouseUpEvent

	public function mouseMoveEvent(x : Int, y : Int) : mint.types.MouseEvent {
		var res = {
			state       : mint.types.InteractState.move,
			button      : mint.types.MouseButton.none,
			timestamp   : Timer.stamp(),
			x           : x,
			y           : y,
			xrel        : 0,
			yrel        : 0,
			bubble      : true
		};

		prevMouseX = x;
		prevMouseY = y;

		return res;

	}//mouseMoveEvent

	public function mouseWheelEvent(w : Int) : mint.types.MouseEvent {

		return {
			state       : mint.types.InteractState.wheel,
			button      : mint.types.MouseButton.none,
			timestamp   : Timer.stamp(),
			x           : 0,
			y           : w<0?-scrollSpeed:scrollSpeed,
			xrel        : 0,
			yrel        : 0,
			bubble      : true
		};
	}//mouseWheelEvent

	/** from luxe.Input.TextEvent to mint.TextEvent */
/*	public static function text_event( _event:TextEvent ) : mint.types.TextEvent {

		return {
			text      : _event.text,
			type      : text_event_type(_event.type),
			timestamp : _event.timestamp,
			start     : _event.start,
			length    : _event.length,
			bubble    : true
		};

	} //mouse_event
*/
} //Convert
