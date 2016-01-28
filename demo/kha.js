(function (console, $hx_exports) { "use strict";
$hx_exports.kha = $hx_exports.kha || {};
$hx_exports.kha.input = $hx_exports.kha.input || {};
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = true;
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var KhaMint = function() {
	this.initialized = false;
	kha_Assets.loadEverything($bind(this,this.init));
};
$hxClasses["KhaMint"] = KhaMint;
KhaMint.__name__ = true;
KhaMint.prototype = {
	initialized: null
	,kitchenSink: null
	,lastUpdate: null
	,init: function() {
		kha_input_Keyboard.get(0).notify($bind(this,this.onkeydown),$bind(this,this.onkeyup));
		kha_input_Mouse.get(0).notify($bind(this,this.onmousedown),$bind(this,this.onmouseup),$bind(this,this.onmousemove),$bind(this,this.onmousewheel));
		KhaMint.kmAdapter = new mint_render_kha_KhaMintAdapter();
		KhaMint.font = kha_Assets.fonts.segoeUISymbol;
		KhaMint.rendering = new mint_render_kha_KhaMintRendering({ font : KhaMint.font},kha_System.get_pixelWidth(),kha_System.get_pixelHeight());
		KhaMint.layout = new mint_layout_margins_Margins();
		KhaMint.canvas = new mint_Canvas({ name : "canvas", rendering : KhaMint.rendering, renderable : true, x : 0, y : 0, w : kha_System.get_pixelWidth(), h : kha_System.get_pixelHeight()});
		KhaMint.focus = new mint_focus_Focus(KhaMint.canvas);
		this.kitchenSink = new KitchenSink();
		this.initialized = true;
	}
	,update: function() {
		if(!this.initialized) return;
		this.kitchenSink.update();
	}
	,render: function(frame) {
		if(!this.initialized) return;
		this.kitchenSink.render(frame);
	}
	,onkeyup: function(k,c) {
		KhaMint.canvas.keyup(KhaMint.kmAdapter.keyUp(k,c));
		switch(c) {
		case "d":
			KhaMint.debugControlBounds = !KhaMint.debugControlBounds;
			break;
		}
	}
	,onkeydown: function(k,c) {
		if(k == kha_Key.CHAR) KhaMint.canvas.textinput(KhaMint.kmAdapter.textEvent(k,c));
		KhaMint.canvas.keydown(KhaMint.kmAdapter.keyDown(k,c));
	}
	,onmousemove: function(x,y,a,b) {
		KhaMint.canvas.mousemove(KhaMint.kmAdapter.mouseMoveEvent(x,y));
		this.updateDebugInfos();
	}
	,onmousedown: function(button,x,y) {
		KhaMint.canvas.mousedown(KhaMint.kmAdapter.mouseDownEvent(button,x,y));
	}
	,onmouseup: function(button,x,y) {
		KhaMint.canvas.mouseup(KhaMint.kmAdapter.mouseUpEvent(button,x,y));
	}
	,onmousewheel: function(w) {
		KhaMint.canvas.mousewheel(KhaMint.kmAdapter.mouseWheelEvent(w));
	}
	,updateDebugInfos: function() {
		var s = "";
		s += "canvas nodes: " + (KhaMint.canvas != null?"" + KhaMint.canvas.get_nodes():"none");
		s += "\n";
		s += "captured: " + (KhaMint.canvas.get_captured() != null?"" + KhaMint.canvas.get_captured().name + " [" + KhaMint.canvas.get_captured().get_nodes() + "]":"none");
		if(KhaMint.canvas.get_captured() != null) s += " / depth: " + KhaMint.canvas.get_captured().get_depth(); else s += "";
		s += "\n";
		s += "marked: " + (KhaMint.canvas.get_marked() != null?KhaMint.canvas.get_marked().name:"none");
		s += "\n";
		s += "focused: " + (KhaMint.canvas.get_focused() != null?KhaMint.canvas.get_focused().name:"none");
		s += "\n\n";
		KhaMint.canvasDebug = s;
	}
	,__class__: KhaMint
};
var KitchenSink = function() {
	this.lastTime = kha_Scheduler.time();
	this.dt = 0.0;
	this.progress_dir = -1;
	this.rendering = KhaMint.rendering;
	this.font = KhaMint.font;
	this.debugControlBounds = false;
	this.init();
};
$hxClasses["KitchenSink"] = KitchenSink;
KitchenSink.__name__ = true;
KitchenSink.prototype = {
	bg: null
	,window1: null
	,window2: null
	,window3: null
	,check: null
	,progress: null
	,canvas: null
	,text1: null
	,debugControlBounds: null
	,font: null
	,rendering: null
	,onleave: function() {
		this.bg.unload();
		this.canvas = null;
		this.window1 = null;
		this.window2 = null;
		this.window3 = null;
		this.check = null;
		this.progress = null;
	}
	,init: function() {
		this.canvas = KhaMint.canvas;
		(js_Boot.__cast(this.canvas , mint_Canvas)).destroy_children();
		this.create_basics();
		this.create_window1();
		this.create_window2();
		this.create_window3();
	}
	,progress_dir: null
	,create_window1: function() {
		this.window1 = new mint_Window({ parent : this.canvas, name : "window1", title : "window", options : { color : kha__$Color_Color_$Impl_$._new(-15592942), color_titlebar : kha__$Color_Color_$Impl_$._new(-15132391), label : { color : kha__$Color_Color_$Impl_$._new(-16337669)}, close_button : { color : kha__$Color_Color_$Impl_$._new(-16337669)}}, x : 160, y : 10, w : 256, h : 400, w_min : 256, h_min : 256, collapsible : true, text_size : 16});
		var _list = new mint_List({ parent : this.window1, name : "list1", options : { view : { color : kha__$Color_Color_$Impl_$._new(-15132388)}}, x : 4, y : 28, w : 248, h : 368});
		KhaMint.layout.margin(_list,null,2,2,4);
		KhaMint.layout.margin(_list,null,4,2,4);
		var titles = ["Sword of Extraction","Fortitude","Wisdom stone","Cursed Blade","Risen Staff"];
		var desc = ["Steals 30% life of every hit from the target","3 second Invulnerability","Passive: intelligence +5","Each attack deals 1 damage to the weilder","Undead staff deals 3x damage to human enemies"];
		var _g = 0;
		while(_g < 5) {
			var i = _g++;
			_list.add_item((function($this) {
				var $r;
				var _panel = new mint_Panel({ parent : _list, name : "panel_" + i, x : 2, y : 4, w : 236, h : 96});
				KhaMint.layout.margin(_panel,null,2,2,8);
				new mint_Image({ parent : _panel, name : "icon_" + i, x : 8, y : 8, w : 80, h : 80, path : "transparency"});
				var _title = new mint_Label({ parent : _panel, name : "label_" + i, mouse_input : true, x : 96, y : 8, w : 148, h : 18, text_size : 18, align : 1, align_vertical : 4, text : titles[i]});
				var _desc = new mint_Label({ parent : _panel, name : "desc_" + i, x : 96, y : 30, w : 132, h : 18, text_size : 15, align : 1, align_vertical : 4, bounds_wrap : true, text : desc[i]});
				KhaMint.layout.margin(_title,null,2,2,8);
				KhaMint.layout.margin(_desc,null,2,2,8);
				KhaMint.layout.margin(_desc,null,4,2,8);
				$r = _panel;
				return $r;
			}(this)),0,i == 0?0:8);
		}
	}
	,create_window2: function() {
		var _window = new mint_Window({ parent : this.canvas, name : "window2", title : "window", visible : false, closable : false, collapsible : true, x : 500, y : 10, w : 256, h : 131, h_max : 131, h_min : 131, w_min : 131, text_size : 16});
		var _anchored = new mint_Image({ parent : this.canvas, name : "image2", x : 0, y : 400, w : 32, h : 32, path : "transparency"});
		var _platform = new mint_Dropdown({ parent : _window, name : "dropdown", text : "Platform...", options : { color : kha__$Color_Color_$Impl_$._new(-13355975)}, x : 10, y : 96, w : 236, h : 24});
		var plist = ["windows","linux","ios","android","web"];
		var _g = 0;
		while(_g < plist.length) {
			var p = plist[_g];
			++_g;
			var first = HxOverrides.indexOf(plist,p,0) == 0;
			_platform.add_item(new mint_Label({ parent : _platform, text : "" + p, align : 1, name : "plat-" + p, w : 225, h : 24, text_size : 16}),10,first?0:10);
		}
		_platform.onselect.listen(function(idx,_,_1) {
			_platform.label.set_text(plist[idx]);
		});
		this.text1 = new mint_TextEdit({ parent : _window, name : "textedit1", text : "snõwkit / mínt", renderable : true, x : 10, y : 32, w : 236, h : 22});
		this.text1.onchange.listen(function(text,display_text,from_typing) {
			haxe_Log.trace(text,{ fileName : "KitchenSink.hx", lineNumber : 194, className : "KitchenSink", methodName : "create_window2"});
		});
		var numbers = new EReg("^[0-9]+[.]?[0-9]{0,2}$","gi");
		var _text2 = new mint_TextEdit({ parent : _window, name : "textnumbersonly", text : "314.29", x : 10, y : 64, w : 236, h : 22, filter : function($char,future,prev) {
			return numbers.match(future);
		}, options : { color : kha__$Color_Color_$Impl_$.fromFloats(0.96,0.96,0.96), color_hover : kha__$Color_Color_$Impl_$.White, color_cursor : kha__$Color_Color_$Impl_$._new(-655237), label : { color : kha__$Color_Color_$Impl_$._new(-655237)}}});
		KhaMint.layout.anchor(_anchored,_window,3,4);
		KhaMint.layout.anchor(_anchored,_window,5,5);
		KhaMint.layout.margin(_platform,null,2,2,10);
		KhaMint.layout.margin(this.text1,null,2,2,10);
		KhaMint.layout.margin(_text2,null,2,2,10);
		kha_Scheduler.addTimeTask(function() {
			_window.set_visible(true);
		},1);
	}
	,create_window3: function() {
	}
	,create_basics: function() {
		var _g = this;
		new mint_Label({ parent : this.canvas, name : "labelmain", x : 10, y : 10, w : 100, h : 32, text : "hello mint", align : 1, text_size : 15, onclick : function(e,c) {
			haxe_Log.trace("hello mint! " + kha_Scheduler.time(),{ fileName : "KitchenSink.hx", lineNumber : 280, className : "KitchenSink", methodName : "create_basics"});
		}});
		this.check = new mint_Checkbox({ parent : this.canvas, name : "check1", x : 120, y : 16, w : 24, h : 24});
		new mint_Checkbox({ parent : this.canvas, name : "check2", options : { color_node : kha__$Color_Color_$Impl_$._new(-655237), color_node_off : kha__$Color_Color_$Impl_$._new(-3223858), color : kha__$Color_Color_$Impl_$._new(-1052689), color_hover : kha__$Color_Color_$Impl_$._new(-1), color_node_hover : kha__$Color_Color_$Impl_$._new(-1965990)}, x : 120, y : 48, w : 24, h : 24});
		this.progress = new mint_Progress({ parent : this.canvas, name : "progress1", progress : 0.2, options : { color : kha__$Color_Color_$Impl_$.White, color_bar : kha__$Color_Color_$Impl_$._new(-15592935)}, x : 10, y : 95, w : 128, h : 16});
		var _s = new mint_Slider({ parent : _g.canvas, name : "slider1", x : 10, y : 330, w : 128, h : 24, options : { color_bar : kha__$Color_Color_$Impl_$._new(-6436253)}, min : -100, max : 100, step : 10, vertical : false, value : 0});
		var _l = new mint_Label({ parent : _s, text_size : 16, x : 0, y : 0, w : _s.w, h : _s.h, align : 3, align_vertical : 3, name : _s.name + ".label", text : "" + _s.value});
		_s.onchange.listen(function(_val,_) {
			_l.set_text("" + _val);
		});
		var _s1 = new mint_Slider({ parent : _g.canvas, name : "slider2", x : 10, y : 357, w : 128, h : 24, options : { color_bar : kha__$Color_Color_$Impl_$._new(-6436253)}, min : 0, max : 100, step : 1, vertical : false, value : 50});
		var _l1 = new mint_Label({ parent : _s1, text_size : 16, x : 0, y : 0, w : _s1.w, h : _s1.h, align : 3, align_vertical : 3, name : _s1.name + ".label", text : "" + _s1.value});
		_s1.onchange.listen(function(_val1,_1) {
			_l1.set_text("" + _val1);
		});
		var _s2 = new mint_Slider({ parent : _g.canvas, name : "slider3", x : 10, y : 385, w : 128, h : 24, options : { color_bar : kha__$Color_Color_$Impl_$._new(-655237)}, min : null, max : null, step : null, vertical : false, value : null});
		var _l2 = new mint_Label({ parent : _s2, text_size : 16, x : 0, y : 0, w : _s2.w, h : _s2.h, align : 3, align_vertical : 3, name : _s2.name + ".label", text : "" + _s2.value});
		_s2.onchange.listen(function(_val2,_2) {
			_l2.set_text("" + _val2);
		});
		var _s3 = new mint_Slider({ parent : _g.canvas, name : "slider4", x : 14, y : 424, w : 32, h : 128, options : { color_bar : kha__$Color_Color_$Impl_$._new(-6436253)}, min : 0, max : 100, step : 10, vertical : true, value : 20});
		var _l3 = new mint_Label({ parent : _s3, text_size : 16, x : 0, y : 0, w : _s3.w, h : _s3.h, align : 3, align_vertical : 3, name : _s3.name + ".label", text : "" + _s3.value});
		_s3.onchange.listen(function(_val3,_3) {
			_l3.set_text("" + _val3);
		});
		var _s4 = new mint_Slider({ parent : _g.canvas, name : "slider5", x : 56, y : 424, w : 32, h : 128, options : { color_bar : kha__$Color_Color_$Impl_$._new(-6436253)}, min : 0, max : 100, step : 1, vertical : true, value : 0.3});
		var _l4 = new mint_Label({ parent : _s4, text_size : 16, x : 0, y : 0, w : _s4.w, h : _s4.h, align : 3, align_vertical : 3, name : _s4.name + ".label", text : "" + _s4.value});
		_s4.onchange.listen(function(_val4,_4) {
			_l4.set_text("" + _val4);
		});
		var _s5 = new mint_Slider({ parent : _g.canvas, name : "slider6", x : 98, y : 424, w : 32, h : 128, options : { color_bar : kha__$Color_Color_$Impl_$._new(-655237)}, min : null, max : null, step : null, vertical : true, value : null});
		var _l5 = new mint_Label({ parent : _s5, text_size : 16, x : 0, y : 0, w : _s5.w, h : _s5.h, align : 3, align_vertical : 3, name : _s5.name + ".label", text : "" + _s5.value});
		_s5.onchange.listen(function(_val5,_5) {
			_l5.set_text("" + _val5);
		});
		new mint_Button({ parent : this.canvas, name : "button1", x : 10, y : 52, w : 60, h : 32, text : "mint", text_size : 16, options : { label : { color : kha__$Color_Color_$Impl_$._new(-6436253)}}, onclick : function(e1,c1) {
			haxe_Log.trace("mint button! " + kha_Scheduler.time(),{ fileName : "KitchenSink.hx", lineNumber : 343, className : "KitchenSink", methodName : "create_basics"});
		}});
		new mint_Button({ parent : this.canvas, name : "button2", x : 76, y : 52, w : 32, h : 32, text : "O", options : { color_hover : kha__$Color_Color_$Impl_$._new(-655237)}, text_size : 16, onclick : function(e2,c2) {
			haxe_Log.trace("mint button! " + kha_Scheduler.time(),{ fileName : "KitchenSink.hx", lineNumber : 353, className : "KitchenSink", methodName : "create_basics"});
		}});
		new mint_Image({ parent : this.canvas, name : "image1", x : 10, y : 120, w : 64, h : 64, options : { uv : new kha_math_Vector4(0,0,2,2)}, path : "transparency"});
		new mint_Panel({ parent : this.canvas, name : "panel1", x : 84, y : 120, w : 64, h : 64});
		var _scroll = new mint_Scroll({ parent : this.canvas, name : "scroll1", options : { color_handles : kha__$Color_Color_$Impl_$._new(-1)}, x : 16, y : 190, w : 128, h : 128});
		new mint_Image({ parent : _scroll, name : "image_other", x : 0, y : 100, w : 512, h : 512, path : "image0"});
	}
	,dt: null
	,lastTime: null
	,update: function() {
		this.dt = kha_Scheduler.time() - this.lastTime;
		if(this.progress != null) {
			var _g = this.progress;
			_g.set_progress(_g.progress + 0.2 * this.dt * this.progress_dir);
			if(this.progress.progress >= 1) this.progress_dir = -1;
			if(this.progress.progress <= 0) this.progress_dir = 1;
		}
		this.canvas.update(this.dt);
	}
	,render: function(frame) {
		var g = frame.get_g2();
		this.rendering.frame = frame;
		g.begin(true,kha__$Color_Color_$Impl_$.fromBytes(255,255,255,255));
		g.drawImage(kha_Assets.images.bg960,0,0);
		g.setBlendingMode(kha_graphics4_BlendingOperation.SourceAlpha,kha_graphics4_BlendingOperation.InverseSourceAlpha);
		this.canvas.render();
		g.flush();
		g.end();
		g.begin(false);
		if(this.debugControlBounds) this.drawBounds(this.canvas,g);
		g.set_color(kha__$Color_Color_$Impl_$.White);
		g.set_font(this.font);
		g.set_fontSize(15);
		var i = 0;
		var _g = 0;
		var _g1 = KhaMint.canvasDebug.split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			g.drawString(line,kha_System.get_pixelWidth() - this.font.width(15,line) - 15,25 * ++i);
		}
		var now = kha_Scheduler.time();
		var fps = "fps : " + Math.round(1.0 / (now - this.lastTime));
		g.drawString(fps,kha_System.get_pixelWidth() - this.font.width(15,fps) - 15,5);
		this.lastTime = now;
		if(KhaMint.debugControlBounds) this.drawBounds(this.canvas,g);
		g.end();
	}
	,drawBounds: function(c,g) {
		var _g = 0;
		var _g1 = c.children;
		while(_g < _g1.length) {
			var control = _g1[_g];
			++_g;
			this.drawBounds(control,g);
		}
		g.drawRect(c.x,c.y,c.w,c.h);
	}
	,__class__: KitchenSink
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = [];
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = true;
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
	,__class__: List
};
var _$List_ListIterator = function(head) {
	this.head = head;
	this.val = null;
};
$hxClasses["_List.ListIterator"] = _$List_ListIterator;
_$List_ListIterator.__name__ = true;
_$List_ListIterator.prototype = {
	head: null
	,val: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _$List_ListIterator
};
var Main = function() { };
$hxClasses["Main"] = Main;
Main.__name__ = true;
Main.main = function() {
	kha_System.init("kha mint",800,600,Main.initialized);
};
Main.initialized = function() {
	var app = new KhaMint();
	kha_System.notifyOnRender($bind(app,app.render));
	kha_Scheduler.addTimeTask($bind(app,app.update),0,0.0166666666666666664);
};
Math.__name__ = true;
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = true;
StringBuf.prototype = {
	b: null
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw new js__$Boot_HaxeError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js__$Boot_HaxeError("Constructor " + constr + " need parameters");
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw new js__$Boot_HaxeError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw new js__$Boot_HaxeError(index + " is not a valid enum constructor index");
	return Type.createEnum(e,c,params);
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
var _$UInt_UInt_$Impl_$ = {};
$hxClasses["_UInt.UInt_Impl_"] = _$UInt_UInt_$Impl_$;
_$UInt_UInt_$Impl_$.__name__ = true;
_$UInt_UInt_$Impl_$.gt = function(a,b) {
	var aNeg = a < 0;
	var bNeg = b < 0;
	if(aNeg != bNeg) return aNeg; else return a > b;
};
_$UInt_UInt_$Impl_$.gte = function(a,b) {
	var aNeg = a < 0;
	var bNeg = b < 0;
	if(aNeg != bNeg) return aNeg; else return a >= b;
};
_$UInt_UInt_$Impl_$.toFloat = function(this1) {
	var $int = this1;
	if($int < 0) return 4294967296.0 + $int; else return $int + 0.0;
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = true;
haxe_IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,__class__: haxe_IMap
};
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function() { };
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = true;
haxe_Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
var haxe_Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = [];
	this.cache = [];
	var r = haxe_Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe_Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe_Unserializer;
haxe_Unserializer.__name__ = true;
haxe_Unserializer.initCodes = function() {
	var codes = [];
	var _g1 = 0;
	var _g = haxe_Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe_Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe_Unserializer.run = function(v) {
	return new haxe_Unserializer(v).unserialize();
};
haxe_Unserializer.prototype = {
	buf: null
	,pos: null
	,length: null
	,cache: null
	,scache: null
	,resolver: null
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,readFloat: function() {
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw new js__$Boot_HaxeError("Invalid object");
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw new js__$Boot_HaxeError("Invalid object key");
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw new js__$Boot_HaxeError("Invalid enum format");
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = [];
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			return this.readFloat();
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw new js__$Boot_HaxeError("Invalid string length");
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return NaN;
		case 109:
			return -Infinity;
		case 112:
			return Infinity;
		case 97:
			var buf = this.buf;
			var a = [];
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw new js__$Boot_HaxeError("Invalid reference");
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw new js__$Boot_HaxeError("Invalid string reference");
			return this.scache[n2];
		case 120:
			throw new js__$Boot_HaxeError(this.unserialize());
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw new js__$Boot_HaxeError("Class not found " + name);
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw new js__$Boot_HaxeError("Enum not found " + name1);
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw new js__$Boot_HaxeError("Enum not found " + name2);
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw new js__$Boot_HaxeError("Unknown enum index " + name2 + "@" + index);
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe_ds_StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe_ds_IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c1 = this.get(this.pos++);
			while(c1 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c1 = this.get(this.pos++);
			}
			if(c1 != 104) throw new js__$Boot_HaxeError("Invalid IntMap format");
			return h1;
		case 77:
			var h2 = new haxe_ds_ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			if(this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
				var s3 = HxOverrides.substr(this.buf,this.pos,19);
				d = HxOverrides.strDate(s3);
				this.pos += 19;
			} else {
				var t = this.readFloat();
				var d1 = new Date();
				d1.setTime(t);
				d = d1;
			}
			this.cache.push(d);
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw new js__$Boot_HaxeError("Invalid bytes length");
			var codes = haxe_Unserializer.CODES;
			if(codes == null) {
				codes = haxe_Unserializer.initCodes();
				haxe_Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe_io_Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c2 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c2 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c2 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c21 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c21 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw new js__$Boot_HaxeError("Class not found " + name3);
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw new js__$Boot_HaxeError("Invalid custom data");
			return o2;
		case 65:
			var name4 = this.unserialize();
			var cl2 = this.resolver.resolveClass(name4);
			if(cl2 == null) throw new js__$Boot_HaxeError("Class not found " + name4);
			return cl2;
		case 66:
			var name5 = this.unserialize();
			var e2 = this.resolver.resolveEnum(name5);
			if(e2 == null) throw new js__$Boot_HaxeError("Enum not found " + name5);
			return e2;
		default:
		}
		this.pos--;
		throw new js__$Boot_HaxeError("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
	}
	,__class__: haxe_Unserializer
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = true;
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) return hb;
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.prototype = {
	length: null
	,b: null
	,data: null
	,get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		return new haxe_io_Bytes(this.b.buffer.slice(pos + this.b.byteOffset,pos + this.b.byteOffset + len));
	}
	,getDouble: function(pos) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		return this.data.getFloat64(pos,true);
	}
	,getFloat: function(pos) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		return this.data.getFloat32(pos,true);
	}
	,setDouble: function(pos,v) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		this.data.setFloat64(pos,v,true);
	}
	,getUInt16: function(pos) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		return this.data.getUint16(pos,true);
	}
	,getInt32: function(pos) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		return this.data.getInt32(pos,true);
	}
	,setInt32: function(pos,v) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		this.data.setInt32(pos,v,true);
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_BytesBuffer = function() {
	this.b = [];
};
$hxClasses["haxe.io.BytesBuffer"] = haxe_io_BytesBuffer;
haxe_io_BytesBuffer.__name__ = true;
haxe_io_BytesBuffer.prototype = {
	b: null
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,getBytes: function() {
		var bytes = new haxe_io_Bytes(new Uint8Array(this.b).buffer);
		this.b = null;
		return bytes;
	}
	,__class__: haxe_io_BytesBuffer
};
var haxe_io_Input = function() { };
$hxClasses["haxe.io.Input"] = haxe_io_Input;
haxe_io_Input.__name__ = true;
haxe_io_Input.prototype = {
	bigEndian: null
	,readByte: function() {
		throw new js__$Boot_HaxeError("Not implemented");
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,read: function(nbytes) {
		var s = haxe_io_Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw new js__$Boot_HaxeError(haxe_io_Error.Blocked);
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24; else return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readString: function(len) {
		var b = haxe_io_Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,__class__: haxe_io_Input
};
var haxe_io_BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe_io_BytesInput;
haxe_io_BytesInput.__name__ = true;
haxe_io_BytesInput.__super__ = haxe_io_Input;
haxe_io_BytesInput.prototype = $extend(haxe_io_Input.prototype,{
	b: null
	,pos: null
	,len: null
	,totlen: null
	,set_position: function(p) {
		if(p < 0) p = 0; else if(p > this.totlen) p = this.totlen;
		this.len = this.totlen - p;
		return this.pos = p;
	}
	,readByte: function() {
		if(this.len == 0) throw new js__$Boot_HaxeError(new haxe_io_Eof());
		this.len--;
		return this.b[this.pos++];
	}
	,readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		if(this.len == 0 && len > 0) throw new js__$Boot_HaxeError(new haxe_io_Eof());
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,__class__: haxe_io_BytesInput
});
var haxe_io_Output = function() { };
$hxClasses["haxe.io.Output"] = haxe_io_Output;
haxe_io_Output.__name__ = true;
haxe_io_Output.prototype = {
	bigEndian: null
	,writeByte: function(c) {
		throw new js__$Boot_HaxeError("Not implemented");
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b.bufferValue;
		if(pos < 0 || len < 0 || pos + len > s.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw new js__$Boot_HaxeError(haxe_io_Error.Blocked);
			p += k;
			l -= k;
		}
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,__class__: haxe_io_Output
};
var haxe_io_BytesOutput = function() {
	this.b = new haxe_io_BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe_io_BytesOutput;
haxe_io_BytesOutput.__name__ = true;
haxe_io_BytesOutput.__super__ = haxe_io_Output;
haxe_io_BytesOutput.prototype = $extend(haxe_io_Output.prototype,{
	b: null
	,writeByte: function(c) {
		this.b.b.push(c);
	}
	,writeBytes: function(buf,pos,len) {
		this.b.addBytes(buf,pos,len);
		return len;
	}
	,getBytes: function() {
		return this.b.getBytes();
	}
	,__class__: haxe_io_BytesOutput
});
var haxe_io_Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = true;
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxClasses["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
$hxClasses["haxe.io.FPHelper"] = haxe_io_FPHelper;
haxe_io_FPHelper.__name__ = true;
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = true;
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return (Function("return typeof " + name + " != \"undefined\" ? " + name + " : null"))();
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
$hxClasses["js.html.compat.ArrayBuffer"] = js_html_compat_ArrayBuffer;
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	byteLength: null
	,a: null
	,slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_Uint8Array = function() { };
$hxClasses["js.html.compat.Uint8Array"] = js_html_compat_Uint8Array;
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var kha_ImageList = function() {
	this.transparencyDescription = { files : ["transparency.png"], original_height : 64, type : "image", original_width : 64, name : "transparency"};
	this.transparencyName = "transparency";
	this.transparency = null;
	this.mint_boxDescription = { files : ["mint.box.png"], original_height : 128, type : "image", original_width : 128, name : "mint_box"};
	this.mint_boxName = "mint_box";
	this.mint_box = null;
	this.image0Description = { files : ["image0.png"], original_height : 1024, type : "image", original_width : 1024, name : "image0"};
	this.image0Name = "image0";
	this.image0 = null;
	this.bg960Description = { files : ["bg960.png"], original_height : 640, type : "image", original_width : 960, name : "bg960"};
	this.bg960Name = "bg960";
	this.bg960 = null;
};
$hxClasses["kha.ImageList"] = kha_ImageList;
kha_ImageList.__name__ = true;
kha_ImageList.prototype = {
	bg960: null
	,bg960Name: null
	,bg960Description: null
	,bg960Load: function(done) {
		kha_Assets.loadImage("bg960",function(image) {
			done();
		});
	}
	,bg960Unload: function() {
		this.bg960.unload();
		this.bg960 = null;
	}
	,image0: null
	,image0Name: null
	,image0Description: null
	,image0Load: function(done) {
		kha_Assets.loadImage("image0",function(image) {
			done();
		});
	}
	,image0Unload: function() {
		this.image0.unload();
		this.image0 = null;
	}
	,mint_box: null
	,mint_boxName: null
	,mint_boxDescription: null
	,mint_boxLoad: function(done) {
		kha_Assets.loadImage("mint_box",function(image) {
			done();
		});
	}
	,mint_boxUnload: function() {
		this.mint_box.unload();
		this.mint_box = null;
	}
	,transparency: null
	,transparencyName: null
	,transparencyDescription: null
	,transparencyLoad: function(done) {
		kha_Assets.loadImage("transparency",function(image) {
			done();
		});
	}
	,transparencyUnload: function() {
		this.transparency.unload();
		this.transparency = null;
	}
	,__class__: kha_ImageList
};
var kha_SoundList = function() {
};
$hxClasses["kha.SoundList"] = kha_SoundList;
kha_SoundList.__name__ = true;
kha_SoundList.prototype = {
	__class__: kha_SoundList
};
var kha_BlobList = function() {
};
$hxClasses["kha.BlobList"] = kha_BlobList;
kha_BlobList.__name__ = true;
kha_BlobList.prototype = {
	__class__: kha_BlobList
};
var kha_FontList = function() {
	this.segoeUISymbolDescription = { files : ["segoeUISymbol.ttf"], type : "font", name : "segoeUISymbol"};
	this.segoeUISymbolName = "segoeUISymbol";
	this.segoeUISymbol = null;
};
$hxClasses["kha.FontList"] = kha_FontList;
kha_FontList.__name__ = true;
kha_FontList.prototype = {
	segoeUISymbol: null
	,segoeUISymbolName: null
	,segoeUISymbolDescription: null
	,segoeUISymbolLoad: function(done) {
		kha_Assets.loadFont("segoeUISymbol",function(font) {
			done();
		});
	}
	,segoeUISymbolUnload: function() {
		this.segoeUISymbol.unload();
		this.segoeUISymbol = null;
	}
	,__class__: kha_FontList
};
var kha_VideoList = function() {
};
$hxClasses["kha.VideoList"] = kha_VideoList;
kha_VideoList.__name__ = true;
kha_VideoList.prototype = {
	__class__: kha_VideoList
};
var kha_Assets = function() { };
$hxClasses["kha.Assets"] = kha_Assets;
kha_Assets.__name__ = true;
kha_Assets.loadEverything = function(callback) {
	var filesLeft = 0;
	var _g = 0;
	var _g1 = Type.getInstanceFields(kha_BlobList);
	while(_g < _g1.length) {
		var blob = _g1[_g];
		++_g;
		if(StringTools.endsWith(blob,"Load")) ++filesLeft;
	}
	var _g2 = 0;
	var _g11 = Type.getInstanceFields(kha_ImageList);
	while(_g2 < _g11.length) {
		var image = _g11[_g2];
		++_g2;
		if(StringTools.endsWith(image,"Load")) ++filesLeft;
	}
	var _g3 = 0;
	var _g12 = Type.getInstanceFields(kha_SoundList);
	while(_g3 < _g12.length) {
		var sound = _g12[_g3];
		++_g3;
		if(StringTools.endsWith(sound,"Load")) ++filesLeft;
	}
	var _g4 = 0;
	var _g13 = Type.getInstanceFields(kha_FontList);
	while(_g4 < _g13.length) {
		var font = _g13[_g4];
		++_g4;
		if(StringTools.endsWith(font,"Load")) ++filesLeft;
	}
	var _g5 = 0;
	var _g14 = Type.getInstanceFields(kha_VideoList);
	while(_g5 < _g14.length) {
		var video = _g14[_g5];
		++_g5;
		if(StringTools.endsWith(video,"Load")) ++filesLeft;
	}
	if(filesLeft == 0) {
		callback();
		return;
	}
	var _g6 = 0;
	var _g15 = Type.getInstanceFields(kha_BlobList);
	while(_g6 < _g15.length) {
		var blob1 = _g15[_g6];
		++_g6;
		if(StringTools.endsWith(blob1,"Load")) (Reflect.field(kha_Assets.blobs,blob1))(function() {
			--filesLeft;
			if(filesLeft == 0) callback();
		});
	}
	var _g7 = 0;
	var _g16 = Type.getInstanceFields(kha_ImageList);
	while(_g7 < _g16.length) {
		var image1 = _g16[_g7];
		++_g7;
		if(StringTools.endsWith(image1,"Load")) (Reflect.field(kha_Assets.images,image1))(function() {
			--filesLeft;
			if(filesLeft == 0) callback();
		});
	}
	var _g8 = 0;
	var _g17 = Type.getInstanceFields(kha_SoundList);
	while(_g8 < _g17.length) {
		var sound1 = _g17[_g8];
		++_g8;
		if(StringTools.endsWith(sound1,"Load")) (Reflect.field(kha_Assets.sounds,sound1))(function() {
			--filesLeft;
			if(filesLeft == 0) callback();
		});
	}
	var _g9 = 0;
	var _g18 = Type.getInstanceFields(kha_FontList);
	while(_g9 < _g18.length) {
		var font1 = _g18[_g9];
		++_g9;
		if(StringTools.endsWith(font1,"Load")) (Reflect.field(kha_Assets.fonts,font1))(function() {
			--filesLeft;
			if(filesLeft == 0) callback();
		});
	}
	var _g10 = 0;
	var _g19 = Type.getInstanceFields(kha_VideoList);
	while(_g10 < _g19.length) {
		var video1 = _g19[_g10];
		++_g10;
		if(StringTools.endsWith(video1,"Load")) (Reflect.field(kha_Assets.videos,video1))(function() {
			--filesLeft;
			if(filesLeft == 0) callback();
		});
	}
};
kha_Assets.loadImage = function(name,done) {
	var description = Reflect.field(kha_Assets.images,name + "Description");
	kha_LoaderImpl.loadImageFromDescription(description,function(image) {
		kha_Assets.images[name] = image;
		done(image);
	});
};
kha_Assets.loadImageFromPath = function(path,readable,done) {
	var description = { files : [path], readable : readable};
	kha_LoaderImpl.loadImageFromDescription(description,done);
};
kha_Assets.get_imageFormats = function() {
	return kha_LoaderImpl.getImageFormats();
};
kha_Assets.loadBlob = function(name,done) {
	var description = Reflect.field(kha_Assets.blobs,name + "Description");
	kha_LoaderImpl.loadBlobFromDescription(description,function(blob) {
		kha_Assets.blobs[name] = blob;
		done(blob);
	});
};
kha_Assets.loadBlobFromPath = function(path,done) {
	var description = { files : [path]};
	kha_LoaderImpl.loadBlobFromDescription(description,done);
};
kha_Assets.loadSound = function(name,done) {
	var description = Reflect.field(kha_Assets.sounds,name + "Description");
	kha_LoaderImpl.loadSoundFromDescription(description,function(sound) {
		kha_Assets.sounds[name] = sound;
		done(sound);
	});
	return;
};
kha_Assets.loadSoundFromPath = function(path,done) {
	var description = { files : [path]};
	kha_LoaderImpl.loadSoundFromDescription(description,done);
	return;
};
kha_Assets.get_soundFormats = function() {
	return kha_LoaderImpl.getSoundFormats();
};
kha_Assets.loadFont = function(name,done) {
	var description = Reflect.field(kha_Assets.fonts,name + "Description");
	kha_LoaderImpl.loadFontFromDescription(description,function(font) {
		kha_Assets.fonts[name] = font;
		done(font);
	});
	return;
};
kha_Assets.loadFontFromPath = function(path,done) {
	var description = { files : [path]};
	kha_LoaderImpl.loadFontFromDescription(description,done);
	return;
};
kha_Assets.get_fontFormats = function() {
	return ["ttf"];
};
kha_Assets.loadVideo = function(name,done) {
	var description = Reflect.field(kha_Assets.videos,name + "Description");
	kha_LoaderImpl.loadVideoFromDescription(description,function(video) {
		kha_Assets.videos[name] = video;
		done(video);
	});
	return;
};
kha_Assets.loadVideoFromPath = function(path,done) {
	var description = { files : [path]};
	kha_LoaderImpl.loadVideoFromDescription(description,done);
	return;
};
kha_Assets.get_videoFormats = function() {
	return kha_LoaderImpl.getVideoFormats();
};
var kha_Canvas = function() { };
$hxClasses["kha.Canvas"] = kha_Canvas;
kha_Canvas.__name__ = true;
kha_Canvas.prototype = {
	get_width: null
	,get_height: null
	,get_g1: null
	,get_g2: null
	,get_g4: null
	,width: null
	,height: null
	,g1: null
	,g2: null
	,g4: null
	,__class__: kha_Canvas
};
var kha_Resource = function() { };
$hxClasses["kha.Resource"] = kha_Resource;
kha_Resource.__name__ = true;
kha_Resource.prototype = {
	unload: null
	,__class__: kha_Resource
};
var kha_Image = function() { };
$hxClasses["kha.Image"] = kha_Image;
kha_Image.__name__ = true;
kha_Image.__interfaces__ = [kha_Resource,kha_Canvas];
kha_Image.create = function(width,height,format,usage,levels) {
	if(levels == null) levels = 1;
	if(format == null) format = kha_graphics4_TextureFormat.RGBA32;
	if(usage == null) usage = kha_graphics4_Usage.StaticUsage;
	if(kha_SystemImpl.gl == null) return new kha_CanvasImage(width,height,format,false); else return new kha_WebGLImage(width,height,format,false);
};
kha_Image.createRenderTarget = function(width,height,format,depthStencil,antiAliasingSamples) {
	if(antiAliasingSamples == null) antiAliasingSamples = 1;
	if(depthStencil == null) depthStencil = false;
	if(format == null) format = kha_graphics4_TextureFormat.RGBA32;
	if(kha_SystemImpl.gl == null) return new kha_CanvasImage(width,height,format,true); else return new kha_WebGLImage(width,height,format,true);
};
kha_Image.fromImage = function(image,readable) {
	if(kha_SystemImpl.gl == null) {
		var img = new kha_CanvasImage(image.width,image.height,kha_graphics4_TextureFormat.RGBA32,false);
		img.image = image;
		img.createTexture();
		return img;
	} else {
		var img1 = new kha_WebGLImage(image.width,image.height,kha_graphics4_TextureFormat.RGBA32,false);
		img1.image = image;
		img1.createTexture();
		return img1;
	}
};
kha_Image.fromVideo = function(video) {
	if(kha_SystemImpl.gl == null) {
		var img = new kha_CanvasImage(video.element.videoWidth,video.element.videoHeight,kha_graphics4_TextureFormat.RGBA32,false);
		img.video = video.element;
		img.createTexture();
		return img;
	} else {
		var img1 = new kha_WebGLImage(video.element.videoWidth,video.element.videoHeight,kha_graphics4_TextureFormat.RGBA32,false);
		img1.video = video.element;
		img1.createTexture();
		return img1;
	}
};
kha_Image.get_maxSize = function() {
	if(kha_SystemImpl.gl == null) return 8192; else return kha_SystemImpl.gl.getParameter(3379);
};
kha_Image.get_nonPow2Supported = function() {
	return kha_SystemImpl.gl != null;
};
kha_Image.prototype = {
	isOpaque: function(x,y) {
		return false;
	}
	,at: function(x,y) {
		return kha__$Color_Color_$Impl_$.Black;
	}
	,unload: function() {
	}
	,lock: function(level) {
		if(level == null) level = 0;
		return null;
	}
	,unlock: function() {
	}
	,width: null
	,get_width: function() {
		return 0;
	}
	,height: null
	,get_height: function() {
		return 0;
	}
	,realWidth: null
	,get_realWidth: function() {
		return 0;
	}
	,realHeight: null
	,get_realHeight: function() {
		return 0;
	}
	,g1: null
	,get_g1: function() {
		return null;
	}
	,g2: null
	,get_g2: function() {
		return null;
	}
	,g4: null
	,get_g4: function() {
		return null;
	}
	,__class__: kha_Image
};
var kha_CanvasImage = function(width,height,format,renderTarget) {
	this.g2canvas = null;
	this.myWidth = width;
	this.myHeight = height;
	this.format = format;
	this.renderTarget = renderTarget;
	this.image = null;
	this.video = null;
	if(renderTarget) this.createTexture();
};
$hxClasses["kha.CanvasImage"] = kha_CanvasImage;
kha_CanvasImage.__name__ = true;
kha_CanvasImage.init = function() {
	var canvas = window.document.createElement("canvas");
	if(canvas != null) {
		kha_CanvasImage.context = canvas.getContext("2d");
		canvas.width = 2048;
		canvas.height = 2048;
		kha_CanvasImage.context.globalCompositeOperation = "copy";
	}
};
kha_CanvasImage.upperPowerOfTwo = function(v) {
	v--;
	v |= v >>> 1;
	v |= v >>> 2;
	v |= v >>> 4;
	v |= v >>> 8;
	v |= v >>> 16;
	v++;
	return v;
};
kha_CanvasImage.__super__ = kha_Image;
kha_CanvasImage.prototype = $extend(kha_Image.prototype,{
	image: null
	,video: null
	,data: null
	,myWidth: null
	,myHeight: null
	,format: null
	,renderTarget: null
	,frameBuffer: null
	,graphics1: null
	,g2canvas: null
	,get_g1: function() {
		if(this.graphics1 == null) this.graphics1 = new kha_graphics2_Graphics1(this);
		return this.graphics1;
	}
	,get_g2: function() {
		if(this.g2canvas == null) {
			var canvas = window.document.createElement("canvas");
			this.image = canvas;
			var context = canvas.getContext("2d");
			canvas.width = this.get_width();
			canvas.height = this.get_height();
			this.g2canvas = new kha_js_CanvasGraphics(context,this.get_width(),this.get_height());
		}
		return this.g2canvas;
	}
	,get_g4: function() {
		return null;
	}
	,get_width: function() {
		return this.myWidth;
	}
	,get_height: function() {
		return this.myHeight;
	}
	,get_realWidth: function() {
		return this.myWidth;
	}
	,get_realHeight: function() {
		return this.myHeight;
	}
	,isOpaque: function(x,y) {
		if(this.data == null) {
			if(kha_CanvasImage.context == null) return true; else this.createImageData();
		}
		return this.data.data[y * Std["int"](this.image.width) * 4 + x * 4 + 3] != 0;
	}
	,at: function(x,y) {
		if(this.data == null) {
			if(kha_CanvasImage.context == null) return kha__$Color_Color_$Impl_$.Black; else this.createImageData();
		}
		var value = this.data.data[y * Std["int"](this.image.width) * 4 + x * 4];
		return kha__$Color_Color_$Impl_$._new(value);
	}
	,createImageData: function() {
		kha_CanvasImage.context.strokeStyle = "rgba(0,0,0,0)";
		kha_CanvasImage.context.fillStyle = "rgba(0,0,0,0)";
		kha_CanvasImage.context.fillRect(0,0,this.image.width,this.image.height);
		kha_CanvasImage.context.drawImage(this.image,0,0,this.image.width,this.image.height,0,0,this.image.width,this.image.height);
		this.data = kha_CanvasImage.context.getImageData(0,0,this.image.width,this.image.height);
	}
	,texture: null
	,createTexture: function() {
		if(kha_SystemImpl.gl == null) return;
		this.texture = kha_SystemImpl.gl.createTexture();
		kha_SystemImpl.gl.bindTexture(3553,this.texture);
		kha_SystemImpl.gl.texParameteri(3553,10240,9729);
		kha_SystemImpl.gl.texParameteri(3553,10241,9729);
		kha_SystemImpl.gl.texParameteri(3553,10242,33071);
		kha_SystemImpl.gl.texParameteri(3553,10243,33071);
		if(this.renderTarget) {
			this.frameBuffer = kha_SystemImpl.gl.createFramebuffer();
			kha_SystemImpl.gl.bindFramebuffer(36160,this.frameBuffer);
			kha_SystemImpl.gl.texImage2D(3553,0,6408,this.get_realWidth(),this.get_realHeight(),0,6408,5121,null);
			kha_SystemImpl.gl.framebufferTexture2D(36160,36064,3553,this.texture,0);
			kha_SystemImpl.gl.bindFramebuffer(36160,null);
		} else if(this.video != null) kha_SystemImpl.gl.texImage2D(3553,0,6408,6408,5121,this.video); else kha_SystemImpl.gl.texImage2D(3553,0,6408,6408,5121,this.image);
		kha_SystemImpl.gl.bindTexture(3553,null);
	}
	,set: function(stage) {
		kha_SystemImpl.gl.activeTexture(33984 + stage);
		kha_SystemImpl.gl.bindTexture(3553,this.texture);
		if(this.video != null) kha_SystemImpl.gl.texImage2D(3553,0,6408,6408,5121,this.video);
	}
	,bytes: null
	,lock: function(level) {
		if(level == null) level = 0;
		this.bytes = haxe_io_Bytes.alloc(this.format == kha_graphics4_TextureFormat.RGBA32?4 * this.get_width() * this.get_height():this.get_width() * this.get_height());
		return this.bytes;
	}
	,unlock: function() {
		if(kha_SystemImpl.gl != null) {
			this.texture = kha_SystemImpl.gl.createTexture();
			kha_SystemImpl.gl.bindTexture(3553,this.texture);
			kha_SystemImpl.gl.texParameteri(3553,10240,9729);
			kha_SystemImpl.gl.texParameteri(3553,10241,9729);
			kha_SystemImpl.gl.texParameteri(3553,10242,33071);
			kha_SystemImpl.gl.texParameteri(3553,10243,33071);
			kha_SystemImpl.gl.texImage2D(3553,0,6409,this.get_width(),this.get_height(),0,6409,5121,new Uint8Array(this.bytes.b.bufferValue));
			if(kha_SystemImpl.gl.getError() == 1282) {
				var rgbaBytes = haxe_io_Bytes.alloc(this.get_width() * this.get_height() * 4);
				var _g1 = 0;
				var _g = this.get_height();
				while(_g1 < _g) {
					var y = _g1++;
					var _g3 = 0;
					var _g2 = this.get_width();
					while(_g3 < _g2) {
						var x = _g3++;
						var value = this.bytes.get(y * this.get_width() + x);
						rgbaBytes.set(y * this.get_width() * 4 + x * 4,value);
						rgbaBytes.set(y * this.get_width() * 4 + x * 4 + 1,value);
						rgbaBytes.set(y * this.get_width() * 4 + x * 4 + 2,value);
						rgbaBytes.set(y * this.get_width() * 4 + x * 4 + 3,255);
					}
				}
				kha_SystemImpl.gl.texImage2D(3553,0,6408,this.get_width(),this.get_height(),0,6408,5121,new Uint8Array(rgbaBytes.b.bufferValue));
			}
			kha_SystemImpl.gl.bindTexture(3553,null);
			this.bytes = null;
		}
	}
	,unload: function() {
	}
	,__class__: kha_CanvasImage
});
var kha__$Color_Color_$Impl_$ = {};
$hxClasses["kha._Color.Color_Impl_"] = kha__$Color_Color_$Impl_$;
kha__$Color_Color_$Impl_$.__name__ = true;
kha__$Color_Color_$Impl_$.fromValue = function(value) {
	return kha__$Color_Color_$Impl_$._new(value);
};
kha__$Color_Color_$Impl_$.fromBytes = function(r,g,b,a) {
	if(a == null) a = 255;
	return kha__$Color_Color_$Impl_$._new(a << 24 | r << 16 | g << 8 | b);
};
kha__$Color_Color_$Impl_$.fromFloats = function(r,g,b,a) {
	if(a == null) a = 1;
	return kha__$Color_Color_$Impl_$._new((a * 255 | 0) << 24 | (r * 255 | 0) << 16 | (g * 255 | 0) << 8 | (b * 255 | 0));
};
kha__$Color_Color_$Impl_$.fromString = function(value) {
	if((value.length == 7 || value.length == 9) && value.charCodeAt(0) == 35) {
		var colorValue = Std.parseInt("0x" + HxOverrides.substr(value,1,null));
		if(value.length == 7) colorValue += -16777216;
		return kha__$Color_Color_$Impl_$._new(colorValue);
	} else throw new js__$Boot_HaxeError("Invalid Color string: '" + value + "'");
};
kha__$Color_Color_$Impl_$._new = function(value) {
	return value;
};
kha__$Color_Color_$Impl_$.get_value = function(this1) {
	return this1;
};
kha__$Color_Color_$Impl_$.set_value = function(this1,value) {
	this1 = value;
	return this1;
};
kha__$Color_Color_$Impl_$.get_Rb = function(this1) {
	return (this1 & 16711680) >>> 16;
};
kha__$Color_Color_$Impl_$.get_Gb = function(this1) {
	return (this1 & 65280) >>> 8;
};
kha__$Color_Color_$Impl_$.get_Bb = function(this1) {
	return this1 & 255;
};
kha__$Color_Color_$Impl_$.get_Ab = function(this1) {
	return this1 >>> 24;
};
kha__$Color_Color_$Impl_$.set_Rb = function(this1,i) {
	this1 = kha__$Color_Color_$Impl_$.get_Ab(this1) << 24 | i << 16 | kha__$Color_Color_$Impl_$.get_Gb(this1) << 8 | kha__$Color_Color_$Impl_$.get_Bb(this1);
	return i;
};
kha__$Color_Color_$Impl_$.set_Gb = function(this1,i) {
	this1 = kha__$Color_Color_$Impl_$.get_Ab(this1) << 24 | kha__$Color_Color_$Impl_$.get_Rb(this1) << 16 | i << 8 | kha__$Color_Color_$Impl_$.get_Bb(this1);
	return i;
};
kha__$Color_Color_$Impl_$.set_Bb = function(this1,i) {
	this1 = kha__$Color_Color_$Impl_$.get_Ab(this1) << 24 | kha__$Color_Color_$Impl_$.get_Rb(this1) << 16 | kha__$Color_Color_$Impl_$.get_Gb(this1) << 8 | i;
	return i;
};
kha__$Color_Color_$Impl_$.set_Ab = function(this1,i) {
	this1 = i << 24 | kha__$Color_Color_$Impl_$.get_Rb(this1) << 16 | kha__$Color_Color_$Impl_$.get_Gb(this1) << 8 | kha__$Color_Color_$Impl_$.get_Bb(this1);
	return i;
};
kha__$Color_Color_$Impl_$.get_R = function(this1) {
	return kha__$Color_Color_$Impl_$.get_Rb(this1) * 0.00392156862745098;
};
kha__$Color_Color_$Impl_$.get_G = function(this1) {
	return kha__$Color_Color_$Impl_$.get_Gb(this1) * 0.00392156862745098;
};
kha__$Color_Color_$Impl_$.get_B = function(this1) {
	return kha__$Color_Color_$Impl_$.get_Bb(this1) * 0.00392156862745098;
};
kha__$Color_Color_$Impl_$.get_A = function(this1) {
	return kha__$Color_Color_$Impl_$.get_Ab(this1) * 0.00392156862745098;
};
kha__$Color_Color_$Impl_$.set_R = function(this1,f) {
	this1 = Std["int"](kha__$Color_Color_$Impl_$.get_Ab(this1) * 0.00392156862745098 * 255) << 24 | (f * 255 | 0) << 16 | Std["int"](kha__$Color_Color_$Impl_$.get_Gb(this1) * 0.00392156862745098 * 255) << 8 | Std["int"](kha__$Color_Color_$Impl_$.get_Bb(this1) * 0.00392156862745098 * 255);
	return f;
};
kha__$Color_Color_$Impl_$.set_G = function(this1,f) {
	this1 = Std["int"](kha__$Color_Color_$Impl_$.get_Ab(this1) * 0.00392156862745098 * 255) << 24 | Std["int"](kha__$Color_Color_$Impl_$.get_Rb(this1) * 0.00392156862745098 * 255) << 16 | (f * 255 | 0) << 8 | Std["int"](kha__$Color_Color_$Impl_$.get_Bb(this1) * 0.00392156862745098 * 255);
	return f;
};
kha__$Color_Color_$Impl_$.set_B = function(this1,f) {
	this1 = Std["int"](kha__$Color_Color_$Impl_$.get_Ab(this1) * 0.00392156862745098 * 255) << 24 | Std["int"](kha__$Color_Color_$Impl_$.get_Rb(this1) * 0.00392156862745098 * 255) << 16 | Std["int"](kha__$Color_Color_$Impl_$.get_Gb(this1) * 0.00392156862745098 * 255) << 8 | (f * 255 | 0);
	return f;
};
kha__$Color_Color_$Impl_$.set_A = function(this1,f) {
	this1 = (f * 255 | 0) << 24 | Std["int"](kha__$Color_Color_$Impl_$.get_Rb(this1) * 0.00392156862745098 * 255) << 16 | Std["int"](kha__$Color_Color_$Impl_$.get_Gb(this1) * 0.00392156862745098 * 255) << 8 | Std["int"](kha__$Color_Color_$Impl_$.get_Bb(this1) * 0.00392156862745098 * 255);
	return f;
};
var kha_EnvironmentVariables = function() {
};
$hxClasses["kha.EnvironmentVariables"] = kha_EnvironmentVariables;
kha_EnvironmentVariables.__name__ = true;
kha_EnvironmentVariables.prototype = {
	getVariable: function(name) {
		return "";
	}
	,__class__: kha_EnvironmentVariables
};
var kha_Font = function() { };
$hxClasses["kha.Font"] = kha_Font;
kha_Font.__name__ = true;
kha_Font.__interfaces__ = [kha_Resource];
kha_Font.prototype = {
	height: null
	,width: null
	,baseline: null
	,__class__: kha_Font
};
var kha_FontStyle = function(bold,italic,underlined) {
	this.bold = bold;
	this.italic = italic;
	this.underlined = underlined;
};
$hxClasses["kha.FontStyle"] = kha_FontStyle;
kha_FontStyle.__name__ = true;
kha_FontStyle.prototype = {
	bold: null
	,italic: null
	,underlined: null
	,getBold: function() {
		return this.bold;
	}
	,getItalic: function() {
		return this.italic;
	}
	,getUnderlined: function() {
		return this.underlined;
	}
	,__class__: kha_FontStyle
};
var kha_Framebuffer = function(g1,g2,g4) {
	this.graphics1 = g1;
	this.graphics2 = g2;
	this.graphics4 = g4;
};
$hxClasses["kha.Framebuffer"] = kha_Framebuffer;
kha_Framebuffer.__name__ = true;
kha_Framebuffer.__interfaces__ = [kha_Canvas];
kha_Framebuffer.prototype = {
	graphics1: null
	,graphics2: null
	,graphics4: null
	,init: function(g1,g2,g4) {
		this.graphics1 = g1;
		this.graphics2 = g2;
		this.graphics4 = g4;
	}
	,g1: null
	,get_g1: function() {
		return this.graphics1;
	}
	,g2: null
	,get_g2: function() {
		return this.graphics2;
	}
	,g4: null
	,get_g4: function() {
		return this.graphics4;
	}
	,width: null
	,get_width: function() {
		return kha_System.get_pixelWidth();
	}
	,height: null
	,get_height: function() {
		return kha_System.get_pixelHeight();
	}
	,__class__: kha_Framebuffer
};
var kha_Key = $hxClasses["kha.Key"] = { __ename__ : true, __constructs__ : ["BACKSPACE","TAB","ENTER","SHIFT","CTRL","ALT","CHAR","ESC","DEL","UP","DOWN","LEFT","RIGHT","BACK"] };
kha_Key.BACKSPACE = ["BACKSPACE",0];
kha_Key.BACKSPACE.toString = $estr;
kha_Key.BACKSPACE.__enum__ = kha_Key;
kha_Key.TAB = ["TAB",1];
kha_Key.TAB.toString = $estr;
kha_Key.TAB.__enum__ = kha_Key;
kha_Key.ENTER = ["ENTER",2];
kha_Key.ENTER.toString = $estr;
kha_Key.ENTER.__enum__ = kha_Key;
kha_Key.SHIFT = ["SHIFT",3];
kha_Key.SHIFT.toString = $estr;
kha_Key.SHIFT.__enum__ = kha_Key;
kha_Key.CTRL = ["CTRL",4];
kha_Key.CTRL.toString = $estr;
kha_Key.CTRL.__enum__ = kha_Key;
kha_Key.ALT = ["ALT",5];
kha_Key.ALT.toString = $estr;
kha_Key.ALT.__enum__ = kha_Key;
kha_Key.CHAR = ["CHAR",6];
kha_Key.CHAR.toString = $estr;
kha_Key.CHAR.__enum__ = kha_Key;
kha_Key.ESC = ["ESC",7];
kha_Key.ESC.toString = $estr;
kha_Key.ESC.__enum__ = kha_Key;
kha_Key.DEL = ["DEL",8];
kha_Key.DEL.toString = $estr;
kha_Key.DEL.__enum__ = kha_Key;
kha_Key.UP = ["UP",9];
kha_Key.UP.toString = $estr;
kha_Key.UP.__enum__ = kha_Key;
kha_Key.DOWN = ["DOWN",10];
kha_Key.DOWN.toString = $estr;
kha_Key.DOWN.__enum__ = kha_Key;
kha_Key.LEFT = ["LEFT",11];
kha_Key.LEFT.toString = $estr;
kha_Key.LEFT.__enum__ = kha_Key;
kha_Key.RIGHT = ["RIGHT",12];
kha_Key.RIGHT.toString = $estr;
kha_Key.RIGHT.__enum__ = kha_Key;
kha_Key.BACK = ["BACK",13];
kha_Key.BACK.toString = $estr;
kha_Key.BACK.__enum__ = kha_Key;
var kha_AlignedQuad = function() {
};
$hxClasses["kha.AlignedQuad"] = kha_AlignedQuad;
kha_AlignedQuad.__name__ = true;
kha_AlignedQuad.prototype = {
	x0: null
	,y0: null
	,s0: null
	,t0: null
	,x1: null
	,y1: null
	,s1: null
	,t1: null
	,xadvance: null
	,__class__: kha_AlignedQuad
};
var kha_KravurImage = function(size,ascent,descent,lineGap,width,height,chars,pixels) {
	this.mySize = size;
	this.width = width;
	this.height = height;
	this.chars = chars;
	this.baseline = ascent;
	var _g = 0;
	while(_g < chars.length) {
		var $char = chars[_g];
		++_g;
		$char.yoff += this.baseline;
	}
	this.texture = kha_Image.create(width,height,kha_graphics4_TextureFormat.L8);
	var bytes = this.texture.lock();
	var pos = 0;
	var _g1 = 0;
	while(_g1 < height) {
		var y = _g1++;
		var _g11 = 0;
		while(_g11 < width) {
			var x = _g11++;
			bytes.set(pos,pixels.readU8(pos));
			++pos;
		}
	}
	this.texture.unlock();
};
$hxClasses["kha.KravurImage"] = kha_KravurImage;
kha_KravurImage.__name__ = true;
kha_KravurImage.prototype = {
	mySize: null
	,chars: null
	,texture: null
	,width: null
	,height: null
	,baseline: null
	,getTexture: function() {
		return this.texture;
	}
	,getBakedQuad: function(char_index,xpos,ypos) {
		if(char_index >= this.chars.length) return null;
		var ipw = 1.0 / this.width;
		var iph = 1.0 / this.height;
		var b = this.chars[char_index];
		if(b == null) return null;
		var round_x = Math.round(xpos + b.xoff);
		var round_y = Math.round(ypos + b.yoff);
		var q = new kha_AlignedQuad();
		q.x0 = round_x;
		q.y0 = round_y;
		q.x1 = round_x + b.x1 - b.x0;
		q.y1 = round_y + b.y1 - b.y0;
		q.s0 = b.x0 * ipw;
		q.t0 = b.y0 * iph;
		q.s1 = b.x1 * ipw;
		q.t1 = b.y1 * iph;
		q.xadvance = b.xadvance;
		return q;
	}
	,getCharWidth: function(charIndex) {
		if(charIndex < 32) return 0;
		if(charIndex - 32 >= this.chars.length) return 0;
		return this.chars[charIndex - 32].xadvance;
	}
	,getHeight: function() {
		return this.mySize;
	}
	,stringWidth: function(string) {
		var str = new String(string);
		var width = 0;
		var _g1 = 0;
		var _g = str.length;
		while(_g1 < _g) {
			var c = _g1++;
			width += this.getCharWidth(HxOverrides.cca(str,c));
		}
		return width;
	}
	,getBaselinePosition: function() {
		return this.baseline;
	}
	,__class__: kha_KravurImage
};
var kha_Kravur = function(blob) {
	this.images = new haxe_ds_IntMap();
	this.blob = blob;
};
$hxClasses["kha.Kravur"] = kha_Kravur;
kha_Kravur.__name__ = true;
kha_Kravur.__interfaces__ = [kha_Font];
kha_Kravur.prototype = {
	blob: null
	,images: null
	,_get: function(fontSize) {
		if(!this.images.h.hasOwnProperty(fontSize)) {
			var width = 64;
			var height = 32;
			var baked;
			var this1;
			this1 = new Array(224);
			baked = this1;
			var _g1 = 0;
			var _g = baked.length;
			while(_g1 < _g) {
				var i = _g1++;
				var val = new kha_graphics2_truetype_Stbtt_$bakedchar();
				baked[i] = val;
			}
			var pixels = null;
			var status = -1;
			while(status < 0) {
				if(height < width) height *= 2; else width *= 2;
				pixels = kha_internal_BytesBlob.alloc(width * height);
				status = kha_graphics2_truetype_StbTruetype.stbtt_BakeFontBitmap(this.blob,0,fontSize,pixels,width,height,32,224,baked);
			}
			var info = new kha_graphics2_truetype_Stbtt_$fontinfo();
			kha_graphics2_truetype_StbTruetype.stbtt_InitFont(info,this.blob,0);
			var metrics = kha_graphics2_truetype_StbTruetype.stbtt_GetFontVMetrics(info);
			var scale = kha_graphics2_truetype_StbTruetype.stbtt_ScaleForPixelHeight(info,fontSize);
			var ascent = Math.round(metrics.ascent * scale);
			var descent = Math.round(metrics.descent * scale);
			var lineGap = Math.round(metrics.lineGap * scale);
			var image = new kha_KravurImage(fontSize | 0,ascent,descent,lineGap,width,height,baked,pixels);
			{
				this.images.h[fontSize] = image;
				image;
			}
			return image;
		}
		return this.images.h[fontSize];
	}
	,height: function(fontSize) {
		return this._get(fontSize).getHeight();
	}
	,width: function(fontSize,str) {
		return this._get(fontSize).stringWidth(str);
	}
	,baseline: function(fontSize) {
		return this._get(fontSize).getBaselinePosition();
	}
	,unload: function() {
		this.blob = null;
		this.images = null;
	}
	,__class__: kha_Kravur
};
var kha_LoaderImpl = function() { };
$hxClasses["kha.LoaderImpl"] = kha_LoaderImpl;
kha_LoaderImpl.__name__ = true;
kha_LoaderImpl.getImageFormats = function() {
	return ["png","jpg"];
};
kha_LoaderImpl.loadImageFromDescription = function(desc,done) {
	var img = window.document.createElement("img");
	img.src = desc.files[0];
	var readable;
	if(Object.prototype.hasOwnProperty.call(desc,"readable")) readable = desc.readable; else readable = false;
	img.onload = function(event) {
		done(kha_Image.fromImage(img,readable));
	};
};
kha_LoaderImpl.getSoundFormats = function() {
	if(kha_SystemImpl._hasWebAudio) return ["ogg"]; else return ["mp4","ogg"];
};
kha_LoaderImpl.loadSoundFromDescription = function(desc,done) {
	if(kha_SystemImpl._hasWebAudio) {
		var _g1 = 0;
		var _g = desc.files.length;
		while(_g1 < _g) {
			var i = _g1++;
			var file = desc.files[i];
			if(StringTools.endsWith(file,".ogg")) {
				new kha_js_WebAudioSound(file,done);
				break;
			}
		}
	} else new kha_js_Sound(desc.files,done);
};
kha_LoaderImpl.getVideoFormats = function() {
	return ["mp4","webm"];
};
kha_LoaderImpl.loadVideoFromDescription = function(desc,done) {
	var video = new kha_js_Video(desc.files,done);
};
kha_LoaderImpl.loadBlobFromDescription = function(desc,done) {
	var request = new XMLHttpRequest();
	request.open("GET",desc.files[0],true);
	request.responseType = "arraybuffer";
	request.onreadystatechange = function() {
		if(request.readyState != 4) return;
		if(request.status >= 200 && request.status < 400) {
			var bytes = null;
			var arrayBuffer = request.response;
			if(arrayBuffer != null) {
				var byteArray = new Uint8Array(arrayBuffer);
				bytes = haxe_io_Bytes.alloc(byteArray.byteLength);
				var _g1 = 0;
				var _g = byteArray.byteLength;
				while(_g1 < _g) {
					var i = _g1++;
					bytes.b[i] = byteArray[i] & 255;
				}
			} else if(request.responseBody != null) {
				var data = VBArray(request.responseBody).toArray();
				bytes = haxe_io_Bytes.alloc(data.length);
				var _g11 = 0;
				var _g2 = data.length;
				while(_g11 < _g2) {
					var i1 = _g11++;
					bytes.b[i1] = data[i1] & 255;
				}
			} else {
				haxe_Log.trace("Error loading " + desc.files[0],{ fileName : "LoaderImpl.hx", lineNumber : 88, className : "kha.LoaderImpl", methodName : "loadBlobFromDescription"});
				window.console.log("loadBlob failed");
			}
			done(new kha_internal_BytesBlob(bytes));
		} else {
			haxe_Log.trace("Error loading " + desc.files[0],{ fileName : "LoaderImpl.hx", lineNumber : 94, className : "kha.LoaderImpl", methodName : "loadBlobFromDescription"});
			window.console.log("loadBlob failed");
		}
	};
	request.send(null);
};
kha_LoaderImpl.loadFontFromDescription = function(desc,done) {
	kha_LoaderImpl.loadBlobFromDescription(desc,function(blob) {
		if(kha_SystemImpl.gl == null) done(new kha_js_Font(new kha_Kravur(blob))); else done(new kha_Kravur(blob));
	});
};
var kha_Rotation = function(center,angle) {
	this.center = center;
	this.angle = angle;
};
$hxClasses["kha.Rotation"] = kha_Rotation;
kha_Rotation.__name__ = true;
kha_Rotation.prototype = {
	center: null
	,angle: null
	,__class__: kha_Rotation
};
var kha_TargetRectangle = function(x,y,w,h,s,r) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.scaleFactor = s;
	this.rotation = r;
};
$hxClasses["kha.TargetRectangle"] = kha_TargetRectangle;
kha_TargetRectangle.__name__ = true;
kha_TargetRectangle.prototype = {
	x: null
	,y: null
	,width: null
	,height: null
	,scaleFactor: null
	,rotation: null
	,__class__: kha_TargetRectangle
};
var kha_Scaler = function() { };
$hxClasses["kha.Scaler"] = kha_Scaler;
kha_Scaler.__name__ = true;
kha_Scaler.targetRect = function(width,height,destinationWidth,destinationHeight,rotation) {
	var scalex;
	var scaley;
	var scalew;
	var scaleh;
	var scale;
	switch(rotation[1]) {
	case 0:
		if(width / height > destinationWidth / destinationHeight) {
			scale = destinationWidth / width;
			scalew = width * scale;
			scaleh = height * scale;
			scalex = 0;
			scaley = (destinationHeight - scaleh) * 0.5;
		} else {
			scale = destinationHeight / height;
			scalew = width * scale;
			scaleh = height * scale;
			scalex = (destinationWidth - scalew) * 0.5;
			scaley = 0;
		}
		break;
	case 1:
		if(width / height > destinationHeight / destinationWidth) {
			scale = destinationHeight / width;
			scalew = width * scale;
			scaleh = height * scale;
			scalex = (destinationWidth - scaleh) * 0.5 + scaleh;
			scaley = 0;
		} else {
			scale = destinationWidth / height;
			scalew = width * scale;
			scaleh = height * scale;
			scalex = scaleh;
			scaley = (destinationHeight - scalew) * 0.5;
		}
		break;
	case 2:
		if(width / height > destinationWidth / destinationHeight) {
			scale = destinationWidth / width;
			scalew = width * scale;
			scaleh = height * scale;
			scalex = scalew;
			scaley = (destinationHeight - scaleh) * 0.5 + scaleh;
		} else {
			scale = destinationHeight / height;
			scalew = width * scale;
			scaleh = height * scale;
			scalex = (destinationWidth - scalew) * 0.5 + scalew;
			scaley = scaleh;
		}
		break;
	case 3:
		if(width / height > destinationHeight / destinationWidth) {
			scale = destinationHeight / width;
			scalew = width * scale;
			scaleh = height * scale;
			scalex = (destinationWidth - scaleh) * 0.5;
			scaley = scalew;
		} else {
			scale = destinationWidth / height;
			scalew = width * scale;
			scaleh = height * scale;
			scalex = 0;
			scaley = (destinationHeight - scalew) * 0.5 + scalew;
		}
		break;
	}
	return new kha_TargetRectangle(scalex,scaley,scalew,scaleh,scale,rotation);
};
kha_Scaler.transformXDirectly = function(x,y,sourceWidth,sourceHeight,destinationWidth,destinationHeight,rotation) {
	var targetRect = kha_Scaler.targetRect(sourceWidth,sourceHeight,destinationWidth,destinationHeight,rotation);
	var _g = targetRect.rotation;
	switch(_g[1]) {
	case 0:
		return (x - targetRect.x) / targetRect.scaleFactor | 0;
	case 1:
		return (y - targetRect.y) / targetRect.scaleFactor | 0;
	case 2:
		return (targetRect.x - x) / targetRect.scaleFactor | 0;
	case 3:
		return (targetRect.y - y) / targetRect.scaleFactor | 0;
	}
};
kha_Scaler.transformX = function(x,y,source,destination,rotation) {
	return kha_Scaler.transformXDirectly(x,y,source.get_width(),source.get_height(),destination.get_width(),destination.get_height(),rotation);
};
kha_Scaler.transformYDirectly = function(x,y,sourceWidth,sourceHeight,destinationWidth,destinationHeight,rotation) {
	var targetRect = kha_Scaler.targetRect(sourceWidth,sourceHeight,destinationWidth,destinationHeight,rotation);
	var _g = targetRect.rotation;
	switch(_g[1]) {
	case 0:
		return (y - targetRect.y) / targetRect.scaleFactor | 0;
	case 1:
		return (targetRect.x - x) / targetRect.scaleFactor | 0;
	case 2:
		return (targetRect.y - y) / targetRect.scaleFactor | 0;
	case 3:
		return (x - targetRect.x) / targetRect.scaleFactor | 0;
	}
};
kha_Scaler.transformY = function(x,y,source,destination,rotation) {
	return kha_Scaler.transformYDirectly(x,y,source.get_width(),source.get_height(),destination.get_width(),destination.get_height(),rotation);
};
kha_Scaler.scale = function(source,destination,rotation) {
	var g = destination.get_g2();
	g.set_transformation(kha_Scaler.getScaledTransformation(source.get_width(),source.get_height(),destination.get_width(),destination.get_height(),rotation));
	g.set_color(kha__$Color_Color_$Impl_$.White);
	g.set_opacity(1);
	g.drawImage(source,0,0);
};
kha_Scaler.getScaledTransformation = function(width,height,destinationWidth,destinationHeight,rotation) {
	var rect = kha_Scaler.targetRect(width,height,destinationWidth,destinationHeight,rotation);
	var sf = rect.scaleFactor;
	var transformation = new kha_math_FastMatrix3(sf,0,rect.x,0,sf,rect.y,0,0,1);
	switch(rotation[1]) {
	case 0:
		break;
	case 1:
		var m;
		var alpha = Math.PI / 2;
		m = new kha_math_FastMatrix3(Math.cos(alpha),-Math.sin(alpha),0,Math.sin(alpha),Math.cos(alpha),0,0,0,1);
		transformation = new kha_math_FastMatrix3(transformation._00 * m._00 + transformation._10 * m._01 + transformation._20 * m._02,transformation._00 * m._10 + transformation._10 * m._11 + transformation._20 * m._12,transformation._00 * m._20 + transformation._10 * m._21 + transformation._20 * m._22,transformation._01 * m._00 + transformation._11 * m._01 + transformation._21 * m._02,transformation._01 * m._10 + transformation._11 * m._11 + transformation._21 * m._12,transformation._01 * m._20 + transformation._11 * m._21 + transformation._21 * m._22,transformation._02 * m._00 + transformation._12 * m._01 + transformation._22 * m._02,transformation._02 * m._10 + transformation._12 * m._11 + transformation._22 * m._12,transformation._02 * m._20 + transformation._12 * m._21 + transformation._22 * m._22);
		break;
	case 2:
		var m1;
		var alpha1 = Math.PI;
		m1 = new kha_math_FastMatrix3(Math.cos(alpha1),-Math.sin(alpha1),0,Math.sin(alpha1),Math.cos(alpha1),0,0,0,1);
		transformation = new kha_math_FastMatrix3(transformation._00 * m1._00 + transformation._10 * m1._01 + transformation._20 * m1._02,transformation._00 * m1._10 + transformation._10 * m1._11 + transformation._20 * m1._12,transformation._00 * m1._20 + transformation._10 * m1._21 + transformation._20 * m1._22,transformation._01 * m1._00 + transformation._11 * m1._01 + transformation._21 * m1._02,transformation._01 * m1._10 + transformation._11 * m1._11 + transformation._21 * m1._12,transformation._01 * m1._20 + transformation._11 * m1._21 + transformation._21 * m1._22,transformation._02 * m1._00 + transformation._12 * m1._01 + transformation._22 * m1._02,transformation._02 * m1._10 + transformation._12 * m1._11 + transformation._22 * m1._12,transformation._02 * m1._20 + transformation._12 * m1._21 + transformation._22 * m1._22);
		break;
	case 3:
		var m2;
		var alpha2 = Math.PI * 3 / 2;
		m2 = new kha_math_FastMatrix3(Math.cos(alpha2),-Math.sin(alpha2),0,Math.sin(alpha2),Math.cos(alpha2),0,0,0,1);
		transformation = new kha_math_FastMatrix3(transformation._00 * m2._00 + transformation._10 * m2._01 + transformation._20 * m2._02,transformation._00 * m2._10 + transformation._10 * m2._11 + transformation._20 * m2._12,transformation._00 * m2._20 + transformation._10 * m2._21 + transformation._20 * m2._22,transformation._01 * m2._00 + transformation._11 * m2._01 + transformation._21 * m2._02,transformation._01 * m2._10 + transformation._11 * m2._11 + transformation._21 * m2._12,transformation._01 * m2._20 + transformation._11 * m2._21 + transformation._21 * m2._22,transformation._02 * m2._00 + transformation._12 * m2._01 + transformation._22 * m2._02,transformation._02 * m2._10 + transformation._12 * m2._11 + transformation._22 * m2._12,transformation._02 * m2._20 + transformation._12 * m2._21 + transformation._22 * m2._22);
		break;
	}
	return transformation;
};
var kha_TimeTask = function() {
};
$hxClasses["kha.TimeTask"] = kha_TimeTask;
kha_TimeTask.__name__ = true;
kha_TimeTask.prototype = {
	task: null
	,start: null
	,period: null
	,duration: null
	,next: null
	,id: null
	,groupId: null
	,active: null
	,paused: null
	,__class__: kha_TimeTask
};
var kha_FrameTask = function(task,priority,id) {
	this.task = task;
	this.priority = priority;
	this.id = id;
	this.active = true;
	this.paused = false;
};
$hxClasses["kha.FrameTask"] = kha_FrameTask;
kha_FrameTask.__name__ = true;
kha_FrameTask.prototype = {
	task: null
	,priority: null
	,id: null
	,active: null
	,paused: null
	,__class__: kha_FrameTask
};
var kha_Scheduler = function() { };
$hxClasses["kha.Scheduler"] = kha_Scheduler;
kha_Scheduler.__name__ = true;
kha_Scheduler.init = function() {
	kha_Scheduler.deltas = [];
	var _g1 = 0;
	var _g = kha_Scheduler.DIF_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		kha_Scheduler.deltas[i] = 0;
	}
	kha_Scheduler.stopped = true;
	kha_Scheduler.frame_tasks_sorted = true;
	kha_Scheduler.current = kha_Scheduler.realTime();
	kha_Scheduler.lastTime = kha_Scheduler.realTime();
	kha_Scheduler.currentFrameTaskId = 0;
	kha_Scheduler.currentTimeTaskId = 0;
	kha_Scheduler.currentGroupId = 0;
	kha_Scheduler.timeTasks = [];
	kha_Scheduler.frameTasks = [];
	kha_Scheduler.toDeleteTime = [];
	kha_Scheduler.toDeleteFrame = [];
};
kha_Scheduler.start = function(restartTimers) {
	if(restartTimers == null) restartTimers = false;
	kha_Scheduler.vsync = kha_System.get_vsync();
	var hz = kha_System.get_refreshRate();
	if(hz >= 57 && hz <= 63) hz = 60;
	kha_Scheduler.onedifhz = 1.0 / hz;
	kha_Scheduler.stopped = false;
	kha_Scheduler.resetTime();
	kha_Scheduler.lastTime = kha_Scheduler.realTime();
	var _g1 = 0;
	var _g = kha_Scheduler.DIF_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		kha_Scheduler.deltas[i] = 0;
	}
	if(restartTimers) {
		var _g2 = 0;
		var _g11 = kha_Scheduler.timeTasks;
		while(_g2 < _g11.length) {
			var timeTask = _g11[_g2];
			++_g2;
			timeTask.paused = false;
		}
		var _g3 = 0;
		var _g12 = kha_Scheduler.frameTasks;
		while(_g3 < _g12.length) {
			var frameTask = _g12[_g3];
			++_g3;
			frameTask.paused = false;
		}
	}
};
kha_Scheduler.stop = function() {
	kha_Scheduler.stopped = true;
};
kha_Scheduler.isStopped = function() {
	return kha_Scheduler.stopped;
};
kha_Scheduler.back = function(time) {
	kha_Scheduler.lastTime = time;
	var _g = 0;
	var _g1 = kha_Scheduler.timeTasks;
	while(_g < _g1.length) {
		var timeTask = _g1[_g];
		++_g;
		if(timeTask.start >= time) timeTask.next = timeTask.start; else {
			timeTask.next = timeTask.start;
			while(timeTask.next < time) timeTask.next += timeTask.period;
		}
	}
};
kha_Scheduler.executeFrame = function() {
	var now = kha_Scheduler.realTime();
	var delta = now - kha_Scheduler.lastNow;
	kha_Scheduler.lastNow = now;
	var frameEnd = kha_Scheduler.current;
	if(delta < 0) return;
	if(delta > kha_Scheduler.maxframetime) {
		delta = kha_Scheduler.maxframetime;
		frameEnd += delta;
	} else if(kha_Scheduler.vsync) {
		var realdif = kha_Scheduler.onedifhz;
		while(realdif < delta - kha_Scheduler.onedifhz) realdif += kha_Scheduler.onedifhz;
		delta = realdif;
		var _g1 = 0;
		var _g = kha_Scheduler.DIF_COUNT - 2;
		while(_g1 < _g) {
			var i = _g1++;
			delta += kha_Scheduler.deltas[i];
			kha_Scheduler.deltas[i] = kha_Scheduler.deltas[i + 1];
		}
		delta += kha_Scheduler.deltas[kha_Scheduler.DIF_COUNT - 2];
		delta /= kha_Scheduler.DIF_COUNT;
		kha_Scheduler.deltas[kha_Scheduler.DIF_COUNT - 2] = realdif;
		frameEnd += delta;
	} else {
		var _g11 = 0;
		var _g2 = kha_Scheduler.DIF_COUNT - 1;
		while(_g11 < _g2) {
			var i1 = _g11++;
			kha_Scheduler.deltas[i1] = kha_Scheduler.deltas[i1 + 1];
		}
		kha_Scheduler.deltas[kha_Scheduler.DIF_COUNT - 1] = delta;
		var next = 0;
		var _g12 = 0;
		var _g3 = kha_Scheduler.DIF_COUNT;
		while(_g12 < _g3) {
			var i2 = _g12++;
			next += kha_Scheduler.deltas[i2];
		}
		next /= kha_Scheduler.DIF_COUNT;
		frameEnd += next;
	}
	kha_Scheduler.lastTime = frameEnd;
	if(!kha_Scheduler.stopped) kha_Scheduler.current = frameEnd;
	var _g4 = 0;
	var _g13 = kha_Scheduler.timeTasks;
	while(_g4 < _g13.length) {
		var t = _g13[_g4];
		++_g4;
		kha_Scheduler.activeTimeTask = t;
		if(kha_Scheduler.stopped || kha_Scheduler.activeTimeTask.paused) kha_Scheduler.activeTimeTask.next += delta; else if(kha_Scheduler.activeTimeTask.next <= frameEnd) {
			kha_Scheduler.activeTimeTask.next += t.period;
			HxOverrides.remove(kha_Scheduler.timeTasks,kha_Scheduler.activeTimeTask);
			if(kha_Scheduler.activeTimeTask.active && kha_Scheduler.activeTimeTask.task()) {
				if(kha_Scheduler.activeTimeTask.period > 0 && (kha_Scheduler.activeTimeTask.duration == 0 || kha_Scheduler.activeTimeTask.duration >= kha_Scheduler.activeTimeTask.start + kha_Scheduler.activeTimeTask.next)) kha_Scheduler.insertSorted(kha_Scheduler.timeTasks,kha_Scheduler.activeTimeTask);
			} else kha_Scheduler.activeTimeTask.active = false;
		}
	}
	kha_Scheduler.activeTimeTask = null;
	var _g5 = 0;
	var _g14 = kha_Scheduler.timeTasks;
	while(_g5 < _g14.length) {
		var timeTask = _g14[_g5];
		++_g5;
		if(!timeTask.active) kha_Scheduler.toDeleteTime.push(timeTask);
	}
	while(kha_Scheduler.toDeleteTime.length > 0) {
		var x = kha_Scheduler.toDeleteTime.pop();
		HxOverrides.remove(kha_Scheduler.timeTasks,x);
	}
	kha_Scheduler.sortFrameTasks();
	var _g6 = 0;
	var _g15 = kha_Scheduler.frameTasks;
	while(_g6 < _g15.length) {
		var frameTask = _g15[_g6];
		++_g6;
		if(!kha_Scheduler.stopped && !frameTask.paused) {
			if(!frameTask.task()) frameTask.active = false;
		}
	}
	var _g7 = 0;
	var _g16 = kha_Scheduler.frameTasks;
	while(_g7 < _g16.length) {
		var frameTask1 = _g16[_g7];
		++_g7;
		if(!frameTask1.active) kha_Scheduler.toDeleteFrame.push(frameTask1);
	}
	while(kha_Scheduler.toDeleteFrame.length > 0) {
		var x1 = kha_Scheduler.toDeleteFrame.pop();
		HxOverrides.remove(kha_Scheduler.frameTasks,x1);
	}
};
kha_Scheduler.time = function() {
	return kha_Scheduler.current;
};
kha_Scheduler.realTime = function() {
	return kha_System.get_time() - kha_Scheduler.startTime;
};
kha_Scheduler.resetTime = function() {
	var now = kha_System.get_time();
	kha_Scheduler.lastNow = 0;
	var dif = now - kha_Scheduler.startTime;
	kha_Scheduler.startTime = now;
	var _g = 0;
	var _g1 = kha_Scheduler.timeTasks;
	while(_g < _g1.length) {
		var timeTask = _g1[_g];
		++_g;
		timeTask.start -= dif;
		timeTask.next -= dif;
	}
	var _g11 = 0;
	var _g2 = kha_Scheduler.DIF_COUNT;
	while(_g11 < _g2) {
		var i = _g11++;
		kha_Scheduler.deltas[i] = 0;
	}
	kha_Scheduler.current = 0;
	kha_Scheduler.lastTime = 0;
};
kha_Scheduler.addBreakableFrameTask = function(task,priority) {
	kha_Scheduler.frameTasks.push(new kha_FrameTask(task,priority,++kha_Scheduler.currentFrameTaskId));
	kha_Scheduler.frame_tasks_sorted = false;
	return kha_Scheduler.currentFrameTaskId;
};
kha_Scheduler.addFrameTask = function(task,priority) {
	return kha_Scheduler.addBreakableFrameTask(function() {
		task();
		return true;
	},priority);
};
kha_Scheduler.pauseFrameTask = function(id,paused) {
	var _g = 0;
	var _g1 = kha_Scheduler.frameTasks;
	while(_g < _g1.length) {
		var frameTask = _g1[_g];
		++_g;
		if(frameTask.id == id) {
			frameTask.paused = paused;
			break;
		}
	}
};
kha_Scheduler.removeFrameTask = function(id) {
	var _g = 0;
	var _g1 = kha_Scheduler.frameTasks;
	while(_g < _g1.length) {
		var frameTask = _g1[_g];
		++_g;
		if(frameTask.id == id) {
			frameTask.active = false;
			HxOverrides.remove(kha_Scheduler.frameTasks,frameTask);
			break;
		}
	}
};
kha_Scheduler.generateGroupId = function() {
	return ++kha_Scheduler.currentGroupId;
};
kha_Scheduler.addBreakableTimeTaskToGroup = function(groupId,task,start,period,duration) {
	if(duration == null) duration = 0;
	if(period == null) period = 0;
	var t = new kha_TimeTask();
	t.active = true;
	t.task = task;
	t.id = ++kha_Scheduler.currentTimeTaskId;
	t.groupId = groupId;
	t.start = kha_Scheduler.current + start;
	t.period = 0;
	if(period != 0) t.period = period;
	t.duration = 0;
	if(duration != 0) t.duration = t.start + duration;
	t.next = t.start;
	kha_Scheduler.insertSorted(kha_Scheduler.timeTasks,t);
	return t.id;
};
kha_Scheduler.addTimeTaskToGroup = function(groupId,task,start,period,duration) {
	if(duration == null) duration = 0;
	if(period == null) period = 0;
	return kha_Scheduler.addBreakableTimeTaskToGroup(groupId,function() {
		task();
		return true;
	},start,period,duration);
};
kha_Scheduler.addBreakableTimeTask = function(task,start,period,duration) {
	if(duration == null) duration = 0;
	if(period == null) period = 0;
	return kha_Scheduler.addBreakableTimeTaskToGroup(0,task,start,period,duration);
};
kha_Scheduler.addTimeTask = function(task,start,period,duration) {
	if(duration == null) duration = 0;
	if(period == null) period = 0;
	return kha_Scheduler.addTimeTaskToGroup(0,task,start,period,duration);
};
kha_Scheduler.getTimeTask = function(id) {
	if(kha_Scheduler.activeTimeTask != null && kha_Scheduler.activeTimeTask.id == id) return kha_Scheduler.activeTimeTask;
	var _g = 0;
	var _g1 = kha_Scheduler.timeTasks;
	while(_g < _g1.length) {
		var timeTask = _g1[_g];
		++_g;
		if(timeTask.id == id) return timeTask;
	}
	return null;
};
kha_Scheduler.pauseTimeTask = function(id,paused) {
	var timeTask = kha_Scheduler.getTimeTask(id);
	if(timeTask != null) timeTask.paused = paused;
};
kha_Scheduler.pauseTimeTasks = function(groupId,paused) {
	var _g = 0;
	var _g1 = kha_Scheduler.timeTasks;
	while(_g < _g1.length) {
		var timeTask = _g1[_g];
		++_g;
		if(timeTask.groupId == groupId) timeTask.paused = paused;
	}
	if(kha_Scheduler.activeTimeTask != null && kha_Scheduler.activeTimeTask.groupId == groupId) kha_Scheduler.activeTimeTask.paused = true;
};
kha_Scheduler.removeTimeTask = function(id) {
	var timeTask = kha_Scheduler.getTimeTask(id);
	if(timeTask != null) {
		timeTask.active = false;
		HxOverrides.remove(kha_Scheduler.timeTasks,timeTask);
	}
};
kha_Scheduler.removeTimeTasks = function(groupId) {
	var _g = 0;
	var _g1 = kha_Scheduler.timeTasks;
	while(_g < _g1.length) {
		var timeTask = _g1[_g];
		++_g;
		if(timeTask.groupId == groupId) {
			timeTask.active = false;
			kha_Scheduler.toDeleteTime.push(timeTask);
		}
	}
	if(kha_Scheduler.activeTimeTask != null && kha_Scheduler.activeTimeTask.groupId == groupId) kha_Scheduler.activeTimeTask.paused = false;
	while(kha_Scheduler.toDeleteTime.length > 0) {
		var x = kha_Scheduler.toDeleteTime.pop();
		HxOverrides.remove(kha_Scheduler.timeTasks,x);
	}
};
kha_Scheduler.numTasksInSchedule = function() {
	return kha_Scheduler.timeTasks.length + kha_Scheduler.frameTasks.length;
};
kha_Scheduler.insertSorted = function(list,task) {
	var _g1 = 0;
	var _g = list.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(list[i].next > task.next) {
			list.splice(i,0,task);
			return;
		}
	}
	list.push(task);
};
kha_Scheduler.sortFrameTasks = function() {
	if(kha_Scheduler.frame_tasks_sorted) return;
	kha_Scheduler.frameTasks.sort(function(a,b) {
		if(a.priority > b.priority) return 1; else if(a.priority < b.priority) return -1; else return 0;
	});
	kha_Scheduler.frame_tasks_sorted = true;
};
var kha_ScreenRotation = $hxClasses["kha.ScreenRotation"] = { __ename__ : true, __constructs__ : ["RotationNone","Rotation90","Rotation180","Rotation270"] };
kha_ScreenRotation.RotationNone = ["RotationNone",0];
kha_ScreenRotation.RotationNone.toString = $estr;
kha_ScreenRotation.RotationNone.__enum__ = kha_ScreenRotation;
kha_ScreenRotation.Rotation90 = ["Rotation90",1];
kha_ScreenRotation.Rotation90.toString = $estr;
kha_ScreenRotation.Rotation90.__enum__ = kha_ScreenRotation;
kha_ScreenRotation.Rotation180 = ["Rotation180",2];
kha_ScreenRotation.Rotation180.toString = $estr;
kha_ScreenRotation.Rotation180.__enum__ = kha_ScreenRotation;
kha_ScreenRotation.Rotation270 = ["Rotation270",3];
kha_ScreenRotation.Rotation270.toString = $estr;
kha_ScreenRotation.Rotation270.__enum__ = kha_ScreenRotation;
var kha_Shaders = function() { };
$hxClasses["kha.Shaders"] = kha_Shaders;
kha_Shaders.__name__ = true;
kha_Shaders.init = function() {
	var data = Reflect.field(kha_Shaders,"painter_colored_fragData");
	var bytes = haxe_Unserializer.run(data);
	kha_Shaders.painter_colored_frag = new kha_graphics4_FragmentShader(kha_internal_BytesBlob.fromBytes(bytes));
	var data1 = Reflect.field(kha_Shaders,"painter_colored_vertData");
	var bytes1 = haxe_Unserializer.run(data1);
	kha_Shaders.painter_colored_vert = new kha_graphics4_VertexShader(kha_internal_BytesBlob.fromBytes(bytes1));
	var data2 = Reflect.field(kha_Shaders,"painter_image_fragData");
	var bytes2 = haxe_Unserializer.run(data2);
	kha_Shaders.painter_image_frag = new kha_graphics4_FragmentShader(kha_internal_BytesBlob.fromBytes(bytes2));
	var data3 = Reflect.field(kha_Shaders,"painter_image_vertData");
	var bytes3 = haxe_Unserializer.run(data3);
	kha_Shaders.painter_image_vert = new kha_graphics4_VertexShader(kha_internal_BytesBlob.fromBytes(bytes3));
	var data4 = Reflect.field(kha_Shaders,"painter_text_fragData");
	var bytes4 = haxe_Unserializer.run(data4);
	kha_Shaders.painter_text_frag = new kha_graphics4_FragmentShader(kha_internal_BytesBlob.fromBytes(bytes4));
	var data5 = Reflect.field(kha_Shaders,"painter_text_vertData");
	var bytes5 = haxe_Unserializer.run(data5);
	kha_Shaders.painter_text_vert = new kha_graphics4_VertexShader(kha_internal_BytesBlob.fromBytes(bytes5));
	var data6 = Reflect.field(kha_Shaders,"painter_video_fragData");
	var bytes6 = haxe_Unserializer.run(data6);
	kha_Shaders.painter_video_frag = new kha_graphics4_FragmentShader(kha_internal_BytesBlob.fromBytes(bytes6));
	var data7 = Reflect.field(kha_Shaders,"painter_video_vertData");
	var bytes7 = haxe_Unserializer.run(data7);
	kha_Shaders.painter_video_vert = new kha_graphics4_VertexShader(kha_internal_BytesBlob.fromBytes(bytes7));
};
var kha_Sound = function() {
};
$hxClasses["kha.Sound"] = kha_Sound;
kha_Sound.__name__ = true;
kha_Sound.__interfaces__ = [kha_Resource];
kha_Sound.prototype = {
	data: null
	,compressed: null
	,unload: function() {
	}
	,__class__: kha_Sound
};
var kha_System = function() { };
$hxClasses["kha.System"] = kha_System;
kha_System.__name__ = true;
kha_System.init = function(title,width,height,callback) {
	kha_SystemImpl.init(title,width,height,callback);
};
kha_System.notifyOnRender = function(listener) {
	kha_System.renderListeners.push(listener);
};
kha_System.notifyOnApplicationState = function(foregroundListener,resumeListener,pauseListener,backgroundListener,shutdownListener) {
	kha_System.foregroundListeners.push(foregroundListener);
	kha_System.resumeListeners.push(resumeListener);
	kha_System.pauseListeners.push(pauseListener);
	kha_System.backgroundListeners.push(backgroundListener);
	kha_System.shutdownListeners.push(shutdownListener);
};
kha_System.render = function(framebuffer) {
	var _g = 0;
	var _g1 = kha_System.renderListeners;
	while(_g < _g1.length) {
		var listener = _g1[_g];
		++_g;
		listener(framebuffer);
	}
};
kha_System.foreground = function() {
	var _g = 0;
	var _g1 = kha_System.foregroundListeners;
	while(_g < _g1.length) {
		var listener = _g1[_g];
		++_g;
		listener();
	}
};
kha_System.resume = function() {
	var _g = 0;
	var _g1 = kha_System.resumeListeners;
	while(_g < _g1.length) {
		var listener = _g1[_g];
		++_g;
		listener();
	}
};
kha_System.pause = function() {
	var _g = 0;
	var _g1 = kha_System.pauseListeners;
	while(_g < _g1.length) {
		var listener = _g1[_g];
		++_g;
		listener();
	}
};
kha_System.background = function() {
	var _g = 0;
	var _g1 = kha_System.backgroundListeners;
	while(_g < _g1.length) {
		var listener = _g1[_g];
		++_g;
		listener();
	}
};
kha_System.shutdown = function() {
	var _g = 0;
	var _g1 = kha_System.shutdownListeners;
	while(_g < _g1.length) {
		var listener = _g1[_g];
		++_g;
		listener();
	}
};
kha_System.get_time = function() {
	return kha_SystemImpl.getTime();
};
kha_System.get_pixelWidth = function() {
	return kha_SystemImpl.getPixelWidth();
};
kha_System.get_pixelHeight = function() {
	return kha_SystemImpl.getPixelHeight();
};
kha_System.get_screenRotation = function() {
	return kha_SystemImpl.getScreenRotation();
};
kha_System.get_vsync = function() {
	return kha_SystemImpl.getVsync();
};
kha_System.get_refreshRate = function() {
	return kha_SystemImpl.getRefreshRate();
};
kha_System.get_systemId = function() {
	return kha_SystemImpl.getSystemId();
};
kha_System.requestShutdown = function() {
	kha_SystemImpl.requestShutdown();
};
kha_System.changeResolution = function(width,height) {
	kha_SystemImpl.changeResolution(width,height);
};
kha_System.loadUrl = function(url) {
};
var kha_GamepadStates = function() {
	this.axes = [];
	this.buttons = [];
};
$hxClasses["kha.GamepadStates"] = kha_GamepadStates;
kha_GamepadStates.__name__ = true;
kha_GamepadStates.prototype = {
	axes: null
	,buttons: null
	,__class__: kha_GamepadStates
};
var kha_SystemImpl = function() { };
$hxClasses["kha.SystemImpl"] = kha_SystemImpl;
kha_SystemImpl.__name__ = true;
kha_SystemImpl.initPerformanceTimer = function() {
	if(window.performance != null) kha_SystemImpl.performance = window.performance; else kha_SystemImpl.performance = window.Date;
};
kha_SystemImpl.init = function(title,width,height,callback) {
	kha_SystemImpl.init2();
	callback();
};
kha_SystemImpl.setCanvas = function(canvas) {
	kha_SystemImpl.khanvas = canvas;
};
kha_SystemImpl.getScreenRotation = function() {
	return kha_ScreenRotation.RotationNone;
};
kha_SystemImpl.getTime = function() {
	return kha_SystemImpl.performance.now() / 1000;
};
kha_SystemImpl.getPixelWidth = function() {
	return kha_SystemImpl.khanvas.width;
};
kha_SystemImpl.getPixelHeight = function() {
	return kha_SystemImpl.khanvas.height;
};
kha_SystemImpl.getVsync = function() {
	return true;
};
kha_SystemImpl.getRefreshRate = function() {
	return 60;
};
kha_SystemImpl.getSystemId = function() {
	return "HTML5";
};
kha_SystemImpl.requestShutdown = function() {
	window.close();
};
kha_SystemImpl.init2 = function(backbufferFormat) {
	haxe_Log.trace = js_Boot.__trace;
	kha_SystemImpl.keyboard = new kha_input_Keyboard();
	kha_SystemImpl.mouse = new kha_input_Mouse();
	kha_SystemImpl.surface = new kha_input_Surface();
	kha_SystemImpl.gamepads = [];
	kha_SystemImpl.gamepadStates = [];
	var _g1 = 0;
	var _g = kha_SystemImpl.maxGamepads;
	while(_g1 < _g) {
		var i = _g1++;
		kha_SystemImpl.gamepads[i] = new kha_input_Gamepad(i);
		kha_SystemImpl.gamepadStates[i] = new kha_GamepadStates();
	}
	kha_SystemImpl.pressedKeys = [];
	var _g2 = 0;
	while(_g2 < 256) {
		var i1 = _g2++;
		kha_SystemImpl.pressedKeys.push(false);
	}
	var _g3 = 0;
	while(_g3 < 256) {
		var i2 = _g3++;
		kha_SystemImpl.pressedKeys.push(null);
	}
	kha_SystemImpl.buttonspressed = [];
	var _g4 = 0;
	while(_g4 < 10) {
		var i3 = _g4++;
		kha_SystemImpl.buttonspressed.push(false);
	}
	kha_CanvasImage.init();
	kha_SystemImpl.initPerformanceTimer();
	kha_Scheduler.init();
	kha_SystemImpl.loadFinished();
	kha_EnvironmentVariables.instance = new kha_js_EnvironmentVariables();
};
kha_SystemImpl.getMouse = function(num) {
	if(num != 0) return null;
	return kha_SystemImpl.mouse;
};
kha_SystemImpl.getKeyboard = function(num) {
	if(num != 0) return null;
	return kha_SystemImpl.keyboard;
};
kha_SystemImpl.checkGamepadButton = function(pad,num) {
	if(kha_SystemImpl.buttonspressed[num]) {
		if(pad.buttons[num] < 0.5) kha_SystemImpl.buttonspressed[num] = false;
	} else if(pad.buttons[num] > 0.5) kha_SystemImpl.buttonspressed[num] = true;
};
kha_SystemImpl.checkGamepad = function(pad) {
	var _g1 = 0;
	var _g = pad.axes.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(pad.axes[i] != null) {
			if(kha_SystemImpl.gamepadStates[pad.index].axes[i] != pad.axes[i]) {
				kha_SystemImpl.gamepadStates[pad.index].axes[i] = pad.axes[i];
				kha_SystemImpl.gamepads[pad.index].sendAxisEvent(i,pad.axes[i]);
			}
		}
	}
	var _g11 = 0;
	var _g2 = pad.buttons.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		if(pad.buttons[i1] != null) {
			if(kha_SystemImpl.gamepadStates[pad.index].buttons[i1] != pad.buttons[i1].value) {
				kha_SystemImpl.gamepadStates[pad.index].buttons[i1] = pad.buttons[i1].value;
				kha_SystemImpl.gamepads[pad.index].sendButtonEvent(i1,pad.buttons[i1].value);
			}
		}
	}
};
kha_SystemImpl.loadFinished = function() {
	var canvas = window.document.getElementById("khanvas");
	var gl = false;
	try {
		kha_SystemImpl.gl = canvas.getContext("experimental-webgl",{ alpha : false, antialias : false});
		if(kha_SystemImpl.gl != null) {
			kha_SystemImpl.gl.pixelStorei(37441,1);
			kha_SystemImpl.gl.getExtension("OES_texture_float");
			kha_SystemImpl.drawBuffers = kha_SystemImpl.gl.getExtension("WEBGL_draw_buffers");
			gl = true;
			kha_Shaders.init();
		}
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		haxe_Log.trace(e,{ fileName : "SystemImpl.hx", lineNumber : 196, className : "kha.SystemImpl", methodName : "loadFinished"});
	}
	kha_SystemImpl.setCanvas(canvas);
	if(gl) {
		var g4;
		if(gl) g4 = new kha_js_graphics4_Graphics(); else g4 = null;
		kha_SystemImpl.frame = new kha_Framebuffer(null,null,g4);
		kha_SystemImpl.frame.init(new kha_graphics2_Graphics1(kha_SystemImpl.frame),new kha_js_graphics4_Graphics2(kha_SystemImpl.frame),g4);
	} else {
		var g2 = new kha_js_CanvasGraphics(canvas.getContext("2d"),640,480);
		kha_SystemImpl.frame = new kha_Framebuffer(null,g2,null);
		kha_SystemImpl.frame.init(new kha_graphics2_Graphics1(kha_SystemImpl.frame),g2,null);
	}
	if(kha_audio2_Audio._init()) {
		kha_SystemImpl._hasWebAudio = true;
		kha_audio2_Audio1._init();
	} else {
		kha_SystemImpl._hasWebAudio = false;
		kha_js_AudioElementAudio._compile();
		kha_audio2_Audio1 = kha_js_AudioElementAudio;
	}
	kha_Scheduler.start();
	var $window = window;
	var requestAnimationFrame = $window.requestAnimationFrame;
	if(requestAnimationFrame == null) requestAnimationFrame = $window.mozRequestAnimationFrame;
	if(requestAnimationFrame == null) requestAnimationFrame = $window.webkitRequestAnimationFrame;
	if(requestAnimationFrame == null) requestAnimationFrame = $window.msRequestAnimationFrame;
	var animate;
	var animate1 = null;
	animate1 = function(timestamp) {
		var window1 = window;
		if(requestAnimationFrame == null) window1.setTimeout(animate1,16.6666666666666679); else requestAnimationFrame(animate1);
		var sysGamepads = (navigator.getGamepads && navigator.getGamepads()) || (navigator.webkitGetGamepads && navigator.webkitGetGamepads());
		if(sysGamepads != null) {
			var _g1 = 0;
			var _g = sysGamepads.length;
			while(_g1 < _g) {
				var i = _g1++;
				var pad = sysGamepads[i];
				if(pad != null) {
					kha_SystemImpl.checkGamepadButton(pad,0);
					kha_SystemImpl.checkGamepadButton(pad,1);
					kha_SystemImpl.checkGamepadButton(pad,12);
					kha_SystemImpl.checkGamepadButton(pad,13);
					kha_SystemImpl.checkGamepadButton(pad,14);
					kha_SystemImpl.checkGamepadButton(pad,15);
					kha_SystemImpl.checkGamepad(pad);
				}
			}
		}
		kha_Scheduler.executeFrame();
		if(canvas.getContext) {
			var displayWidth = canvas.clientWidth;
			var displayHeight = canvas.clientHeight;
			if(canvas.width != displayWidth || canvas.height != displayHeight) {
				canvas.width = displayWidth;
				canvas.height = displayHeight;
			}
			kha_System.render(kha_SystemImpl.frame);
			if(kha_SystemImpl.gl != null) {
				kha_SystemImpl.gl.clearColor(1,1,1,1);
				kha_SystemImpl.gl.colorMask(false,false,false,true);
				kha_SystemImpl.gl.clear(16384);
				kha_SystemImpl.gl.colorMask(true,true,true,true);
			}
		}
	};
	animate = animate1;
	if(requestAnimationFrame == null) $window.setTimeout(animate,16.6666666666666679); else requestAnimationFrame(animate);
	if(canvas.getAttribute("tabindex") == null) canvas.setAttribute("tabindex","0");
	canvas.focus();
	canvas.oncontextmenu = function(event) {
		event.stopPropagation();
		event.preventDefault();
	};
	canvas.onmousedown = kha_SystemImpl.mouseDown;
	canvas.onmousemove = kha_SystemImpl.mouseMove;
	canvas.onkeydown = kha_SystemImpl.keyDown;
	canvas.onkeyup = kha_SystemImpl.keyUp;
	if(canvas.onwheel) canvas.onwheel = kha_SystemImpl.mouseWheel; else if(canvas.onmousewheel) canvas.onmousewheel = kha_SystemImpl.mouseWheel;
	canvas.addEventListener("wheel mousewheel",kha_SystemImpl.mouseWheel,false);
	canvas.addEventListener("touchstart",kha_SystemImpl.touchDown,false);
	canvas.addEventListener("touchend",kha_SystemImpl.touchUp,false);
	canvas.addEventListener("touchmove",kha_SystemImpl.touchMove,false);
	window.addEventListener("unload",kha_SystemImpl.unload);
};
kha_SystemImpl.lockMouse = function() {
	if(($_=kha_SystemImpl.khanvas,$bind($_,$_.requestPointerLock))) kha_SystemImpl.khanvas.requestPointerLock(); else if(canvas.mozRequestPointerLock) kha_SystemImpl.khanvas.mozRequestPointerLock(); else if(canvas.webkitRequestPointerLock) kha_SystemImpl.khanvas.webkitRequestPointerLock();
};
kha_SystemImpl.unlockMouse = function() {
	if(document.exitPointerLock) document.exitPointerLock(); else if(document.mozExitPointerLock) document.mozExitPointerLock(); else if(document.webkitExitPointerLock) document.webkitExitPointerLock();
};
kha_SystemImpl.canLockMouse = function() {
	return 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;
};
kha_SystemImpl.isMouseLocked = function() {
	return document.pointerLockElement === kha_Sys.khanvas ||
  			document.mozPointerLockElement === kha_Sys.khanvas ||
  			document.webkitPointerLockElement === kha_Sys.khanvas;
};
kha_SystemImpl.notifyOfMouseLockChange = function(func,error) {
	window.document.addEventListener("pointerlockchange",func,false);
	window.document.addEventListener("mozpointerlockchange",func,false);
	window.document.addEventListener("webkitpointerlockchange",func,false);
	window.document.addEventListener("pointerlockerror",error,false);
	window.document.addEventListener("mozpointerlockerror",error,false);
	window.document.addEventListener("webkitpointerlockerror",error,false);
};
kha_SystemImpl.removeFromMouseLockChange = function(func,error) {
	window.document.removeEventListener("pointerlockchange",func,false);
	window.document.removeEventListener("mozpointerlockchange",func,false);
	window.document.removeEventListener("webkitpointerlockchange",func,false);
	window.document.removeEventListener("pointerlockerror",error,false);
	window.document.removeEventListener("mozpointerlockerror",error,false);
	window.document.removeEventListener("webkitpointerlockerror",error,false);
};
kha_SystemImpl.unload = function(_) {
};
kha_SystemImpl.setMouseXY = function(event) {
	var rect = kha_SystemImpl.khanvas.getBoundingClientRect();
	var borderWidth = kha_SystemImpl.khanvas.clientLeft;
	var borderHeight = kha_SystemImpl.khanvas.clientTop;
	kha_SystemImpl.mouseX = (event.clientX - rect.left - borderWidth) * kha_SystemImpl.khanvas.width / (rect.width - 2 * borderWidth) | 0;
	kha_SystemImpl.mouseY = (event.clientY - rect.top - borderHeight) * kha_SystemImpl.khanvas.height / (rect.height - 2 * borderHeight) | 0;
};
kha_SystemImpl.mouseWheel = function(event) {
	kha_SystemImpl.mouse.sendWheelEvent(event.deltaY | 0);
};
kha_SystemImpl.mouseDown = function(event) {
	window.document.addEventListener("mouseup",kha_SystemImpl.mouseUp);
	kha_SystemImpl.setMouseXY(event);
	if(event.which == 1) {
		if(event.ctrlKey) {
			kha_SystemImpl.leftMouseCtrlDown = true;
			kha_SystemImpl.mouse.sendDownEvent(1,kha_SystemImpl.mouseX,kha_SystemImpl.mouseY);
		} else {
			kha_SystemImpl.leftMouseCtrlDown = false;
			kha_SystemImpl.mouse.sendDownEvent(0,kha_SystemImpl.mouseX,kha_SystemImpl.mouseY);
		}
	} else if(event.which == 2) kha_SystemImpl.mouse.sendDownEvent(2,kha_SystemImpl.mouseX,kha_SystemImpl.mouseY); else if(event.which == 3) kha_SystemImpl.mouse.sendDownEvent(1,kha_SystemImpl.mouseX,kha_SystemImpl.mouseY);
};
kha_SystemImpl.mouseUp = function(event) {
	window.document.removeEventListener("mouseup",kha_SystemImpl.mouseUp);
	kha_SystemImpl.setMouseXY(event);
	if(event.which == 1) {
		if(kha_SystemImpl.leftMouseCtrlDown) kha_SystemImpl.mouse.sendUpEvent(1,kha_SystemImpl.mouseX,kha_SystemImpl.mouseY); else kha_SystemImpl.mouse.sendUpEvent(0,kha_SystemImpl.mouseX,kha_SystemImpl.mouseY);
		kha_SystemImpl.leftMouseCtrlDown = false;
	} else if(event.which == 2) kha_SystemImpl.mouse.sendUpEvent(2,kha_SystemImpl.mouseX,kha_SystemImpl.mouseY); else if(event.which == 3) kha_SystemImpl.mouse.sendUpEvent(1,kha_SystemImpl.mouseX,kha_SystemImpl.mouseY);
};
kha_SystemImpl.mouseMove = function(event) {
	var lastMouseX = kha_SystemImpl.mouseX;
	var lastMouseY = kha_SystemImpl.mouseY;
	kha_SystemImpl.setMouseXY(event);
	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || kha_SystemImpl.mouseX - lastMouseX;
	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || kha_SystemImpl.mouseY - lastMouseY;
	kha_SystemImpl.mouse.sendMoveEvent(kha_SystemImpl.mouseX,kha_SystemImpl.mouseY,movementX,movementY);
};
kha_SystemImpl.setTouchXY = function(touch) {
	var rect = kha_SystemImpl.khanvas.getBoundingClientRect();
	var borderWidth = kha_SystemImpl.khanvas.clientLeft;
	var borderHeight = kha_SystemImpl.khanvas.clientTop;
	kha_SystemImpl.touchX = (touch.clientX - rect.left - borderWidth) * kha_SystemImpl.khanvas.width / (rect.width - 2 * borderWidth) | 0;
	kha_SystemImpl.touchY = (touch.clientY - rect.top - borderHeight) * kha_SystemImpl.khanvas.height / (rect.height - 2 * borderHeight) | 0;
};
kha_SystemImpl.touchDown = function(event) {
	var _g = 0;
	var _g1 = event.changedTouches;
	while(_g < _g1.length) {
		var touch = _g1[_g];
		++_g;
		kha_SystemImpl.setTouchXY(touch);
		kha_SystemImpl.mouse.sendDownEvent(0,kha_SystemImpl.touchX,kha_SystemImpl.touchY);
		kha_SystemImpl.surface.sendTouchStartEvent(touch.identifier,kha_SystemImpl.touchX,kha_SystemImpl.touchY);
	}
};
kha_SystemImpl.touchUp = function(event) {
	var _g = 0;
	var _g1 = event.changedTouches;
	while(_g < _g1.length) {
		var touch = _g1[_g];
		++_g;
		kha_SystemImpl.setTouchXY(touch);
		kha_SystemImpl.mouse.sendUpEvent(0,kha_SystemImpl.touchX,kha_SystemImpl.touchY);
		kha_SystemImpl.surface.sendTouchEndEvent(touch.identifier,kha_SystemImpl.touchX,kha_SystemImpl.touchY);
	}
};
kha_SystemImpl.touchMove = function(event) {
	var index = 0;
	var _g = 0;
	var _g1 = event.changedTouches;
	while(_g < _g1.length) {
		var touch = _g1[_g];
		++_g;
		kha_SystemImpl.setTouchXY(touch);
		if(index == 0) {
			var movementX = kha_SystemImpl.touchX - kha_SystemImpl.lastFirstTouchX;
			var movementY = kha_SystemImpl.touchY - kha_SystemImpl.lastFirstTouchY;
			kha_SystemImpl.lastFirstTouchX = kha_SystemImpl.touchX;
			kha_SystemImpl.lastFirstTouchY = kha_SystemImpl.touchY;
			kha_SystemImpl.mouse.sendMoveEvent(kha_SystemImpl.touchX,kha_SystemImpl.touchY,movementX,movementY);
		}
		kha_SystemImpl.surface.sendMoveEvent(touch.identifier,kha_SystemImpl.touchX,kha_SystemImpl.touchY);
		index++;
	}
};
kha_SystemImpl.keycodeToChar = function(key,keycode,shift) {
	if(key != null) {
		if(key.length == 1) return key;
		switch(key) {
		case "Add":
			return "+";
		case "Subtract":
			return "-";
		case "Multiply":
			return "*";
		case "Divide":
			return "/";
		}
	}
	switch(keycode) {
	case 187:
		if(shift) return "*"; else return "+";
		break;
	case 188:
		if(shift) return ";"; else return ",";
		break;
	case 189:
		if(shift) return "_"; else return "-";
		break;
	case 190:
		if(shift) return ":"; else return ".";
		break;
	case 191:
		if(shift) return "'"; else return "#";
		break;
	case 226:
		if(shift) return ">"; else return "<";
		break;
	case 106:
		return "*";
	case 107:
		return "+";
	case 109:
		return "-";
	case 111:
		return "/";
	case 49:
		if(shift) return "!"; else return "1";
		break;
	case 50:
		if(shift) return "\""; else return "2";
		break;
	case 51:
		if(shift) return "§"; else return "3";
		break;
	case 52:
		if(shift) return "$"; else return "4";
		break;
	case 53:
		if(shift) return "%"; else return "5";
		break;
	case 54:
		if(shift) return "&"; else return "6";
		break;
	case 55:
		if(shift) return "/"; else return "7";
		break;
	case 56:
		if(shift) return "("; else return "8";
		break;
	case 57:
		if(shift) return ")"; else return "9";
		break;
	case 48:
		if(shift) return "="; else return "0";
		break;
	case 219:
		if(shift) return "?"; else return "ß";
		break;
	case 212:
		if(shift) return "`"; else return "´";
		break;
	}
	if(keycode >= 96 && keycode <= 105) return String.fromCharCode(-48 + keycode);
	if(keycode >= 65 && keycode <= 90) {
		if(shift) return String.fromCharCode(keycode); else return String.fromCharCode(keycode - 65 + 97);
	}
	return String.fromCharCode(keycode);
};
kha_SystemImpl.keyDown = function(event) {
	event.stopPropagation();
	if(kha_SystemImpl.pressedKeys[event.keyCode]) {
		event.preventDefault();
		return;
	}
	kha_SystemImpl.pressedKeys[event.keyCode] = true;
	var _g = event.keyCode;
	switch(_g) {
	case 8:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.BACKSPACE,"");
		event.preventDefault();
		break;
	case 9:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.TAB,"");
		event.preventDefault();
		break;
	case 13:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.ENTER,"");
		event.preventDefault();
		break;
	case 16:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.SHIFT,"");
		event.preventDefault();
		break;
	case 17:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.CTRL,"");
		event.preventDefault();
		break;
	case 18:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.ALT,"");
		event.preventDefault();
		break;
	case 27:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.ESC,"");
		event.preventDefault();
		break;
	case 32:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.CHAR," ");
		event.preventDefault();
		break;
	case 46:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.DEL,"");
		event.preventDefault();
		break;
	case 38:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.UP,"");
		event.preventDefault();
		break;
	case 40:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.DOWN,"");
		event.preventDefault();
		break;
	case 37:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.LEFT,"");
		event.preventDefault();
		break;
	case 39:
		kha_SystemImpl.keyboard.sendDownEvent(kha_Key.RIGHT,"");
		event.preventDefault();
		break;
	default:
		if(!event.altKey) {
			var $char = kha_SystemImpl.keycodeToChar(event.key,event.keyCode,event.shiftKey);
			kha_SystemImpl.keyboard.sendDownEvent(kha_Key.CHAR,$char);
		}
	}
};
kha_SystemImpl.keyUp = function(event) {
	event.preventDefault();
	event.stopPropagation();
	kha_SystemImpl.pressedKeys[event.keyCode] = false;
	var _g = event.keyCode;
	switch(_g) {
	case 8:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.BACKSPACE,"");
		break;
	case 9:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.TAB,"");
		break;
	case 13:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.ENTER,"");
		break;
	case 16:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.SHIFT,"");
		break;
	case 17:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.CTRL,"");
		break;
	case 18:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.ALT,"");
		break;
	case 27:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.ESC,"");
		break;
	case 32:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.CHAR," ");
		break;
	case 46:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.DEL,"");
		break;
	case 38:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.UP,"");
		break;
	case 40:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.DOWN,"");
		break;
	case 37:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.LEFT,"");
		break;
	case 39:
		kha_SystemImpl.keyboard.sendUpEvent(kha_Key.RIGHT,"");
		break;
	default:
		if(!event.altKey) {
			var $char = kha_SystemImpl.keycodeToChar(event.key,event.keyCode,event.shiftKey);
			kha_SystemImpl.keyboard.sendUpEvent(kha_Key.CHAR,$char);
		}
	}
};
kha_SystemImpl.canSwitchFullscreen = function() {
	return 'fullscreenElement ' in document ||
        'mozFullScreenElement' in document ||
        'webkitFullscreenElement' in document ||
        'msFullscreenElement' in document
        ;
};
kha_SystemImpl.isFullscreen = function() {
	return document.fullscreenElement === this.khanvas ||
  			document.mozFullScreenElement === this.khanvas ||
  			document.webkitFullscreenElement === this.khanvas ||
  			document.msFullscreenElement === this.khanvas ;
};
kha_SystemImpl.requestFullscreen = function() {
	if(($_=kha_SystemImpl.khanvas,$bind($_,$_.requestFullscreen))) kha_SystemImpl.khanvas.requestFullscreen(); else if(kha_SystemImpl.khanvas.msRequestFullscreen) kha_SystemImpl.khanvas.msRequestFullscreen(); else if(kha_SystemImpl.khanvas.mozRequestFullScreen) kha_SystemImpl.khanvas.mozRequestFullScreen(); else if(kha_SystemImpl.khanvas.webkitRequestFullscreen) kha_SystemImpl.khanvas.webkitRequestFullscreen();
};
kha_SystemImpl.exitFullscreen = function() {
	if(document.exitFullscreen) document.exitFullscreen(); else if(document.msExitFullscreen) document.msExitFullscreen(); else if(document.mozCancelFullScreen) document.mozCancelFullScreen(); else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
};
kha_SystemImpl.changeResolution = function(width,height) {
};
kha_SystemImpl.prototype = {
	notifyOfFullscreenChange: function(func,error) {
		window.document.addEventListener("fullscreenchange",func,false);
		window.document.addEventListener("mozfullscreenchange",func,false);
		window.document.addEventListener("webkitfullscreenchange",func,false);
		window.document.addEventListener("MSFullscreenChange",func,false);
		window.document.addEventListener("fullscreenerror",error,false);
		window.document.addEventListener("mozfullscreenerror",error,false);
		window.document.addEventListener("webkitfullscreenerror",error,false);
		window.document.addEventListener("MSFullscreenError",error,false);
	}
	,removeFromFullscreenChange: function(func,error) {
		window.document.removeEventListener("fullscreenchange",func,false);
		window.document.removeEventListener("mozfullscreenchange",func,false);
		window.document.removeEventListener("webkitfullscreenchange",func,false);
		window.document.removeEventListener("MSFullscreenChange",func,false);
		window.document.removeEventListener("fullscreenerror",error,false);
		window.document.removeEventListener("mozfullscreenerror",error,false);
		window.document.removeEventListener("webkitfullscreenerror",error,false);
		window.document.removeEventListener("MSFullscreenError",error,false);
	}
	,__class__: kha_SystemImpl
};
var kha_Video = function() {
};
$hxClasses["kha.Video"] = kha_Video;
kha_Video.__name__ = true;
kha_Video.__interfaces__ = [kha_Resource];
kha_Video.prototype = {
	width: function() {
		return 100;
	}
	,height: function() {
		return 100;
	}
	,play: function(loop) {
		if(loop == null) loop = false;
	}
	,pause: function() {
	}
	,stop: function() {
	}
	,getLength: function() {
		return 0;
	}
	,getCurrentPos: function() {
		return 0;
	}
	,getVolume: function() {
		return 1;
	}
	,setVolume: function(volume) {
	}
	,isFinished: function() {
		return this.getCurrentPos() >= this.getLength();
	}
	,unload: function() {
	}
	,__class__: kha_Video
};
var kha_WebGLImage = function(width,height,format,renderTarget) {
	this.myWidth = width;
	this.myHeight = height;
	this.format = format;
	this.renderTarget = renderTarget;
	this.image = null;
	this.video = null;
	if(renderTarget) this.createTexture();
};
$hxClasses["kha.WebGLImage"] = kha_WebGLImage;
kha_WebGLImage.__name__ = true;
kha_WebGLImage.init = function() {
	var canvas = window.document.createElement("canvas");
	if(canvas != null) {
		kha_WebGLImage.context = canvas.getContext("2d");
		canvas.width = 2048;
		canvas.height = 2048;
		kha_WebGLImage.context.globalCompositeOperation = "copy";
	}
};
kha_WebGLImage.upperPowerOfTwo = function(v) {
	v--;
	v |= v >>> 1;
	v |= v >>> 2;
	v |= v >>> 4;
	v |= v >>> 8;
	v |= v >>> 16;
	v++;
	return v;
};
kha_WebGLImage.__super__ = kha_Image;
kha_WebGLImage.prototype = $extend(kha_Image.prototype,{
	image: null
	,video: null
	,data: null
	,myWidth: null
	,myHeight: null
	,format: null
	,renderTarget: null
	,frameBuffer: null
	,renderBuffer: null
	,texture: null
	,graphics1: null
	,graphics2: null
	,graphics4: null
	,get_g1: function() {
		if(this.graphics1 == null) this.graphics1 = new kha_graphics2_Graphics1(this);
		return this.graphics1;
	}
	,get_g2: function() {
		if(this.graphics2 == null) this.graphics2 = new kha_js_graphics4_Graphics2(this);
		return this.graphics2;
	}
	,get_g4: function() {
		if(this.graphics4 == null) this.graphics4 = new kha_js_graphics4_Graphics(this);
		return this.graphics4;
	}
	,get_width: function() {
		return this.myWidth;
	}
	,get_height: function() {
		return this.myHeight;
	}
	,get_realWidth: function() {
		return this.myWidth;
	}
	,get_realHeight: function() {
		return this.myHeight;
	}
	,isOpaque: function(x,y) {
		if(this.data == null) {
			if(kha_WebGLImage.context == null) return true; else this.createImageData();
		}
		return this.data.data[y * Std["int"](this.image.width) * 4 + x * 4 + 3] != 0;
	}
	,at: function(x,y) {
		if(this.data == null) {
			if(kha_WebGLImage.context == null) return kha__$Color_Color_$Impl_$.Black; else this.createImageData();
		}
		var value = this.data.data[y * Std["int"](this.image.width) * 4 + x * 4];
		return kha__$Color_Color_$Impl_$._new(value);
	}
	,createImageData: function() {
		kha_WebGLImage.context.strokeStyle = "rgba(0,0,0,0)";
		kha_WebGLImage.context.fillStyle = "rgba(0,0,0,0)";
		kha_WebGLImage.context.fillRect(0,0,this.image.width,this.image.height);
		kha_WebGLImage.context.drawImage(this.image,0,0,this.image.width,this.image.height,0,0,this.image.width,this.image.height);
		this.data = kha_WebGLImage.context.getImageData(0,0,this.image.width,this.image.height);
	}
	,createTexture: function() {
		if(kha_SystemImpl.gl == null) return;
		this.texture = kha_SystemImpl.gl.createTexture();
		kha_SystemImpl.gl.bindTexture(3553,this.texture);
		kha_SystemImpl.gl.texParameteri(3553,10240,9729);
		kha_SystemImpl.gl.texParameteri(3553,10241,9729);
		kha_SystemImpl.gl.texParameteri(3553,10242,33071);
		kha_SystemImpl.gl.texParameteri(3553,10243,33071);
		if(this.renderTarget) {
			this.frameBuffer = kha_SystemImpl.gl.createFramebuffer();
			kha_SystemImpl.gl.bindFramebuffer(36160,this.frameBuffer);
			kha_SystemImpl.gl.texImage2D(3553,0,6408,this.get_realWidth(),this.get_realHeight(),0,6408,this.format == kha_graphics4_TextureFormat.RGBA128?5126:5121,null);
			kha_SystemImpl.gl.framebufferTexture2D(36160,36064,3553,this.texture,0);
			this.renderBuffer = kha_SystemImpl.gl.createRenderbuffer();
			kha_SystemImpl.gl.bindRenderbuffer(36161,this.renderBuffer);
			kha_SystemImpl.gl.renderbufferStorage(36161,33189,this.get_realWidth(),this.get_realHeight());
			kha_SystemImpl.gl.framebufferRenderbuffer(36160,36096,36161,this.renderBuffer);
			kha_SystemImpl.gl.bindRenderbuffer(36161,null);
			kha_SystemImpl.gl.bindFramebuffer(36160,null);
		} else if(this.video != null) kha_SystemImpl.gl.texImage2D(3553,0,6408,6408,5121,this.video); else kha_SystemImpl.gl.texImage2D(3553,0,6408,6408,this.format == kha_graphics4_TextureFormat.RGBA128?5126:5121,this.image);
		kha_SystemImpl.gl.bindTexture(3553,null);
	}
	,set: function(stage) {
		kha_SystemImpl.gl.activeTexture(33984 + stage);
		kha_SystemImpl.gl.bindTexture(3553,this.texture);
		if(this.video != null) kha_SystemImpl.gl.texImage2D(3553,0,6408,6408,5121,this.video);
	}
	,bytes: null
	,lock: function(level) {
		if(level == null) level = 0;
		this.bytes = haxe_io_Bytes.alloc(this.format == kha_graphics4_TextureFormat.RGBA32?4 * this.get_width() * this.get_height():this.format == kha_graphics4_TextureFormat.RGBA128?16 * this.get_width() * this.get_height():this.get_width() * this.get_height());
		return this.bytes;
	}
	,unlock: function() {
		if(kha_SystemImpl.gl != null) {
			this.texture = kha_SystemImpl.gl.createTexture();
			kha_SystemImpl.gl.bindTexture(3553,this.texture);
			kha_SystemImpl.gl.texParameteri(3553,10240,9729);
			kha_SystemImpl.gl.texParameteri(3553,10241,9729);
			kha_SystemImpl.gl.texParameteri(3553,10242,33071);
			kha_SystemImpl.gl.texParameteri(3553,10243,33071);
			var _g = this.format;
			switch(_g[1]) {
			case 1:
				kha_SystemImpl.gl.texImage2D(3553,0,6409,this.get_width(),this.get_height(),0,6409,5121,new Uint8Array(this.bytes.b.bufferValue));
				if(kha_SystemImpl.gl.getError() == 1282) {
					var rgbaBytes = haxe_io_Bytes.alloc(this.get_width() * this.get_height() * 4);
					var _g2 = 0;
					var _g1 = this.get_height();
					while(_g2 < _g1) {
						var y = _g2++;
						var _g4 = 0;
						var _g3 = this.get_width();
						while(_g4 < _g3) {
							var x = _g4++;
							var value = this.bytes.get(y * this.get_width() + x);
							rgbaBytes.set(y * this.get_width() * 4 + x * 4,value);
							rgbaBytes.set(y * this.get_width() * 4 + x * 4 + 1,value);
							rgbaBytes.set(y * this.get_width() * 4 + x * 4 + 2,value);
							rgbaBytes.set(y * this.get_width() * 4 + x * 4 + 3,255);
						}
					}
					kha_SystemImpl.gl.texImage2D(3553,0,6408,this.get_width(),this.get_height(),0,6408,5121,new Uint8Array(rgbaBytes.b.bufferValue));
				}
				break;
			case 0:
				kha_SystemImpl.gl.texImage2D(3553,0,6408,this.get_width(),this.get_height(),0,6408,5121,new Uint8Array(this.bytes.b.bufferValue));
				break;
			case 2:
				kha_SystemImpl.gl.texImage2D(3553,0,6408,this.get_width(),this.get_height(),0,6408,5126,new Uint8Array(this.bytes.b.bufferValue));
				break;
			}
			kha_SystemImpl.gl.bindTexture(3553,null);
			this.bytes = null;
		}
	}
	,unload: function() {
	}
	,__class__: kha_WebGLImage
});
var kha_arrays__$Float32Array_Float32Array_$Impl_$ = {};
$hxClasses["kha.arrays._Float32Array.Float32Array_Impl_"] = kha_arrays__$Float32Array_Float32Array_$Impl_$;
kha_arrays__$Float32Array_Float32Array_$Impl_$.__name__ = true;
kha_arrays__$Float32Array_Float32Array_$Impl_$._new = function(elements) {
	return new Float32Array(elements);
};
kha_arrays__$Float32Array_Float32Array_$Impl_$.get_length = function(this1) {
	return this1.length;
};
kha_arrays__$Float32Array_Float32Array_$Impl_$.set = function(this1,index,value) {
	return this1[index] = value;
};
kha_arrays__$Float32Array_Float32Array_$Impl_$.get = function(this1,index) {
	return this1[index];
};
kha_arrays__$Float32Array_Float32Array_$Impl_$.data = function(this1) {
	return this1;
};
var kha_audio1_AudioChannel = function() { };
$hxClasses["kha.audio1.AudioChannel"] = kha_audio1_AudioChannel;
kha_audio1_AudioChannel.__name__ = true;
kha_audio1_AudioChannel.prototype = {
	play: null
	,pause: null
	,stop: null
	,length: null
	,get_length: null
	,position: null
	,get_position: null
	,get_volume: null
	,set_volume: null
	,finished: null
	,get_finished: null
	,__class__: kha_audio1_AudioChannel
};
var kha_audio2_Audio = function() { };
$hxClasses["kha.audio2.Audio"] = kha_audio2_Audio;
kha_audio2_Audio.__name__ = true;
kha_audio2_Audio.initContext = function() {
	try {
		kha_audio2_Audio._context = new AudioContext();
		return;
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
	}
	try {
		this._context = new webkitAudioContext();
		return;
	} catch( e1 ) {
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
	}
};
kha_audio2_Audio._init = function() {
	kha_audio2_Audio.initContext();
	if(kha_audio2_Audio._context == null) return false;
	var bufferSize = 2048;
	kha_audio2_Audio.buffer = new kha_audio2_Buffer(bufferSize * 4,2,kha_audio2_Audio._context.sampleRate | 0);
	kha_audio2_Audio.processingNode = kha_audio2_Audio._context.createScriptProcessor(bufferSize,0,2);
	kha_audio2_Audio.processingNode.onaudioprocess = function(e) {
		var output1 = e.outputBuffer.getChannelData(0);
		var output2 = e.outputBuffer.getChannelData(1);
		if(kha_audio2_Audio.audioCallback != null) {
			kha_audio2_Audio.audioCallback(e.outputBuffer.length * 2,kha_audio2_Audio.buffer);
			var _g1 = 0;
			var _g = e.outputBuffer.length;
			while(_g1 < _g) {
				var i = _g1++;
				output1[i] = kha_audio2_Audio.buffer.data[kha_audio2_Audio.buffer.readLocation];
				kha_audio2_Audio.buffer.readLocation += 1;
				output2[i] = kha_audio2_Audio.buffer.data[kha_audio2_Audio.buffer.readLocation];
				kha_audio2_Audio.buffer.readLocation += 1;
				if(kha_audio2_Audio.buffer.readLocation >= kha_audio2_Audio.buffer.size) kha_audio2_Audio.buffer.readLocation = 0;
			}
		} else {
			var _g11 = 0;
			var _g2 = e.outputBuffer.length;
			while(_g11 < _g2) {
				var i1 = _g11++;
				output1[i1] = 0;
				output2[i1] = 0;
			}
		}
	};
	kha_audio2_Audio.processingNode.connect(kha_audio2_Audio._context.destination);
	return true;
};
kha_audio2_Audio.play = function(sound,loop) {
	if(loop == null) loop = false;
	return null;
};
var kha_audio2_Audio1 = function() { };
$hxClasses["kha.audio2.Audio1"] = kha_audio2_Audio1;
kha_audio2_Audio1.__name__ = true;
kha_audio2_Audio1._init = function() {
	var this1;
	this1 = new Array(16);
	kha_audio2_Audio1.soundChannels = this1;
	var this2;
	this2 = new Array(16);
	kha_audio2_Audio1.internalSoundChannels = this2;
	var this3;
	this3 = new Array(512);
	kha_audio2_Audio1.sampleCache1 = this3;
	var this4;
	this4 = new Array(512);
	kha_audio2_Audio1.sampleCache2 = this4;
	kha_audio2_Audio.audioCallback = kha_audio2_Audio1._mix;
};
kha_audio2_Audio1.max = function(a,b) {
	if(a > b) return a; else return b;
};
kha_audio2_Audio1.min = function(a,b) {
	if(a < b) return a; else return b;
};
kha_audio2_Audio1._mix = function(samples,buffer) {
	if(kha_audio2_Audio1.sampleCache1.length < samples) {
		var this1;
		this1 = new Array(samples);
		kha_audio2_Audio1.sampleCache1 = this1;
		var this2;
		this2 = new Array(samples);
		kha_audio2_Audio1.sampleCache2 = this2;
	}
	var _g = 0;
	while(_g < samples) {
		var i = _g++;
		kha_audio2_Audio1.sampleCache2[i] = 0;
	}
	var _g1 = 0;
	while(_g1 < 16) {
		var i1 = _g1++;
		kha_audio2_Audio1.internalSoundChannels[i1] = kha_audio2_Audio1.soundChannels[i1];
	}
	var _g2 = 0;
	var _g11 = kha_audio2_Audio1.internalSoundChannels;
	while(_g2 < _g11.length) {
		var channel = _g11[_g2];
		++_g2;
		if(channel == null || channel.get_finished()) continue;
		channel.nextSamples(kha_audio2_Audio1.sampleCache1,samples,buffer.samplesPerSecond);
		var _g21 = 0;
		while(_g21 < samples) {
			var i2 = _g21++;
			var _g3 = i2;
			var val = kha_audio2_Audio1.sampleCache2[_g3] + kha_audio2_Audio1.sampleCache1[i2] * channel.get_volume();
			kha_audio2_Audio1.sampleCache2[_g3] = val;
		}
	}
	var _g4 = 0;
	while(_g4 < samples) {
		var i3 = _g4++;
		var val1 = kha_audio2_Audio1.max(kha_audio2_Audio1.min(kha_audio2_Audio1.sampleCache2[i3],1.0),-1.0);
		buffer.data[buffer.writeLocation] = val1;
		buffer.writeLocation += 1;
		if(buffer.writeLocation >= buffer.size) buffer.writeLocation = 0;
	}
};
kha_audio2_Audio1.play = function(sound,loop,stream) {
	if(stream == null) stream = false;
	if(loop == null) loop = false;
	var channel = null;
	var _g = 0;
	while(_g < 16) {
		var i = _g++;
		if(kha_audio2_Audio1.soundChannels[i] == null || kha_audio2_Audio1.soundChannels[i].get_finished()) {
			channel = new kha_audio2_AudioChannel(loop);
			channel.data = sound.data;
			kha_audio2_Audio1.soundChannels[i] = channel;
			break;
		}
	}
	return channel;
};
var kha_audio2_AudioChannel = function(looping) {
	this.paused = false;
	this.looping = looping;
	this.myVolume = 1;
	this.myPosition = 0;
};
$hxClasses["kha.audio2.AudioChannel"] = kha_audio2_AudioChannel;
kha_audio2_AudioChannel.__name__ = true;
kha_audio2_AudioChannel.__interfaces__ = [kha_audio1_AudioChannel];
kha_audio2_AudioChannel.prototype = {
	data: null
	,myVolume: null
	,myPosition: null
	,paused: null
	,looping: null
	,nextSamples: function(samples,length,sampleRate) {
		if(this.paused) {
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				samples[i] = 0;
			}
			return;
		}
		var _g1 = 0;
		while(_g1 < length) {
			var i1 = _g1++;
			if(this.myPosition >= this.data.length && this.looping) this.myPosition = 0;
			if(this.myPosition < this.data.length) samples[i1] = this.data[this.myPosition]; else samples[i1] = 0;
			++this.myPosition;
		}
	}
	,play: function() {
		this.paused = false;
	}
	,pause: function() {
		this.paused = true;
	}
	,stop: function() {
		this.myPosition = this.data.length;
	}
	,length: null
	,get_length: function() {
		return this.data.length / 44100 / 2;
	}
	,position: null
	,get_position: function() {
		return this.myPosition / 44100 / 2;
	}
	,get_volume: function() {
		return this.myVolume;
	}
	,set_volume: function(value) {
		return this.myVolume = value;
	}
	,finished: null
	,get_finished: function() {
		return this.myPosition >= this.data.length;
	}
	,__class__: kha_audio2_AudioChannel
};
var kha_audio2_Buffer = function(size,channels,samplesPerSecond) {
	this.size = size;
	var this1;
	this1 = new Array(size);
	this.data = this1;
	this.channels = channels;
	this.samplesPerSecond = samplesPerSecond;
	this.readLocation = 0;
	this.writeLocation = 0;
};
$hxClasses["kha.audio2.Buffer"] = kha_audio2_Buffer;
kha_audio2_Buffer.__name__ = true;
kha_audio2_Buffer.prototype = {
	channels: null
	,samplesPerSecond: null
	,data: null
	,size: null
	,readLocation: null
	,writeLocation: null
	,__class__: kha_audio2_Buffer
};
var kha_audio2_ogg_tools_Crc32 = function() { };
$hxClasses["kha.audio2.ogg.tools.Crc32"] = kha_audio2_ogg_tools_Crc32;
kha_audio2_ogg_tools_Crc32.__name__ = true;
kha_audio2_ogg_tools_Crc32.init = function() {
	if(kha_audio2_ogg_tools_Crc32.table != null) return;
	var this1;
	this1 = new Array(256);
	kha_audio2_ogg_tools_Crc32.table = this1;
	var _g = 0;
	while(_g < 256) {
		var i = _g++;
		var s = i << 24;
		var _g1 = 0;
		while(_g1 < 8) {
			var j = _g1++;
			var b;
			if(_$UInt_UInt_$Impl_$.gte(s,1 << 31)) b = 79764919; else b = 0;
			s = s << 1 ^ b;
		}
		kha_audio2_ogg_tools_Crc32.table[i] = s;
	}
};
kha_audio2_ogg_tools_Crc32.update = function(crc,$byte) {
	return crc << 8 ^ kha_audio2_ogg_tools_Crc32.table[$byte ^ crc >>> 24];
};
var kha_audio2_ogg_tools_MathTools = function() { };
$hxClasses["kha.audio2.ogg.tools.MathTools"] = kha_audio2_ogg_tools_MathTools;
kha_audio2_ogg_tools_MathTools.__name__ = true;
kha_audio2_ogg_tools_MathTools.ilog = function(n) {
	var log2_4 = [0,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4];
	if(n < 16384) {
		if(n < 16) return log2_4[n]; else if(n < 512) return 5 + log2_4[n >> 5]; else return 10 + log2_4[n >> 10];
	} else if(n < 16777216) {
		if(n < 524288) return 15 + log2_4[n >> 15]; else return 20 + log2_4[n >> 20];
	} else if(n < 536870912) return 25 + log2_4[n >> 25]; else if(n < -2147483648) return 30 + log2_4[n >> 30]; else return 0;
};
var kha_audio2_ogg_tools_Mdct = function() { };
$hxClasses["kha.audio2.ogg.tools.Mdct"] = kha_audio2_ogg_tools_Mdct;
kha_audio2_ogg_tools_Mdct.__name__ = true;
kha_audio2_ogg_tools_Mdct.inverseTransform = function(buffer,n,a,b,c,bitReverse) {
	var n2 = n >> 1;
	var n4 = n >> 2;
	var n8 = n >> 3;
	var buf2;
	var this1;
	this1 = new Array(n2);
	buf2 = this1;
	var dOffset = n2 - 2;
	var aaOffset = 0;
	var eOffset = 0;
	var eStopOffset = n2;
	while(eOffset != eStopOffset) {
		buf2[dOffset + 1] = buffer[eOffset] * a[aaOffset] - buffer[eOffset + 2] * a[aaOffset + 1];
		buf2[dOffset] = buffer[eOffset] * a[aaOffset + 1] + buffer[eOffset + 2] * a[aaOffset];
		dOffset -= 2;
		aaOffset += 2;
		eOffset += 4;
	}
	eOffset = n2 - 3;
	while(dOffset >= 0) {
		buf2[dOffset + 1] = -buffer[eOffset + 2] * a[aaOffset] - -buffer[eOffset] * a[aaOffset + 1];
		buf2[dOffset] = -buffer[eOffset + 2] * a[aaOffset + 1] + -buffer[eOffset] * a[aaOffset];
		dOffset -= 2;
		aaOffset += 2;
		eOffset -= 4;
	}
	var u = buffer;
	var v = buf2;
	var aaOffset1 = n2 - 8;
	var eOffset0 = n4;
	var eOffset1 = 0;
	var dOffset0 = n4;
	var dOffset1 = 0;
	while(aaOffset1 >= 0) {
		var v41_21 = v[eOffset0 + 1] - v[eOffset1 + 1];
		var v40_20 = v[eOffset0] - v[eOffset1];
		u[dOffset0 + 1] = v[eOffset0 + 1] + v[eOffset1 + 1];
		u[dOffset0] = v[eOffset0] + v[eOffset1];
		u[dOffset1 + 1] = v41_21 * a[aaOffset1 + 4] - v40_20 * a[aaOffset1 + 5];
		u[dOffset1] = v40_20 * a[aaOffset1 + 4] + v41_21 * a[aaOffset1 + 5];
		v41_21 = v[eOffset0 + 3] - v[eOffset1 + 3];
		v40_20 = v[eOffset0 + 2] - v[eOffset1 + 2];
		u[dOffset0 + 3] = v[eOffset0 + 3] + v[eOffset1 + 3];
		u[dOffset0 + 2] = v[eOffset0 + 2] + v[eOffset1 + 2];
		u[dOffset1 + 3] = v41_21 * a[aaOffset1] - v40_20 * a[aaOffset1 + 1];
		u[dOffset1 + 2] = v40_20 * a[aaOffset1] + v41_21 * a[aaOffset1 + 1];
		aaOffset1 -= 8;
		dOffset0 += 4;
		dOffset1 += 4;
		eOffset0 += 4;
		eOffset1 += 4;
	}
	var ld = kha_audio2_ogg_tools_MathTools.ilog(n) - 1;
	kha_audio2_ogg_tools_Mdct.step3Iter0Loop(n >> 4,u,n2 - 1 - n4 * 0,-(n >> 3),a);
	kha_audio2_ogg_tools_Mdct.step3Iter0Loop(n >> 4,u,n2 - 1 - n4,-(n >> 3),a);
	kha_audio2_ogg_tools_Mdct.step3InnerRLoop(n >> 5,u,n2 - 1 - n8 * 0,-(n >> 4),a,16);
	kha_audio2_ogg_tools_Mdct.step3InnerRLoop(n >> 5,u,n2 - 1 - n8,-(n >> 4),a,16);
	kha_audio2_ogg_tools_Mdct.step3InnerRLoop(n >> 5,u,n2 - 1 - n8 * 2,-(n >> 4),a,16);
	kha_audio2_ogg_tools_Mdct.step3InnerRLoop(n >> 5,u,n2 - 1 - n8 * 3,-(n >> 4),a,16);
	var _g1 = 2;
	var _g = ld - 3 >> 1;
	while(_g1 < _g) {
		var l = _g1++;
		var k0 = n >> l + 2;
		var k0_2 = k0 >> 1;
		var lim = 1 << l + 1;
		var _g2 = 0;
		while(_g2 < lim) {
			var i = _g2++;
			kha_audio2_ogg_tools_Mdct.step3InnerRLoop(n >> l + 4,u,n2 - 1 - k0 * i,-k0_2,a,1 << l + 3);
		}
	}
	var _g11 = ld - 3 >> 1;
	var _g3 = ld - 6;
	while(_g11 < _g3) {
		var l1 = _g11++;
		var k01 = n >> l1 + 2;
		var k1 = 1 << l1 + 3;
		var k0_21 = k01 >> 1;
		var rlim = n >> l1 + 6;
		var lim1 = 1 << l1 + 1;
		var aOffset = 0;
		var i_off = n2 - 1;
		var r = rlim + 1;
		while(--r > 0) {
			kha_audio2_ogg_tools_Mdct.step3InnerSLoop(lim1,u,i_off,-k0_21,a,aOffset,k1,k01);
			aOffset += k1 * 4;
			i_off -= 8;
		}
	}
	kha_audio2_ogg_tools_Mdct.step3InnerSLoopLd654(n >> 5,u,n2 - 1,a,n);
	var brOffset = 0;
	var dOffset01 = n4 - 4;
	var dOffset11 = n2 - 4;
	while(dOffset01 >= 0) {
		var k4 = bitReverse[brOffset];
		v[dOffset11 + 3] = u[k4];
		v[dOffset11 + 2] = u[k4 + 1];
		v[dOffset01 + 3] = u[k4 + 2];
		v[dOffset01 + 2] = u[k4 + 3];
		k4 = bitReverse[brOffset + 1];
		v[dOffset11 + 1] = u[k4];
		v[dOffset11] = u[k4 + 1];
		v[dOffset01 + 1] = u[k4 + 2];
		v[dOffset01] = u[k4 + 3];
		dOffset01 -= 4;
		dOffset11 -= 4;
		brOffset += 2;
	}
	var cOffset = 0;
	var dOffset2 = 0;
	var eOffset2 = n2 - 4;
	while(dOffset2 < eOffset2) {
		var a02 = v[dOffset2] - v[eOffset2 + 2];
		var a11 = v[dOffset2 + 1] + v[eOffset2 + 3];
		var b0 = c[cOffset + 1] * a02 + c[cOffset] * a11;
		var b1 = c[cOffset + 1] * a11 - c[cOffset] * a02;
		var b2 = v[dOffset2] + v[eOffset2 + 2];
		var b3 = v[dOffset2 + 1] - v[eOffset2 + 3];
		v[dOffset2] = b2 + b0;
		v[dOffset2 + 1] = b3 + b1;
		v[eOffset2 + 2] = b2 - b0;
		v[eOffset2 + 3] = b1 - b3;
		a02 = v[dOffset2 + 2] - v[eOffset2];
		a11 = v[dOffset2 + 3] + v[eOffset2 + 1];
		b0 = c[cOffset + 3] * a02 + c[cOffset + 2] * a11;
		b1 = c[cOffset + 3] * a11 - c[cOffset + 2] * a02;
		b2 = v[dOffset2 + 2] + v[eOffset2];
		b3 = v[dOffset2 + 3] - v[eOffset2 + 1];
		v[dOffset2 + 2] = b2 + b0;
		v[dOffset2 + 3] = b3 + b1;
		v[eOffset2] = b2 - b0;
		v[eOffset2 + 1] = b1 - b3;
		cOffset += 4;
		dOffset2 += 4;
		eOffset2 -= 4;
	}
	var bOffset = n2 - 8;
	var eOffset3 = n2 - 8;
	var dOffset02 = 0;
	var dOffset12 = n2 - 4;
	var dOffset21 = n2;
	var dOffset3 = n - 4;
	while(eOffset3 >= 0) {
		var p3 = buf2[eOffset3 + 6] * b[bOffset + 7] - buf2[eOffset3 + 7] * b[bOffset + 6];
		var p2 = -buf2[eOffset3 + 6] * b[bOffset + 6] - buf2[eOffset3 + 7] * b[bOffset + 7];
		buffer[dOffset02] = p3;
		buffer[dOffset12 + 3] = -p3;
		buffer[dOffset21] = p2;
		buffer[dOffset3 + 3] = p2;
		var p1 = buf2[eOffset3 + 4] * b[bOffset + 5] - buf2[eOffset3 + 5] * b[bOffset + 4];
		var p0 = -buf2[eOffset3 + 4] * b[bOffset + 4] - buf2[eOffset3 + 5] * b[bOffset + 5];
		buffer[dOffset02 + 1] = p1;
		buffer[dOffset12 + 2] = -p1;
		buffer[dOffset21 + 1] = p0;
		buffer[dOffset3 + 2] = p0;
		p3 = buf2[eOffset3 + 2] * b[bOffset + 3] - buf2[eOffset3 + 3] * b[bOffset + 2];
		p2 = -buf2[eOffset3 + 2] * b[bOffset + 2] - buf2[eOffset3 + 3] * b[bOffset + 3];
		buffer[dOffset02 + 2] = p3;
		buffer[dOffset12 + 1] = -p3;
		buffer[dOffset21 + 2] = p2;
		buffer[dOffset3 + 1] = p2;
		p1 = buf2[eOffset3] * b[bOffset + 1] - buf2[eOffset3 + 1] * b[bOffset];
		p0 = -buf2[eOffset3] * b[bOffset] - buf2[eOffset3 + 1] * b[bOffset + 1];
		buffer[dOffset02 + 3] = p1;
		buffer[dOffset12] = -p1;
		buffer[dOffset21 + 3] = p0;
		buffer[dOffset3] = p0;
		bOffset -= 8;
		eOffset3 -= 8;
		dOffset02 += 4;
		dOffset21 += 4;
		dOffset12 -= 4;
		dOffset3 -= 4;
	}
};
kha_audio2_ogg_tools_Mdct.step3Iter0Loop = function(n,e,i_off,k_off,a) {
	var eeOffset0 = i_off;
	var eeOffset2 = i_off + k_off;
	var aOffset = 0;
	var i = (n >> 2) + 1;
	while(--i > 0) {
		var k00_20 = e[eeOffset0] - e[eeOffset2];
		var k01_21 = e[eeOffset0 + -1] - e[eeOffset2 + -1];
		var _g = eeOffset0;
		e[_g] = e[_g] + e[eeOffset2];
		var _g1 = eeOffset0 + -1;
		e[_g1] = e[_g1] + e[eeOffset2 + -1];
		e[eeOffset2] = k00_20 * a[aOffset] - k01_21 * a[aOffset + 1];
		e[eeOffset2 + -1] = k01_21 * a[aOffset] + k00_20 * a[aOffset + 1];
		aOffset += 8;
		k00_20 = e[eeOffset0 + -2] - e[eeOffset2 + -2];
		k01_21 = e[eeOffset0 + -3] - e[eeOffset2 + -3];
		var _g2 = eeOffset0 + -2;
		e[_g2] = e[_g2] + e[eeOffset2 + -2];
		var _g3 = eeOffset0 + -3;
		e[_g3] = e[_g3] + e[eeOffset2 + -3];
		e[eeOffset2 + -2] = k00_20 * a[aOffset] - k01_21 * a[aOffset + 1];
		e[eeOffset2 + -3] = k01_21 * a[aOffset] + k00_20 * a[aOffset + 1];
		aOffset += 8;
		k00_20 = e[eeOffset0 + -4] - e[eeOffset2 + -4];
		k01_21 = e[eeOffset0 + -5] - e[eeOffset2 + -5];
		var _g4 = eeOffset0 + -4;
		e[_g4] = e[_g4] + e[eeOffset2 + -4];
		var _g5 = eeOffset0 + -5;
		e[_g5] = e[_g5] + e[eeOffset2 + -5];
		e[eeOffset2 + -4] = k00_20 * a[aOffset] - k01_21 * a[aOffset + 1];
		e[eeOffset2 + -5] = k01_21 * a[aOffset] + k00_20 * a[aOffset + 1];
		aOffset += 8;
		k00_20 = e[eeOffset0 + -6] - e[eeOffset2 + -6];
		k01_21 = e[eeOffset0 + -7] - e[eeOffset2 + -7];
		var _g6 = eeOffset0 + -6;
		e[_g6] = e[_g6] + e[eeOffset2 + -6];
		var _g7 = eeOffset0 + -7;
		e[_g7] = e[_g7] + e[eeOffset2 + -7];
		e[eeOffset2 + -6] = k00_20 * a[aOffset] - k01_21 * a[aOffset + 1];
		e[eeOffset2 + -7] = k01_21 * a[aOffset] + k00_20 * a[aOffset + 1];
		aOffset += 8;
		eeOffset0 -= 8;
		eeOffset2 -= 8;
	}
};
kha_audio2_ogg_tools_Mdct.step3InnerRLoop = function(lim,e,d0,k_off,a,k1) {
	var aOffset = 0;
	var eOffset0 = d0;
	var eOffset2 = d0 + k_off;
	var i = (lim >> 2) + 1;
	while(--i > 0) {
		var k00_20 = e[eOffset0] - e[eOffset2];
		var k01_21 = e[eOffset0 + -1] - e[eOffset2 + -1];
		var _g = eOffset0;
		e[_g] = e[_g] + e[eOffset2];
		var _g1 = eOffset0 + -1;
		e[_g1] = e[_g1] + e[eOffset2 + -1];
		e[eOffset2] = k00_20 * a[aOffset] - k01_21 * a[aOffset + 1];
		e[eOffset2 + -1] = k01_21 * a[aOffset] + k00_20 * a[aOffset + 1];
		aOffset += k1;
		k00_20 = e[eOffset0 + -2] - e[eOffset2 + -2];
		k01_21 = e[eOffset0 + -3] - e[eOffset2 + -3];
		var _g2 = eOffset0 + -2;
		e[_g2] = e[_g2] + e[eOffset2 + -2];
		var _g3 = eOffset0 + -3;
		e[_g3] = e[_g3] + e[eOffset2 + -3];
		e[eOffset2 + -2] = k00_20 * a[aOffset] - k01_21 * a[aOffset + 1];
		e[eOffset2 + -3] = k01_21 * a[aOffset] + k00_20 * a[aOffset + 1];
		aOffset += k1;
		k00_20 = e[eOffset0 + -4] - e[eOffset2 + -4];
		k01_21 = e[eOffset0 + -5] - e[eOffset2 + -5];
		var _g4 = eOffset0 + -4;
		e[_g4] = e[_g4] + e[eOffset2 + -4];
		var _g5 = eOffset0 + -5;
		e[_g5] = e[_g5] + e[eOffset2 + -5];
		e[eOffset2 + -4] = k00_20 * a[aOffset] - k01_21 * a[aOffset + 1];
		e[eOffset2 + -5] = k01_21 * a[aOffset] + k00_20 * a[aOffset + 1];
		aOffset += k1;
		k00_20 = e[eOffset0 + -6] - e[eOffset2 + -6];
		k01_21 = e[eOffset0 + -7] - e[eOffset2 + -7];
		var _g6 = eOffset0 + -6;
		e[_g6] = e[_g6] + e[eOffset2 + -6];
		var _g7 = eOffset0 + -7;
		e[_g7] = e[_g7] + e[eOffset2 + -7];
		e[eOffset2 + -6] = k00_20 * a[aOffset] - k01_21 * a[aOffset + 1];
		e[eOffset2 + -7] = k01_21 * a[aOffset] + k00_20 * a[aOffset + 1];
		eOffset0 -= 8;
		eOffset2 -= 8;
		aOffset += k1;
	}
};
kha_audio2_ogg_tools_Mdct.step3InnerSLoop = function(n,e,i_off,k_off,a,aOffset0,aOffset1,k0) {
	var A0 = a[aOffset0];
	var A1 = a[aOffset0 + 1];
	var A2 = a[aOffset0 + aOffset1];
	var A3 = a[aOffset0 + aOffset1 + 1];
	var A4 = a[aOffset0 + aOffset1 * 2];
	var A5 = a[aOffset0 + aOffset1 * 2 + 1];
	var A6 = a[aOffset0 + aOffset1 * 3];
	var A7 = a[aOffset0 + aOffset1 * 3 + 1];
	var eeOffset0 = i_off;
	var eeOffset2 = i_off + k_off;
	var i = n + 1;
	while(--i > 0) {
		var k00 = e[eeOffset0] - e[eeOffset2];
		var k11 = e[eeOffset0 + -1] - e[eeOffset2 + -1];
		e[eeOffset0] = e[eeOffset0] + e[eeOffset2];
		e[eeOffset0 + -1] = e[eeOffset0 + -1] + e[eeOffset2 + -1];
		e[eeOffset2] = k00 * A0 - k11 * A1;
		e[eeOffset2 + -1] = k11 * A0 + k00 * A1;
		k00 = e[eeOffset0 + -2] - e[eeOffset2 + -2];
		k11 = e[eeOffset0 + -3] - e[eeOffset2 + -3];
		e[eeOffset0 + -2] = e[eeOffset0 + -2] + e[eeOffset2 + -2];
		e[eeOffset0 + -3] = e[eeOffset0 + -3] + e[eeOffset2 + -3];
		e[eeOffset2 + -2] = k00 * A2 - k11 * A3;
		e[eeOffset2 + -3] = k11 * A2 + k00 * A3;
		k00 = e[eeOffset0 + -4] - e[eeOffset2 + -4];
		k11 = e[eeOffset0 + -5] - e[eeOffset2 + -5];
		e[eeOffset0 + -4] = e[eeOffset0 + -4] + e[eeOffset2 + -4];
		e[eeOffset0 + -5] = e[eeOffset0 + -5] + e[eeOffset2 + -5];
		e[eeOffset2 + -4] = k00 * A4 - k11 * A5;
		e[eeOffset2 + -5] = k11 * A4 + k00 * A5;
		k00 = e[eeOffset0 + -6] - e[eeOffset2 + -6];
		k11 = e[eeOffset0 + -7] - e[eeOffset2 + -7];
		e[eeOffset0 + -6] = e[eeOffset0 + -6] + e[eeOffset2 + -6];
		e[eeOffset0 + -7] = e[eeOffset0 + -7] + e[eeOffset2 + -7];
		e[eeOffset2 + -6] = k00 * A6 - k11 * A7;
		e[eeOffset2 + -7] = k11 * A6 + k00 * A7;
		eeOffset0 -= k0;
		eeOffset2 -= k0;
	}
};
kha_audio2_ogg_tools_Mdct.iter54 = function(e,zOffset) {
	var t0 = e[zOffset];
	var t1 = e[zOffset + -4];
	var k00 = t0 - t1;
	var y0 = t0 + t1;
	t0 = e[zOffset + -2];
	t1 = e[zOffset + -6];
	var y2 = t0 + t1;
	var k22 = t0 - t1;
	e[zOffset] = y0 + y2;
	e[zOffset + -2] = y0 - y2;
	var k33 = e[zOffset + -3] - e[zOffset + -7];
	e[zOffset + -4] = k00 + k33;
	e[zOffset + -6] = k00 - k33;
	t0 = e[zOffset + -1];
	t1 = e[zOffset + -5];
	var k11 = t0 - t1;
	var y1 = t0 + t1;
	var y3 = e[zOffset + -3] + e[zOffset + -7];
	e[zOffset + -1] = y1 + y3;
	e[zOffset + -3] = y1 - y3;
	e[zOffset + -5] = k11 - k22;
	e[zOffset + -7] = k11 + k22;
};
kha_audio2_ogg_tools_Mdct.step3InnerSLoopLd654 = function(n,e,i_off,a,baseN) {
	var A2 = a[baseN >> 3];
	var zOffset = i_off;
	var baseOffset = i_off - 16 * n;
	while(zOffset > baseOffset) {
		var t0 = e[zOffset];
		var t1 = e[zOffset + -8];
		e[zOffset + -8] = t0 - t1;
		e[zOffset] = t0 + t1;
		t0 = e[zOffset + -1];
		t1 = e[zOffset + -9];
		e[zOffset + -9] = t0 - t1;
		e[zOffset + -1] = t0 + t1;
		t0 = e[zOffset + -2];
		t1 = e[zOffset + -10];
		var k00 = t0 - t1;
		e[zOffset + -2] = t0 + t1;
		t0 = e[zOffset + -3];
		t1 = e[zOffset + -11];
		var k11 = t0 - t1;
		e[zOffset + -3] = t0 + t1;
		e[zOffset + -10] = (k00 + k11) * A2;
		e[zOffset + -11] = (k11 - k00) * A2;
		t0 = e[zOffset + -4];
		t1 = e[zOffset + -12];
		k00 = t1 - t0;
		e[zOffset + -4] = t0 + t1;
		t0 = e[zOffset + -5];
		t1 = e[zOffset + -13];
		k11 = t0 - t1;
		e[zOffset + -5] = t0 + t1;
		e[zOffset + -12] = k11;
		e[zOffset + -13] = k00;
		t0 = e[zOffset + -6];
		t1 = e[zOffset + -14];
		k00 = t1 - t0;
		e[zOffset + -6] = t0 + t1;
		t0 = e[zOffset + -7];
		t1 = e[zOffset + -15];
		k11 = t0 - t1;
		e[zOffset + -7] = t0 + t1;
		e[zOffset + -14] = (k00 + k11) * A2;
		e[zOffset + -15] = (k00 - k11) * A2;
		kha_audio2_ogg_tools_Mdct.iter54(e,zOffset);
		kha_audio2_ogg_tools_Mdct.iter54(e,zOffset - 8);
		zOffset -= 16;
	}
};
var kha_audio2_ogg_vorbis_Reader = function(input,seekFunc,inputLength) {
	this.seekFunc = seekFunc;
	this.inputLength = inputLength;
	this.decoder = kha_audio2_ogg_vorbis_VorbisDecoder.start(input);
	this.decoder.setupSampleNumber(seekFunc,inputLength);
	this.loopStart = this.get_header().comment.get_loopStart();
	this.loopLength = this.get_header().comment.get_loopLength();
};
$hxClasses["kha.audio2.ogg.vorbis.Reader"] = kha_audio2_ogg_vorbis_Reader;
kha_audio2_ogg_vorbis_Reader.__name__ = true;
kha_audio2_ogg_vorbis_Reader.openFromBytes = function(bytes) {
	var input = new haxe_io_BytesInput(bytes);
	return new kha_audio2_ogg_vorbis_Reader(input,(function(f,a1) {
		return function(a2) {
			f(a1,a2);
		};
	})(kha_audio2_ogg_vorbis_Reader.seekBytes,input),bytes.length);
};
kha_audio2_ogg_vorbis_Reader.seekBytes = function(bytes,pos) {
	bytes.set_position(pos);
};
kha_audio2_ogg_vorbis_Reader.readAll = function(bytes,output,useFloat) {
	if(useFloat == null) useFloat = false;
	var input = new haxe_io_BytesInput(bytes);
	var decoder = kha_audio2_ogg_vorbis_VorbisDecoder.start(input);
	decoder.setupSampleNumber((function(f,a1) {
		return function(a2) {
			f(a1,a2);
		};
	})(kha_audio2_ogg_vorbis_Reader.seekBytes,input),bytes.length);
	var header = decoder.header;
	var count = 0;
	var bufferSize = 4096;
	var buffer;
	var this1;
	this1 = new Array(bufferSize * header.channel);
	buffer = this1;
	while(true) {
		var n = decoder.read(buffer,bufferSize,header.channel,header.sampleRate,useFloat);
		var _g1 = 0;
		var _g = n * header.channel;
		while(_g1 < _g) {
			var i = _g1++;
			output.writeInt32(haxe_io_FPHelper.floatToI32(buffer[i]));
		}
		if(n == 0) break;
		count += n;
	}
	return decoder.header;
};
kha_audio2_ogg_vorbis_Reader.prototype = {
	decoder: null
	,get_header: function() {
		return this.decoder.header;
	}
	,get_totalSample: function() {
		return this.decoder.totalSample;
	}
	,get_totalMillisecond: function() {
		return this.sampleToMillisecond(this.decoder.totalSample);
	}
	,get_currentSample: function() {
		return this.decoder.currentSample;
	}
	,set_currentSample: function(value) {
		this.decoder.seek(this.seekFunc,this.inputLength,value);
		return this.decoder.currentSample;
	}
	,get_currentMillisecond: function() {
		return this.sampleToMillisecond(this.get_currentSample());
	}
	,set_currentMillisecond: function(value) {
		this.set_currentSample(this.millisecondToSample(value));
		return this.get_currentMillisecond();
	}
	,loopStart: null
	,loopLength: null
	,seekFunc: null
	,inputLength: null
	,read: function(output,samples,channels,sampleRate,useFloat) {
		if(useFloat == null) useFloat = false;
		this.decoder.ensurePosition(this.seekFunc);
		if(samples == null) samples = this.decoder.totalSample;
		if(channels == null) channels = this.get_header().channel;
		if(sampleRate == null) sampleRate = this.get_header().sampleRate;
		return this.decoder.read(output,samples,channels,sampleRate,useFloat);
	}
	,clone: function() {
		var reader = Type.createEmptyInstance(kha_audio2_ogg_vorbis_Reader);
		reader.seekFunc = this.seekFunc;
		reader.inputLength = this.inputLength;
		reader.decoder = this.decoder.clone(this.seekFunc);
		reader.loopStart = this.loopStart;
		reader.loopLength = this.loopLength;
		return reader;
	}
	,sampleToMillisecond: function(samples) {
		return (function($this) {
			var $r;
			var b = $this.get_header().sampleRate;
			$r = _$UInt_UInt_$Impl_$.toFloat(samples) / _$UInt_UInt_$Impl_$.toFloat(b);
			return $r;
		}(this)) * 1000;
	}
	,millisecondToSample: function(millseconds) {
		return Math.floor((function($this) {
			var $r;
			var _g = millseconds / 1000;
			var _g1 = $this.get_header().sampleRate;
			$r = _$UInt_UInt_$Impl_$.toFloat(_g1) * _g;
			return $r;
		}(this)));
	}
	,__class__: kha_audio2_ogg_vorbis_Reader
};
var kha_audio2_ogg_vorbis_VorbisDecodeState = function(input) {
	this.nextSeg = 0;
	this.firstDecode = false;
	this.bytesInSeg = 0;
	this.validBits = 0;
	this.input = input;
	this.inputPosition = 0;
	this.page = new kha_audio2_ogg_vorbis_data_Page();
	kha_audio2_ogg_tools_Crc32.init();
};
$hxClasses["kha.audio2.ogg.vorbis.VorbisDecodeState"] = kha_audio2_ogg_vorbis_VorbisDecodeState;
kha_audio2_ogg_vorbis_VorbisDecodeState.__name__ = true;
kha_audio2_ogg_vorbis_VorbisDecodeState.prototype = {
	page: null
	,eof: null
	,pFirst: null
	,pLast: null
	,validBits: null
	,inputPosition: null
	,input: null
	,discardSamplesDeferred: null
	,segments: null
	,bytesInSeg: null
	,channelBuffers: null
	,channelBufferStart: null
	,channelBufferEnd: null
	,currentSample: null
	,previousWindow: null
	,previousLength: null
	,finalY: null
	,firstDecode: null
	,nextSeg: null
	,acc: null
	,lastSeg: null
	,lastSegWhich: null
	,endSegWithKnownLoc: null
	,knownLocForPacket: null
	,error: null
	,currentLoc: null
	,currentLocValid: null
	,firstAudioPageOffset: null
	,setup: function(loc0,loc1) {
		var segmentCount;
		this.inputPosition += 1;
		segmentCount = this.input.readByte();
		this.segments = this.read(segmentCount);
		this.endSegWithKnownLoc = -2;
		if(loc0 != -1 || loc1 != -1) {
			var i = segmentCount - 1;
			while(i >= 0) {
				if(this.segments[i] < 255) break;
				if(i >= 0) {
					this.endSegWithKnownLoc = i;
					this.knownLocForPacket = loc0;
				}
				i--;
			}
		}
		if(this.firstDecode) {
			var i1 = 0;
			var len = 0;
			var p = new kha_audio2_ogg_vorbis_data_ProbedPage();
			var _g = 0;
			while(_g < segmentCount) {
				var i2 = _g++;
				len += this.segments[i2];
			}
			len += 27 + segmentCount;
			p.pageStart = this.firstAudioPageOffset;
			p.pageEnd = p.pageStart + len;
			p.firstDecodedSample = 0;
			p.lastDecodedSample = loc0;
			this.pFirst = p;
		}
		this.nextSeg = 0;
	}
	,clone: function(seekFunc) {
		var state = Type.createEmptyInstance(kha_audio2_ogg_vorbis_VorbisDecodeState);
		seekFunc(this.inputPosition);
		state.input = this.input;
		state.eof = this.eof;
		state.validBits = this.validBits;
		state.discardSamplesDeferred = this.discardSamplesDeferred;
		state.firstDecode = this.firstDecode;
		state.nextSeg = this.nextSeg;
		state.bytesInSeg = this.bytesInSeg;
		state.acc = state.acc;
		state.lastSeg = this.lastSeg;
		state.lastSegWhich = this.lastSegWhich;
		state.currentLoc = this.currentLoc;
		state.currentLocValid = this.currentLocValid;
		state.inputPosition = this.inputPosition;
		state.firstAudioPageOffset = this.firstAudioPageOffset;
		state.error = this.error;
		state.segments = this.segments;
		state.pFirst = this.pFirst;
		state.pLast = this.pLast;
		state.page = this.page.clone();
		return state;
	}
	,next: function() {
		if(this.lastSeg) return 0;
		if(this.nextSeg == -1) {
			this.lastSegWhich = this.segments.length - 1;
			try {
				this.page.start(this);
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				if( js_Boot.__instanceof(e,kha_audio2_ogg_vorbis_data_ReaderError) ) {
					this.lastSeg = true;
					this.error = e;
					return 0;
				} else throw(e);
			}
			if((this.page.flag & 1) == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.CONTINUED_PACKET_FLAG_INVALID,null,{ fileName : "VorbisDecodeState.hx", lineNumber : 171, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "next"}));
		}
		var len;
		var index = this.nextSeg++;
		len = this.segments[index];
		if(len < 255) {
			this.lastSeg = true;
			this.lastSegWhich = this.nextSeg - 1;
		}
		if(this.nextSeg >= this.segments.length) this.nextSeg = -1;
		this.bytesInSeg = len;
		return len;
	}
	,startPacket: function() {
		while(this.nextSeg == -1) {
			this.page.start(this);
			if((this.page.flag & 1) != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.MISSING_CAPTURE_PATTERN,null,{ fileName : "VorbisDecodeState.hx", lineNumber : 193, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "startPacket"}));
		}
		this.lastSeg = false;
		this.validBits = 0;
		this.bytesInSeg = 0;
	}
	,maybeStartPacket: function() {
		if(this.nextSeg == -1) {
			var eof = false;
			var x;
			try {
				this.inputPosition += 1;
				x = this.input.readByte();
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				if( js_Boot.__instanceof(e,haxe_io_Eof) ) {
					eof = true;
					x = 0;
				} else throw(e);
			}
			if(eof) return false;
			if(x != 79 || (function($this) {
				var $r;
				$this.inputPosition += 1;
				$r = $this.input.readByte();
				return $r;
			}(this)) != 103 || (function($this) {
				var $r;
				$this.inputPosition += 1;
				$r = $this.input.readByte();
				return $r;
			}(this)) != 103 || (function($this) {
				var $r;
				$this.inputPosition += 1;
				$r = $this.input.readByte();
				return $r;
			}(this)) != 83) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.MISSING_CAPTURE_PATTERN,null,{ fileName : "VorbisDecodeState.hx", lineNumber : 218, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "maybeStartPacket"}));
			this.page.startWithoutCapturePattern(this);
		}
		this.startPacket();
		return true;
	}
	,readBits: function(n) {
		if(this.validBits < 0) return 0; else if(this.validBits < n) {
			if(n > 24) return this.readBits(24) + (this.readBits(n - 24) << 24); else {
				if(this.validBits == 0) this.acc = 0;
				do if(this.bytesInSeg == 0 && (this.lastSeg || this.next() == 0)) {
					this.validBits = -1;
					break;
				} else {
					this.bytesInSeg--;
					var b;
					b = (function($this) {
						var $r;
						$this.inputPosition += 1;
						$r = $this.input.readByte();
						return $r;
					}(this)) << this.validBits;
					this.acc = this.acc + b;
					this.validBits += 8;
				} while(this.validBits < n);
				if(this.validBits < 0) return 0; else {
					var z = this.acc & (1 << n) - 1;
					this.acc = this.acc >>> n;
					this.validBits -= n;
					return z;
				}
			}
		} else {
			var z1 = this.acc & (1 << n) - 1;
			this.acc = this.acc >>> n;
			this.validBits -= n;
			return z1;
		}
	}
	,readPacketRaw: function() {
		if(this.bytesInSeg == 0 && (this.lastSeg || this.next() == 0)) return -1; else {
			this.bytesInSeg--;
			this.inputPosition += 1;
			return this.input.readByte();
		}
	}
	,readPacket: function() {
		var x;
		if(this.bytesInSeg == 0 && (this.lastSeg || this.next() == 0)) x = -1; else {
			this.bytesInSeg--;
			this.inputPosition += 1;
			x = this.input.readByte();
		}
		this.validBits = 0;
		return x;
	}
	,flushPacket: function() {
		while(this.bytesInSeg != 0 || !this.lastSeg && this.next() != 0) {
			this.bytesInSeg--;
			this.inputPosition += 1;
			this.input.readByte();
		}
	}
	,vorbisValidate: function() {
		var header = haxe_io_Bytes.alloc(6);
		var _g = 0;
		while(_g < 6) {
			var i = _g++;
			header.set(i,this.readPacket());
		}
		if(header.toString() != "vorbis") throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,"vorbis header",{ fileName : "VorbisDecodeState.hx", lineNumber : 300, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "vorbisValidate"}));
	}
	,firstPageValidate: function() {
		if(this.segments.length != 1) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"segmentCount",{ fileName : "VorbisDecodeState.hx", lineNumber : 307, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "firstPageValidate"}));
		if(this.segments[0] != 30) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"decodeState head",{ fileName : "VorbisDecodeState.hx", lineNumber : 310, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "firstPageValidate"}));
	}
	,startFirstDecode: function() {
		this.firstAudioPageOffset = this.inputPosition;
		this.firstDecode = true;
	}
	,capturePattern: function() {
		if((function($this) {
			var $r;
			$this.inputPosition += 1;
			$r = $this.input.readByte();
			return $r;
		}(this)) != 79 || (function($this) {
			var $r;
			$this.inputPosition += 1;
			$r = $this.input.readByte();
			return $r;
		}(this)) != 103 || (function($this) {
			var $r;
			$this.inputPosition += 1;
			$r = $this.input.readByte();
			return $r;
		}(this)) != 103 || (function($this) {
			var $r;
			$this.inputPosition += 1;
			$r = $this.input.readByte();
			return $r;
		}(this)) != 83) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.MISSING_CAPTURE_PATTERN,null,{ fileName : "VorbisDecodeState.hx", lineNumber : 323, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "capturePattern"}));
	}
	,skip: function(len) {
		this.read(len);
	}
	,prepHuffman: function() {
		if(this.validBits <= 24) {
			if(this.validBits == 0) this.acc = 0;
			do if(this.bytesInSeg == 0 && (this.lastSeg || this.next() == 0)) return; else {
				this.bytesInSeg--;
				var b;
				b = (function($this) {
					var $r;
					$this.inputPosition += 1;
					$r = $this.input.readByte();
					return $r;
				}(this)) << this.validBits;
				this.acc = this.acc + b;
				this.validBits += 8;
			} while(this.validBits <= 24);
		}
	}
	,decode: function(c) {
		var val = this.decodeRaw(c);
		if(c.sparse) val = c.sortedValues[val];
		return val;
	}
	,decodeRaw: function(c) {
		if(this.validBits < 10) this.prepHuffman();
		var i = c.fastHuffman[this.acc & 1023];
		if(i >= 0) {
			var l = c.codewordLengths[i];
			this.acc = this.acc >>> l;
			this.validBits -= l;
			if(this.validBits < 0) {
				this.validBits = 0;
				return -1;
			} else return i;
		} else return this.decodeScalarRaw(c);
	}
	,isLastByte: function() {
		return this.bytesInSeg == 0 && this.lastSeg;
	}
	,finishDecodePacket: function(previousLength,n,r) {
		var left = r.left.start;
		var currentLocValid = false;
		var n2 = n >> 1;
		if(this.firstDecode) {
			this.currentLoc = -n2;
			this.discardSamplesDeferred = n - r.right.end;
			currentLocValid = true;
			this.firstDecode = false;
		} else if(this.discardSamplesDeferred != 0) {
			r.left.start += this.discardSamplesDeferred;
			left = r.left.start;
			this.discardSamplesDeferred = 0;
		} else if(previousLength == 0 && currentLocValid) {
		}
		if(this.lastSegWhich == this.endSegWithKnownLoc) {
			if(currentLocValid && (this.page.flag & 4) != 0) {
				var currentEnd = this.knownLocForPacket - (n - r.right.end);
				if(currentEnd < this.currentLoc + r.right.end) {
					var len;
					if(currentEnd < this.currentLoc) len = 0; else len = currentEnd - this.currentLoc;
					len += r.left.start;
					this.currentLoc += len;
					return { len : len, left : left, right : r.right.start};
				}
			}
			this.currentLoc = this.knownLocForPacket - (n2 - r.left.start);
			currentLocValid = true;
		}
		if(currentLocValid) this.currentLoc += r.right.start - r.left.start;
		return { len : r.right.end, left : left, right : r.right.start};
	}
	,readInt32: function() {
		this.inputPosition += 4;
		return this.input.readInt32();
	}
	,readByte: function() {
		this.inputPosition += 1;
		return this.input.readByte();
	}
	,read: function(n) {
		this.inputPosition += n;
		var vec;
		var this1;
		this1 = new Array(n);
		vec = this1;
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			var val = this.input.readByte();
			vec[i] = val;
		}
		return vec;
	}
	,readBytes: function(n) {
		this.inputPosition += n;
		return this.input.read(n);
	}
	,readString: function(n) {
		this.inputPosition += n;
		return this.input.readString(n);
	}
	,getSampleNumber: function(seekFunc,inputLength) {
		var restoreOffset = this.inputPosition;
		var previousSafe;
		if(_$UInt_UInt_$Impl_$.gte(inputLength,65536) && _$UInt_UInt_$Impl_$.gte(inputLength - 65536,this.firstAudioPageOffset)) previousSafe = inputLength - 65536; else previousSafe = this.firstAudioPageOffset;
		seekFunc(this.inputPosition = previousSafe);
		var end = 0;
		var last = false;
		{
			var _g = this.findPage(seekFunc,inputLength);
			switch(_g[1]) {
			case 0:
				var l = _g[3];
				var e = _g[2];
				end = e;
				last = l;
				break;
			case 1:
				throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.CANT_FIND_LAST_PAGE,null,{ fileName : "VorbisDecodeState.hx", lineNumber : 518, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "getSampleNumber"}));
				break;
			}
		}
		var lastPageLoc = this.inputPosition;
		try {
			while(!last) {
				seekFunc(this.inputPosition = end);
				{
					var _g1 = this.findPage(seekFunc,inputLength);
					switch(_g1[1]) {
					case 0:
						var l1 = _g1[3];
						var e1 = _g1[2];
						end = e1;
						last = l1;
						break;
					case 1:
						throw "__break__";
						break;
					}
				}
				previousSafe = lastPageLoc + 1;
				lastPageLoc = this.inputPosition;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		seekFunc(this.inputPosition = lastPageLoc);
		var vorbisHeader = this.read(6);
		var lo;
		this.inputPosition += 4;
		lo = this.input.readInt32();
		var hi;
		this.inputPosition += 4;
		hi = this.input.readInt32();
		if(lo == -1 && hi == -1 || hi > 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.CANT_FIND_LAST_PAGE,null,{ fileName : "VorbisDecodeState.hx", lineNumber : 552, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "getSampleNumber"}));
		this.pLast = new kha_audio2_ogg_vorbis_data_ProbedPage();
		this.pLast.pageStart = lastPageLoc;
		this.pLast.pageEnd = end;
		this.pLast.lastDecodedSample = lo;
		this.pLast.firstDecodedSample = null;
		this.pLast.afterPreviousPageStart = previousSafe;
		seekFunc(this.inputPosition = restoreOffset);
		return lo;
	}
	,forcePageResync: function() {
		this.nextSeg = -1;
	}
	,setInputOffset: function(seekFunc,n) {
		seekFunc(this.inputPosition = n);
	}
	,findPage: function(seekFunc,inputLength) {
		try {
			while(true) {
				var n;
				this.inputPosition += 1;
				n = this.input.readByte();
				if(n == 79) {
					var retryLoc = this.inputPosition;
					if(retryLoc - 25 > inputLength) return kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult.NotFound;
					if((function($this) {
						var $r;
						$this.inputPosition += 1;
						$r = $this.input.readByte();
						return $r;
					}(this)) != 103 || (function($this) {
						var $r;
						$this.inputPosition += 1;
						$r = $this.input.readByte();
						return $r;
					}(this)) != 103 || (function($this) {
						var $r;
						$this.inputPosition += 1;
						$r = $this.input.readByte();
						return $r;
					}(this)) != 83) continue;
					var header;
					var this1;
					this1 = new Array(27);
					header = this1;
					header[0] = 79;
					header[1] = 103;
					header[2] = 103;
					header[3] = 83;
					var _g = 4;
					while(_g < 27) {
						var i = _g++;
						var val;
						this.inputPosition += 1;
						val = this.input.readByte();
						header[i] = val;
					}
					if(header[4] != 0) {
						seekFunc(this.inputPosition = retryLoc);
						continue;
					}
					var goal = header[22] + (header[23] << 8) + (header[24] << 16) + (header[25] << 24);
					var _g1 = 22;
					while(_g1 < 26) {
						var i1 = _g1++;
						header[i1] = 0;
					}
					var crc = 0;
					var _g2 = 0;
					while(_g2 < 27) {
						var i2 = _g2++;
						crc = crc << 8 ^ kha_audio2_ogg_tools_Crc32.table[header[i2] ^ crc >>> 24];
					}
					var len = 0;
					try {
						var _g11 = 0;
						var _g3 = header[26];
						while(_g11 < _g3) {
							var i3 = _g11++;
							var s;
							this.inputPosition += 1;
							s = this.input.readByte();
							crc = crc << 8 ^ kha_audio2_ogg_tools_Crc32.table[s ^ crc >>> 24];
							len += s;
						}
						var _g4 = 0;
						while(_g4 < len) {
							var i4 = _g4++;
							crc = kha_audio2_ogg_tools_Crc32.update(crc,(function($this) {
								var $r;
								$this.inputPosition += 1;
								$r = $this.input.readByte();
								return $r;
							}(this)));
						}
					} catch( e ) {
						if (e instanceof js__$Boot_HaxeError) e = e.val;
						if( js_Boot.__instanceof(e,haxe_io_Eof) ) {
							return kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult.NotFound;
						} else throw(e);
					}
					if(crc == goal) {
						var end = this.inputPosition;
						seekFunc(this.inputPosition = retryLoc - 1);
						return kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult.Found(end,(header[5] & 4) != 0);
					}
				}
			}
		} catch( e1 ) {
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			if( js_Boot.__instanceof(e1,haxe_io_Eof) ) {
				return kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult.NotFound;
			} else throw(e1);
		}
	}
	,analyzePage: function(seekFunc,h) {
		var z = new kha_audio2_ogg_vorbis_data_ProbedPage();
		var packetType;
		var this1;
		this1 = new Array(255);
		packetType = this1;
		z.pageStart = this.inputPosition;
		var pageHeader = this.read(27);
		var lacing = this.read(pageHeader[26]);
		var len = 0;
		var _g1 = 0;
		var _g = pageHeader[26];
		while(_g1 < _g) {
			var i1 = _g1++;
			len += lacing[i1];
		}
		z.pageEnd = z.pageStart + 27 + pageHeader[26] + len;
		z.lastDecodedSample = pageHeader[6] + (pageHeader[7] << 8) + (pageHeader[8] << 16) + (pageHeader[9] << 16);
		if((pageHeader[5] & 4) != 0) {
			z.firstDecodedSample = null;
			seekFunc(this.inputPosition = z.pageStart);
			return z;
		}
		var numPacket = 0;
		var packetStart = (pageHeader[5] & 1) == 0;
		var modeCount = h.modes.length;
		var _g11 = 0;
		var _g2 = pageHeader[26];
		while(_g11 < _g2) {
			var i2 = _g11++;
			if(packetStart) {
				if(lacing[i2] == 0) {
					seekFunc(this.inputPosition = z.pageStart);
					return null;
				}
				var n;
				this.inputPosition += 1;
				n = this.input.readByte();
				if((n & 1) != 0) {
					seekFunc(this.inputPosition = z.pageStart);
					return null;
				}
				n >>= 1;
				var b = kha_audio2_ogg_tools_MathTools.ilog(modeCount - 1);
				n &= (1 << b) - 1;
				if(n >= modeCount) {
					seekFunc(this.inputPosition = z.pageStart);
					return null;
				}
				var index = numPacket++;
				packetType[index] = h.modes[n].blockflag;
				this.read(lacing[i2] - 1);
			} else this.read(lacing[i2]);
			packetStart = lacing[i2] < 255;
		}
		var samples = 0;
		if(numPacket > 1) if(packetType[numPacket - 1]) samples += h.blocksize1; else samples += h.blocksize0;
		var i = numPacket - 2;
		while(i >= 1) {
			i--;
			if(packetType[i]) {
				if(packetType[i + 1]) samples += h.blocksize1 >> 1; else samples += (h.blocksize1 - h.blocksize0 >> 2) + (h.blocksize0 >> 1);
			} else samples += h.blocksize0 >> 1;
			i--;
		}
		z.firstDecodedSample = z.lastDecodedSample - samples;
		seekFunc(this.inputPosition = z.pageStart);
		return z;
	}
	,decodeScalarRaw: function(c) {
		this.prepHuffman();
		var codewordLengths = c.codewordLengths;
		var codewords = c.codewords;
		var sortedCodewords = c.sortedCodewords;
		if(c.entries > 8?sortedCodewords != null:codewords != null) {
			var code = kha_audio2_ogg_vorbis_VorbisTools.bitReverse(this.acc);
			var x = 0;
			var n = c.sortedEntries;
			while(n > 1) {
				var m = x + (n >> 1);
				if(_$UInt_UInt_$Impl_$.gte(code,sortedCodewords[m])) {
					x = m;
					n -= n >> 1;
				} else n >>= 1;
			}
			if(!c.sparse) x = c.sortedValues[x];
			var len = codewordLengths[x];
			if(this.validBits >= len) {
				this.acc = this.acc >>> len;
				this.validBits -= len;
				return x;
			}
			this.validBits = 0;
			return -1;
		}
		var _g1 = 0;
		var _g = c.entries;
		while(_g1 < _g) {
			var i = _g1++;
			var cl = codewordLengths[i];
			if(cl == 255) continue;
			if(codewords[i] == (this.acc & (1 << cl) - 1)) {
				if(this.validBits >= cl) {
					this.acc = this.acc >>> cl;
					this.validBits -= cl;
					return i;
				}
				this.validBits = 0;
				return -1;
			}
		}
		this.error = new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM,null,{ fileName : "VorbisDecodeState.hx", lineNumber : 846, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "decodeScalarRaw"});
		this.validBits = 0;
		return -1;
	}
	,__class__: kha_audio2_ogg_vorbis_VorbisDecodeState
};
var kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult = $hxClasses["kha.audio2.ogg.vorbis._VorbisDecodeState.FindPageResult"] = { __ename__ : true, __constructs__ : ["Found","NotFound"] };
kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult.Found = function(end,last) { var $x = ["Found",0,end,last]; $x.__enum__ = kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult; $x.toString = $estr; return $x; };
kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult.NotFound = ["NotFound",1];
kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult.NotFound.toString = $estr;
kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult.NotFound.__enum__ = kha_audio2_ogg_vorbis__$VorbisDecodeState_FindPageResult;
var kha_audio2_ogg_vorbis_VorbisDecoder = function(header,decodeState) {
	this.header = header;
	this.decodeState = decodeState;
	this.totalSample = null;
	this.currentSample = 0;
	this.previousLength = 0;
	var this1;
	this1 = new Array(header.channel);
	this.channelBuffers = this1;
	var this2;
	this2 = new Array(header.channel);
	this.previousWindow = this2;
	var this3;
	this3 = new Array(header.channel);
	this.finalY = this3;
	var _g1 = 0;
	var _g = header.channel;
	while(_g1 < _g) {
		var i = _g1++;
		var val = kha_audio2_ogg_vorbis_VorbisTools.emptyFloatVector(header.blocksize1);
		this.channelBuffers[i] = val;
		var val1 = kha_audio2_ogg_vorbis_VorbisTools.emptyFloatVector(header.blocksize1 / 2 | 0);
		this.previousWindow[i] = val1;
		var val2 = [];
		this.finalY[i] = val2;
	}
	var this4;
	this4 = new Array(2);
	this.a = this4;
	var this5;
	this5 = new Array(2);
	this.b = this5;
	var this6;
	this6 = new Array(2);
	this.c = this6;
	var this7;
	this7 = new Array(2);
	this.window = this7;
	var this8;
	this8 = new Array(2);
	this.bitReverseData = this8;
	this.initBlocksize(0,header.blocksize0);
	this.initBlocksize(1,header.blocksize1);
};
$hxClasses["kha.audio2.ogg.vorbis.VorbisDecoder"] = kha_audio2_ogg_vorbis_VorbisDecoder;
kha_audio2_ogg_vorbis_VorbisDecoder.__name__ = true;
kha_audio2_ogg_vorbis_VorbisDecoder.start = function(input) {
	var decodeState = new kha_audio2_ogg_vorbis_VorbisDecodeState(input);
	var header = kha_audio2_ogg_vorbis_data_Header.read(decodeState);
	var decoder = new kha_audio2_ogg_vorbis_VorbisDecoder(header,decodeState);
	decodeState.startFirstDecode();
	decoder.pumpFirstFrame();
	return decoder;
};
kha_audio2_ogg_vorbis_VorbisDecoder.prototype = {
	previousWindow: null
	,previousLength: null
	,finalY: null
	,a: null
	,b: null
	,c: null
	,window: null
	,bitReverseData: null
	,channelBuffers: null
	,channelBufferStart: null
	,channelBufferEnd: null
	,header: null
	,currentSample: null
	,totalSample: null
	,decodeState: null
	,read: function(output,samples,channels,sampleRate,useFloat) {
		if((function($this) {
			var $r;
			var a = Std["int"](_$UInt_UInt_$Impl_$.toFloat(sampleRate) % _$UInt_UInt_$Impl_$.toFloat($this.header.sampleRate));
			$r = a != 0;
			return $r;
		}(this))) throw new js__$Boot_HaxeError("Unsupported sampleRate : can't convert " + Std.string(_$UInt_UInt_$Impl_$.toFloat(this.header.sampleRate)) + " to " + sampleRate);
		if(channels % this.header.channel != 0) throw new js__$Boot_HaxeError("Unsupported channels : can't convert " + this.header.channel + " to " + channels);
		var sampleRepeat = Std["int"](_$UInt_UInt_$Impl_$.toFloat(sampleRate) / _$UInt_UInt_$Impl_$.toFloat(this.header.sampleRate));
		var channelRepeat = channels / this.header.channel | 0;
		var n = 0;
		var len = Math.floor(samples / sampleRepeat);
		if(this.totalSample != null && len > this.totalSample - this.currentSample) len = this.totalSample - this.currentSample;
		var index = 0;
		while(n < len) {
			var k = this.channelBufferEnd - this.channelBufferStart;
			if(k >= len - n) k = len - n;
			var _g1 = this.channelBufferStart;
			var _g = this.channelBufferStart + k;
			while(_g1 < _g) {
				var j = _g1++;
				var _g2 = 0;
				while(_g2 < sampleRepeat) {
					var sr = _g2++;
					var _g4 = 0;
					var _g3 = this.header.channel;
					while(_g4 < _g3) {
						var i = _g4++;
						var _g5 = 0;
						while(_g5 < channelRepeat) {
							var cr = _g5++;
							var value = this.channelBuffers[i][j];
							if(value > 1) value = 1; else if(value < -1) value = -1;
							if(useFloat) {
								output[index] = value;
								++index;
							} else {
							}
						}
					}
				}
			}
			n += k;
			this.channelBufferStart += k;
			if(n == len || this.getFrameFloat() == 0) break;
		}
		var _g6 = n;
		while(_g6 < len) {
			var j1 = _g6++;
			var _g11 = 0;
			while(_g11 < sampleRepeat) {
				var sr1 = _g11++;
				var _g31 = 0;
				var _g21 = this.header.channel;
				while(_g31 < _g21) {
					var i1 = _g31++;
					var _g41 = 0;
					while(_g41 < channelRepeat) {
						var cr1 = _g41++;
						if(useFloat) {
							output[index] = 0;
							++index;
						} else {
						}
					}
				}
			}
		}
		this.currentSample += len;
		return len * sampleRepeat;
	}
	,skipSamples: function(len) {
		var n = 0;
		if(this.totalSample != null && len > this.totalSample - this.currentSample) len = this.totalSample - this.currentSample;
		while(n < len) {
			var k = this.channelBufferEnd - this.channelBufferStart;
			if(k >= len - n) k = len - n;
			n += k;
			this.channelBufferStart += k;
			if(n == len || this.getFrameFloat() == 0) break;
		}
		this.currentSample += len;
		return len;
	}
	,setupSampleNumber: function(seekFunc,inputLength) {
		if(this.totalSample == null) this.totalSample = this.decodeState.getSampleNumber(seekFunc,inputLength);
	}
	,seek: function(seekFunc,inputLength,sampleNumber) {
		if(this.currentSample == sampleNumber) return;
		if(this.totalSample == null) {
			this.setupSampleNumber(seekFunc,inputLength);
			if(this.totalSample == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.CANT_FIND_LAST_PAGE,null,{ fileName : "VorbisDecoder.hx", lineNumber : 187, className : "kha.audio2.ogg.vorbis.VorbisDecoder", methodName : "seek"}));
		}
		if(sampleNumber < 0) sampleNumber = 0;
		var p0 = this.decodeState.pFirst;
		var p1 = this.decodeState.pLast;
		if(sampleNumber >= p1.lastDecodedSample) sampleNumber = p1.lastDecodedSample - 1;
		if(sampleNumber < p0.lastDecodedSample) this.seekFrameFromPage(seekFunc,p0.pageStart,0,sampleNumber); else {
			var attempts = 0;
			while(p0.pageEnd < p1.pageStart) {
				var startOffset = p0.pageEnd;
				var endOffset = p1.afterPreviousPageStart;
				var startSample = p0.lastDecodedSample;
				var endSample = p1.lastDecodedSample;
				if(startSample == null || endSample == null) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_FAILED,null,{ fileName : "VorbisDecoder.hx", lineNumber : 219, className : "kha.audio2.ogg.vorbis.VorbisDecoder", methodName : "seek"}));
				if(_$UInt_UInt_$Impl_$.gt(endOffset,startOffset + 4000)) endOffset = endOffset - 4000;
				var probe;
				var b = Math.floor(_$UInt_UInt_$Impl_$.toFloat(endOffset - startOffset) / _$UInt_UInt_$Impl_$.toFloat(endSample - startSample) * (sampleNumber - startSample));
				probe = startOffset + b;
				if(attempts >= 4) {
					var probe2 = startOffset + (endOffset - startOffset >>> 1);
					if(attempts >= 8) probe = probe2; else if(_$UInt_UInt_$Impl_$.gt(probe2,probe)) probe = probe + (probe2 - probe >>> 1); else probe = probe2 + (probe - probe2 >>> 1);
				}
				++attempts;
				seekFunc(this.decodeState.inputPosition = probe);
				{
					var _g = this.decodeState.findPage(seekFunc,inputLength);
					switch(_g[1]) {
					case 1:
						throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_FAILED,null,{ fileName : "VorbisDecoder.hx", lineNumber : 249, className : "kha.audio2.ogg.vorbis.VorbisDecoder", methodName : "seek"}));
						break;
					case 0:
						break;
					}
				}
				var q = this.decodeState.analyzePage(seekFunc,this.header);
				if(q == null) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_FAILED,null,{ fileName : "VorbisDecoder.hx", lineNumber : 255, className : "kha.audio2.ogg.vorbis.VorbisDecoder", methodName : "seek"}));
				q.afterPreviousPageStart = probe;
				if(q.pageStart == p1.pageStart) {
					p1 = q;
					continue;
				}
				if(sampleNumber < q.lastDecodedSample) p1 = q; else p0 = q;
			}
			if(p0.lastDecodedSample <= sampleNumber && sampleNumber < p1.lastDecodedSample) this.seekFrameFromPage(seekFunc,p1.pageStart,p0.lastDecodedSample,sampleNumber); else throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_FAILED,null,{ fileName : "VorbisDecoder.hx", lineNumber : 275, className : "kha.audio2.ogg.vorbis.VorbisDecoder", methodName : "seek"}));
		}
	}
	,seekFrameFromPage: function(seekFunc,pageStart,firstSample,targetSample) {
		var frame = 0;
		var frameStart = firstSample;
		seekFunc(this.decodeState.inputPosition = pageStart);
		this.decodeState.nextSeg = -1;
		var leftEnd = 0;
		var leftStart = 0;
		var prevState = null;
		var lastState = null;
		while(true) {
			prevState = lastState;
			lastState = this.decodeState.clone(seekFunc);
			var initialResult = this.decodeInitial();
			if(initialResult == null) {
				lastState = prevState;
				break;
			}
			leftStart = initialResult.left.start;
			leftEnd = initialResult.left.end;
			var start;
			if(frame == 0) start = leftEnd; else start = leftStart;
			if(targetSample < frameStart + initialResult.right.start - start) break;
			this.decodeState.flushPacket();
			frameStart += initialResult.right.start - start;
			++frame;
		}
		this.decodeState = lastState;
		seekFunc(this.decodeState.inputPosition);
		this.previousLength = 0;
		this.pumpFirstFrame();
		this.currentSample = frameStart;
		this.skipSamples(targetSample - frameStart);
	}
	,clone: function(seekFunc) {
		var decoder = Type.createEmptyInstance(kha_audio2_ogg_vorbis_VorbisDecoder);
		decoder.currentSample = this.currentSample;
		decoder.totalSample = this.totalSample;
		decoder.previousLength = this.previousLength;
		decoder.channelBufferStart = this.channelBufferStart;
		decoder.channelBufferEnd = this.channelBufferEnd;
		decoder.a = this.a;
		decoder.b = this.b;
		decoder.c = this.c;
		decoder.window = this.window;
		decoder.bitReverseData = this.bitReverseData;
		decoder.header = this.header;
		decoder.decodeState = this.decodeState.clone(seekFunc);
		var this1;
		this1 = new Array(this.header.channel);
		decoder.channelBuffers = this1;
		var this2;
		this2 = new Array(this.header.channel);
		decoder.previousWindow = this2;
		var this3;
		this3 = new Array(this.header.channel);
		decoder.finalY = this3;
		var _g1 = 0;
		var _g = this.header.channel;
		while(_g1 < _g) {
			var i = _g1++;
			var val = kha_audio2_ogg_vorbis_VorbisTools.copyVector(this.channelBuffers[i]);
			decoder.channelBuffers[i] = val;
			var val1 = kha_audio2_ogg_vorbis_VorbisTools.copyVector(this.previousWindow[i]);
			decoder.previousWindow[i] = val1;
			var val2 = Lambda.array(this.finalY[i]);
			decoder.finalY[i] = val2;
		}
		return decoder;
	}
	,ensurePosition: function(seekFunc) {
		seekFunc(this.decodeState.inputPosition);
	}
	,getFrameFloat: function() {
		var result = this.decodePacket();
		if(result == null) {
			this.channelBufferStart = this.channelBufferEnd = 0;
			return 0;
		}
		var len = this.finishFrame(result);
		this.channelBufferStart = result.left;
		this.channelBufferEnd = result.left + len;
		return len;
	}
	,pumpFirstFrame: function() {
		this.finishFrame(this.decodePacket());
	}
	,finishFrame: function(r) {
		var len = r.len;
		var right = r.right;
		var left = r.left;
		if(this.previousLength != 0) {
			var n = this.previousLength;
			var w = this.getWindow(n);
			var _g1 = 0;
			var _g = this.header.channel;
			while(_g1 < _g) {
				var i = _g1++;
				var cb = this.channelBuffers[i];
				var pw = this.previousWindow[i];
				var _g2 = 0;
				while(_g2 < n) {
					var j = _g2++;
					cb[left + j] = cb[left + j] * w[j] + pw[j] * w[n - 1 - j];
				}
			}
		}
		var prev = this.previousLength;
		this.previousLength = len - right;
		var _g11 = 0;
		var _g3 = this.header.channel;
		while(_g11 < _g3) {
			var i1 = _g11++;
			var pw1 = this.previousWindow[i1];
			var cb1 = this.channelBuffers[i1];
			var _g31 = 0;
			var _g21 = len - right;
			while(_g31 < _g21) {
				var j1 = _g31++;
				pw1[j1] = cb1[right + j1];
			}
		}
		if(prev == 0) return 0;
		if(len < right) right = len;
		return right - left;
	}
	,getWindow: function(len) {
		len <<= 1;
		if(len == this.header.blocksize0) return this.window[0]; else if(len == this.header.blocksize1) return this.window[1]; else return null;
	}
	,initBlocksize: function(bs,n) {
		var n2 = n >> 1;
		var n4 = n >> 2;
		var n8 = n >> 3;
		var val;
		var this1;
		this1 = new Array(n2);
		val = this1;
		this.a[bs] = val;
		var val1;
		var this2;
		this2 = new Array(n2);
		val1 = this2;
		this.b[bs] = val1;
		var val2;
		var this3;
		this3 = new Array(n4);
		val2 = this3;
		this.c[bs] = val2;
		var val3;
		var this4;
		this4 = new Array(n2);
		val3 = this4;
		this.window[bs] = val3;
		var val4;
		var this5;
		this5 = new Array(n8);
		val4 = this5;
		this.bitReverseData[bs] = val4;
		kha_audio2_ogg_vorbis_VorbisTools.computeTwiddleFactors(n,this.a[bs],this.b[bs],this.c[bs]);
		kha_audio2_ogg_vorbis_VorbisTools.computeWindow(n,this.window[bs]);
		kha_audio2_ogg_vorbis_VorbisTools.computeBitReverse(n,this.bitReverseData[bs]);
	}
	,inverseMdct: function(buffer,n,blocktype) {
		var bt;
		if(blocktype) bt = 1; else bt = 0;
		kha_audio2_ogg_tools_Mdct.inverseTransform(buffer,n,this.a[bt],this.b[bt],this.c[bt],this.bitReverseData[bt]);
	}
	,decodePacket: function() {
		var result = this.decodeInitial();
		if(result == null) return null;
		var rest = this.decodePacketRest(result);
		return rest;
	}
	,decodeInitial: function() {
		this.channelBufferStart = this.channelBufferEnd = 0;
		do {
			if(!this.decodeState.maybeStartPacket()) return null;
			if(this.decodeState.readBits(1) != 0) {
				while(-1 != this.decodeState.readPacket()) {
				}
				continue;
			}
			break;
		} while(true);
		var i = this.decodeState.readBits(kha_audio2_ogg_tools_MathTools.ilog(this.header.modes.length - 1));
		if(i == -1 || i >= this.header.modes.length) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_FAILED,null,{ fileName : "VorbisDecoder.hx", lineNumber : 519, className : "kha.audio2.ogg.vorbis.VorbisDecoder", methodName : "decodeInitial"}));
		var m = this.header.modes[i];
		var n;
		var prev;
		var next;
		if(m.blockflag) {
			n = this.header.blocksize1;
			prev = this.decodeState.readBits(1);
			next = this.decodeState.readBits(1);
		} else {
			prev = next = 0;
			n = this.header.blocksize0;
		}
		var windowCenter = n >> 1;
		return { mode : i, left : m.blockflag && prev == 0?{ start : n - this.header.blocksize0 >> 2, end : n + this.header.blocksize0 >> 2}:{ start : 0, end : windowCenter}, right : m.blockflag && next == 0?{ start : n * 3 - this.header.blocksize0 >> 2, end : n * 3 + this.header.blocksize0 >> 2}:{ start : windowCenter, end : n}};
	}
	,decodePacketRest: function(r) {
		var len = 0;
		var m = this.header.modes[r.mode];
		var zeroChannel;
		var this1;
		this1 = new Array(256);
		zeroChannel = this1;
		var reallyZeroChannel;
		var this2;
		this2 = new Array(256);
		reallyZeroChannel = this2;
		var n;
		if(m.blockflag) n = this.header.blocksize1; else n = this.header.blocksize0;
		var map = this.header.mapping[m.mapping];
		var n2 = n >> 1;
		var rangeList = [256,128,86,64];
		var codebooks = this.header.codebooks;
		var _g1 = 0;
		var _g = this.header.channel;
		while(_g1 < _g) {
			var i1 = _g1++;
			var s = map.chan[i1].mux;
			zeroChannel[i1] = false;
			var floor = this.header.floorConfig[map.submapFloor[s]];
			if(floor.type == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM,null,{ fileName : "VorbisDecoder.hx", lineNumber : 581, className : "kha.audio2.ogg.vorbis.VorbisDecoder", methodName : "decodePacketRest"})); else {
				var g = floor.floor1;
				if(this.decodeState.readBits(1) != 0) {
					var fy = [];
					var step2Flag;
					var this3;
					this3 = new Array(256);
					step2Flag = this3;
					var range = rangeList[g.floor1Multiplier - 1];
					var offset = 2;
					fy = this.finalY[i1];
					fy[0] = this.decodeState.readBits(kha_audio2_ogg_tools_MathTools.ilog(range) - 1);
					fy[1] = this.decodeState.readBits(kha_audio2_ogg_tools_MathTools.ilog(range) - 1);
					var _g3 = 0;
					var _g2 = g.partitions;
					while(_g3 < _g2) {
						var j = _g3++;
						var pclass = g.partitionClassList[j];
						var cdim = g.classDimensions[pclass];
						var cbits = g.classSubclasses[pclass];
						var csub = (1 << cbits) - 1;
						var cval = 0;
						if(cbits != 0) {
							var c = codebooks[g.classMasterbooks[pclass]];
							cval = this.decodeState.decode(c);
						}
						var books = g.subclassBooks[pclass];
						var _g4 = 0;
						while(_g4 < cdim) {
							var k = _g4++;
							var book = books[cval & csub];
							cval >>= cbits;
							if(book >= 0) fy[offset++] = this.decodeState.decode(codebooks[book]); else fy[offset++] = 0;
						}
					}
					if(this.decodeState.validBits == -1) {
						zeroChannel[i1] = true;
						continue;
					}
					var val = step2Flag[1] = true;
					step2Flag[0] = val;
					var naighbors = g.neighbors;
					var xlist = g.xlist;
					var _g31 = 2;
					var _g21 = g.values;
					while(_g31 < _g21) {
						var j1 = _g31++;
						var low = naighbors[j1][0];
						var high = naighbors[j1][1];
						var lowroom = kha_audio2_ogg_vorbis_VorbisTools.predictPoint(xlist[j1],xlist[low],xlist[high],fy[low],fy[high]);
						var val1 = fy[j1];
						var highroom = range - lowroom;
						var room;
						if(highroom < lowroom) room = highroom * 2; else room = lowroom * 2;
						if(val1 != 0) {
							var val2 = step2Flag[high] = true;
							step2Flag[low] = val2;
							step2Flag[j1] = true;
							if(val1 >= room) {
								if(highroom > lowroom) fy[j1] = val1 - lowroom + lowroom; else fy[j1] = lowroom - val1 + highroom - 1;
							} else if((val1 & 1) != 0) fy[j1] = lowroom - (val1 + 1 >> 1); else fy[j1] = lowroom + (val1 >> 1);
						} else {
							step2Flag[j1] = false;
							fy[j1] = lowroom;
						}
					}
					var _g32 = 0;
					var _g22 = g.values;
					while(_g32 < _g22) {
						var j2 = _g32++;
						if(!step2Flag[j2]) fy[j2] = -1;
					}
				} else zeroChannel[i1] = true;
			}
		}
		var _g11 = 0;
		var _g5 = this.header.channel;
		while(_g11 < _g5) {
			var i2 = _g11++;
			reallyZeroChannel[i2] = zeroChannel[i2];
		}
		var _g12 = 0;
		var _g6 = map.couplingSteps;
		while(_g12 < _g6) {
			var i3 = _g12++;
			if(!zeroChannel[map.chan[i3].magnitude] || !zeroChannel[map.chan[i3].angle]) {
				var val3 = zeroChannel[map.chan[i3].angle] = false;
				zeroChannel[map.chan[i3].magnitude] = val3;
			}
		}
		var _g13 = 0;
		var _g7 = map.submaps;
		while(_g13 < _g7) {
			var i4 = _g13++;
			var residueBuffers;
			var this4;
			this4 = new Array(this.header.channel);
			residueBuffers = this4;
			var doNotDecode;
			var this5;
			this5 = new Array(256);
			doNotDecode = this5;
			var ch = 0;
			var _g33 = 0;
			var _g23 = this.header.channel;
			while(_g33 < _g23) {
				var j3 = _g33++;
				if(map.chan[j3].mux == i4) {
					if(zeroChannel[j3]) {
						doNotDecode[ch] = true;
						residueBuffers[ch] = null;
					} else {
						doNotDecode[ch] = false;
						residueBuffers[ch] = this.channelBuffers[j3];
					}
					++ch;
				}
			}
			var r1 = map.submapResidue[i4];
			var residue = this.header.residueConfig[r1];
			residue.decode(this.decodeState,this.header,residueBuffers,ch,n2,doNotDecode,this.channelBuffers);
		}
		var i = map.couplingSteps;
		var n21 = n >> 1;
		while(--i >= 0) {
			var m1 = this.channelBuffers[map.chan[i].magnitude];
			var a = this.channelBuffers[map.chan[i].angle];
			var _g8 = 0;
			while(_g8 < n21) {
				var j4 = _g8++;
				var a2;
				var m2;
				if(m1[j4] > 0) {
					if(a[j4] > 0) {
						m2 = m1[j4];
						a2 = m1[j4] - a[j4];
					} else {
						a2 = m1[j4];
						m2 = m1[j4] + a[j4];
					}
				} else if(a[j4] > 0) {
					m2 = m1[j4];
					a2 = m1[j4] + a[j4];
				} else {
					a2 = m1[j4];
					m2 = m1[j4] - a[j4];
				}
				m1[j4] = m2;
				a[j4] = a2;
			}
		}
		var _g14 = 0;
		var _g9 = this.header.channel;
		while(_g14 < _g9) {
			var i5 = _g14++;
			if(reallyZeroChannel[i5]) {
				var _g24 = 0;
				while(_g24 < n21) {
					var j5 = _g24++;
					this.channelBuffers[i5][j5] = 0;
				}
			} else map.doFloor(this.header.floorConfig,i5,n,this.channelBuffers[i5],this.finalY[i5],null);
		}
		var _g15 = 0;
		var _g10 = this.header.channel;
		while(_g15 < _g10) {
			var i6 = _g15++;
			this.inverseMdct(this.channelBuffers[i6],n,m.blockflag);
		}
		this.decodeState.flushPacket();
		return this.decodeState.finishDecodePacket(this.previousLength,n,r);
	}
	,__class__: kha_audio2_ogg_vorbis_VorbisDecoder
};
var kha_audio2_ogg_vorbis_VorbisTools = function() { };
$hxClasses["kha.audio2.ogg.vorbis.VorbisTools"] = kha_audio2_ogg_vorbis_VorbisTools;
kha_audio2_ogg_vorbis_VorbisTools.__name__ = true;
kha_audio2_ogg_vorbis_VorbisTools.assert = function(b,p) {
};
kha_audio2_ogg_vorbis_VorbisTools.neighbors = function(x,n) {
	var low = -1;
	var high = 65536;
	var plow = 0;
	var phigh = 0;
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		if(x[i] > low && x[i] < x[n]) {
			plow = i;
			low = x[i];
		}
		if(x[i] < high && x[i] > x[n]) {
			phigh = i;
			high = x[i];
		}
	}
	return { low : plow, high : phigh};
};
kha_audio2_ogg_vorbis_VorbisTools.floatUnpack = function(x) {
	var mantissa = _$UInt_UInt_$Impl_$.toFloat(x & 2097151);
	var sign = x & -2147483648;
	var exp = (x & 2145386496) >>> 21;
	var res;
	if(sign != 0) res = -mantissa; else res = mantissa;
	return res * Math.pow(2,exp - 788);
};
kha_audio2_ogg_vorbis_VorbisTools.bitReverse = function(n) {
	n = (n & -1431655766) >>> 1 | (n & 1431655765) << 1;
	n = (n & -858993460) >>> 2 | (n & 858993459) << 2;
	n = (n & -252645136) >>> 4 | (n & 252645135) << 4;
	n = (n & -16711936) >>> 8 | (n & 16711935) << 8;
	return n >>> 16 | n << 16;
};
kha_audio2_ogg_vorbis_VorbisTools.pointCompare = function(a,b) {
	if(a.x < b.x) return -1; else if(a.x > b.x) return 1; else return 0;
};
kha_audio2_ogg_vorbis_VorbisTools.uintAsc = function(a,b) {
	if(_$UInt_UInt_$Impl_$.gt(b,a)) return -1; else if(a == b) return 0; else return 1;
};
kha_audio2_ogg_vorbis_VorbisTools.lookup1Values = function(entries,dim) {
	var r = Std["int"](Math.exp(Math.log(entries) / dim));
	if(Std["int"](Math.pow(r + 1,dim)) <= entries) r++;
	kha_audio2_ogg_vorbis_VorbisTools.assert(Math.pow(r + 1,dim) > entries,{ fileName : "VorbisTools.hx", lineNumber : 155, className : "kha.audio2.ogg.vorbis.VorbisTools", methodName : "lookup1Values"});
	kha_audio2_ogg_vorbis_VorbisTools.assert(Std["int"](Math.pow(r,dim)) <= entries,{ fileName : "VorbisTools.hx", lineNumber : 156, className : "kha.audio2.ogg.vorbis.VorbisTools", methodName : "lookup1Values"});
	return r;
};
kha_audio2_ogg_vorbis_VorbisTools.computeWindow = function(n,window) {
	var n2 = n >> 1;
	var _g = 0;
	while(_g < n2) {
		var i = _g++;
		var val = Math.sin(1.57079632679489656 * kha_audio2_ogg_vorbis_VorbisTools.square(Math.sin((i + 0.5) / n2 * 0.5 * 3.14159265358979323846264)));
		window[i] = val;
	}
};
kha_audio2_ogg_vorbis_VorbisTools.square = function(f) {
	return f * f;
};
kha_audio2_ogg_vorbis_VorbisTools.computeBitReverse = function(n,rev) {
	var ld = kha_audio2_ogg_tools_MathTools.ilog(n) - 1;
	var n8 = n >> 3;
	var _g = 0;
	while(_g < n8) {
		var i = _g++;
		var val;
		var a;
		var a1 = kha_audio2_ogg_vorbis_VorbisTools.bitReverse(i);
		a = a1 >>> 32 - ld + 3;
		val = a << 2;
		rev[i] = val;
	}
};
kha_audio2_ogg_vorbis_VorbisTools.computeTwiddleFactors = function(n,af,bf,cf) {
	var n4 = n >> 2;
	var n8 = n >> 3;
	var k2 = 0;
	var _g = 0;
	while(_g < n4) {
		var k = _g++;
		var val = Math.cos(4 * k * 3.14159265358979323846264 / n);
		af[k2] = val;
		var val1 = -Math.sin(4 * k * 3.14159265358979323846264 / n);
		af[k2 + 1] = val1;
		var val2 = Math.cos((k2 + 1) * 3.14159265358979323846264 / n / 2) * 0.5;
		bf[k2] = val2;
		var val3 = Math.sin((k2 + 1) * 3.14159265358979323846264 / n / 2) * 0.5;
		bf[k2 + 1] = val3;
		k2 += 2;
	}
	var k21 = 0;
	var _g1 = 0;
	while(_g1 < n8) {
		var k1 = _g1++;
		var val4 = Math.cos(2 * (k21 + 1) * 3.14159265358979323846264 / n);
		cf[k21] = val4;
		var val5 = -Math.sin(2 * (k21 + 1) * 3.14159265358979323846264 / n);
		cf[k21 + 1] = val5;
		k21 += 2;
	}
};
kha_audio2_ogg_vorbis_VorbisTools.drawLine = function(output,x0,y0,x1,y1,n) {
	if(kha_audio2_ogg_vorbis_VorbisTools.integerDivideTable == null) {
		var this1;
		this1 = new Array(32);
		kha_audio2_ogg_vorbis_VorbisTools.integerDivideTable = this1;
		var _g = 0;
		while(_g < 32) {
			var i = _g++;
			var val;
			var this2;
			this2 = new Array(64);
			val = this2;
			kha_audio2_ogg_vorbis_VorbisTools.integerDivideTable[i] = val;
			var _g1 = 1;
			while(_g1 < 64) {
				var j = _g1++;
				kha_audio2_ogg_vorbis_VorbisTools.integerDivideTable[i][j] = i / j | 0;
			}
		}
	}
	var dy = y1 - y0;
	var adx = x1 - x0;
	var ady;
	if(dy < 0) ady = -dy; else ady = dy;
	var base;
	var x = x0;
	var y = y0;
	var err = 0;
	var sy;
	if(adx < 64 && ady < 32) {
		if(dy < 0) {
			base = -kha_audio2_ogg_vorbis_VorbisTools.integerDivideTable[ady][adx];
			sy = base - 1;
		} else {
			base = kha_audio2_ogg_vorbis_VorbisTools.integerDivideTable[ady][adx];
			sy = base + 1;
		}
	} else {
		base = dy / adx | 0;
		if(dy < 0) sy = base - 1; else sy = base + 1;
	}
	ady -= (base < 0?-base:base) * adx;
	if(x1 > n) x1 = n;
	var _g2 = x;
	output[_g2] = output[_g2] * kha_audio2_ogg_vorbis_VorbisTools.INVERSE_DB_TABLE[y];
	var _g3 = x + 1;
	while(_g3 < x1) {
		var i1 = _g3++;
		err += ady;
		if(err >= adx) {
			err -= adx;
			y += sy;
		} else y += base;
		var _g11 = i1;
		output[_g11] = output[_g11] * kha_audio2_ogg_vorbis_VorbisTools.INVERSE_DB_TABLE[y];
	}
};
kha_audio2_ogg_vorbis_VorbisTools.predictPoint = function(x,x0,x1,y0,y1) {
	var dy = y1 - y0;
	var adx = x1 - x0;
	var err = Math.abs(dy) * (x - x0);
	var off = err / adx | 0;
	if(dy < 0) return y0 - off; else return y0 + off;
};
kha_audio2_ogg_vorbis_VorbisTools.emptyFloatVector = function(len) {
	var vec;
	var this1;
	this1 = new Array(len);
	vec = this1;
	return vec;
};
kha_audio2_ogg_vorbis_VorbisTools.copyVector = function(source) {
	var dest;
	var this1;
	this1 = new Array(source.length);
	dest = this1;
	var _g1 = 0;
	var _g = source.length;
	while(_g1 < _g) {
		var i = _g1++;
		dest[i] = source[i];
	}
	return dest;
};
var kha_audio2_ogg_vorbis_data_Codebook = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Codebook"] = kha_audio2_ogg_vorbis_data_Codebook;
kha_audio2_ogg_vorbis_data_Codebook.__name__ = true;
kha_audio2_ogg_vorbis_data_Codebook.read = function(decodeState) {
	var c = new kha_audio2_ogg_vorbis_data_Codebook();
	if(decodeState.readBits(8) != 66 || decodeState.readBits(8) != 67 || decodeState.readBits(8) != 86) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Codebook.hx", lineNumber : 40, className : "kha.audio2.ogg.vorbis.data.Codebook", methodName : "read"}));
	var x = decodeState.readBits(8);
	c.dimensions = (decodeState.readBits(8) << 8) + x;
	var x1 = decodeState.readBits(8);
	var y = decodeState.readBits(8);
	c.entries = (decodeState.readBits(8) << 16) + (y << 8) + x1;
	var ordered = decodeState.readBits(1);
	if(ordered != 0) c.sparse = false; else c.sparse = decodeState.readBits(1) != 0;
	var lengths;
	var this1;
	this1 = new Array(c.entries);
	lengths = this1;
	if(!c.sparse) c.codewordLengths = lengths;
	var total = 0;
	if(ordered != 0) {
		var currentEntry = 0;
		var currentLength = decodeState.readBits(5) + 1;
		while(currentEntry < c.entries) {
			var limit = c.entries - currentEntry;
			var n = decodeState.readBits(kha_audio2_ogg_tools_MathTools.ilog(limit));
			if(currentEntry + n > c.entries) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,"codebook entrys",{ fileName : "Codebook.hx", lineNumber : 67, className : "kha.audio2.ogg.vorbis.data.Codebook", methodName : "read"}));
			var _g = 0;
			while(_g < n) {
				var i = _g++;
				lengths[currentEntry + i] = currentLength;
			}
			currentEntry += n;
			currentLength++;
		}
	} else {
		var _g1 = 0;
		var _g2 = c.entries;
		while(_g1 < _g2) {
			var j = _g1++;
			var present;
			if(c.sparse) present = decodeState.readBits(1); else present = 1;
			if(present != 0) {
				var val = decodeState.readBits(5) + 1;
				lengths[j] = val;
				total++;
			} else lengths[j] = 255;
		}
	}
	if(c.sparse && total >= c.entries >> 2) {
		c.codewordLengths = lengths;
		c.sparse = false;
	}
	if(c.sparse) c.sortedEntries = total; else {
		var sortedCount = 0;
		var _g11 = 0;
		var _g3 = c.entries;
		while(_g11 < _g3) {
			var j1 = _g11++;
			var l = lengths[j1];
			if(l > 10 && l != 255) ++sortedCount;
		}
		c.sortedEntries = sortedCount;
	}
	var values = null;
	if(!c.sparse) {
		var this2;
		this2 = new Array(c.entries);
		c.codewords = this2;
	} else {
		if(c.sortedEntries != 0) {
			var this3;
			this3 = new Array(c.sortedEntries);
			c.codewordLengths = this3;
			var this4;
			this4 = new Array(c.entries);
			c.codewords = this4;
			var this5;
			this5 = new Array(c.entries);
			values = this5;
		}
		var size = c.entries + 64 * c.sortedEntries;
	}
	if(!c.computeCodewords(lengths,c.entries,values)) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,"compute codewords",{ fileName : "Codebook.hx", lineNumber : 120, className : "kha.audio2.ogg.vorbis.data.Codebook", methodName : "read"}));
	if(c.sortedEntries != 0) {
		c.sortedCodewords = [];
		var this6;
		this6 = new Array(c.sortedEntries);
		c.sortedValues = this6;
		c.computeSortedHuffman(lengths,values);
	}
	if(c.sparse) {
		values = null;
		c.codewords = null;
		lengths = null;
	}
	c.computeAcceleratedHuffman();
	c.lookupType = decodeState.readBits(4);
	if(c.lookupType > 2) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,"codebook lookup type",{ fileName : "Codebook.hx", lineNumber : 143, className : "kha.audio2.ogg.vorbis.data.Codebook", methodName : "read"}));
	if(c.lookupType > 0) {
		c.minimumValue = kha_audio2_ogg_vorbis_VorbisTools.floatUnpack(decodeState.readBits(32));
		c.deltaValue = kha_audio2_ogg_vorbis_VorbisTools.floatUnpack(decodeState.readBits(32));
		c.valueBits = decodeState.readBits(4) + 1;
		c.sequenceP = decodeState.readBits(1) != 0;
		if(c.lookupType == 1) c.lookupValues = kha_audio2_ogg_vorbis_VorbisTools.lookup1Values(c.entries,c.dimensions); else c.lookupValues = c.entries * c.dimensions;
		var mults;
		var this7;
		this7 = new Array(c.lookupValues);
		mults = this7;
		var _g12 = 0;
		var _g4 = c.lookupValues;
		while(_g12 < _g4) {
			var j2 = _g12++;
			var q = decodeState.readBits(c.valueBits);
			if(q == -1) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,"fail lookup",{ fileName : "Codebook.hx", lineNumber : 161, className : "kha.audio2.ogg.vorbis.data.Codebook", methodName : "read"}));
			mults[j2] = q;
		}
		var this8;
		this8 = new Array(c.lookupValues);
		c.multiplicands = this8;
		var _g13 = 0;
		var _g5 = c.lookupValues;
		while(_g13 < _g5) {
			var j3 = _g13++;
			c.multiplicands[j3] = mults[j3] * c.deltaValue + c.minimumValue;
		}
		if(c.lookupType == 2 && c.sequenceP) {
			var _g14 = 1;
			var _g6 = c.lookupValues;
			while(_g14 < _g6) {
				var j4 = _g14++;
				c.multiplicands[j4] = c.multiplicands[j4 - 1];
			}
			c.sequenceP = false;
		}
	}
	return c;
};
kha_audio2_ogg_vorbis_data_Codebook.prototype = {
	dimensions: null
	,entries: null
	,codewordLengths: null
	,minimumValue: null
	,deltaValue: null
	,valueBits: null
	,lookupType: null
	,sequenceP: null
	,sparse: null
	,lookupValues: null
	,multiplicands: null
	,codewords: null
	,fastHuffman: null
	,sortedCodewords: null
	,sortedValues: null
	,sortedEntries: null
	,addEntry: function(huffCode,symbol,count,len,values) {
		if(!this.sparse) this.codewords[symbol] = huffCode; else {
			this.codewords[count] = huffCode;
			this.codewordLengths[count] = len;
			values[count] = symbol;
		}
	}
	,includeInSort: function(len) {
		if(this.sparse) return true; else if(len == 255) return false; else if(len > 10) return true; else return false;
	}
	,computeCodewords: function(len,n,values) {
		var available;
		var this1;
		this1 = new Array(32);
		available = this1;
		var _g = 0;
		while(_g < 32) {
			var x = _g++;
			available[x] = 0;
		}
		var k = 0;
		while(k < n) {
			if(len[k] < 255) break;
			k++;
		}
		if(k == n) return true;
		var m = 0;
		this.addEntry(0,k,m++,len[k],values);
		var i = 0;
		while(++i <= len[k]) available[i] = 1 << 32 - i;
		i = k;
		while(++i < n) {
			var z = len[i];
			if(z == 255) continue;
			while(z > 0 && available[z] == 0) --z;
			if(z == 0) return false;
			var res = available[z];
			available[z] = 0;
			this.addEntry(kha_audio2_ogg_vorbis_VorbisTools.bitReverse(res),i,m++,len[i],values);
			if(z != len[i]) {
				var y = len[i];
				while(y > z) {
					available[y] = res + (1 << 32 - y);
					y--;
				}
			}
		}
		return true;
	}
	,computeSortedHuffman: function(lengths,values) {
		if(!this.sparse) {
			var k = 0;
			var _g1 = 0;
			var _g = this.entries;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.includeInSort(lengths[i])) this.sortedCodewords[k++] = kha_audio2_ogg_vorbis_VorbisTools.bitReverse(this.codewords[i]);
			}
			null;
		} else {
			var _g11 = 0;
			var _g2 = this.sortedEntries;
			while(_g11 < _g2) {
				var i1 = _g11++;
				this.sortedCodewords[i1] = kha_audio2_ogg_vorbis_VorbisTools.bitReverse(this.codewords[i1]);
			}
		}
		this.sortedCodewords[this.sortedEntries] = -1;
		this.sortedCodewords.sort(kha_audio2_ogg_vorbis_VorbisTools.uintAsc);
		var len;
		if(this.sparse) len = this.sortedEntries; else len = this.entries;
		var _g3 = 0;
		while(_g3 < len) {
			var i2 = _g3++;
			var huffLen;
			if(this.sparse) huffLen = lengths[values[i2]]; else huffLen = lengths[i2];
			if(this.sparse?true:huffLen == 255?false:huffLen > 10?true:false) {
				var code = kha_audio2_ogg_vorbis_VorbisTools.bitReverse(this.codewords[i2]);
				var x = 0;
				var n = this.sortedEntries;
				while(n > 1) {
					var m = x + (n >> 1);
					if(_$UInt_UInt_$Impl_$.gte(code,this.sortedCodewords[m])) {
						x = m;
						n -= n >> 1;
					} else n >>= 1;
				}
				if(this.sparse) {
					this.sortedValues[x] = values[i2];
					this.codewordLengths[x] = huffLen;
				} else this.sortedValues[x] = i2;
			}
		}
	}
	,computeAcceleratedHuffman: function() {
		var this1;
		this1 = new Array(1024);
		this.fastHuffman = this1;
		this.fastHuffman[0] = -1;
		var _g1 = 0;
		var _g = 1024;
		while(_g1 < _g) {
			var i = _g1++;
			this.fastHuffman[i] = -1;
		}
		var len;
		if(this.sparse) len = this.sortedEntries; else len = this.entries;
		var _g2 = 0;
		while(_g2 < len) {
			var i1 = _g2++;
			if(this.codewordLengths[i1] <= 10) {
				var z;
				if(this.sparse) z = kha_audio2_ogg_vorbis_VorbisTools.bitReverse(this.sortedCodewords[i1]); else z = this.codewords[i1];
				while(z < 1024) {
					this.fastHuffman[z] = i1;
					z += 1 << this.codewordLengths[i1];
				}
			}
		}
	}
	,codebookDecode: function(decodeState,output,offset,len) {
		var z = decodeState.decode(this);
		var lookupValues = this.lookupValues;
		var sequenceP = this.sequenceP;
		var multiplicands = this.multiplicands;
		var minimumValue = this.minimumValue;
		if(z < 0) return false;
		if(len > this.dimensions) len = this.dimensions;
		if(this.lookupType == 1) {
			var div = 1;
			var last = 0.0;
			var _g = 0;
			while(_g < len) {
				var i = _g++;
				var off = Std["int"](_$UInt_UInt_$Impl_$.toFloat(z / div | 0) % _$UInt_UInt_$Impl_$.toFloat(lookupValues));
				var val = multiplicands[off] + last;
				var _g1 = offset + i;
				output[_g1] = output[_g1] + val;
				if(sequenceP) last = val + minimumValue;
				div = div * lookupValues;
			}
			return true;
		}
		z *= this.dimensions;
		if(sequenceP) {
			var last1 = 0.0;
			var _g2 = 0;
			while(_g2 < len) {
				var i1 = _g2++;
				var val1 = multiplicands[z + i1] + last1;
				var _g11 = offset + i1;
				output[_g11] = output[_g11] + val1;
				last1 = val1 + minimumValue;
			}
		} else {
			var last2 = 0.0;
			var _g3 = 0;
			while(_g3 < len) {
				var i2 = _g3++;
				var _g12 = offset + i2;
				output[_g12] = output[_g12] + (multiplicands[z + i2] + last2);
			}
		}
		return true;
	}
	,codebookDecodeStep: function(decodeState,output,offset,len,step) {
		var z = decodeState.decode(this);
		var last = 0.0;
		if(z < 0) return false;
		if(len > this.dimensions) len = this.dimensions;
		var lookupValues = this.lookupValues;
		var sequenceP = this.sequenceP;
		var multiplicands = this.multiplicands;
		if(this.lookupType == 1) {
			var div = 1;
			var _g = 0;
			while(_g < len) {
				var i = _g++;
				var off = Std["int"](_$UInt_UInt_$Impl_$.toFloat(z / div | 0) % _$UInt_UInt_$Impl_$.toFloat(lookupValues));
				var val = multiplicands[off] + last;
				var _g1 = offset + i * step;
				output[_g1] = output[_g1] + val;
				if(sequenceP) last = val;
				div = div * lookupValues;
			}
			return true;
		}
		z *= this.dimensions;
		var _g2 = 0;
		while(_g2 < len) {
			var i1 = _g2++;
			var val1 = multiplicands[z + i1] + last;
			var _g11 = offset + i1 * step;
			output[_g11] = output[_g11] + val1;
			if(sequenceP) last = val1;
		}
		return true;
	}
	,decodeStart: function(decodeState) {
		return decodeState.decode(this);
	}
	,decodeDeinterleaveRepeat: function(decodeState,residueBuffers,ch,cInter,pInter,len,totalDecode) {
		var effective = this.dimensions;
		if(this.lookupType == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM,null,{ fileName : "Codebook.hx", lineNumber : 488, className : "kha.audio2.ogg.vorbis.data.Codebook", methodName : "decodeDeinterleaveRepeat"}));
		var multiplicands = this.multiplicands;
		var sequenceP = this.sequenceP;
		var lookupValues = this.lookupValues;
		while(totalDecode > 0) {
			var last = 0.0;
			var z = decodeState.decode(this);
			if(z < 0) {
				if(decodeState.bytesInSeg == 0 && decodeState.lastSeg) return null;
				throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM,null,{ fileName : "Codebook.hx", lineNumber : 503, className : "kha.audio2.ogg.vorbis.data.Codebook", methodName : "decodeDeinterleaveRepeat"}));
			}
			if(cInter + pInter * ch + effective > len * ch) effective = len * ch - (pInter * ch - cInter);
			if(this.lookupType == 1) {
				var div = 1;
				if(sequenceP) {
					var _g = 0;
					while(_g < effective) {
						var i = _g++;
						var off = Std["int"](_$UInt_UInt_$Impl_$.toFloat(z / div | 0) % _$UInt_UInt_$Impl_$.toFloat(lookupValues));
						var val = multiplicands[off] + last;
						var _g1 = pInter;
						residueBuffers[cInter][_g1] = residueBuffers[cInter][_g1] + val;
						if(++cInter == ch) {
							cInter = 0;
							++pInter;
						}
						last = val;
						div = div * lookupValues;
					}
				} else {
					var _g2 = 0;
					while(_g2 < effective) {
						var i1 = _g2++;
						var off1 = Std["int"](_$UInt_UInt_$Impl_$.toFloat(z / div | 0) % _$UInt_UInt_$Impl_$.toFloat(lookupValues));
						var val1 = multiplicands[off1] + last;
						var _g11 = pInter;
						residueBuffers[cInter][_g11] = residueBuffers[cInter][_g11] + val1;
						if(++cInter == ch) {
							cInter = 0;
							++pInter;
						}
						div = div * lookupValues;
					}
				}
			} else {
				z *= this.dimensions;
				if(sequenceP) {
					var _g3 = 0;
					while(_g3 < effective) {
						var i2 = _g3++;
						var val2 = multiplicands[z + i2] + last;
						var _g12 = pInter;
						residueBuffers[cInter][_g12] = residueBuffers[cInter][_g12] + val2;
						if(++cInter == ch) {
							cInter = 0;
							++pInter;
						}
						last = val2;
					}
				} else {
					var _g4 = 0;
					while(_g4 < effective) {
						var i3 = _g4++;
						var val3 = multiplicands[z + i3] + last;
						var _g13 = pInter;
						residueBuffers[cInter][_g13] = residueBuffers[cInter][_g13] + val3;
						if(++cInter == ch) {
							cInter = 0;
							++pInter;
						}
					}
				}
			}
			totalDecode -= effective;
		}
		return { cInter : cInter, pInter : pInter};
	}
	,residueDecode: function(decodeState,target,offset,n,rtype) {
		if(rtype == 0) {
			var step = n / this.dimensions | 0;
			var _g = 0;
			while(_g < step) {
				var k = _g++;
				if(!this.codebookDecodeStep(decodeState,target,offset + k,n - offset - k,step)) return false;
			}
		} else {
			var k1 = 0;
			while(k1 < n) {
				if(!this.codebookDecode(decodeState,target,offset,n - k1)) return false;
				k1 += this.dimensions;
				offset += this.dimensions;
			}
		}
		return true;
	}
	,__class__: kha_audio2_ogg_vorbis_data_Codebook
};
var kha_audio2_ogg_vorbis_data_Comment = function() {
	this.data = new haxe_ds_StringMap();
};
$hxClasses["kha.audio2.ogg.vorbis.data.Comment"] = kha_audio2_ogg_vorbis_data_Comment;
kha_audio2_ogg_vorbis_data_Comment.__name__ = true;
kha_audio2_ogg_vorbis_data_Comment.prototype = {
	data: null
	,get_title: function() {
		return this.getString("title");
	}
	,get_loopStart: function() {
		return Std.parseInt(this.getString("loopstart"));
	}
	,get_loopLength: function() {
		return Std.parseInt(this.getString("looplength"));
	}
	,get_version: function() {
		return this.getString("version");
	}
	,get_album: function() {
		return this.getString("album");
	}
	,get_organization: function() {
		return this.getString("organization");
	}
	,get_tracknumber: function() {
		return this.getString("tracknumber");
	}
	,get_performer: function() {
		return this.getString("performer");
	}
	,get_copyright: function() {
		return this.getString("copyright");
	}
	,get_license: function() {
		return this.getString("license");
	}
	,get_artist: function() {
		return this.getString("artist");
	}
	,get_description: function() {
		return this.getString("description");
	}
	,get_genre: function() {
		return this.getString("genre");
	}
	,get_date: function() {
		return this.getString("date");
	}
	,get_location: function() {
		return this.getString("location");
	}
	,get_contact: function() {
		return this.getString("contact");
	}
	,get_isrc: function() {
		return this.getString("isrc");
	}
	,get_artists: function() {
		return this.getArray("artist");
	}
	,add: function(key,value) {
		key = key.toLowerCase();
		if(this.data.exists(key)) this.data.get(key).push(value); else {
			var v = [value];
			this.data.set(key,v);
			v;
		}
	}
	,getString: function(key) {
		key = key.toLowerCase();
		if(this.data.exists(key)) return this.data.get(key)[0]; else return null;
	}
	,getArray: function(key) {
		key = key.toLowerCase();
		if(this.data.exists(key)) return this.data.get(key); else return null;
	}
	,__class__: kha_audio2_ogg_vorbis_data_Comment
};
var kha_audio2_ogg_vorbis_data_Floor = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Floor"] = kha_audio2_ogg_vorbis_data_Floor;
kha_audio2_ogg_vorbis_data_Floor.__name__ = true;
kha_audio2_ogg_vorbis_data_Floor.read = function(decodeState,codebooks) {
	var floor = new kha_audio2_ogg_vorbis_data_Floor();
	floor.type = decodeState.readBits(16);
	if(floor.type > 1) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Floor.hx", lineNumber : 28, className : "kha.audio2.ogg.vorbis.data.Floor", methodName : "read"}));
	if(floor.type == 0) {
		var g = floor.floor0 = new kha_audio2_ogg_vorbis_data_Floor0();
		g.order = decodeState.readBits(8);
		g.rate = decodeState.readBits(16);
		g.barkMapSize = decodeState.readBits(16);
		g.amplitudeBits = decodeState.readBits(6);
		g.amplitudeOffset = decodeState.readBits(8);
		g.numberOfBooks = decodeState.readBits(4) + 1;
		var _g1 = 0;
		var _g = g.numberOfBooks;
		while(_g1 < _g) {
			var j = _g1++;
			var val = decodeState.readBits(8);
			g.bookList[j] = val;
		}
		throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.FEATURE_NOT_SUPPORTED,null,{ fileName : "Floor.hx", lineNumber : 41, className : "kha.audio2.ogg.vorbis.data.Floor", methodName : "read"}));
	} else {
		var p = [];
		var g1 = floor.floor1 = new kha_audio2_ogg_vorbis_data_Floor1();
		var maxClass = -1;
		g1.partitions = decodeState.readBits(5);
		var this1;
		this1 = new Array(g1.partitions);
		g1.partitionClassList = this1;
		var _g11 = 0;
		var _g2 = g1.partitions;
		while(_g11 < _g2) {
			var j1 = _g11++;
			var val1 = decodeState.readBits(4);
			g1.partitionClassList[j1] = val1;
			if(g1.partitionClassList[j1] > maxClass) maxClass = g1.partitionClassList[j1];
		}
		var this2;
		this2 = new Array(maxClass + 1);
		g1.classDimensions = this2;
		var this3;
		this3 = new Array(maxClass + 1);
		g1.classMasterbooks = this3;
		var this4;
		this4 = new Array(maxClass + 1);
		g1.classSubclasses = this4;
		var this5;
		this5 = new Array(maxClass + 1);
		g1.subclassBooks = this5;
		var _g12 = 0;
		var _g3 = maxClass + 1;
		while(_g12 < _g3) {
			var j2 = _g12++;
			var val2 = decodeState.readBits(3) + 1;
			g1.classDimensions[j2] = val2;
			var val3 = decodeState.readBits(2);
			g1.classSubclasses[j2] = val3;
			if(g1.classSubclasses[j2] != 0) {
				var val4 = decodeState.readBits(8);
				g1.classMasterbooks[j2] = val4;
				if(g1.classMasterbooks[j2] >= codebooks.length) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Floor.hx", lineNumber : 64, className : "kha.audio2.ogg.vorbis.data.Floor", methodName : "read"}));
			}
			var kl = 1 << g1.classSubclasses[j2];
			var val5;
			var this6;
			this6 = new Array(kl);
			val5 = this6;
			g1.subclassBooks[j2] = val5;
			var _g21 = 0;
			while(_g21 < kl) {
				var k = _g21++;
				var val6 = decodeState.readBits(8) - 1;
				g1.subclassBooks[j2][k] = val6;
				if(g1.subclassBooks[j2][k] >= codebooks.length) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Floor.hx", lineNumber : 73, className : "kha.audio2.ogg.vorbis.data.Floor", methodName : "read"}));
			}
		}
		g1.floor1Multiplier = decodeState.readBits(2) + 1;
		g1.rangebits = decodeState.readBits(4);
		var this7;
		this7 = new Array(250);
		g1.xlist = this7;
		g1.xlist[0] = 0;
		g1.xlist[1] = 1 << g1.rangebits;
		g1.values = 2;
		var _g13 = 0;
		var _g4 = g1.partitions;
		while(_g13 < _g4) {
			var j3 = _g13++;
			var c = g1.partitionClassList[j3];
			var _g31 = 0;
			var _g22 = g1.classDimensions[c];
			while(_g31 < _g22) {
				var k1 = _g31++;
				var val7 = decodeState.readBits(g1.rangebits);
				g1.xlist[g1.values] = val7;
				g1.values++;
			}
		}
		var _g14 = 0;
		var _g5 = g1.values;
		while(_g14 < _g5) {
			var j4 = _g14++;
			p.push(new kha_audio2_ogg_vorbis_data_IntPoint());
			p[j4].x = g1.xlist[j4];
			p[j4].y = j4;
		}
		p.sort(kha_audio2_ogg_vorbis_VorbisTools.pointCompare);
		var this8;
		this8 = new Array(g1.values);
		g1.sortedOrder = this8;
		var _g15 = 0;
		var _g6 = g1.values;
		while(_g15 < _g6) {
			var j5 = _g15++;
			g1.sortedOrder[j5] = p[j5].y;
		}
		var this9;
		this9 = new Array(g1.values);
		g1.neighbors = this9;
		var _g16 = 2;
		var _g7 = g1.values;
		while(_g16 < _g7) {
			var j6 = _g16++;
			var ne = kha_audio2_ogg_vorbis_VorbisTools.neighbors(g1.xlist,j6);
			var val8;
			var this10;
			this10 = new Array(g1.values);
			val8 = this10;
			g1.neighbors[j6] = val8;
			g1.neighbors[j6][0] = ne.low;
			g1.neighbors[j6][1] = ne.high;
		}
	}
	return floor;
};
kha_audio2_ogg_vorbis_data_Floor.prototype = {
	floor0: null
	,floor1: null
	,type: null
	,__class__: kha_audio2_ogg_vorbis_data_Floor
};
var kha_audio2_ogg_vorbis_data_Floor0 = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Floor0"] = kha_audio2_ogg_vorbis_data_Floor0;
kha_audio2_ogg_vorbis_data_Floor0.__name__ = true;
kha_audio2_ogg_vorbis_data_Floor0.prototype = {
	order: null
	,rate: null
	,barkMapSize: null
	,amplitudeBits: null
	,amplitudeOffset: null
	,numberOfBooks: null
	,bookList: null
	,__class__: kha_audio2_ogg_vorbis_data_Floor0
};
var kha_audio2_ogg_vorbis_data_Floor1 = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Floor1"] = kha_audio2_ogg_vorbis_data_Floor1;
kha_audio2_ogg_vorbis_data_Floor1.__name__ = true;
kha_audio2_ogg_vorbis_data_Floor1.prototype = {
	partitions: null
	,partitionClassList: null
	,classDimensions: null
	,classSubclasses: null
	,classMasterbooks: null
	,subclassBooks: null
	,xlist: null
	,sortedOrder: null
	,neighbors: null
	,floor1Multiplier: null
	,rangebits: null
	,values: null
	,__class__: kha_audio2_ogg_vorbis_data_Floor1
};
var kha_audio2_ogg_vorbis_data_Header = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Header"] = kha_audio2_ogg_vorbis_data_Header;
kha_audio2_ogg_vorbis_data_Header.__name__ = true;
kha_audio2_ogg_vorbis_data_Header.read = function(decodeState) {
	var page = decodeState.page;
	page.start(decodeState);
	if((page.flag & 2) == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"not firstPage",{ fileName : "Header.hx", lineNumber : 46, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	if((page.flag & 4) != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"lastPage",{ fileName : "Header.hx", lineNumber : 49, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	if((page.flag & 1) != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"continuedPacket",{ fileName : "Header.hx", lineNumber : 52, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	decodeState.firstPageValidate();
	if((function($this) {
		var $r;
		decodeState.inputPosition += 1;
		$r = decodeState.input.readByte();
		return $r;
	}(this)) != 1) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"decodeState head",{ fileName : "Header.hx", lineNumber : 57, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	decodeState.vorbisValidate();
	var version;
	decodeState.inputPosition += 4;
	version = decodeState.input.readInt32();
	if(version != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"vorbis version : " + version,{ fileName : "Header.hx", lineNumber : 66, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	var header = new kha_audio2_ogg_vorbis_data_Header();
	decodeState.inputPosition += 1;
	header.channel = decodeState.input.readByte();
	if(header.channel == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"no channel",{ fileName : "Header.hx", lineNumber : 73, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"})); else if(header.channel > 16) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.TOO_MANY_CHANNELS,"too many channels",{ fileName : "Header.hx", lineNumber : 75, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	decodeState.inputPosition += 4;
	header.sampleRate = decodeState.input.readInt32();
	if(header.sampleRate == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,"no sampling rate",{ fileName : "Header.hx", lineNumber : 80, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	decodeState.inputPosition += 4;
	header.maximumBitRate = decodeState.input.readInt32();
	decodeState.inputPosition += 4;
	header.nominalBitRate = decodeState.input.readInt32();
	decodeState.inputPosition += 4;
	header.minimumBitRate = decodeState.input.readInt32();
	var x;
	decodeState.inputPosition += 1;
	x = decodeState.input.readByte();
	var log0 = x & 15;
	var log1 = x >> 4;
	header.blocksize0 = 1 << log0;
	header.blocksize1 = 1 << log1;
	if(log0 < 6 || log0 > 13) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Header.hx", lineNumber : 93, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	if(log1 < 6 || log1 > 13) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Header.hx", lineNumber : 96, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	if(log0 > log1) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Header.hx", lineNumber : 99, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	var x1;
	decodeState.inputPosition += 1;
	x1 = decodeState.input.readByte();
	if((x1 & 1) == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE,null,{ fileName : "Header.hx", lineNumber : 105, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	decodeState.page.start(decodeState);
	decodeState.startPacket();
	var len = 0;
	var output = new haxe_io_BytesOutput();
	while((len = decodeState.next()) != 0) {
		output.write((function($this) {
			var $r;
			decodeState.inputPosition += len;
			$r = decodeState.input.read(len);
			return $r;
		}(this)));
		decodeState.bytesInSeg = 0;
	}
	var packetInput = new haxe_io_BytesInput(output.getBytes());
	packetInput.readByte();
	packetInput.read(6);
	var vendorLength = packetInput.readInt32();
	header.vendor = packetInput.readString(vendorLength);
	header.comment = new kha_audio2_ogg_vorbis_data_Comment();
	var commentCount = packetInput.readInt32();
	var _g = 0;
	while(_g < commentCount) {
		var i = _g++;
		var n = packetInput.readInt32();
		var str = packetInput.readString(n);
		var splitter = str.indexOf("=");
		if(splitter != -1) header.comment.add(str.substring(0,splitter),str.substring(splitter + 1));
	}
	var x2 = packetInput.readByte();
	if((x2 & 1) == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Header.hx", lineNumber : 141, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	decodeState.startPacket();
	if(decodeState.readPacket() != 5) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,"setup packet",{ fileName : "Header.hx", lineNumber : 149, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	decodeState.vorbisValidate();
	var codebookCount = decodeState.readBits(8) + 1;
	var this1;
	this1 = new Array(codebookCount);
	header.codebooks = this1;
	var _g1 = 0;
	while(_g1 < codebookCount) {
		var i1 = _g1++;
		var val = kha_audio2_ogg_vorbis_data_Codebook.read(decodeState);
		header.codebooks[i1] = val;
	}
	x1 = decodeState.readBits(6) + 1;
	var _g2 = 0;
	while(_g2 < x1) {
		var i2 = _g2++;
		if(decodeState.readBits(16) != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Header.hx", lineNumber : 165, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	}
	var floorCount = decodeState.readBits(6) + 1;
	var this2;
	this2 = new Array(floorCount);
	header.floorConfig = this2;
	var _g3 = 0;
	while(_g3 < floorCount) {
		var i3 = _g3++;
		var val1 = kha_audio2_ogg_vorbis_data_Floor.read(decodeState,header.codebooks);
		header.floorConfig[i3] = val1;
	}
	var residueCount = decodeState.readBits(6) + 1;
	var this3;
	this3 = new Array(residueCount);
	header.residueConfig = this3;
	var _g4 = 0;
	while(_g4 < residueCount) {
		var i4 = _g4++;
		var val2 = kha_audio2_ogg_vorbis_data_Residue.read(decodeState,header.codebooks);
		header.residueConfig[i4] = val2;
	}
	var mappingCount = decodeState.readBits(6) + 1;
	var this4;
	this4 = new Array(mappingCount);
	header.mapping = this4;
	var _g5 = 0;
	while(_g5 < mappingCount) {
		var i5 = _g5++;
		var map = kha_audio2_ogg_vorbis_data_Mapping.read(decodeState,header.channel);
		header.mapping[i5] = map;
		var _g21 = 0;
		var _g11 = map.submaps;
		while(_g21 < _g11) {
			var j = _g21++;
			if(map.submapFloor[j] >= header.floorConfig.length) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Header.hx", lineNumber : 191, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
			if(map.submapResidue[j] >= header.residueConfig.length) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Header.hx", lineNumber : 194, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
		}
	}
	var modeCount = decodeState.readBits(6) + 1;
	var this5;
	this5 = new Array(modeCount);
	header.modes = this5;
	var _g6 = 0;
	while(_g6 < modeCount) {
		var i6 = _g6++;
		var mode = kha_audio2_ogg_vorbis_data_Mode.read(decodeState);
		header.modes[i6] = mode;
		if(mode.mapping >= header.mapping.length) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Header.hx", lineNumber : 205, className : "kha.audio2.ogg.vorbis.data.Header", methodName : "read"}));
	}
	while(decodeState.bytesInSeg != 0 || !decodeState.lastSeg && decodeState.next() != 0) {
		decodeState.bytesInSeg--;
		decodeState.inputPosition += 1;
		decodeState.input.readByte();
	}
	return header;
};
kha_audio2_ogg_vorbis_data_Header.prototype = {
	maximumBitRate: null
	,nominalBitRate: null
	,minimumBitRate: null
	,sampleRate: null
	,channel: null
	,blocksize0: null
	,blocksize1: null
	,codebooks: null
	,floorConfig: null
	,residueConfig: null
	,mapping: null
	,modes: null
	,comment: null
	,vendor: null
	,__class__: kha_audio2_ogg_vorbis_data_Header
};
var kha_audio2_ogg_vorbis_data_IntPoint = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.IntPoint"] = kha_audio2_ogg_vorbis_data_IntPoint;
kha_audio2_ogg_vorbis_data_IntPoint.__name__ = true;
kha_audio2_ogg_vorbis_data_IntPoint.prototype = {
	x: null
	,y: null
	,__class__: kha_audio2_ogg_vorbis_data_IntPoint
};
var kha_audio2_ogg_vorbis_data_Mapping = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Mapping"] = kha_audio2_ogg_vorbis_data_Mapping;
kha_audio2_ogg_vorbis_data_Mapping.__name__ = true;
kha_audio2_ogg_vorbis_data_Mapping.read = function(decodeState,channels) {
	var m = new kha_audio2_ogg_vorbis_data_Mapping();
	var mappingType = decodeState.readBits(16);
	if(mappingType != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,"mapping type " + mappingType,{ fileName : "Mapping.hx", lineNumber : 22, className : "kha.audio2.ogg.vorbis.data.Mapping", methodName : "read"}));
	var this1;
	this1 = new Array(channels);
	m.chan = this1;
	var _g = 0;
	while(_g < channels) {
		var j = _g++;
		var val = new kha_audio2_ogg_vorbis_data_MappingChannel();
		m.chan[j] = val;
	}
	if(decodeState.readBits(1) != 0) m.submaps = decodeState.readBits(4) + 1; else m.submaps = 1;
	if(decodeState.readBits(1) != 0) {
		m.couplingSteps = decodeState.readBits(8) + 1;
		var _g1 = 0;
		var _g2 = m.couplingSteps;
		while(_g1 < _g2) {
			var k = _g1++;
			m.chan[k].magnitude = decodeState.readBits(kha_audio2_ogg_tools_MathTools.ilog(channels - 1));
			m.chan[k].angle = decodeState.readBits(kha_audio2_ogg_tools_MathTools.ilog(channels - 1));
			if(m.chan[k].magnitude >= channels) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Mapping.hx", lineNumber : 46, className : "kha.audio2.ogg.vorbis.data.Mapping", methodName : "read"}));
			if(m.chan[k].angle >= channels) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Mapping.hx", lineNumber : 49, className : "kha.audio2.ogg.vorbis.data.Mapping", methodName : "read"}));
			if(m.chan[k].magnitude == m.chan[k].angle) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Mapping.hx", lineNumber : 52, className : "kha.audio2.ogg.vorbis.data.Mapping", methodName : "read"}));
		}
	} else m.couplingSteps = 0;
	if(decodeState.readBits(2) != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Mapping.hx", lineNumber : 61, className : "kha.audio2.ogg.vorbis.data.Mapping", methodName : "read"}));
	if(m.submaps > 1) {
		var _g3 = 0;
		while(_g3 < channels) {
			var j1 = _g3++;
			m.chan[j1].mux = decodeState.readBits(4);
			if(m.chan[j1].mux >= m.submaps) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Mapping.hx", lineNumber : 67, className : "kha.audio2.ogg.vorbis.data.Mapping", methodName : "read"}));
		}
	} else {
		var _g4 = 0;
		while(_g4 < channels) {
			var j2 = _g4++;
			m.chan[j2].mux = 0;
		}
	}
	var this2;
	this2 = new Array(m.submaps);
	m.submapFloor = this2;
	var this3;
	this3 = new Array(m.submaps);
	m.submapResidue = this3;
	var _g11 = 0;
	var _g5 = m.submaps;
	while(_g11 < _g5) {
		var j3 = _g11++;
		decodeState.readBits(8);
		var val1 = decodeState.readBits(8);
		m.submapFloor[j3] = val1;
		var val2 = decodeState.readBits(8);
		m.submapResidue[j3] = val2;
	}
	return m;
};
kha_audio2_ogg_vorbis_data_Mapping.prototype = {
	couplingSteps: null
	,chan: null
	,submaps: null
	,submapFloor: null
	,submapResidue: null
	,doFloor: function(floors,i,n,target,finalY,step2Flag) {
		var n2 = n >> 1;
		var s = this.chan[i].mux;
		var floor;
		var floor1 = floors[this.submapFloor[s]];
		if(floor1.type == 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM,null,{ fileName : "Mapping.hx", lineNumber : 94, className : "kha.audio2.ogg.vorbis.data.Mapping", methodName : "doFloor"})); else {
			var g = floor1.floor1;
			var lx = 0;
			var ly = finalY[0] * g.floor1Multiplier;
			var _g1 = 1;
			var _g = g.values;
			while(_g1 < _g) {
				var q = _g1++;
				var j = g.sortedOrder[q];
				if(finalY[j] >= 0) {
					var hy = finalY[j] * g.floor1Multiplier;
					var hx = g.xlist[j];
					kha_audio2_ogg_vorbis_VorbisTools.drawLine(target,lx,ly,hx,hy,n2);
					lx = hx;
					ly = hy;
				}
			}
			if(lx < n2) {
				var _g2 = lx;
				while(_g2 < n2) {
					var j1 = _g2++;
					var _g11 = j1;
					target[_g11] = target[_g11] * kha_audio2_ogg_vorbis_VorbisTools.INVERSE_DB_TABLE[ly];
				}
			}
		}
	}
	,__class__: kha_audio2_ogg_vorbis_data_Mapping
};
var kha_audio2_ogg_vorbis_data_MappingChannel = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.MappingChannel"] = kha_audio2_ogg_vorbis_data_MappingChannel;
kha_audio2_ogg_vorbis_data_MappingChannel.__name__ = true;
kha_audio2_ogg_vorbis_data_MappingChannel.prototype = {
	magnitude: null
	,angle: null
	,mux: null
	,__class__: kha_audio2_ogg_vorbis_data_MappingChannel
};
var kha_audio2_ogg_vorbis_data_Mode = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Mode"] = kha_audio2_ogg_vorbis_data_Mode;
kha_audio2_ogg_vorbis_data_Mode.__name__ = true;
kha_audio2_ogg_vorbis_data_Mode.read = function(decodeState) {
	var m = new kha_audio2_ogg_vorbis_data_Mode();
	m.blockflag = decodeState.readBits(1) != 0;
	m.windowtype = decodeState.readBits(16);
	m.transformtype = decodeState.readBits(16);
	m.mapping = decodeState.readBits(8);
	if(m.windowtype != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Mode.hx", lineNumber : 22, className : "kha.audio2.ogg.vorbis.data.Mode", methodName : "read"}));
	if(m.transformtype != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Mode.hx", lineNumber : 25, className : "kha.audio2.ogg.vorbis.data.Mode", methodName : "read"}));
	return m;
};
kha_audio2_ogg_vorbis_data_Mode.prototype = {
	blockflag: null
	,mapping: null
	,windowtype: null
	,transformtype: null
	,__class__: kha_audio2_ogg_vorbis_data_Mode
};
var kha_audio2_ogg_vorbis_data_Page = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Page"] = kha_audio2_ogg_vorbis_data_Page;
kha_audio2_ogg_vorbis_data_Page.__name__ = true;
kha_audio2_ogg_vorbis_data_Page.prototype = {
	flag: null
	,clone: function() {
		var page = new kha_audio2_ogg_vorbis_data_Page();
		page.flag = this.flag;
		return page;
	}
	,start: function(decodeState) {
		if((function($this) {
			var $r;
			decodeState.inputPosition += 1;
			$r = decodeState.input.readByte();
			return $r;
		}(this)) != 79 || (function($this) {
			var $r;
			decodeState.inputPosition += 1;
			$r = decodeState.input.readByte();
			return $r;
		}(this)) != 103 || (function($this) {
			var $r;
			decodeState.inputPosition += 1;
			$r = decodeState.input.readByte();
			return $r;
		}(this)) != 103 || (function($this) {
			var $r;
			decodeState.inputPosition += 1;
			$r = decodeState.input.readByte();
			return $r;
		}(this)) != 83) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.MISSING_CAPTURE_PATTERN,null,{ fileName : "VorbisDecodeState.hx", lineNumber : 323, className : "kha.audio2.ogg.vorbis.VorbisDecodeState", methodName : "capturePattern"}));
		this.startWithoutCapturePattern(decodeState);
	}
	,startWithoutCapturePattern: function(decodeState) {
		var version;
		decodeState.inputPosition += 1;
		version = decodeState.input.readByte();
		if(version != 0) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM_STRUCTURE_VERSION,"" + version,{ fileName : "Page.hx", lineNumber : 34, className : "kha.audio2.ogg.vorbis.data.Page", methodName : "startWithoutCapturePattern"}));
		decodeState.inputPosition += 1;
		this.flag = decodeState.input.readByte();
		var loc0;
		decodeState.inputPosition += 4;
		loc0 = decodeState.input.readInt32();
		var loc1;
		decodeState.inputPosition += 4;
		loc1 = decodeState.input.readInt32();
		decodeState.inputPosition += 4;
		decodeState.input.readInt32();
		decodeState.inputPosition += 4;
		decodeState.input.readInt32();
		decodeState.inputPosition += 4;
		decodeState.input.readInt32();
		decodeState.setup(loc0,loc1);
	}
	,__class__: kha_audio2_ogg_vorbis_data_Page
};
var kha_audio2_ogg_vorbis_data_PageFlag = function() { };
$hxClasses["kha.audio2.ogg.vorbis.data.PageFlag"] = kha_audio2_ogg_vorbis_data_PageFlag;
kha_audio2_ogg_vorbis_data_PageFlag.__name__ = true;
var kha_audio2_ogg_vorbis_data_ProbedPage = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.ProbedPage"] = kha_audio2_ogg_vorbis_data_ProbedPage;
kha_audio2_ogg_vorbis_data_ProbedPage.__name__ = true;
kha_audio2_ogg_vorbis_data_ProbedPage.prototype = {
	pageStart: null
	,pageEnd: null
	,afterPreviousPageStart: null
	,firstDecodedSample: null
	,lastDecodedSample: null
	,__class__: kha_audio2_ogg_vorbis_data_ProbedPage
};
var kha_audio2_ogg_vorbis_data_ReaderError = function(type,message,posInfos) {
	if(message == null) message = "";
	this.type = type;
	this.message = message;
	this.posInfos = posInfos;
};
$hxClasses["kha.audio2.ogg.vorbis.data.ReaderError"] = kha_audio2_ogg_vorbis_data_ReaderError;
kha_audio2_ogg_vorbis_data_ReaderError.__name__ = true;
kha_audio2_ogg_vorbis_data_ReaderError.prototype = {
	type: null
	,message: null
	,posInfos: null
	,__class__: kha_audio2_ogg_vorbis_data_ReaderError
};
var kha_audio2_ogg_vorbis_data_ReaderErrorType = $hxClasses["kha.audio2.ogg.vorbis.data.ReaderErrorType"] = { __ename__ : true, __constructs__ : ["NEED_MORE_DATA","INVALID_API_MIXING","OUTOFMEM","FEATURE_NOT_SUPPORTED","TOO_MANY_CHANNELS","FILE_OPEN_FAILURE","SEEK_WITHOUT_LENGTH","UNEXPECTED_EOF","SEEK_INVALID","INVALID_SETUP","INVALID_STREAM","MISSING_CAPTURE_PATTERN","INVALID_STREAM_STRUCTURE_VERSION","CONTINUED_PACKET_FLAG_INVALID","INCORRECT_STREAM_SERIAL_NUMBER","INVALID_FIRST_PAGE","BAD_PACKET_TYPE","CANT_FIND_LAST_PAGE","SEEK_FAILED","OTHER"] };
kha_audio2_ogg_vorbis_data_ReaderErrorType.NEED_MORE_DATA = ["NEED_MORE_DATA",0];
kha_audio2_ogg_vorbis_data_ReaderErrorType.NEED_MORE_DATA.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.NEED_MORE_DATA.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_API_MIXING = ["INVALID_API_MIXING",1];
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_API_MIXING.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_API_MIXING.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.OUTOFMEM = ["OUTOFMEM",2];
kha_audio2_ogg_vorbis_data_ReaderErrorType.OUTOFMEM.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.OUTOFMEM.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.FEATURE_NOT_SUPPORTED = ["FEATURE_NOT_SUPPORTED",3];
kha_audio2_ogg_vorbis_data_ReaderErrorType.FEATURE_NOT_SUPPORTED.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.FEATURE_NOT_SUPPORTED.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.TOO_MANY_CHANNELS = ["TOO_MANY_CHANNELS",4];
kha_audio2_ogg_vorbis_data_ReaderErrorType.TOO_MANY_CHANNELS.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.TOO_MANY_CHANNELS.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.FILE_OPEN_FAILURE = ["FILE_OPEN_FAILURE",5];
kha_audio2_ogg_vorbis_data_ReaderErrorType.FILE_OPEN_FAILURE.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.FILE_OPEN_FAILURE.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_WITHOUT_LENGTH = ["SEEK_WITHOUT_LENGTH",6];
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_WITHOUT_LENGTH.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_WITHOUT_LENGTH.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.UNEXPECTED_EOF = ["UNEXPECTED_EOF",7];
kha_audio2_ogg_vorbis_data_ReaderErrorType.UNEXPECTED_EOF.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.UNEXPECTED_EOF.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_INVALID = ["SEEK_INVALID",8];
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_INVALID.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_INVALID.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP = ["INVALID_SETUP",9];
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM = ["INVALID_STREAM",10];
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.MISSING_CAPTURE_PATTERN = ["MISSING_CAPTURE_PATTERN",11];
kha_audio2_ogg_vorbis_data_ReaderErrorType.MISSING_CAPTURE_PATTERN.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.MISSING_CAPTURE_PATTERN.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM_STRUCTURE_VERSION = ["INVALID_STREAM_STRUCTURE_VERSION",12];
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM_STRUCTURE_VERSION.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_STREAM_STRUCTURE_VERSION.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.CONTINUED_PACKET_FLAG_INVALID = ["CONTINUED_PACKET_FLAG_INVALID",13];
kha_audio2_ogg_vorbis_data_ReaderErrorType.CONTINUED_PACKET_FLAG_INVALID.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.CONTINUED_PACKET_FLAG_INVALID.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INCORRECT_STREAM_SERIAL_NUMBER = ["INCORRECT_STREAM_SERIAL_NUMBER",14];
kha_audio2_ogg_vorbis_data_ReaderErrorType.INCORRECT_STREAM_SERIAL_NUMBER.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INCORRECT_STREAM_SERIAL_NUMBER.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE = ["INVALID_FIRST_PAGE",15];
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_FIRST_PAGE.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.BAD_PACKET_TYPE = ["BAD_PACKET_TYPE",16];
kha_audio2_ogg_vorbis_data_ReaderErrorType.BAD_PACKET_TYPE.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.BAD_PACKET_TYPE.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.CANT_FIND_LAST_PAGE = ["CANT_FIND_LAST_PAGE",17];
kha_audio2_ogg_vorbis_data_ReaderErrorType.CANT_FIND_LAST_PAGE.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.CANT_FIND_LAST_PAGE.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_FAILED = ["SEEK_FAILED",18];
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_FAILED.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.SEEK_FAILED.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
kha_audio2_ogg_vorbis_data_ReaderErrorType.OTHER = ["OTHER",19];
kha_audio2_ogg_vorbis_data_ReaderErrorType.OTHER.toString = $estr;
kha_audio2_ogg_vorbis_data_ReaderErrorType.OTHER.__enum__ = kha_audio2_ogg_vorbis_data_ReaderErrorType;
var kha_audio2_ogg_vorbis_data_Residue = function() {
};
$hxClasses["kha.audio2.ogg.vorbis.data.Residue"] = kha_audio2_ogg_vorbis_data_Residue;
kha_audio2_ogg_vorbis_data_Residue.__name__ = true;
kha_audio2_ogg_vorbis_data_Residue.read = function(decodeState,codebooks) {
	var r = new kha_audio2_ogg_vorbis_data_Residue();
	r.type = decodeState.readBits(16);
	if(r.type > 2) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Residue.hx", lineNumber : 29, className : "kha.audio2.ogg.vorbis.data.Residue", methodName : "read"}));
	var residueCascade;
	var this1;
	this1 = new Array(64);
	residueCascade = this1;
	r.begin = decodeState.readBits(24);
	r.end = decodeState.readBits(24);
	r.partSize = decodeState.readBits(24) + 1;
	var classifications = r.classifications = decodeState.readBits(6) + 1;
	r.classbook = decodeState.readBits(8);
	var _g1 = 0;
	var _g = r.classifications;
	while(_g1 < _g) {
		var j = _g1++;
		var highBits = 0;
		var lowBits = decodeState.readBits(3);
		if(decodeState.readBits(1) != 0) highBits = decodeState.readBits(5);
		residueCascade[j] = highBits * 8 + lowBits;
	}
	var this2;
	this2 = new Array(r.classifications);
	r.residueBooks = this2;
	var _g11 = 0;
	var _g2 = r.classifications;
	while(_g11 < _g2) {
		var j1 = _g11++;
		var val;
		var this3;
		this3 = new Array(8);
		val = this3;
		r.residueBooks[j1] = val;
		var _g21 = 0;
		while(_g21 < 8) {
			var k = _g21++;
			if((residueCascade[j1] & 1 << k) != 0) {
				var val1 = decodeState.readBits(8);
				r.residueBooks[j1][k] = val1;
				if(r.residueBooks[j1][k] >= codebooks.length) throw new js__$Boot_HaxeError(new kha_audio2_ogg_vorbis_data_ReaderError(kha_audio2_ogg_vorbis_data_ReaderErrorType.INVALID_SETUP,null,{ fileName : "Residue.hx", lineNumber : 55, className : "kha.audio2.ogg.vorbis.data.Residue", methodName : "read"}));
			} else r.residueBooks[j1][k] = -1;
		}
	}
	var el = codebooks[r.classbook].entries;
	var classwords = codebooks[r.classbook].dimensions;
	var this4;
	this4 = new Array(el);
	r.classdata = this4;
	var _g3 = 0;
	while(_g3 < el) {
		var j2 = _g3++;
		var temp = j2;
		var k1 = classwords;
		var cd;
		var val2;
		var this5;
		this5 = new Array(classwords);
		val2 = this5;
		cd = r.classdata[j2] = val2;
		while(--k1 >= 0) {
			cd[k1] = temp % classifications;
			temp = temp / classifications | 0;
		}
	}
	return r;
};
kha_audio2_ogg_vorbis_data_Residue.prototype = {
	begin: null
	,end: null
	,partSize: null
	,classifications: null
	,classbook: null
	,classdata: null
	,residueBooks: null
	,type: null
	,decode: function(decodeState,header,residueBuffers,ch,n,doNotDecode,channelBuffers) {
		var codebooks = header.codebooks;
		var classwords = codebooks[this.classbook].dimensions;
		var nRead = this.end - this.begin;
		var partSize = this.partSize;
		var partRead = Std["int"](_$UInt_UInt_$Impl_$.toFloat(nRead) / _$UInt_UInt_$Impl_$.toFloat(partSize));
		var classifications;
		var this1;
		this1 = new Array(header.channel * partRead + 1);
		classifications = this1;
		var _g = 0;
		while(_g < ch) {
			var i = _g++;
			if(!doNotDecode[i]) {
				var buffer = residueBuffers[i];
				var _g2 = 0;
				var _g1 = buffer.length;
				while(_g2 < _g1) {
					var j = _g2++;
					buffer[j] = 0;
				}
			}
		}
		if(this.type == 2 && ch != 1) {
			var _g3 = 0;
			while(_g3 < ch) {
				var j1 = _g3++;
				if(!doNotDecode[j1]) break; else if(j1 == ch - 1) return;
			}
			var _g4 = 0;
			while(_g4 < 8) {
				var pass = _g4++;
				var pcount = 0;
				var classSet = 0;
				if(ch == 2) while(pcount < partRead) {
					var z = this.begin + pcount * partSize;
					var cInter = z & 1;
					var pInter = z >>> 1;
					if(pass == 0) {
						var c = codebooks[this.classbook];
						var q = decodeState.decode(c);
						if(q == -1) return;
						var i1 = classwords;
						while(--i1 >= 0) {
							classifications[i1 + pcount] = q % this.classifications;
							q = q / this.classifications | 0;
						}
					}
					var _g11 = 0;
					while(_g11 < classwords) {
						var i2 = _g11++;
						if(pcount >= partRead) break;
						var z1 = this.begin + pcount * partSize;
						var c1 = classifications[pcount];
						var b = this.residueBooks[c1][pass];
						if(b >= 0) {
							var book = codebooks[b];
							var result = book.decodeDeinterleaveRepeat(decodeState,residueBuffers,ch,cInter,pInter,n,partSize);
							if(result == null) return; else {
								cInter = result.cInter;
								pInter = result.pInter;
							}
							null;
						} else {
							z1 = z1 + partSize;
							cInter = z1 & 1;
							pInter = z1 >>> 1;
						}
						++pcount;
					}
					null;
				} else if(ch == 1) while(pcount < partRead) {
					var z2 = this.begin + pcount * partSize;
					var cInter1 = 0;
					var pInter1 = z2;
					if(pass == 0) {
						var c2 = codebooks[this.classbook];
						var q1 = decodeState.decode(c2);
						if(q1 == -1) return;
						var i3 = classwords;
						while(--i3 >= 0) {
							classifications[i3 + pcount] = q1 % this.classifications;
							q1 = q1 / this.classifications | 0;
						}
					}
					var _g12 = 0;
					while(_g12 < classwords) {
						var i4 = _g12++;
						if(pcount >= partRead) break;
						var z3 = this.begin + pcount * partSize;
						var b1 = this.residueBooks[classifications[pcount]][pass];
						if(b1 >= 0) {
							var book1 = codebooks[b1];
							var result1 = book1.decodeDeinterleaveRepeat(decodeState,residueBuffers,ch,cInter1,pInter1,n,partSize);
							if(result1 == null) return; else {
								cInter1 = result1.cInter;
								pInter1 = result1.pInter;
							}
							null;
						} else {
							z3 = z3 + partSize;
							cInter1 = 0;
							pInter1 = z3;
						}
						++pcount;
					}
				} else while(pcount < partRead) {
					var z4 = this.begin + pcount * partSize;
					var cInter2 = Std["int"](_$UInt_UInt_$Impl_$.toFloat(z4) % _$UInt_UInt_$Impl_$.toFloat(ch));
					var pInter2 = Std["int"](_$UInt_UInt_$Impl_$.toFloat(z4) / _$UInt_UInt_$Impl_$.toFloat(ch));
					if(pass == 0) {
						var c3 = codebooks[this.classbook];
						var q2 = decodeState.decode(c3);
						if(q2 == -1) return;
						var i5 = classwords;
						while(--i5 >= 0) {
							classifications[i5 + pcount] = q2 % this.classifications;
							q2 = q2 / this.classifications | 0;
						}
					}
					var _g13 = 0;
					while(_g13 < classwords) {
						var i6 = _g13++;
						if(pcount >= partRead) break;
						var z5 = this.begin + pcount * partSize;
						var b2 = this.residueBooks[classifications[pcount]][pass];
						if(b2 >= 0) {
							var book2 = codebooks[b2];
							var result2 = book2.decodeDeinterleaveRepeat(decodeState,residueBuffers,ch,cInter2,pInter2,n,partSize);
							if(result2 == null) return; else {
								cInter2 = result2.cInter;
								pInter2 = result2.pInter;
							}
							null;
						} else {
							z5 = z5 + partSize;
							cInter2 = Std["int"](_$UInt_UInt_$Impl_$.toFloat(z5) % _$UInt_UInt_$Impl_$.toFloat(ch));
							pInter2 = Std["int"](_$UInt_UInt_$Impl_$.toFloat(z5) / _$UInt_UInt_$Impl_$.toFloat(ch));
						}
						++pcount;
					}
				}
			}
			return;
		}
		var _g5 = 0;
		while(_g5 < 8) {
			var pass1 = _g5++;
			var pcount1 = 0;
			var classSet1 = 0;
			while(pcount1 < partRead) {
				if(pass1 == 0) {
					var _g14 = 0;
					while(_g14 < ch) {
						var j2 = _g14++;
						if(!doNotDecode[j2]) {
							var c4 = codebooks[this.classbook];
							var temp = decodeState.decode(c4);
							if(temp == -1) return;
							var i7 = classwords;
							while(--i7 >= 0) {
								classifications[j2 * partRead + i7 + pcount1] = temp % this.classifications;
								temp = temp / this.classifications | 0;
							}
						}
					}
				}
				var _g15 = 0;
				while(_g15 < classwords) {
					var i8 = _g15++;
					if(pcount1 >= partRead) break;
					var _g21 = 0;
					while(_g21 < ch) {
						var j3 = _g21++;
						if(!doNotDecode[j3]) {
							var c5 = classifications[j3 * partRead + pcount1];
							var b3 = this.residueBooks[c5][pass1];
							if(b3 >= 0) {
								var target = residueBuffers[j3];
								var offset = this.begin + pcount1 * partSize;
								var n1 = partSize;
								var book3 = codebooks[b3];
								if(!book3.residueDecode(decodeState,target,offset,n1,this.type)) return;
							}
						}
					}
					++pcount1;
				}
			}
		}
	}
	,__class__: kha_audio2_ogg_vorbis_data_Residue
};
var kha_audio2_ogg_vorbis_data_Setting = function() { };
$hxClasses["kha.audio2.ogg.vorbis.data.Setting"] = kha_audio2_ogg_vorbis_data_Setting;
kha_audio2_ogg_vorbis_data_Setting.__name__ = true;
var kha_graphics1_Graphics = function() { };
$hxClasses["kha.graphics1.Graphics"] = kha_graphics1_Graphics;
kha_graphics1_Graphics.__name__ = true;
kha_graphics1_Graphics.prototype = {
	begin: null
	,end: null
	,setPixel: null
	,__class__: kha_graphics1_Graphics
};
var kha_graphics2_Graphics = function() {
	this.transformations = [];
	this.transformations.push(new kha_math_FastMatrix3(1,0,0,0,1,0,0,0,1));
	this.opacities = [];
	this.opacities.push(1);
	this.myFontSize = 12;
	this.pipe = null;
};
$hxClasses["kha.graphics2.Graphics"] = kha_graphics2_Graphics;
kha_graphics2_Graphics.__name__ = true;
kha_graphics2_Graphics.prototype = {
	begin: function(clear,clearColor) {
		if(clear == null) clear = true;
	}
	,end: function() {
	}
	,flush: function() {
	}
	,clear: function(color) {
	}
	,drawImage: function(img,x,y) {
		this.drawSubImage(img,x,y,0,0,img.get_width(),img.get_height());
	}
	,drawSubImage: function(img,x,y,sx,sy,sw,sh) {
		this.drawScaledSubImage(img,sx,sy,sw,sh,x,y,sw,sh);
	}
	,drawScaledImage: function(img,dx,dy,dw,dh) {
		this.drawScaledSubImage(img,0,0,img.get_width(),img.get_height(),dx,dy,dw,dh);
	}
	,drawScaledSubImage: function(image,sx,sy,sw,sh,dx,dy,dw,dh) {
	}
	,drawRect: function(x,y,width,height,strength) {
		if(strength == null) strength = 1.0;
	}
	,fillRect: function(x,y,width,height) {
	}
	,drawString: function(text,x,y) {
	}
	,drawLine: function(x1,y1,x2,y2,strength) {
		if(strength == null) strength = 1.0;
	}
	,drawVideo: function(video,x,y,width,height) {
	}
	,fillTriangle: function(x1,y1,x2,y2,x3,y3) {
	}
	,get_imageScaleQuality: function() {
		return kha_graphics2_ImageScaleQuality.Low;
	}
	,set_imageScaleQuality: function(value) {
		return kha_graphics2_ImageScaleQuality.High;
	}
	,get_color: function() {
		return kha__$Color_Color_$Impl_$.Black;
	}
	,set_color: function(color) {
		return kha__$Color_Color_$Impl_$.Black;
	}
	,get_font: function() {
		return null;
	}
	,set_font: function(font) {
		return null;
	}
	,get_fontSize: function() {
		return this.myFontSize;
	}
	,set_fontSize: function(value) {
		return this.myFontSize = value;
	}
	,pushTransformation: function(transformation) {
		this.setTransformation(transformation);
		this.transformations.push(transformation);
	}
	,popTransformation: function() {
		var ret = this.transformations.pop();
		this.setTransformation(this.transformations[this.transformations.length - 1]);
		return ret;
	}
	,get_transformation: function() {
		return this.transformations[this.transformations.length - 1];
	}
	,set_transformation: function(transformation) {
		this.setTransformation(transformation);
		return this.transformations[this.transformations.length - 1] = transformation;
	}
	,translation: function(tx,ty) {
		var _this__00 = 1;
		var _this__10 = 0;
		var _this__20 = tx;
		var _this__01 = 0;
		var _this__11 = 1;
		var _this__21 = ty;
		var _this__02 = 0;
		var _this__12 = 0;
		var _this__22 = 1;
		var m = this.transformations[this.transformations.length - 1];
		return new kha_math_FastMatrix3(_this__00 * m._00 + _this__10 * m._01 + _this__20 * m._02,_this__00 * m._10 + _this__10 * m._11 + _this__20 * m._12,_this__00 * m._20 + _this__10 * m._21 + _this__20 * m._22,_this__01 * m._00 + _this__11 * m._01 + _this__21 * m._02,_this__01 * m._10 + _this__11 * m._11 + _this__21 * m._12,_this__01 * m._20 + _this__11 * m._21 + _this__21 * m._22,_this__02 * m._00 + _this__12 * m._01 + _this__22 * m._02,_this__02 * m._10 + _this__12 * m._11 + _this__22 * m._12,_this__02 * m._20 + _this__12 * m._21 + _this__22 * m._22);
	}
	,translate: function(tx,ty) {
		this.set_transformation(this.translation(tx,ty));
	}
	,pushTranslation: function(tx,ty) {
		this.pushTransformation(this.translation(tx,ty));
	}
	,rotation: function(angle,centerx,centery) {
		var _this__00 = 1;
		var _this__10 = 0;
		var _this__20 = centerx;
		var _this__01 = 0;
		var _this__11 = 1;
		var _this__21 = centery;
		var _this__02 = 0;
		var _this__12 = 0;
		var _this__22 = 1;
		var m = new kha_math_FastMatrix3(Math.cos(angle),-Math.sin(angle),0,Math.sin(angle),Math.cos(angle),0,0,0,1);
		var _this__001 = _this__00 * m._00 + _this__10 * m._01 + _this__20 * m._02;
		var _this__101 = _this__00 * m._10 + _this__10 * m._11 + _this__20 * m._12;
		var _this__201 = _this__00 * m._20 + _this__10 * m._21 + _this__20 * m._22;
		var _this__011 = _this__01 * m._00 + _this__11 * m._01 + _this__21 * m._02;
		var _this__111 = _this__01 * m._10 + _this__11 * m._11 + _this__21 * m._12;
		var _this__211 = _this__01 * m._20 + _this__11 * m._21 + _this__21 * m._22;
		var _this__021 = _this__02 * m._00 + _this__12 * m._01 + _this__22 * m._02;
		var _this__121 = _this__02 * m._10 + _this__12 * m._11 + _this__22 * m._12;
		var _this__221 = _this__02 * m._20 + _this__12 * m._21 + _this__22 * m._22;
		var m__00 = 1;
		var m__10 = 0;
		var m__20 = -centerx;
		var m__01 = 0;
		var m__11 = 1;
		var m__21 = -centery;
		var m__02 = 0;
		var m__12 = 0;
		var m__22 = 1;
		var _this__002 = _this__001 * m__00 + _this__101 * m__01 + _this__201 * m__02;
		var _this__102 = _this__001 * m__10 + _this__101 * m__11 + _this__201 * m__12;
		var _this__202 = _this__001 * m__20 + _this__101 * m__21 + _this__201 * m__22;
		var _this__012 = _this__011 * m__00 + _this__111 * m__01 + _this__211 * m__02;
		var _this__112 = _this__011 * m__10 + _this__111 * m__11 + _this__211 * m__12;
		var _this__212 = _this__011 * m__20 + _this__111 * m__21 + _this__211 * m__22;
		var _this__022 = _this__021 * m__00 + _this__121 * m__01 + _this__221 * m__02;
		var _this__122 = _this__021 * m__10 + _this__121 * m__11 + _this__221 * m__12;
		var _this__222 = _this__021 * m__20 + _this__121 * m__21 + _this__221 * m__22;
		var m1 = this.transformations[this.transformations.length - 1];
		return new kha_math_FastMatrix3(_this__002 * m1._00 + _this__102 * m1._01 + _this__202 * m1._02,_this__002 * m1._10 + _this__102 * m1._11 + _this__202 * m1._12,_this__002 * m1._20 + _this__102 * m1._21 + _this__202 * m1._22,_this__012 * m1._00 + _this__112 * m1._01 + _this__212 * m1._02,_this__012 * m1._10 + _this__112 * m1._11 + _this__212 * m1._12,_this__012 * m1._20 + _this__112 * m1._21 + _this__212 * m1._22,_this__022 * m1._00 + _this__122 * m1._01 + _this__222 * m1._02,_this__022 * m1._10 + _this__122 * m1._11 + _this__222 * m1._12,_this__022 * m1._20 + _this__122 * m1._21 + _this__222 * m1._22);
	}
	,rotate: function(angle,centerx,centery) {
		this.set_transformation(this.rotation(angle,centerx,centery));
	}
	,pushRotation: function(angle,centerx,centery) {
		this.pushTransformation(this.rotation(angle,centerx,centery));
	}
	,pushOpacity: function(opacity) {
		this.setOpacity(opacity);
		this.opacities.push(opacity);
	}
	,popOpacity: function() {
		var ret = this.opacities.pop();
		this.setOpacity(this.get_opacity());
		return ret;
	}
	,get_opacity: function() {
		return this.opacities[this.opacities.length - 1];
	}
	,set_opacity: function(opacity) {
		this.setOpacity(opacity);
		return this.opacities[this.opacities.length - 1] = opacity;
	}
	,scissor: function(x,y,width,height) {
	}
	,disableScissor: function() {
	}
	,pipe: null
	,get_pipeline: function() {
		return this.pipe;
	}
	,set_pipeline: function(pipeline) {
		this.setPipeline(pipeline);
		return this.pipe = pipeline;
	}
	,setBlendingMode: function(source,destination) {
	}
	,transformations: null
	,opacities: null
	,myFontSize: null
	,setTransformation: function(transformation) {
	}
	,setOpacity: function(opacity) {
	}
	,setPipeline: function(pipeline) {
	}
	,__class__: kha_graphics2_Graphics
};
var kha_graphics2_Graphics1 = function(canvas) {
	this.canvas = canvas;
};
$hxClasses["kha.graphics2.Graphics1"] = kha_graphics2_Graphics1;
kha_graphics2_Graphics1.__name__ = true;
kha_graphics2_Graphics1.__interfaces__ = [kha_graphics1_Graphics];
kha_graphics2_Graphics1.prototype = {
	canvas: null
	,texture: null
	,pixels: null
	,begin: function() {
		if(this.texture == null) this.texture = kha_Image.create(this.canvas.get_width(),this.canvas.get_height(),kha_graphics4_TextureFormat.RGBA32,kha_graphics4_Usage.ReadableUsage);
		this.pixels = this.texture.lock();
	}
	,end: function() {
		this.texture.unlock();
		this.canvas.get_g2().begin();
		this.canvas.get_g2().drawImage(this.texture,0,0);
		this.canvas.get_g2().end();
	}
	,setPixel: function(x,y,color) {
		this.pixels.setInt32(y * this.texture.get_realWidth() * 4 + x * 4,color);
	}
	,__class__: kha_graphics2_Graphics1
};
var kha_graphics2_ImageScaleQuality = $hxClasses["kha.graphics2.ImageScaleQuality"] = { __ename__ : true, __constructs__ : ["Low","High"] };
kha_graphics2_ImageScaleQuality.Low = ["Low",0];
kha_graphics2_ImageScaleQuality.Low.toString = $estr;
kha_graphics2_ImageScaleQuality.Low.__enum__ = kha_graphics2_ImageScaleQuality;
kha_graphics2_ImageScaleQuality.High = ["High",1];
kha_graphics2_ImageScaleQuality.High.toString = $estr;
kha_graphics2_ImageScaleQuality.High.__enum__ = kha_graphics2_ImageScaleQuality;
var kha_graphics2_truetype_Stbtt_$temp_$rect = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt_temp_rect"] = kha_graphics2_truetype_Stbtt_$temp_$rect;
kha_graphics2_truetype_Stbtt_$temp_$rect.__name__ = true;
kha_graphics2_truetype_Stbtt_$temp_$rect.prototype = {
	x0: null
	,y0: null
	,x1: null
	,y1: null
	,__class__: kha_graphics2_truetype_Stbtt_$temp_$rect
};
var kha_graphics2_truetype_Stbtt_$temp_$glyph_$h_$metrics = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt_temp_glyph_h_metrics"] = kha_graphics2_truetype_Stbtt_$temp_$glyph_$h_$metrics;
kha_graphics2_truetype_Stbtt_$temp_$glyph_$h_$metrics.__name__ = true;
kha_graphics2_truetype_Stbtt_$temp_$glyph_$h_$metrics.prototype = {
	advanceWidth: null
	,leftSideBearing: null
	,__class__: kha_graphics2_truetype_Stbtt_$temp_$glyph_$h_$metrics
};
var kha_graphics2_truetype_Stbtt_$temp_$font_$v_$metrics = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt_temp_font_v_metrics"] = kha_graphics2_truetype_Stbtt_$temp_$font_$v_$metrics;
kha_graphics2_truetype_Stbtt_$temp_$font_$v_$metrics.__name__ = true;
kha_graphics2_truetype_Stbtt_$temp_$font_$v_$metrics.prototype = {
	ascent: null
	,descent: null
	,lineGap: null
	,__class__: kha_graphics2_truetype_Stbtt_$temp_$font_$v_$metrics
};
var kha_graphics2_truetype_Stbtt_$temp_$region = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt_temp_region"] = kha_graphics2_truetype_Stbtt_$temp_$region;
kha_graphics2_truetype_Stbtt_$temp_$region.__name__ = true;
kha_graphics2_truetype_Stbtt_$temp_$region.prototype = {
	width: null
	,height: null
	,xoff: null
	,yoff: null
	,__class__: kha_graphics2_truetype_Stbtt_$temp_$region
};
var kha_graphics2_truetype_Stbtt_$bakedchar = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt_bakedchar"] = kha_graphics2_truetype_Stbtt_$bakedchar;
kha_graphics2_truetype_Stbtt_$bakedchar.__name__ = true;
kha_graphics2_truetype_Stbtt_$bakedchar.prototype = {
	x0: null
	,y0: null
	,x1: null
	,y1: null
	,xoff: null
	,yoff: null
	,xadvance: null
	,__class__: kha_graphics2_truetype_Stbtt_$bakedchar
};
var kha_graphics2_truetype_Stbtt_$aligned_$quad = function() { };
$hxClasses["kha.graphics2.truetype.Stbtt_aligned_quad"] = kha_graphics2_truetype_Stbtt_$aligned_$quad;
kha_graphics2_truetype_Stbtt_$aligned_$quad.__name__ = true;
kha_graphics2_truetype_Stbtt_$aligned_$quad.prototype = {
	x0: null
	,y0: null
	,s0: null
	,t0: null
	,x1: null
	,y1: null
	,s1: null
	,t1: null
	,__class__: kha_graphics2_truetype_Stbtt_$aligned_$quad
};
var kha_graphics2_truetype_Stbtt_$packedchar = function() { };
$hxClasses["kha.graphics2.truetype.Stbtt_packedchar"] = kha_graphics2_truetype_Stbtt_$packedchar;
kha_graphics2_truetype_Stbtt_$packedchar.__name__ = true;
kha_graphics2_truetype_Stbtt_$packedchar.prototype = {
	x0: null
	,y0: null
	,x1: null
	,y1: null
	,xoff: null
	,yoff: null
	,xadvance: null
	,xoff2: null
	,yoff2: null
	,__class__: kha_graphics2_truetype_Stbtt_$packedchar
};
var kha_graphics2_truetype_Stbtt_$pack_$range = function() { };
$hxClasses["kha.graphics2.truetype.Stbtt_pack_range"] = kha_graphics2_truetype_Stbtt_$pack_$range;
kha_graphics2_truetype_Stbtt_$pack_$range.__name__ = true;
kha_graphics2_truetype_Stbtt_$pack_$range.prototype = {
	font_size: null
	,first_unicode_codepoint_in_range: null
	,array_of_unicode_codepoints: null
	,num_chars: null
	,chardata_for_range: null
	,h_oversample: null
	,v_oversample: null
	,__class__: kha_graphics2_truetype_Stbtt_$pack_$range
};
var kha_graphics2_truetype_Stbtt_$pack_$context = function() { };
$hxClasses["kha.graphics2.truetype.Stbtt_pack_context"] = kha_graphics2_truetype_Stbtt_$pack_$context;
kha_graphics2_truetype_Stbtt_$pack_$context.__name__ = true;
kha_graphics2_truetype_Stbtt_$pack_$context.prototype = {
	width: null
	,height: null
	,stride_in_bytes: null
	,padding: null
	,h_oversample: null
	,v_oversample: null
	,pixels: null
	,__class__: kha_graphics2_truetype_Stbtt_$pack_$context
};
var kha_graphics2_truetype_Stbtt_$fontinfo = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt_fontinfo"] = kha_graphics2_truetype_Stbtt_$fontinfo;
kha_graphics2_truetype_Stbtt_$fontinfo.__name__ = true;
kha_graphics2_truetype_Stbtt_$fontinfo.prototype = {
	data: null
	,fontstart: null
	,numGlyphs: null
	,loca: null
	,head: null
	,glyf: null
	,hhea: null
	,hmtx: null
	,kern: null
	,index_map: null
	,indexToLocFormat: null
	,__class__: kha_graphics2_truetype_Stbtt_$fontinfo
};
var kha_graphics2_truetype_Stbtt_$vertex = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt_vertex"] = kha_graphics2_truetype_Stbtt_$vertex;
kha_graphics2_truetype_Stbtt_$vertex.__name__ = true;
kha_graphics2_truetype_Stbtt_$vertex.prototype = {
	x: null
	,y: null
	,cx: null
	,cy: null
	,type: null
	,padding: null
	,__class__: kha_graphics2_truetype_Stbtt_$vertex
};
var kha_graphics2_truetype_Stbtt_$_$bitmap = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt__bitmap"] = kha_graphics2_truetype_Stbtt_$_$bitmap;
kha_graphics2_truetype_Stbtt_$_$bitmap.__name__ = true;
kha_graphics2_truetype_Stbtt_$_$bitmap.prototype = {
	w: null
	,h: null
	,stride: null
	,pixels: null
	,pixels_offset: null
	,__class__: kha_graphics2_truetype_Stbtt_$_$bitmap
};
var kha_graphics2_truetype_Stbtt_$_$edge = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt__edge"] = kha_graphics2_truetype_Stbtt_$_$edge;
kha_graphics2_truetype_Stbtt_$_$edge.__name__ = true;
kha_graphics2_truetype_Stbtt_$_$edge.prototype = {
	x0: null
	,y0: null
	,x1: null
	,y1: null
	,invert: null
	,__class__: kha_graphics2_truetype_Stbtt_$_$edge
};
var kha_graphics2_truetype_Stbtt_$_$active_$edge = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt__active_edge"] = kha_graphics2_truetype_Stbtt_$_$active_$edge;
kha_graphics2_truetype_Stbtt_$_$active_$edge.__name__ = true;
kha_graphics2_truetype_Stbtt_$_$active_$edge.prototype = {
	next: null
	,fx: null
	,fdx: null
	,fdy: null
	,direction: null
	,sy: null
	,ey: null
	,__class__: kha_graphics2_truetype_Stbtt_$_$active_$edge
};
var kha_graphics2_truetype_Stbtt_$_$point = function() {
};
$hxClasses["kha.graphics2.truetype.Stbtt__point"] = kha_graphics2_truetype_Stbtt_$_$point;
kha_graphics2_truetype_Stbtt_$_$point.__name__ = true;
kha_graphics2_truetype_Stbtt_$_$point.prototype = {
	x: null
	,y: null
	,__class__: kha_graphics2_truetype_Stbtt_$_$point
};
var kha_graphics2_truetype_StbTruetype = function() { };
$hxClasses["kha.graphics2.truetype.StbTruetype"] = kha_graphics2_truetype_StbTruetype;
kha_graphics2_truetype_StbTruetype.__name__ = true;
kha_graphics2_truetype_StbTruetype.STBTT_assert = function(value) {
	if(!value) throw new js__$Boot_HaxeError("Error");
};
kha_graphics2_truetype_StbTruetype.STBTT_POINT_SIZE = function(x) {
	return -x;
};
kha_graphics2_truetype_StbTruetype.ttBYTE = function(p,pos) {
	if(pos == null) pos = 0;
	return p.readU8(pos);
};
kha_graphics2_truetype_StbTruetype.ttCHAR = function(p,pos) {
	if(pos == null) pos = 0;
	var n = p.readU8(pos);
	if(n >= 128) return n - 256;
	return n;
};
kha_graphics2_truetype_StbTruetype.ttUSHORT = function(p,pos) {
	if(pos == null) pos = 0;
	var ch1 = p.readU8(pos);
	var ch2 = p.readU8(pos + 1);
	return ch2 | ch1 << 8;
};
kha_graphics2_truetype_StbTruetype.ttSHORT = function(p,pos) {
	if(pos == null) pos = 0;
	var ch1 = p.readU8(pos);
	var ch2 = p.readU8(pos + 1);
	var n = ch2 | ch1 << 8;
	if((n & 32768) != 0) return n - 65536;
	return n;
};
kha_graphics2_truetype_StbTruetype.ttULONG = function(p,pos) {
	if(pos == null) pos = 0;
	return kha_graphics2_truetype_StbTruetype.ttLONG(p,pos);
};
kha_graphics2_truetype_StbTruetype.ttLONG = function(p,pos) {
	if(pos == null) pos = 0;
	var ch1 = p.readU8(pos);
	var ch2 = p.readU8(pos + 1);
	var ch3 = p.readU8(pos + 2);
	var ch4 = p.readU8(pos + 3);
	return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24;
};
kha_graphics2_truetype_StbTruetype.ttFixed = function(p,pos) {
	if(pos == null) pos = 0;
	return kha_graphics2_truetype_StbTruetype.ttLONG(p,pos);
};
kha_graphics2_truetype_StbTruetype.stbtt_tag4 = function(p,pos,c0,c1,c2,c3) {
	return p.readU8(pos) == c0 && p.readU8(pos + 1) == c1 && p.readU8(pos + 2) == c2 && p.readU8(pos + 3) == c3;
};
kha_graphics2_truetype_StbTruetype.stbtt_tag = function(p,pos,str) {
	return kha_graphics2_truetype_StbTruetype.stbtt_tag4(p,pos,HxOverrides.cca(str,0),HxOverrides.cca(str,1),HxOverrides.cca(str,2),HxOverrides.cca(str,3));
};
kha_graphics2_truetype_StbTruetype.stbtt__isfont = function(font) {
	if(kha_graphics2_truetype_StbTruetype.stbtt_tag4(font,0,HxOverrides.cca("1",0),0,0,0)) return true;
	if(kha_graphics2_truetype_StbTruetype.stbtt_tag4(font,0,HxOverrides.cca("typ1",0),HxOverrides.cca("typ1",1),HxOverrides.cca("typ1",2),HxOverrides.cca("typ1",3))) return true;
	if(kha_graphics2_truetype_StbTruetype.stbtt_tag4(font,0,HxOverrides.cca("OTTO",0),HxOverrides.cca("OTTO",1),HxOverrides.cca("OTTO",2),HxOverrides.cca("OTTO",3))) return true;
	if(font.readU8(0) == 0 && font.readU8(1) == 1 && font.readU8(2) == 0 && font.readU8(3) == 0) return true;
	return false;
};
kha_graphics2_truetype_StbTruetype.stbtt__find_table = function(data,fontstart,tag) {
	var num_tables = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,fontstart + 4);
	var tabledir = fontstart + 12;
	var _g = 0;
	while(_g < num_tables) {
		var i = _g++;
		var loc = tabledir + 16 * i;
		if(kha_graphics2_truetype_StbTruetype.stbtt_tag4(data,loc,HxOverrides.cca(tag,0),HxOverrides.cca(tag,1),HxOverrides.cca(tag,2),HxOverrides.cca(tag,3))) return kha_graphics2_truetype_StbTruetype.ttLONG(data,loc + 8);
	}
	return 0;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetFontOffsetForIndex = function(font_collection,index) {
	if(kha_graphics2_truetype_StbTruetype.stbtt__isfont(font_collection)) if(index == 0) return 0; else return -1;
	if(kha_graphics2_truetype_StbTruetype.stbtt_tag4(font_collection,0,HxOverrides.cca("ttcf",0),HxOverrides.cca("ttcf",1),HxOverrides.cca("ttcf",2),HxOverrides.cca("ttcf",3))) {
		if(kha_graphics2_truetype_StbTruetype.ttLONG(font_collection,4) == 65536 || kha_graphics2_truetype_StbTruetype.ttLONG(font_collection,4) == 131072) {
			var n = kha_graphics2_truetype_StbTruetype.ttLONG(font_collection,8);
			if(index >= n) return -1;
			return kha_graphics2_truetype_StbTruetype.ttLONG(font_collection,12 + index * 4);
		}
	}
	return -1;
};
kha_graphics2_truetype_StbTruetype.stbtt_InitFont = function(info,data,fontstart) {
	var cmap;
	var t;
	var numTables;
	info.data = data;
	info.fontstart = fontstart;
	cmap = kha_graphics2_truetype_StbTruetype.stbtt__find_table(data,fontstart,"cmap");
	info.loca = kha_graphics2_truetype_StbTruetype.stbtt__find_table(data,fontstart,"loca");
	info.head = kha_graphics2_truetype_StbTruetype.stbtt__find_table(data,fontstart,"head");
	info.glyf = kha_graphics2_truetype_StbTruetype.stbtt__find_table(data,fontstart,"glyf");
	info.hhea = kha_graphics2_truetype_StbTruetype.stbtt__find_table(data,fontstart,"hhea");
	info.hmtx = kha_graphics2_truetype_StbTruetype.stbtt__find_table(data,fontstart,"hmtx");
	info.kern = kha_graphics2_truetype_StbTruetype.stbtt__find_table(data,fontstart,"kern");
	if(cmap == 0 || info.loca == 0 || info.head == 0 || info.glyf == 0 || info.hhea == 0 || info.hmtx == 0) return false;
	t = kha_graphics2_truetype_StbTruetype.stbtt__find_table(data,fontstart,"maxp");
	if(t != 0) info.numGlyphs = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,t + 4); else info.numGlyphs = 65535;
	numTables = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,cmap + 2);
	info.index_map = 0;
	var _g = 0;
	while(_g < numTables) {
		var i = _g++;
		var encoding_record = cmap + 4 + 8 * i;
		var _g1 = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,encoding_record);
		switch(_g1) {
		case 3:
			var _g2 = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,encoding_record + 2);
			switch(_g2) {
			case 1:case 10:
				info.index_map = cmap + kha_graphics2_truetype_StbTruetype.ttLONG(data,encoding_record + 4);
				break;
			}
			break;
		case 0:
			info.index_map = cmap + kha_graphics2_truetype_StbTruetype.ttLONG(data,encoding_record + 4);
			break;
		}
	}
	if(info.index_map == 0) return false;
	info.indexToLocFormat = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,info.head + 50);
	return true;
};
kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex = function(info,unicode_codepoint) {
	var data = info.data;
	var index_map = info.index_map;
	var format = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map);
	if(format == 0) {
		var bytes = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 2);
		if(unicode_codepoint < bytes - 6) return data.readU8(index_map + 6 + unicode_codepoint);
		return 0;
	} else if(format == 6) {
		var first = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 6);
		var count = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 8);
		if(unicode_codepoint >= first && unicode_codepoint < first + count) return kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 10 + (unicode_codepoint - first) * 2);
		return 0;
	} else if(format == 2) {
		throw new js__$Boot_HaxeError("Error");
		return 0;
	} else if(format == 4) {
		var segcount = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 6) >> 1;
		var searchRange = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 8) >> 1;
		var entrySelector = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 10);
		var rangeShift = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 12) >> 1;
		var endCount = index_map + 14;
		var search = endCount;
		if(unicode_codepoint > 65535) return 0;
		if(unicode_codepoint >= kha_graphics2_truetype_StbTruetype.ttUSHORT(data,search + rangeShift * 2)) search += rangeShift * 2;
		search -= 2;
		while(entrySelector != 0) {
			var end;
			searchRange >>= 1;
			end = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,search + searchRange * 2);
			if(unicode_codepoint > end) search += searchRange * 2;
			--entrySelector;
		}
		search += 2;
		var offset;
		var start;
		var item = search - endCount >> 1;
		kha_graphics2_truetype_StbTruetype.STBTT_assert(unicode_codepoint <= kha_graphics2_truetype_StbTruetype.ttUSHORT(data,endCount + 2 * item));
		start = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 14 + segcount * 2 + 2 + 2 * item);
		if(unicode_codepoint < start) return 0;
		offset = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,index_map + 14 + segcount * 6 + 2 + 2 * item);
		if(offset == 0) return unicode_codepoint + kha_graphics2_truetype_StbTruetype.ttSHORT(data,index_map + 14 + segcount * 4 + 2 + 2 * item);
		return kha_graphics2_truetype_StbTruetype.ttUSHORT(data,offset + (unicode_codepoint - start) * 2 + index_map + 14 + segcount * 6 + 2 + 2 * item);
	} else if(format == 12 || format == 13) {
		var ngroups = kha_graphics2_truetype_StbTruetype.ttLONG(data,index_map + 12);
		var low;
		var high;
		low = 0;
		high = ngroups;
		while(low < high) {
			var mid = low + (high - low >> 1);
			var start_char = kha_graphics2_truetype_StbTruetype.ttLONG(data,index_map + 16 + mid * 12);
			var end_char = kha_graphics2_truetype_StbTruetype.ttLONG(data,index_map + 16 + mid * 12 + 4);
			if(unicode_codepoint < start_char) high = mid; else if(unicode_codepoint > end_char) low = mid + 1; else {
				var start_glyph = kha_graphics2_truetype_StbTruetype.ttLONG(data,index_map + 16 + mid * 12 + 8);
				if(format == 12) return start_glyph + unicode_codepoint - start_char; else return start_glyph;
			}
		}
		return 0;
	}
	throw new js__$Boot_HaxeError("Error");
	return 0;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointShape = function(info,unicode_codepoint) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphShape(info,kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(info,unicode_codepoint));
};
kha_graphics2_truetype_StbTruetype.stbtt_setvertex = function(v,type,x,y,cx,cy) {
	v.type = type;
	v.x = x;
	v.y = y;
	v.cx = cx;
	v.cy = cy;
};
kha_graphics2_truetype_StbTruetype.stbtt__GetGlyfOffset = function(info,glyph_index) {
	var g1;
	var g2;
	if(glyph_index >= info.numGlyphs) return -1;
	if(info.indexToLocFormat >= 2) return -1;
	if(info.indexToLocFormat == 0) {
		g1 = info.glyf + kha_graphics2_truetype_StbTruetype.ttUSHORT(info.data,info.loca + glyph_index * 2) * 2;
		g2 = info.glyf + kha_graphics2_truetype_StbTruetype.ttUSHORT(info.data,info.loca + glyph_index * 2 + 2) * 2;
	} else {
		g1 = info.glyf + kha_graphics2_truetype_StbTruetype.ttLONG(info.data,info.loca + glyph_index * 4);
		g2 = info.glyf + kha_graphics2_truetype_StbTruetype.ttLONG(info.data,info.loca + glyph_index * 4 + 4);
	}
	if(g1 == g2) return -1; else return g1;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBox = function(info,glyph_index,rect) {
	var g = kha_graphics2_truetype_StbTruetype.stbtt__GetGlyfOffset(info,glyph_index);
	if(g < 0) return false;
	rect.x0 = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,g + 2);
	rect.y0 = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,g + 4);
	rect.x1 = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,g + 6);
	rect.y1 = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,g + 8);
	return true;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointBox = function(info,codepoint,rect) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBox(info,kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(info,codepoint),rect);
};
kha_graphics2_truetype_StbTruetype.stbtt_IsGlyphEmpty = function(info,glyph_index) {
	var numberOfContours;
	var g = kha_graphics2_truetype_StbTruetype.stbtt__GetGlyfOffset(info,glyph_index);
	if(g < 0) return true;
	numberOfContours = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,g);
	return numberOfContours == 0;
};
kha_graphics2_truetype_StbTruetype.stbtt__close_shape = function(vertices,num_vertices,was_off,start_off,sx,sy,scx,scy,cx,cy) {
	if(start_off) {
		if(was_off) kha_graphics2_truetype_StbTruetype.stbtt_setvertex((function($this) {
			var $r;
			var index = num_vertices++;
			$r = vertices[index];
			return $r;
		}(this)),3,cx + scx >> 1,cy + scy >> 1,cx,cy);
		kha_graphics2_truetype_StbTruetype.stbtt_setvertex((function($this) {
			var $r;
			var index1 = num_vertices++;
			$r = vertices[index1];
			return $r;
		}(this)),3,sx,sy,scx,scy);
	} else if(was_off) kha_graphics2_truetype_StbTruetype.stbtt_setvertex((function($this) {
		var $r;
		var index2 = num_vertices++;
		$r = vertices[index2];
		return $r;
	}(this)),3,sx,sy,cx,cy); else kha_graphics2_truetype_StbTruetype.stbtt_setvertex((function($this) {
		var $r;
		var index3 = num_vertices++;
		$r = vertices[index3];
		return $r;
	}(this)),2,sx,sy,0,0);
	return num_vertices;
};
kha_graphics2_truetype_StbTruetype.copyVertices = function(from,to,offset,count) {
	var _g = 0;
	while(_g < count) {
		var i = _g++;
		to[offset + i] = from[i];
	}
};
kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphShape = function(info,glyph_index) {
	var numberOfContours;
	var endPtsOfContours;
	var data = info.data;
	var vertices = null;
	var num_vertices = 0;
	var g = kha_graphics2_truetype_StbTruetype.stbtt__GetGlyfOffset(info,glyph_index);
	if(g < 0) return null;
	numberOfContours = kha_graphics2_truetype_StbTruetype.ttSHORT(data,g);
	if(numberOfContours > 0) {
		var flags = 0;
		var flagcount;
		var ins;
		var j = 0;
		var m;
		var n;
		var next_move = 0;
		var off = 0;
		var was_off = false;
		var start_off = false;
		var x;
		var y;
		var cx;
		var cy;
		var sx;
		var sy;
		var scx;
		var scy;
		var points;
		var pointsIndex = 0;
		endPtsOfContours = data.sub(g + 10,data.get_length() - (g + 10));
		ins = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,g + 10 + numberOfContours * 2);
		points = data.sub(g + 10 + numberOfContours * 2 + 2 + ins,data.get_length() - (g + 10 + numberOfContours * 2 + 2 + ins));
		n = 1 + kha_graphics2_truetype_StbTruetype.ttUSHORT(endPtsOfContours,numberOfContours * 2 - 2);
		m = n + 2 * numberOfContours;
		var this1;
		this1 = new Array(m);
		vertices = this1;
		if(vertices == null) return null; else {
			var _g1 = 0;
			var _g = vertices.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				var val = new kha_graphics2_truetype_Stbtt_$vertex();
				vertices[i1] = val;
			}
		}
		next_move = 0;
		flagcount = 0;
		off = m - n;
		var _g2 = 0;
		while(_g2 < n) {
			var i2 = _g2++;
			if(flagcount == 0) {
				flags = points.readU8(pointsIndex++);
				if((flags & 8) != 0) flagcount = points.readU8(pointsIndex++);
			} else --flagcount;
			vertices[off + i2].type = flags;
		}
		x = 0;
		var _g3 = 0;
		while(_g3 < n) {
			var i3 = _g3++;
			flags = vertices[off + i3].type;
			if((flags & 2) != 0) {
				var dx = points.readU8(pointsIndex++);
				if((flags & 16) != 0) x += dx; else x += -dx;
			} else if((flags & 16) == 0) {
				var value;
				var ch1 = points.readU8(pointsIndex);
				var ch2 = points.readU8(pointsIndex + 1);
				var n1 = ch2 | ch1 << 8;
				if((n1 & 32768) != 0) value = n1 - 65536; else value = n1;
				x = x + value;
				pointsIndex += 2;
			}
			vertices[off + i3].x = x;
		}
		y = 0;
		var _g4 = 0;
		while(_g4 < n) {
			var i4 = _g4++;
			flags = vertices[off + i4].type;
			if((flags & 4) != 0) {
				var dy = points.readU8(pointsIndex++);
				if((flags & 32) != 0) y += dy; else y += -dy;
			} else if((flags & 32) == 0) {
				var value1;
				var ch11 = points.readU8(pointsIndex);
				var ch21 = points.readU8(pointsIndex + 1);
				var n2 = ch21 | ch11 << 8;
				if((n2 & 32768) != 0) value1 = n2 - 65536; else value1 = n2;
				y = y + value1;
				pointsIndex += 2;
			}
			vertices[off + i4].y = y;
		}
		num_vertices = 0;
		sx = sy = cx = cy = scx = scy = 0;
		var i = 0;
		while(i < n) {
			flags = vertices[off + i].type;
			x = vertices[off + i].x;
			y = vertices[off + i].y;
			if(next_move == i) {
				if(i != 0) num_vertices = kha_graphics2_truetype_StbTruetype.stbtt__close_shape(vertices,num_vertices,was_off,start_off,sx,sy,scx,scy,cx,cy);
				start_off = (flags & 1) == 0;
				if(start_off) {
					scx = x;
					scy = y;
					if((vertices[off + i + 1].type & 1) == 0) {
						sx = x + vertices[off + i + 1].x >> 1;
						sy = y + vertices[off + i + 1].y >> 1;
					} else {
						sx = vertices[off + i + 1].x;
						sy = vertices[off + i + 1].y;
						++i;
					}
				} else {
					sx = x;
					sy = y;
				}
				kha_graphics2_truetype_StbTruetype.stbtt_setvertex((function($this) {
					var $r;
					var index = num_vertices++;
					$r = vertices[index];
					return $r;
				}(this)),1,sx,sy,0,0);
				was_off = false;
				next_move = 1 + kha_graphics2_truetype_StbTruetype.ttUSHORT(endPtsOfContours,j * 2);
				++j;
			} else if((flags & 1) == 0) {
				if(was_off) kha_graphics2_truetype_StbTruetype.stbtt_setvertex((function($this) {
					var $r;
					var index1 = num_vertices++;
					$r = vertices[index1];
					return $r;
				}(this)),3,cx + x >> 1,cy + y >> 1,cx,cy);
				cx = x;
				cy = y;
				was_off = true;
			} else {
				if(was_off) kha_graphics2_truetype_StbTruetype.stbtt_setvertex((function($this) {
					var $r;
					var index2 = num_vertices++;
					$r = vertices[index2];
					return $r;
				}(this)),3,x,y,cx,cy); else kha_graphics2_truetype_StbTruetype.stbtt_setvertex((function($this) {
					var $r;
					var index3 = num_vertices++;
					$r = vertices[index3];
					return $r;
				}(this)),2,x,y,0,0);
				was_off = false;
			}
			++i;
		}
		num_vertices = kha_graphics2_truetype_StbTruetype.stbtt__close_shape(vertices,num_vertices,was_off,start_off,sx,sy,scx,scy,cx,cy);
	} else if(numberOfContours == -1) {
		var more = 1;
		var comp = data.sub(g + 10,data.get_length() - (g + 10));
		var compIndex = 0;
		num_vertices = 0;
		vertices = null;
		while(more != 0) {
			var flags1;
			var gidx;
			var comp_num_verts = 0;
			var i5;
			var comp_verts = null;
			var tmp = null;
			var mtx0 = 1;
			var mtx1 = 0;
			var mtx2 = 0;
			var mtx3 = 1;
			var mtx4 = 0;
			var mtx5 = 0;
			var m1;
			var n3;
			flags1 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex);
			compIndex += 2;
			gidx = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex);
			compIndex += 2;
			if((flags1 & 2) != 0) {
				if((flags1 & 1) != 0) {
					mtx4 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex);
					compIndex += 2;
					mtx5 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex);
					compIndex += 2;
				} else {
					mtx4 = kha_graphics2_truetype_StbTruetype.ttCHAR(comp,compIndex);
					compIndex += 1;
					mtx5 = kha_graphics2_truetype_StbTruetype.ttCHAR(comp,compIndex);
					compIndex += 1;
				}
			} else throw new js__$Boot_HaxeError("Error");
			if((flags1 & 8) != 0) {
				mtx0 = mtx3 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex) / 16384.0;
				compIndex += 2;
				mtx1 = mtx2 = 0;
			} else if((flags1 & 64) != 0) {
				mtx0 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex) / 16384.0;
				compIndex += 2;
				mtx1 = mtx2 = 0;
				mtx3 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex) / 16384.0;
				compIndex += 2;
			} else if((flags1 & 128) != 0) {
				mtx0 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex) / 16384.0;
				compIndex += 2;
				mtx1 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex) / 16384.0;
				compIndex += 2;
				mtx2 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex) / 16384.0;
				compIndex += 2;
				mtx3 = kha_graphics2_truetype_StbTruetype.ttSHORT(comp,compIndex) / 16384.0;
				compIndex += 2;
			}
			m1 = Math.sqrt(mtx0 * mtx0 + mtx1 * mtx1);
			n3 = Math.sqrt(mtx2 * mtx2 + mtx3 * mtx3);
			comp_verts = kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphShape(info,gidx);
			if(comp_verts == null) comp_num_verts = 0; else comp_num_verts = comp_verts.length;
			if(comp_num_verts > 0) {
				var _g5 = 0;
				while(_g5 < comp_num_verts) {
					var i6 = _g5++;
					var v = comp_verts[i6];
					var x1;
					var y1;
					x1 = v.x;
					y1 = v.y;
					v.x = m1 * (mtx0 * x1 + mtx2 * y1 + mtx4) | 0;
					v.y = n3 * (mtx1 * x1 + mtx3 * y1 + mtx5) | 0;
					x1 = v.cx;
					y1 = v.cy;
					v.cx = m1 * (mtx0 * x1 + mtx2 * y1 + mtx4) | 0;
					v.cy = n3 * (mtx1 * x1 + mtx3 * y1 + mtx5) | 0;
				}
				var this2;
				this2 = new Array(num_vertices + comp_num_verts);
				tmp = this2;
				if(tmp == null) return null;
				if(num_vertices > 0) kha_graphics2_truetype_StbTruetype.copyVertices(vertices,tmp,0,num_vertices);
				kha_graphics2_truetype_StbTruetype.copyVertices(comp_verts,tmp,num_vertices,comp_num_verts);
				vertices = tmp;
				num_vertices += comp_num_verts;
			}
			more = flags1 & 32;
		}
	} else if(numberOfContours < 0) throw new js__$Boot_HaxeError("Error"); else {
	}
	if(vertices == null) return null;
	if(!(vertices.length >= num_vertices)) throw new js__$Boot_HaxeError("Error");
	if(num_vertices < vertices.length) {
		var tmp1;
		var this3;
		this3 = new Array(num_vertices);
		tmp1 = this3;
		kha_graphics2_truetype_StbTruetype.copyVertices(vertices,tmp1,0,num_vertices);
		return tmp1;
	} else return vertices;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphHMetrics = function(info,glyph_index) {
	var numOfLongHorMetrics = kha_graphics2_truetype_StbTruetype.ttUSHORT(info.data,info.hhea + 34);
	var metrics = new kha_graphics2_truetype_Stbtt_$temp_$glyph_$h_$metrics();
	if(glyph_index < numOfLongHorMetrics) {
		metrics.advanceWidth = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hmtx + 4 * glyph_index);
		metrics.leftSideBearing = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hmtx + 4 * glyph_index + 2);
	} else {
		metrics.advanceWidth = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hmtx + 4 * (numOfLongHorMetrics - 1));
		metrics.leftSideBearing = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hmtx + 4 * numOfLongHorMetrics + 2 * (glyph_index - numOfLongHorMetrics));
	}
	return metrics;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphKernAdvance = function(info,glyph1,glyph2) {
	var data = info.data.sub(info.kern,info.data.get_length() - info.kern);
	var needle;
	var straw;
	var l;
	var r;
	var m;
	if(info.kern == 0) return 0;
	if(kha_graphics2_truetype_StbTruetype.ttUSHORT(data,2) < 1) return 0;
	if(kha_graphics2_truetype_StbTruetype.ttUSHORT(data,8) != 1) return 0;
	l = 0;
	r = kha_graphics2_truetype_StbTruetype.ttUSHORT(data,10) - 1;
	needle = glyph1 << 16 | glyph2;
	while(l <= r) {
		m = l + r >> 1;
		straw = kha_graphics2_truetype_StbTruetype.ttLONG(data,18 + m * 6);
		if(needle < straw) r = m - 1; else if(needle > straw) l = m + 1; else return kha_graphics2_truetype_StbTruetype.ttSHORT(data,22 + m * 6);
	}
	return 0;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointKernAdvance = function(info,ch1,ch2) {
	if(info.kern == 0) return 0;
	return kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphKernAdvance(info,kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(info,ch1),kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(info,ch2));
};
kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointHMetrics = function(info,codepoint) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphHMetrics(info,kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(info,codepoint));
};
kha_graphics2_truetype_StbTruetype.stbtt_GetFontVMetrics = function(info) {
	var metrics = new kha_graphics2_truetype_Stbtt_$temp_$font_$v_$metrics();
	metrics.ascent = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hhea + 4);
	metrics.descent = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hhea + 6);
	metrics.lineGap = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hhea + 8);
	return metrics;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetFontBoundingBox = function(info) {
	var rect = new kha_graphics2_truetype_Stbtt_$temp_$rect();
	rect.x0 = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.head + 36);
	rect.y0 = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.head + 38);
	rect.x1 = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.head + 40);
	rect.y1 = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.head + 42);
	return rect;
};
kha_graphics2_truetype_StbTruetype.stbtt_ScaleForPixelHeight = function(info,height) {
	var fheight = kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hhea + 4) - kha_graphics2_truetype_StbTruetype.ttSHORT(info.data,info.hhea + 6);
	return height / fheight;
};
kha_graphics2_truetype_StbTruetype.stbtt_ScaleForMappingEmToPixels = function(info,pixels) {
	var unitsPerEm = kha_graphics2_truetype_StbTruetype.ttUSHORT(info.data,info.head + 18);
	return pixels / unitsPerEm;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapBoxSubpixel = function(font,glyph,scale_x,scale_y,shift_x,shift_y) {
	var rect = new kha_graphics2_truetype_Stbtt_$temp_$rect();
	if(!kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBox(font,glyph,rect)) {
		rect.x0 = 0;
		rect.y0 = 0;
		rect.x1 = 0;
		rect.y1 = 0;
	} else {
		var x0 = rect.x0;
		var x1 = rect.x1;
		var y0 = rect.y0;
		var y1 = rect.y1;
		rect.x0 = Math.floor(x0 * scale_x + shift_x);
		rect.y0 = Math.floor(-y1 * scale_y + shift_y);
		rect.x1 = Math.ceil(x1 * scale_x + shift_x);
		rect.y1 = Math.ceil(-y0 * scale_y + shift_y);
	}
	return rect;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapBox = function(font,glyph,scale_x,scale_y) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapBoxSubpixel(font,glyph,scale_x,scale_y,0.0,0.0);
};
kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointBitmapBoxSubpixel = function(font,codepoint,scale_x,scale_y,shift_x,shift_y) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapBoxSubpixel(font,kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(font,codepoint),scale_x,scale_y,shift_x,shift_y);
};
kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointBitmapBox = function(font,codepoint,scale_x,scale_y) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointBitmapBoxSubpixel(font,codepoint,scale_x,scale_y,0.0,0.0);
};
kha_graphics2_truetype_StbTruetype.stbtt__new_active = function(e,eIndex,off_x,start_point) {
	var z = new kha_graphics2_truetype_Stbtt_$_$active_$edge();
	var dxdy = (e[eIndex].x1 - e[eIndex].x0) / (e[eIndex].y1 - e[eIndex].y0);
	if(z == null) return z;
	z.fdx = dxdy;
	if(dxdy != 0.0) z.fdy = 1.0 / dxdy; else z.fdy = 0.0;
	z.fx = e[eIndex].x0 + dxdy * (start_point - e[eIndex].y0);
	z.fx -= off_x;
	if(e[eIndex].invert) z.direction = 1.0; else z.direction = -1.0;
	z.sy = e[eIndex].y0;
	z.ey = e[eIndex].y1;
	z.next = null;
	return z;
};
kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge = function(scanline,scanlineIndex,x,e,x0,y0,x1,y1) {
	if(y0 == y1) return;
	if(!(y0 < y1)) throw new js__$Boot_HaxeError("Error");
	if(!(e.sy <= e.ey)) throw new js__$Boot_HaxeError("Error");
	if(y0 > e.ey) return;
	if(y1 < e.sy) return;
	if(y0 < e.sy) {
		x0 += (x1 - x0) * (e.sy - y0) / (y1 - y0);
		y0 = e.sy;
	}
	if(y1 > e.ey) {
		x1 += (x1 - x0) * (e.ey - y1) / (y1 - y0);
		y1 = e.ey;
	}
	if(x0 == x) {
		if(!(x1 <= x + 1)) throw new js__$Boot_HaxeError("Error");
	} else if(x0 == x + 1) {
		if(!(x1 >= x)) throw new js__$Boot_HaxeError("Error");
	} else if(x0 <= x) {
		if(!(x1 <= x)) throw new js__$Boot_HaxeError("Error");
	} else if(x0 >= x + 1) {
		if(!(x1 >= x + 1)) throw new js__$Boot_HaxeError("Error");
	} else if(!(x1 >= x && x1 <= x + 1)) throw new js__$Boot_HaxeError("Error");
	if(x0 <= x && x1 <= x) {
		var _g = scanlineIndex + x;
		scanline[_g] = scanline[_g] + e.direction * (y1 - y0);
	} else if(x0 >= x + 1 && x1 >= x + 1) {
	} else {
		if(!(x0 >= x && x0 <= x + 1 && x1 >= x && x1 <= x + 1)) throw new js__$Boot_HaxeError("Error");
		var _g1 = scanlineIndex + x;
		scanline[_g1] = scanline[_g1] + e.direction * (y1 - y0) * (1 - (x0 - x + (x1 - x)) / 2);
	}
};
kha_graphics2_truetype_StbTruetype.stbtt__fill_active_edges_new = function(scanline,scanline_fill,scanline_fillIndex,len,e,y_top) {
	var y_bottom = y_top + 1;
	while(e != null) {
		if(!(e.ey >= y_top)) throw new js__$Boot_HaxeError("Error");
		if(e.fdx == 0) {
			var x0 = e.fx;
			if(x0 < len) {
				if(x0 >= 0) {
					kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x0 | 0,e,x0,y_top,x0,y_bottom);
					kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline_fill,scanline_fillIndex - 1,x0 + 1 | 0,e,x0,y_top,x0,y_bottom);
				} else kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline_fill,scanline_fillIndex - 1,0,e,x0,y_top,x0,y_bottom);
			}
		} else {
			var x01 = e.fx;
			var dx = e.fdx;
			var xb = x01 + dx;
			var x_top;
			var x_bottom;
			var sy0;
			var sy1;
			var dy = e.fdy;
			if(!(e.sy <= y_bottom && e.ey >= y_top)) throw new js__$Boot_HaxeError("Error");
			if(e.sy > y_top) {
				x_top = x01 + dx * (e.sy - y_top);
				sy0 = e.sy;
			} else {
				x_top = x01;
				sy0 = y_top;
			}
			if(e.ey < y_bottom) {
				x_bottom = x01 + dx * (e.ey - y_top);
				sy1 = e.ey;
			} else {
				x_bottom = xb;
				sy1 = y_bottom;
			}
			if(x_top >= 0 && x_bottom >= 0 && x_top < len && x_bottom < len) {
				if((x_top | 0) == (x_bottom | 0)) {
					var height;
					var x = x_top | 0;
					height = sy1 - sy0;
					if(!(x >= 0 && x < len)) throw new js__$Boot_HaxeError("Error");
					var _g = x;
					scanline[_g] = scanline[_g] + e.direction * (1 - (x_top - x + (x_bottom - x)) / 2) * height;
					var _g1 = scanline_fillIndex + x;
					scanline_fill[_g1] = scanline_fill[_g1] + e.direction * height;
				} else {
					var x1;
					var x11;
					var x2;
					var y_crossing;
					var step;
					var sign;
					var area;
					if(x_top > x_bottom) {
						var t;
						sy0 = y_bottom - (sy0 - y_top);
						sy1 = y_bottom - (sy1 - y_top);
						t = sy0;
						sy0 = sy1;
						sy1 = t;
						t = x_bottom;
						x_bottom = x_top;
						x_top = t;
						dx = -dx;
						dy = -dy;
						t = x01;
						x01 = xb;
						xb = t;
					}
					x11 = x_top | 0;
					x2 = x_bottom | 0;
					y_crossing = (x11 + 1 - x01) * dy + y_top;
					sign = e.direction;
					area = sign * (y_crossing - sy0);
					var _g2 = x11;
					scanline[_g2] = scanline[_g2] + area * (1 - (x_top - x11 + (x11 + 1 - x11)) / 2);
					step = sign * dy;
					var _g3 = x11 + 1;
					while(_g3 < x2) {
						var x3 = _g3++;
						var _g11 = x3;
						scanline[_g11] = scanline[_g11] + (area + step / 2);
						area += step;
					}
					y_crossing += dy * (x2 - (x11 + 1));
					kha_graphics2_truetype_StbTruetype.STBTT_assert(Math.abs(area) <= 1.01);
					var _g4 = x2;
					scanline[_g4] = scanline[_g4] + (area + sign * (1 - (x2 - x2 + (x_bottom - x2)) / 2) * (sy1 - y_crossing));
					var _g5 = scanline_fillIndex + x2;
					scanline_fill[_g5] = scanline_fill[_g5] + sign * (sy1 - sy0);
				}
			} else {
				var _g6 = 0;
				while(_g6 < len) {
					var x4 = _g6++;
					var y0 = y_top;
					var x12 = x4;
					var x21 = x4 + 1;
					var x31 = xb;
					var y3 = y_bottom;
					var y1;
					var y2;
					y1 = (x4 - x01) / dx + y_top;
					y2 = (x4 + 1 - x01) / dx + y_top;
					if(x01 < x12 && x31 > x21) {
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x01,y0,x12,y1);
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x12,y1,x21,y2);
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x21,y2,x31,y3);
					} else if(x31 < x12 && x01 > x21) {
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x01,y0,x21,y2);
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x21,y2,x12,y1);
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x12,y1,x31,y3);
					} else if(x01 < x12 && x31 > x12) {
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x01,y0,x12,y1);
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x12,y1,x31,y3);
					} else if(x31 < x12 && x01 > x12) {
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x01,y0,x12,y1);
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x12,y1,x31,y3);
					} else if(x01 < x21 && x31 > x21) {
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x01,y0,x21,y2);
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x21,y2,x31,y3);
					} else if(x31 < x21 && x01 > x21) {
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x01,y0,x21,y2);
						kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x21,y2,x31,y3);
					} else kha_graphics2_truetype_StbTruetype.stbtt__handle_clipped_edge(scanline,0,x4,e,x01,y0,x31,y3);
				}
			}
		}
		e = e.next;
	}
};
kha_graphics2_truetype_StbTruetype.stbtt__rasterize_sorted_edges = function(result,e,n,vsubsample,off_x,off_y) {
	var active = null;
	var y;
	var j = 0;
	var i;
	var scanline;
	var scanline2;
	var scanline2Index = 0;
	var eIndex = 0;
	if(result.w > 64) {
		var this1;
		this1 = new Array(result.w * 2 + 1);
		scanline = this1;
	} else {
		var this2;
		this2 = new Array(129);
		scanline = this2;
	}
	scanline2 = scanline;
	scanline2Index = result.w;
	y = off_y;
	e[eIndex + n].y0 = off_y + result.h + 1;
	while(j < result.h) {
		var scan_y_top = y + 0.0;
		var scan_y_bottom = y + 1.0;
		var step_value = active;
		var step_parent = null;
		var _g1 = 0;
		var _g = result.w;
		while(_g1 < _g) {
			var i1 = _g1++;
			scanline[i1] = 0;
		}
		var _g11 = 0;
		var _g2 = result.w + 1;
		while(_g11 < _g2) {
			var i2 = _g11++;
			scanline2[scanline2Index + i2] = 0;
		}
		while(step_value != null) {
			var z = step_value;
			if(z.ey <= scan_y_top) {
				if(step_parent == null) {
					active = z.next;
					step_value = z.next;
				} else {
					step_parent.next = z.next;
					step_value = z.next;
				}
				if(!(z.direction != 0)) throw new js__$Boot_HaxeError("Error");
				z.direction = 0;
			} else {
				step_parent = step_value;
				step_value = step_value.next;
			}
		}
		while(e[eIndex].y0 <= scan_y_bottom) {
			if(e[eIndex].y0 != e[eIndex].y1) {
				var z1 = kha_graphics2_truetype_StbTruetype.stbtt__new_active(e,eIndex,off_x,scan_y_top);
				if(!(z1.ey >= scan_y_top)) throw new js__$Boot_HaxeError("Error");
				z1.next = active;
				active = z1;
			}
			++eIndex;
		}
		if(active != null) kha_graphics2_truetype_StbTruetype.stbtt__fill_active_edges_new(scanline,scanline2,scanline2Index + 1,result.w,active,scan_y_top);
		var sum = 0;
		var _g12 = 0;
		var _g3 = result.w;
		while(_g12 < _g3) {
			var i3 = _g12++;
			var k;
			var m;
			sum += scanline2[scanline2Index + i3];
			k = scanline[i3] + sum;
			k = Math.abs(k) * 255.0 + 0.5;
			m = k | 0;
			if(m > 255) m = 255;
			result.pixels.writeU8(result.pixels_offset + j * result.stride + i3,m);
		}
		step_parent = null;
		step_value = active;
		while(step_value != null) {
			var z2 = step_value;
			z2.fx += z2.fdx;
			step_parent = step_value;
			step_value = step_value.next;
		}
		++y;
		++j;
	}
};
kha_graphics2_truetype_StbTruetype.STBTT__COMPARE = function(a,b) {
	return a.y0 < b.y0;
};
kha_graphics2_truetype_StbTruetype.stbtt__sort_edges_ins_sort = function(p,n) {
	var i;
	var j;
	var _g = 1;
	while(_g < n) {
		var i1 = _g++;
		var t = p[i1];
		var a = t;
		j = i1;
		while(j > 0) {
			var b = p[j - 1];
			var c = kha_graphics2_truetype_StbTruetype.STBTT__COMPARE(a,b);
			if(!c) break;
			p[j] = p[j - 1];
			--j;
		}
		if(i1 != j) p[j] = t;
	}
};
kha_graphics2_truetype_StbTruetype.stbtt__sort_edges_quicksort = function(p,pIndex,n) {
	while(n > 12) {
		var t;
		var c01;
		var c12;
		var c;
		var m;
		var i;
		var j;
		m = n >> 1;
		c01 = kha_graphics2_truetype_StbTruetype.STBTT__COMPARE(p[pIndex],p[pIndex + m]);
		c12 = kha_graphics2_truetype_StbTruetype.STBTT__COMPARE(p[pIndex + m],p[pIndex + n - 1]);
		if(c01 != c12) {
			var z;
			c = kha_graphics2_truetype_StbTruetype.STBTT__COMPARE(p[pIndex],p[pIndex + n - 1]);
			if(c == c12) z = 0; else z = n - 1;
			t = p[pIndex + z];
			p[pIndex + z] = p[pIndex + m];
			p[pIndex + m] = t;
		}
		t = p[pIndex];
		p[pIndex] = p[pIndex + m];
		p[pIndex + m] = t;
		i = 1;
		j = n - 1;
		while(true) {
			while(true) {
				if(!kha_graphics2_truetype_StbTruetype.STBTT__COMPARE(p[pIndex + i],p[pIndex])) break;
				++i;
			}
			while(true) {
				if(!kha_graphics2_truetype_StbTruetype.STBTT__COMPARE(p[pIndex],p[pIndex + j])) break;
				--j;
			}
			if(i >= j) break;
			t = p[pIndex + i];
			p[pIndex + i] = p[pIndex + j];
			p[pIndex + j] = t;
			++i;
			--j;
		}
		if(j < n - i) {
			kha_graphics2_truetype_StbTruetype.stbtt__sort_edges_quicksort(p,pIndex,j);
			pIndex += i;
			n = n - i;
		} else {
			kha_graphics2_truetype_StbTruetype.stbtt__sort_edges_quicksort(p,pIndex + i,n - i);
			n = j;
		}
	}
};
kha_graphics2_truetype_StbTruetype.stbtt__sort_edges = function(p,n) {
	kha_graphics2_truetype_StbTruetype.stbtt__sort_edges_quicksort(p,0,n);
	kha_graphics2_truetype_StbTruetype.stbtt__sort_edges_ins_sort(p,n);
};
kha_graphics2_truetype_StbTruetype.stbtt__rasterize = function(result,pts,wcount,windings,scale_x,scale_y,shift_x,shift_y,off_x,off_y,invert) {
	var y_scale_inv;
	if(invert) y_scale_inv = -scale_y; else y_scale_inv = scale_y;
	var e;
	var n;
	var i;
	var j;
	var k;
	var m;
	var vsubsample = 1;
	var ptsIndex = 0;
	n = 0;
	var _g = 0;
	while(_g < windings) {
		var i1 = _g++;
		n += wcount[i1];
	}
	var this1;
	this1 = new Array(n + 1);
	e = this1;
	if(e == null) return; else {
		var _g1 = 0;
		var _g2 = e.length;
		while(_g1 < _g2) {
			var i2 = _g1++;
			var val = new kha_graphics2_truetype_Stbtt_$_$edge();
			e[i2] = val;
		}
	}
	n = 0;
	m = 0;
	var _g3 = 0;
	while(_g3 < windings) {
		var i3 = _g3++;
		var p = pts;
		var pIndex = ptsIndex + m;
		m += wcount[i3];
		j = wcount[i3] - 1;
		var _g21 = 0;
		var _g11 = wcount[i3];
		while(_g21 < _g11) {
			var k1 = _g21++;
			var a = k1;
			var b = j;
			if(p[pIndex + j].y == p[pIndex + k1].y) {
				j = k1;
				continue;
			}
			e[n].invert = false;
			if(invert?p[pIndex + j].y > p[pIndex + k1].y:p[pIndex + j].y < p[pIndex + k1].y) {
				e[n].invert = true;
				a = j;
				b = k1;
			}
			e[n].x0 = p[pIndex + a].x * scale_x + shift_x;
			e[n].y0 = (p[pIndex + a].y * y_scale_inv + shift_y) * vsubsample;
			e[n].x1 = p[pIndex + b].x * scale_x + shift_x;
			e[n].y1 = (p[pIndex + b].y * y_scale_inv + shift_y) * vsubsample;
			++n;
			j = k1;
		}
	}
	kha_graphics2_truetype_StbTruetype.stbtt__sort_edges(e,n);
	kha_graphics2_truetype_StbTruetype.stbtt__rasterize_sorted_edges(result,e,n,vsubsample,off_x,off_y);
};
kha_graphics2_truetype_StbTruetype.stbtt__add_point = function(points,n,x,y) {
	if(points == null) return;
	points[n].x = x;
	points[n].y = y;
};
kha_graphics2_truetype_StbTruetype.stbtt__tesselate_curve = function(points,num_points,x0,y0,x1,y1,x2,y2,objspace_flatness_squared,n) {
	var mx = (x0 + 2 * x1 + x2) / 4;
	var my = (y0 + 2 * y1 + y2) / 4;
	var dx = (x0 + x2) / 2 - mx;
	var dy = (y0 + y2) / 2 - my;
	if(n > 16) return 1;
	if(dx * dx + dy * dy > objspace_flatness_squared) {
		kha_graphics2_truetype_StbTruetype.stbtt__tesselate_curve(points,num_points,x0,y0,(x0 + x1) / 2.0,(y0 + y1) / 2.0,mx,my,objspace_flatness_squared,n + 1);
		kha_graphics2_truetype_StbTruetype.stbtt__tesselate_curve(points,num_points,mx,my,(x1 + x2) / 2.0,(y1 + y2) / 2.0,x2,y2,objspace_flatness_squared,n + 1);
	} else {
		kha_graphics2_truetype_StbTruetype.stbtt__add_point(points,num_points.value,x2,y2);
		num_points.value = num_points.value + 1;
	}
	return 1;
};
kha_graphics2_truetype_StbTruetype.stbtt_FlattenCurves = function(vertices,num_verts,objspace_flatness,contour_lengths,num_contours) {
	var points = null;
	var num_points = 0;
	var objspace_flatness_squared = objspace_flatness * objspace_flatness;
	var i;
	var n = 0;
	var start = 0;
	var pass;
	var _g = 0;
	while(_g < num_verts) {
		var i1 = _g++;
		if(vertices[i1].type == 1) ++n;
	}
	num_contours.value = n;
	if(n == 0) return null;
	var this1;
	this1 = new Array(n);
	contour_lengths.value = this1;
	if(contour_lengths.value == null) {
		num_contours.value = 0;
		return null;
	}
	var _g1 = 0;
	while(_g1 < 2) {
		var pass1 = _g1++;
		var x = 0;
		var y = 0;
		if(pass1 == 1) {
			var this2;
			this2 = new Array(num_points);
			points = this2;
			if(points == null) {
				contour_lengths.value = null;
				num_contours.value = 0;
				return null;
			} else {
				var _g2 = 0;
				var _g11 = points.length;
				while(_g2 < _g11) {
					var i2 = _g2++;
					var val = new kha_graphics2_truetype_Stbtt_$_$point();
					points[i2] = val;
				}
			}
		}
		num_points = 0;
		n = -1;
		var _g12 = 0;
		while(_g12 < num_verts) {
			var i3 = _g12++;
			var _g21 = vertices[i3].type;
			switch(_g21) {
			case 1:
				if(n >= 0) contour_lengths.value[n] = num_points - start;
				++n;
				start = num_points;
				x = vertices[i3].x;
				y = vertices[i3].y;
				kha_graphics2_truetype_StbTruetype.stbtt__add_point(points,num_points++,x,y);
				break;
			case 2:
				x = vertices[i3].x;
				y = vertices[i3].y;
				kha_graphics2_truetype_StbTruetype.stbtt__add_point(points,num_points++,x,y);
				break;
			case 3:
				var num_points_reference = { value : num_points};
				kha_graphics2_truetype_StbTruetype.stbtt__tesselate_curve(points,num_points_reference,x,y,vertices[i3].cx,vertices[i3].cy,vertices[i3].x,vertices[i3].y,objspace_flatness_squared,0);
				num_points = num_points_reference.value;
				x = vertices[i3].x;
				y = vertices[i3].y;
				break;
			}
		}
		contour_lengths.value[n] = num_points - start;
	}
	return points;
};
kha_graphics2_truetype_StbTruetype.stbtt_Rasterize = function(result,flatness_in_pixels,vertices,num_verts,scale_x,scale_y,shift_x,shift_y,x_off,y_off,invert) {
	var scale;
	if(scale_x > scale_y) scale = scale_y; else scale = scale_x;
	var winding_count = 0;
	var winding_lengths = null;
	var winding_count_reference = { value : winding_count};
	var winding_lengths_reference = { value : winding_lengths};
	var windings = kha_graphics2_truetype_StbTruetype.stbtt_FlattenCurves(vertices,num_verts,flatness_in_pixels / scale,winding_lengths_reference,winding_count_reference);
	winding_count = winding_count_reference.value;
	winding_lengths = winding_lengths_reference.value;
	if(windings != null) kha_graphics2_truetype_StbTruetype.stbtt__rasterize(result,windings,winding_lengths,winding_count,scale_x,scale_y,shift_x,shift_y,x_off,y_off,invert);
};
kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapSubpixel = function(info,scale_x,scale_y,shift_x,shift_y,glyph,region) {
	var ix0;
	var iy0;
	var ix1;
	var iy1;
	var gbm = new kha_graphics2_truetype_Stbtt_$_$bitmap();
	var vertices = kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphShape(info,glyph);
	var num_verts = vertices.length;
	if(scale_x == 0) scale_x = scale_y;
	if(scale_y == 0) {
		if(scale_x == 0) return null;
		scale_y = scale_x;
	}
	var rect = kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapBoxSubpixel(info,glyph,scale_x,scale_y,shift_x,shift_y);
	ix0 = rect.x0;
	iy0 = rect.y0;
	ix1 = rect.x1;
	iy1 = rect.y1;
	gbm.w = ix1 - ix0;
	gbm.h = iy1 - iy0;
	gbm.pixels = null;
	region.width = gbm.w;
	region.height = gbm.h;
	region.xoff = ix0;
	region.yoff = iy0;
	if(gbm.w != 0 && gbm.h != 0) {
		gbm.pixels = kha_internal_BytesBlob.alloc(gbm.w * gbm.h);
		if(gbm.pixels != null) {
			gbm.stride = gbm.w;
			kha_graphics2_truetype_StbTruetype.stbtt_Rasterize(gbm,0.35,vertices,num_verts,scale_x,scale_y,shift_x,shift_y,ix0,iy0,true);
		}
	}
	return gbm.pixels;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmap = function(info,scale_x,scale_y,glyph,region) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapSubpixel(info,scale_x,scale_y,0.0,0.0,glyph,region);
};
kha_graphics2_truetype_StbTruetype.stbtt_MakeGlyphBitmapSubpixel = function(info,output,output_offset,out_w,out_h,out_stride,scale_x,scale_y,shift_x,shift_y,glyph) {
	var ix0 = 0;
	var iy0 = 0;
	var vertices = kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphShape(info,glyph);
	var num_verts;
	if(vertices == null) num_verts = 0; else num_verts = vertices.length;
	var gbm = new kha_graphics2_truetype_Stbtt_$_$bitmap();
	var rect = kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapBoxSubpixel(info,glyph,scale_x,scale_y,shift_x,shift_y);
	ix0 = rect.x0;
	iy0 = rect.y0;
	gbm.pixels = output;
	gbm.pixels_offset = output_offset;
	gbm.w = out_w;
	gbm.h = out_h;
	gbm.stride = out_stride;
	if(gbm.w != 0 && gbm.h != 0) kha_graphics2_truetype_StbTruetype.stbtt_Rasterize(gbm,0.35,vertices,num_verts,scale_x,scale_y,shift_x,shift_y,ix0,iy0,true);
};
kha_graphics2_truetype_StbTruetype.stbtt_MakeGlyphBitmap = function(info,output,output_offset,out_w,out_h,out_stride,scale_x,scale_y,glyph) {
	kha_graphics2_truetype_StbTruetype.stbtt_MakeGlyphBitmapSubpixel(info,output,output_offset,out_w,out_h,out_stride,scale_x,scale_y,0.0,0.0,glyph);
};
kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointBitmapSubpixel = function(info,scale_x,scale_y,shift_x,shift_y,codepoint,region) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapSubpixel(info,scale_x,scale_y,shift_x,shift_y,kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(info,codepoint),region);
};
kha_graphics2_truetype_StbTruetype.stbtt_MakeCodepointBitmapSubpixel = function(info,output,output_offset,out_w,out_h,out_stride,scale_x,scale_y,shift_x,shift_y,codepoint) {
	kha_graphics2_truetype_StbTruetype.stbtt_MakeGlyphBitmapSubpixel(info,output,output_offset,out_w,out_h,out_stride,scale_x,scale_y,shift_x,shift_y,kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(info,codepoint));
};
kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointBitmap = function(info,scale_x,scale_y,codepoint,region) {
	return kha_graphics2_truetype_StbTruetype.stbtt_GetCodepointBitmapSubpixel(info,scale_x,scale_y,0.0,0.0,codepoint,region);
};
kha_graphics2_truetype_StbTruetype.stbtt_MakeCodepointBitmap = function(info,output,output_offset,out_w,out_h,out_stride,scale_x,scale_y,codepoint) {
	kha_graphics2_truetype_StbTruetype.stbtt_MakeCodepointBitmapSubpixel(info,output,output_offset,out_w,out_h,out_stride,scale_x,scale_y,0.0,0.0,codepoint);
};
kha_graphics2_truetype_StbTruetype.stbtt_BakeFontBitmap = function(data,offset,pixel_height,pixels,pw,ph,first_char,num_chars,chardata) {
	var scale;
	var x;
	var y;
	var bottom_y;
	var f = new kha_graphics2_truetype_Stbtt_$fontinfo();
	if(!kha_graphics2_truetype_StbTruetype.stbtt_InitFont(f,data,offset)) return -1;
	var _g1 = 0;
	var _g = pw * ph;
	while(_g1 < _g) {
		var i = _g1++;
		pixels.writeU8(i,0);
	}
	x = y = 1;
	bottom_y = 1;
	scale = kha_graphics2_truetype_StbTruetype.stbtt_ScaleForPixelHeight(f,pixel_height);
	var _g2 = 0;
	while(_g2 < num_chars) {
		var i1 = _g2++;
		var advance;
		var lsb;
		var x0;
		var y0;
		var x1;
		var y1;
		var gw;
		var gh;
		var g = kha_graphics2_truetype_StbTruetype.stbtt_FindGlyphIndex(f,first_char + i1);
		var metrics = kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphHMetrics(f,g);
		advance = metrics.advanceWidth;
		lsb = metrics.leftSideBearing;
		var rect = kha_graphics2_truetype_StbTruetype.stbtt_GetGlyphBitmapBox(f,g,scale,scale);
		x0 = rect.x0;
		y0 = rect.y0;
		x1 = rect.x1;
		y1 = rect.y1;
		gw = x1 - x0;
		gh = y1 - y0;
		if(x + gw + 1 >= pw) {
			y = bottom_y;
			x = 1;
		}
		if(y + gh + 1 >= ph) return -i1;
		if(!(x + gw < pw)) throw new js__$Boot_HaxeError("Error");
		if(!(y + gh < ph)) throw new js__$Boot_HaxeError("Error");
		kha_graphics2_truetype_StbTruetype.stbtt_MakeGlyphBitmap(f,pixels,x + y * pw,gw,gh,pw,scale,scale,g);
		chardata[i1].x0 = x;
		chardata[i1].y0 = y;
		chardata[i1].x1 = x + gw;
		chardata[i1].y1 = y + gh;
		chardata[i1].xadvance = scale * advance;
		chardata[i1].xoff = x0;
		chardata[i1].yoff = y0;
		x = x + gw + 1;
		if(y + gh + 1 > bottom_y) bottom_y = y + gh + 1;
	}
	return bottom_y;
};
kha_graphics2_truetype_StbTruetype.stbtt_GetBakedQuad = function(chardata,pw,ph,char_index,xpos,ypos,q,opengl_fillrule) {
	var d3d_bias;
	if(opengl_fillrule) d3d_bias = 0; else d3d_bias = -0.5;
	var ipw = 1.0 / pw;
	var iph = 1.0 / ph;
	var b = chardata[char_index];
	var round_x = Math.floor(xpos.value + b.xoff + 0.5);
	var round_y = Math.floor(ypos.value + b.yoff + 0.5);
	q.x0 = round_x + d3d_bias;
	q.y0 = round_y + d3d_bias;
	q.x1 = round_x + b.x1 - b.x0 + d3d_bias;
	q.y1 = round_y + b.y1 - b.y0 + d3d_bias;
	q.s0 = b.x0 * ipw;
	q.t0 = b.y0 * iph;
	q.s1 = b.x1 * ipw;
	q.t1 = b.y1 * iph;
	xpos.value += b.xadvance;
};
var kha_graphics4_BlendingOperation = $hxClasses["kha.graphics4.BlendingOperation"] = { __ename__ : true, __constructs__ : ["Undefined","BlendOne","BlendZero","SourceAlpha","DestinationAlpha","InverseSourceAlpha","InverseDestinationAlpha"] };
kha_graphics4_BlendingOperation.Undefined = ["Undefined",0];
kha_graphics4_BlendingOperation.Undefined.toString = $estr;
kha_graphics4_BlendingOperation.Undefined.__enum__ = kha_graphics4_BlendingOperation;
kha_graphics4_BlendingOperation.BlendOne = ["BlendOne",1];
kha_graphics4_BlendingOperation.BlendOne.toString = $estr;
kha_graphics4_BlendingOperation.BlendOne.__enum__ = kha_graphics4_BlendingOperation;
kha_graphics4_BlendingOperation.BlendZero = ["BlendZero",2];
kha_graphics4_BlendingOperation.BlendZero.toString = $estr;
kha_graphics4_BlendingOperation.BlendZero.__enum__ = kha_graphics4_BlendingOperation;
kha_graphics4_BlendingOperation.SourceAlpha = ["SourceAlpha",3];
kha_graphics4_BlendingOperation.SourceAlpha.toString = $estr;
kha_graphics4_BlendingOperation.SourceAlpha.__enum__ = kha_graphics4_BlendingOperation;
kha_graphics4_BlendingOperation.DestinationAlpha = ["DestinationAlpha",4];
kha_graphics4_BlendingOperation.DestinationAlpha.toString = $estr;
kha_graphics4_BlendingOperation.DestinationAlpha.__enum__ = kha_graphics4_BlendingOperation;
kha_graphics4_BlendingOperation.InverseSourceAlpha = ["InverseSourceAlpha",5];
kha_graphics4_BlendingOperation.InverseSourceAlpha.toString = $estr;
kha_graphics4_BlendingOperation.InverseSourceAlpha.__enum__ = kha_graphics4_BlendingOperation;
kha_graphics4_BlendingOperation.InverseDestinationAlpha = ["InverseDestinationAlpha",6];
kha_graphics4_BlendingOperation.InverseDestinationAlpha.toString = $estr;
kha_graphics4_BlendingOperation.InverseDestinationAlpha.__enum__ = kha_graphics4_BlendingOperation;
var kha_graphics4_CompareMode = $hxClasses["kha.graphics4.CompareMode"] = { __ename__ : true, __constructs__ : ["Always","Never","Equal","NotEqual","Less","LessEqual","Greater","GreaterEqual"] };
kha_graphics4_CompareMode.Always = ["Always",0];
kha_graphics4_CompareMode.Always.toString = $estr;
kha_graphics4_CompareMode.Always.__enum__ = kha_graphics4_CompareMode;
kha_graphics4_CompareMode.Never = ["Never",1];
kha_graphics4_CompareMode.Never.toString = $estr;
kha_graphics4_CompareMode.Never.__enum__ = kha_graphics4_CompareMode;
kha_graphics4_CompareMode.Equal = ["Equal",2];
kha_graphics4_CompareMode.Equal.toString = $estr;
kha_graphics4_CompareMode.Equal.__enum__ = kha_graphics4_CompareMode;
kha_graphics4_CompareMode.NotEqual = ["NotEqual",3];
kha_graphics4_CompareMode.NotEqual.toString = $estr;
kha_graphics4_CompareMode.NotEqual.__enum__ = kha_graphics4_CompareMode;
kha_graphics4_CompareMode.Less = ["Less",4];
kha_graphics4_CompareMode.Less.toString = $estr;
kha_graphics4_CompareMode.Less.__enum__ = kha_graphics4_CompareMode;
kha_graphics4_CompareMode.LessEqual = ["LessEqual",5];
kha_graphics4_CompareMode.LessEqual.toString = $estr;
kha_graphics4_CompareMode.LessEqual.__enum__ = kha_graphics4_CompareMode;
kha_graphics4_CompareMode.Greater = ["Greater",6];
kha_graphics4_CompareMode.Greater.toString = $estr;
kha_graphics4_CompareMode.Greater.__enum__ = kha_graphics4_CompareMode;
kha_graphics4_CompareMode.GreaterEqual = ["GreaterEqual",7];
kha_graphics4_CompareMode.GreaterEqual.toString = $estr;
kha_graphics4_CompareMode.GreaterEqual.__enum__ = kha_graphics4_CompareMode;
var kha_graphics4_ConstantLocation = function() { };
$hxClasses["kha.graphics4.ConstantLocation"] = kha_graphics4_ConstantLocation;
kha_graphics4_ConstantLocation.__name__ = true;
var kha_graphics4_CubeMap = function() { };
$hxClasses["kha.graphics4.CubeMap"] = kha_graphics4_CubeMap;
kha_graphics4_CubeMap.__name__ = true;
kha_graphics4_CubeMap.prototype = {
	get_size: null
	,size: null
	,lock: null
	,unlock: null
	,__class__: kha_graphics4_CubeMap
};
var kha_graphics4_CullMode = $hxClasses["kha.graphics4.CullMode"] = { __ename__ : true, __constructs__ : ["Clockwise","CounterClockwise","None"] };
kha_graphics4_CullMode.Clockwise = ["Clockwise",0];
kha_graphics4_CullMode.Clockwise.toString = $estr;
kha_graphics4_CullMode.Clockwise.__enum__ = kha_graphics4_CullMode;
kha_graphics4_CullMode.CounterClockwise = ["CounterClockwise",1];
kha_graphics4_CullMode.CounterClockwise.toString = $estr;
kha_graphics4_CullMode.CounterClockwise.__enum__ = kha_graphics4_CullMode;
kha_graphics4_CullMode.None = ["None",2];
kha_graphics4_CullMode.None.toString = $estr;
kha_graphics4_CullMode.None.__enum__ = kha_graphics4_CullMode;
var kha_graphics4_FragmentShader = function(source) {
	this.source = source.toString();
	this.type = 35632;
	this.shader = null;
};
$hxClasses["kha.graphics4.FragmentShader"] = kha_graphics4_FragmentShader;
kha_graphics4_FragmentShader.__name__ = true;
kha_graphics4_FragmentShader.prototype = {
	source: null
	,type: null
	,shader: null
	,__class__: kha_graphics4_FragmentShader
};
var kha_graphics4_Graphics = function() { };
$hxClasses["kha.graphics4.Graphics"] = kha_graphics4_Graphics;
kha_graphics4_Graphics.__name__ = true;
kha_graphics4_Graphics.prototype = {
	begin: null
	,end: null
	,vsynced: null
	,refreshRate: null
	,clear: null
	,viewport: null
	,scissor: null
	,disableScissor: null
	,setVertexBuffer: null
	,setVertexBuffers: null
	,setIndexBuffer: null
	,setTexture: null
	,setVideoTexture: null
	,setTextureParameters: null
	,createCubeMap: null
	,renderTargetsInvertedY: null
	,instancedRenderingAvailable: null
	,setPipeline: null
	,setBool: null
	,setInt: null
	,setFloat: null
	,setFloat2: null
	,setFloat3: null
	,setFloat4: null
	,setFloats: null
	,setVector2: null
	,setVector3: null
	,setVector4: null
	,setMatrix: null
	,drawIndexedVertices: null
	,drawIndexedVerticesInstanced: null
	,flush: null
	,__class__: kha_graphics4_Graphics
};
var kha_graphics4_ImageShaderPainter = function(g4) {
	this.destinationBlend = kha_graphics4_BlendingOperation.Undefined;
	this.sourceBlend = kha_graphics4_BlendingOperation.Undefined;
	this.myPipeline = null;
	this.bilinear = false;
	this.g = g4;
	this.bufferIndex = 0;
	this.initShaders();
	this.initBuffers();
	this.projectionLocation = this.shaderPipeline.getConstantLocation("projectionMatrix");
	this.textureLocation = this.shaderPipeline.getTextureUnit("tex");
};
$hxClasses["kha.graphics4.ImageShaderPainter"] = kha_graphics4_ImageShaderPainter;
kha_graphics4_ImageShaderPainter.__name__ = true;
kha_graphics4_ImageShaderPainter.prototype = {
	projectionMatrix: null
	,shaderPipeline: null
	,structure: null
	,projectionLocation: null
	,textureLocation: null
	,bufferIndex: null
	,rectVertexBuffer: null
	,rectVertices: null
	,indexBuffer: null
	,lastTexture: null
	,bilinear: null
	,g: null
	,myPipeline: null
	,sourceBlend: null
	,destinationBlend: null
	,get_pipeline: function() {
		return this.myPipeline;
	}
	,set_pipeline: function(pipe) {
		if(pipe == null) {
			this.projectionLocation = this.shaderPipeline.getConstantLocation("projectionMatrix");
			this.textureLocation = this.shaderPipeline.getTextureUnit("tex");
		} else {
			this.projectionLocation = pipe.getConstantLocation("projectionMatrix");
			this.textureLocation = pipe.getTextureUnit("tex");
		}
		return this.myPipeline = pipe;
	}
	,setProjection: function(projectionMatrix) {
		this.projectionMatrix = projectionMatrix;
	}
	,initShaders: function() {
		this.shaderPipeline = new kha_graphics4_PipelineState();
		this.shaderPipeline.fragmentShader = kha_Shaders.painter_image_frag;
		this.shaderPipeline.vertexShader = kha_Shaders.painter_image_vert;
		this.structure = new kha_graphics4_VertexStructure();
		this.structure.add("vertexPosition",kha_graphics4_VertexData.Float3);
		this.structure.add("texPosition",kha_graphics4_VertexData.Float2);
		this.structure.add("vertexColor",kha_graphics4_VertexData.Float4);
		this.shaderPipeline.inputLayout = [this.structure];
		this.shaderPipeline.blendSource = kha_graphics4_BlendingOperation.BlendOne;
		this.shaderPipeline.blendDestination = kha_graphics4_BlendingOperation.InverseSourceAlpha;
		this.shaderPipeline.compile();
	}
	,initBuffers: function() {
		this.rectVertexBuffer = new kha_graphics4_VertexBuffer(kha_graphics4_ImageShaderPainter.bufferSize * 4,this.structure,kha_graphics4_Usage.DynamicUsage);
		this.rectVertices = this.rectVertexBuffer.lock();
		this.indexBuffer = new kha_graphics4_IndexBuffer(kha_graphics4_ImageShaderPainter.bufferSize * 3 * 2,kha_graphics4_Usage.StaticUsage);
		var indices = this.indexBuffer.lock();
		var _g1 = 0;
		var _g = kha_graphics4_ImageShaderPainter.bufferSize;
		while(_g1 < _g) {
			var i = _g1++;
			indices[i * 3 * 2] = i * 4;
			indices[i * 3 * 2 + 1] = i * 4 + 1;
			indices[i * 3 * 2 + 2] = i * 4 + 2;
			indices[i * 3 * 2 + 3] = i * 4;
			indices[i * 3 * 2 + 4] = i * 4 + 2;
			indices[i * 3 * 2 + 5] = i * 4 + 3;
		}
		this.indexBuffer.unlock();
	}
	,setRectVertices: function(bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty) {
		var baseIndex = this.bufferIndex * kha_graphics4_ImageShaderPainter.vertexSize * 4;
		this.rectVertices[baseIndex] = bottomleftx;
		this.rectVertices[baseIndex + 1] = bottomlefty;
		this.rectVertices[baseIndex + 2] = -5.0;
		this.rectVertices[baseIndex + 9] = topleftx;
		this.rectVertices[baseIndex + 10] = toplefty;
		this.rectVertices[baseIndex + 11] = -5.0;
		this.rectVertices[baseIndex + 18] = toprightx;
		this.rectVertices[baseIndex + 19] = toprighty;
		this.rectVertices[baseIndex + 20] = -5.0;
		this.rectVertices[baseIndex + 27] = bottomrightx;
		this.rectVertices[baseIndex + 28] = bottomrighty;
		this.rectVertices[baseIndex + 29] = -5.0;
	}
	,setRectTexCoords: function(left,top,right,bottom) {
		var baseIndex = this.bufferIndex * kha_graphics4_ImageShaderPainter.vertexSize * 4;
		this.rectVertices[baseIndex + 3] = left;
		this.rectVertices[baseIndex + 4] = bottom;
		this.rectVertices[baseIndex + 12] = left;
		this.rectVertices[baseIndex + 13] = top;
		this.rectVertices[baseIndex + 21] = right;
		this.rectVertices[baseIndex + 22] = top;
		this.rectVertices[baseIndex + 30] = right;
		this.rectVertices[baseIndex + 31] = bottom;
	}
	,setRectColor: function(r,g,b,a) {
		var baseIndex = this.bufferIndex * kha_graphics4_ImageShaderPainter.vertexSize * 4;
		this.rectVertices[baseIndex + 5] = r;
		this.rectVertices[baseIndex + 6] = g;
		this.rectVertices[baseIndex + 7] = b;
		this.rectVertices[baseIndex + 8] = a;
		this.rectVertices[baseIndex + 14] = r;
		this.rectVertices[baseIndex + 15] = g;
		this.rectVertices[baseIndex + 16] = b;
		this.rectVertices[baseIndex + 17] = a;
		this.rectVertices[baseIndex + 23] = r;
		this.rectVertices[baseIndex + 24] = g;
		this.rectVertices[baseIndex + 25] = b;
		this.rectVertices[baseIndex + 26] = a;
		this.rectVertices[baseIndex + 32] = r;
		this.rectVertices[baseIndex + 33] = g;
		this.rectVertices[baseIndex + 34] = b;
		this.rectVertices[baseIndex + 35] = a;
	}
	,drawBuffer: function() {
		this.rectVertexBuffer.unlock();
		this.g.setVertexBuffer(this.rectVertexBuffer);
		this.g.setIndexBuffer(this.indexBuffer);
		this.g.setPipeline(this.get_pipeline() == null?this.shaderPipeline:this.get_pipeline());
		this.g.setTexture(this.textureLocation,this.lastTexture);
		this.g.setTextureParameters(this.textureLocation,kha_graphics4_TextureAddressing.Clamp,kha_graphics4_TextureAddressing.Clamp,this.bilinear?kha_graphics4_TextureFilter.LinearFilter:kha_graphics4_TextureFilter.PointFilter,this.bilinear?kha_graphics4_TextureFilter.LinearFilter:kha_graphics4_TextureFilter.PointFilter,kha_graphics4_MipMapFilter.NoMipFilter);
		this.g.setMatrix(this.projectionLocation,this.projectionMatrix);
		this.g.drawIndexedVertices(0,this.bufferIndex * 2 * 3);
		this.g.setTexture(this.textureLocation,null);
		this.bufferIndex = 0;
		this.rectVertices = this.rectVertexBuffer.lock();
	}
	,setBilinearFilter: function(bilinear) {
		this.end();
		this.bilinear = bilinear;
	}
	,drawImage: function(img,bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty,opacity,color) {
		var tex = img;
		if(this.bufferIndex + 1 >= kha_graphics4_ImageShaderPainter.bufferSize || this.lastTexture != null && tex != this.lastTexture) this.drawBuffer();
		this.setRectColor(kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098 * opacity);
		this.setRectTexCoords(0,0,tex.get_width() / tex.get_realWidth(),tex.get_height() / tex.get_realHeight());
		this.setRectVertices(bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty);
		++this.bufferIndex;
		this.lastTexture = tex;
	}
	,drawImage2: function(img,sx,sy,sw,sh,bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty,opacity,color) {
		var tex = img;
		if(this.bufferIndex + 1 >= kha_graphics4_ImageShaderPainter.bufferSize || this.lastTexture != null && tex != this.lastTexture) this.drawBuffer();
		this.setRectTexCoords(sx / tex.get_realWidth(),sy / tex.get_realHeight(),(sx + sw) / tex.get_realWidth(),(sy + sh) / tex.get_realHeight());
		this.setRectColor(kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098 * opacity);
		this.setRectVertices(bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty);
		++this.bufferIndex;
		this.lastTexture = tex;
	}
	,drawImageScale: function(img,sx,sy,sw,sh,left,top,right,bottom,opacity,color) {
		var tex = img;
		if(this.bufferIndex + 1 >= kha_graphics4_ImageShaderPainter.bufferSize || this.lastTexture != null && tex != this.lastTexture) this.drawBuffer();
		this.setRectTexCoords(sx / tex.get_realWidth(),sy / tex.get_realHeight(),(sx + sw) / tex.get_realWidth(),(sy + sh) / tex.get_realHeight());
		this.setRectColor(kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098,opacity);
		this.setRectVertices(left,bottom,left,top,right,top,right,bottom);
		++this.bufferIndex;
		this.lastTexture = tex;
	}
	,end: function() {
		if(this.bufferIndex > 0) this.drawBuffer();
		this.lastTexture = null;
	}
	,__class__: kha_graphics4_ImageShaderPainter
};
var kha_graphics4_ColoredShaderPainter = function(g4) {
	this.destinationBlend = kha_graphics4_BlendingOperation.Undefined;
	this.sourceBlend = kha_graphics4_BlendingOperation.Undefined;
	this.myPipeline = null;
	this.g = g4;
	this.bufferIndex = 0;
	this.triangleBufferIndex = 0;
	this.initShaders();
	this.initBuffers();
	this.projectionLocation = this.shaderPipeline.getConstantLocation("projectionMatrix");
};
$hxClasses["kha.graphics4.ColoredShaderPainter"] = kha_graphics4_ColoredShaderPainter;
kha_graphics4_ColoredShaderPainter.__name__ = true;
kha_graphics4_ColoredShaderPainter.prototype = {
	projectionMatrix: null
	,shaderPipeline: null
	,structure: null
	,projectionLocation: null
	,bufferIndex: null
	,rectVertexBuffer: null
	,rectVertices: null
	,indexBuffer: null
	,triangleBufferIndex: null
	,triangleVertexBuffer: null
	,triangleVertices: null
	,triangleIndexBuffer: null
	,g: null
	,myPipeline: null
	,sourceBlend: null
	,destinationBlend: null
	,get_pipeline: function() {
		return this.myPipeline;
	}
	,set_pipeline: function(pipe) {
		if(pipe == null) this.projectionLocation = this.shaderPipeline.getConstantLocation("projectionMatrix"); else this.projectionLocation = pipe.getConstantLocation("projectionMatrix");
		return this.myPipeline = pipe;
	}
	,setProjection: function(projectionMatrix) {
		this.projectionMatrix = projectionMatrix;
	}
	,initShaders: function() {
		this.shaderPipeline = new kha_graphics4_PipelineState();
		this.shaderPipeline.fragmentShader = kha_Shaders.painter_colored_frag;
		this.shaderPipeline.vertexShader = kha_Shaders.painter_colored_vert;
		this.structure = new kha_graphics4_VertexStructure();
		this.structure.add("vertexPosition",kha_graphics4_VertexData.Float3);
		this.structure.add("vertexColor",kha_graphics4_VertexData.Float4);
		this.shaderPipeline.inputLayout = [this.structure];
		this.shaderPipeline.blendSource = kha_graphics4_BlendingOperation.SourceAlpha;
		this.shaderPipeline.blendDestination = kha_graphics4_BlendingOperation.InverseSourceAlpha;
		this.shaderPipeline.compile();
	}
	,initBuffers: function() {
		this.rectVertexBuffer = new kha_graphics4_VertexBuffer(kha_graphics4_ColoredShaderPainter.bufferSize * 4,this.structure,kha_graphics4_Usage.DynamicUsage);
		this.rectVertices = this.rectVertexBuffer.lock();
		this.indexBuffer = new kha_graphics4_IndexBuffer(kha_graphics4_ColoredShaderPainter.bufferSize * 3 * 2,kha_graphics4_Usage.StaticUsage);
		var indices = this.indexBuffer.lock();
		var _g1 = 0;
		var _g = kha_graphics4_ColoredShaderPainter.bufferSize;
		while(_g1 < _g) {
			var i = _g1++;
			indices[i * 3 * 2] = i * 4;
			indices[i * 3 * 2 + 1] = i * 4 + 1;
			indices[i * 3 * 2 + 2] = i * 4 + 2;
			indices[i * 3 * 2 + 3] = i * 4;
			indices[i * 3 * 2 + 4] = i * 4 + 2;
			indices[i * 3 * 2 + 5] = i * 4 + 3;
		}
		this.indexBuffer.unlock();
		this.triangleVertexBuffer = new kha_graphics4_VertexBuffer(kha_graphics4_ColoredShaderPainter.triangleBufferSize * 3,this.structure,kha_graphics4_Usage.DynamicUsage);
		this.triangleVertices = this.triangleVertexBuffer.lock();
		this.triangleIndexBuffer = new kha_graphics4_IndexBuffer(kha_graphics4_ColoredShaderPainter.triangleBufferSize * 3,kha_graphics4_Usage.StaticUsage);
		var triIndices = this.triangleIndexBuffer.lock();
		var _g11 = 0;
		var _g2 = kha_graphics4_ColoredShaderPainter.bufferSize;
		while(_g11 < _g2) {
			var i1 = _g11++;
			triIndices[i1 * 3] = i1 * 3;
			triIndices[i1 * 3 + 1] = i1 * 3 + 1;
			triIndices[i1 * 3 + 2] = i1 * 3 + 2;
		}
		this.triangleIndexBuffer.unlock();
	}
	,setRectVertices: function(bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty) {
		var baseIndex = this.bufferIndex * 7 * 4;
		this.rectVertices[baseIndex] = bottomleftx;
		this.rectVertices[baseIndex + 1] = bottomlefty;
		this.rectVertices[baseIndex + 2] = -5.0;
		this.rectVertices[baseIndex + 7] = topleftx;
		this.rectVertices[baseIndex + 8] = toplefty;
		this.rectVertices[baseIndex + 9] = -5.0;
		this.rectVertices[baseIndex + 14] = toprightx;
		this.rectVertices[baseIndex + 15] = toprighty;
		this.rectVertices[baseIndex + 16] = -5.0;
		this.rectVertices[baseIndex + 21] = bottomrightx;
		this.rectVertices[baseIndex + 22] = bottomrighty;
		this.rectVertices[baseIndex + 23] = -5.0;
	}
	,setRectColors: function(opacity,color) {
		var baseIndex = this.bufferIndex * 7 * 4;
		var a = opacity * (kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098);
		var value = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 3] = value;
		var value1 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 4] = value1;
		var value2 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 5] = value2;
		this.rectVertices[baseIndex + 6] = a;
		var value3 = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 10] = value3;
		var value4 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 11] = value4;
		var value5 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 12] = value5;
		this.rectVertices[baseIndex + 13] = a;
		var value6 = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 17] = value6;
		var value7 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 18] = value7;
		var value8 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 19] = value8;
		this.rectVertices[baseIndex + 20] = a;
		var value9 = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 24] = value9;
		var value10 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 25] = value10;
		var value11 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 26] = value11;
		this.rectVertices[baseIndex + 27] = a;
	}
	,setTriVertices: function(x1,y1,x2,y2,x3,y3) {
		var baseIndex = this.triangleBufferIndex * 7 * 3;
		this.triangleVertices[baseIndex] = x1;
		this.triangleVertices[baseIndex + 1] = y1;
		this.triangleVertices[baseIndex + 2] = -5.0;
		this.triangleVertices[baseIndex + 7] = x2;
		this.triangleVertices[baseIndex + 8] = y2;
		this.triangleVertices[baseIndex + 9] = -5.0;
		this.triangleVertices[baseIndex + 14] = x3;
		this.triangleVertices[baseIndex + 15] = y3;
		this.triangleVertices[baseIndex + 16] = -5.0;
	}
	,setTriColors: function(opacity,color) {
		var baseIndex = this.triangleBufferIndex * 7 * 3;
		var a = opacity * (kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098);
		var value = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 3] = value;
		var value1 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 4] = value1;
		var value2 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 5] = value2;
		this.triangleVertices[baseIndex + 6] = a;
		var value3 = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 10] = value3;
		var value4 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 11] = value4;
		var value5 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 12] = value5;
		this.triangleVertices[baseIndex + 13] = a;
		var value6 = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 17] = value6;
		var value7 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 18] = value7;
		var value8 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.triangleVertices[baseIndex + 19] = value8;
		this.triangleVertices[baseIndex + 20] = a;
	}
	,drawBuffer: function(trisDone) {
		if(!trisDone) {
			if(this.triangleBufferIndex > 0) this.drawTriBuffer(true);
		}
		this.rectVertexBuffer.unlock();
		this.g.setVertexBuffer(this.rectVertexBuffer);
		this.g.setIndexBuffer(this.indexBuffer);
		this.g.setPipeline(this.get_pipeline() == null?this.shaderPipeline:this.get_pipeline());
		this.g.setMatrix(this.projectionLocation,this.projectionMatrix);
		this.g.drawIndexedVertices(0,this.bufferIndex * 2 * 3);
		this.bufferIndex = 0;
		this.rectVertices = this.rectVertexBuffer.lock();
	}
	,drawTriBuffer: function(rectsDone) {
		if(!rectsDone) {
			if(this.bufferIndex > 0) this.drawBuffer(true);
		}
		this.triangleVertexBuffer.unlock();
		this.g.setVertexBuffer(this.triangleVertexBuffer);
		this.g.setIndexBuffer(this.triangleIndexBuffer);
		this.g.setPipeline(this.get_pipeline() == null?this.shaderPipeline:this.get_pipeline());
		this.g.setMatrix(this.projectionLocation,this.projectionMatrix);
		this.g.drawIndexedVertices(0,this.triangleBufferIndex * 3);
		this.triangleBufferIndex = 0;
		this.triangleVertices = this.triangleVertexBuffer.lock();
	}
	,fillRect: function(opacity,color,bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty) {
		if(this.bufferIndex + 1 >= kha_graphics4_ColoredShaderPainter.bufferSize) this.drawBuffer(false);
		this.setRectColors(opacity,color);
		this.setRectVertices(bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty);
		++this.bufferIndex;
	}
	,fillTriangle: function(opacity,color,x1,y1,x2,y2,x3,y3) {
		if(this.triangleBufferIndex + 1 >= kha_graphics4_ColoredShaderPainter.triangleBufferSize) this.drawTriBuffer(false);
		this.setTriColors(opacity,color);
		this.setTriVertices(x1,y1,x2,y2,x3,y3);
		++this.triangleBufferIndex;
	}
	,endTris: function(rectsDone) {
		if(this.triangleBufferIndex > 0) this.drawTriBuffer(rectsDone);
	}
	,endRects: function(trisDone) {
		if(this.bufferIndex > 0) this.drawBuffer(trisDone);
	}
	,end: function() {
		if(this.triangleBufferIndex > 0) this.drawTriBuffer(false);
		if(this.bufferIndex > 0) this.drawBuffer(false);
	}
	,__class__: kha_graphics4_ColoredShaderPainter
};
var kha_graphics4_TextShaderPainter = function(g4) {
	this.destinationBlend = kha_graphics4_BlendingOperation.Undefined;
	this.sourceBlend = kha_graphics4_BlendingOperation.Undefined;
	this.bilinear = false;
	this.myPipeline = null;
	this.g = g4;
	this.bufferIndex = 0;
	this.initShaders();
	this.initBuffers();
	this.projectionLocation = this.shaderPipeline.getConstantLocation("projectionMatrix");
	this.textureLocation = this.shaderPipeline.getTextureUnit("tex");
};
$hxClasses["kha.graphics4.TextShaderPainter"] = kha_graphics4_TextShaderPainter;
kha_graphics4_TextShaderPainter.__name__ = true;
kha_graphics4_TextShaderPainter.prototype = {
	projectionMatrix: null
	,shaderPipeline: null
	,structure: null
	,projectionLocation: null
	,textureLocation: null
	,bufferIndex: null
	,rectVertexBuffer: null
	,rectVertices: null
	,indexBuffer: null
	,font: null
	,lastTexture: null
	,g: null
	,myPipeline: null
	,fontSize: null
	,bilinear: null
	,sourceBlend: null
	,destinationBlend: null
	,get_pipeline: function() {
		return this.myPipeline;
	}
	,set_pipeline: function(pipe) {
		if(pipe == null) {
			this.projectionLocation = this.shaderPipeline.getConstantLocation("projectionMatrix");
			this.textureLocation = this.shaderPipeline.getTextureUnit("tex");
		} else {
			this.projectionLocation = pipe.getConstantLocation("projectionMatrix");
			this.textureLocation = pipe.getTextureUnit("tex");
		}
		return this.myPipeline = pipe;
	}
	,setProjection: function(projectionMatrix) {
		this.projectionMatrix = projectionMatrix;
	}
	,initShaders: function() {
		this.shaderPipeline = new kha_graphics4_PipelineState();
		this.shaderPipeline.fragmentShader = kha_Shaders.painter_text_frag;
		this.shaderPipeline.vertexShader = kha_Shaders.painter_text_vert;
		this.structure = new kha_graphics4_VertexStructure();
		this.structure.add("vertexPosition",kha_graphics4_VertexData.Float3);
		this.structure.add("texPosition",kha_graphics4_VertexData.Float2);
		this.structure.add("vertexColor",kha_graphics4_VertexData.Float4);
		this.shaderPipeline.inputLayout = [this.structure];
		this.shaderPipeline.blendSource = kha_graphics4_BlendingOperation.SourceAlpha;
		this.shaderPipeline.blendDestination = kha_graphics4_BlendingOperation.InverseSourceAlpha;
		this.shaderPipeline.compile();
	}
	,initBuffers: function() {
		this.rectVertexBuffer = new kha_graphics4_VertexBuffer(kha_graphics4_TextShaderPainter.bufferSize * 4,this.structure,kha_graphics4_Usage.DynamicUsage);
		this.rectVertices = this.rectVertexBuffer.lock();
		this.indexBuffer = new kha_graphics4_IndexBuffer(kha_graphics4_TextShaderPainter.bufferSize * 3 * 2,kha_graphics4_Usage.StaticUsage);
		var indices = this.indexBuffer.lock();
		var _g1 = 0;
		var _g = kha_graphics4_TextShaderPainter.bufferSize;
		while(_g1 < _g) {
			var i = _g1++;
			indices[i * 3 * 2] = i * 4;
			indices[i * 3 * 2 + 1] = i * 4 + 1;
			indices[i * 3 * 2 + 2] = i * 4 + 2;
			indices[i * 3 * 2 + 3] = i * 4;
			indices[i * 3 * 2 + 4] = i * 4 + 2;
			indices[i * 3 * 2 + 5] = i * 4 + 3;
		}
		this.indexBuffer.unlock();
	}
	,setRectVertices: function(bottomleftx,bottomlefty,topleftx,toplefty,toprightx,toprighty,bottomrightx,bottomrighty) {
		var baseIndex = this.bufferIndex * 9 * 4;
		this.rectVertices[baseIndex] = bottomleftx;
		this.rectVertices[baseIndex + 1] = bottomlefty;
		this.rectVertices[baseIndex + 2] = -5.0;
		this.rectVertices[baseIndex + 9] = topleftx;
		this.rectVertices[baseIndex + 10] = toplefty;
		this.rectVertices[baseIndex + 11] = -5.0;
		this.rectVertices[baseIndex + 18] = toprightx;
		this.rectVertices[baseIndex + 19] = toprighty;
		this.rectVertices[baseIndex + 20] = -5.0;
		this.rectVertices[baseIndex + 27] = bottomrightx;
		this.rectVertices[baseIndex + 28] = bottomrighty;
		this.rectVertices[baseIndex + 29] = -5.0;
	}
	,setRectTexCoords: function(left,top,right,bottom) {
		var baseIndex = this.bufferIndex * 9 * 4;
		this.rectVertices[baseIndex + 3] = left;
		this.rectVertices[baseIndex + 4] = bottom;
		this.rectVertices[baseIndex + 12] = left;
		this.rectVertices[baseIndex + 13] = top;
		this.rectVertices[baseIndex + 21] = right;
		this.rectVertices[baseIndex + 22] = top;
		this.rectVertices[baseIndex + 30] = right;
		this.rectVertices[baseIndex + 31] = bottom;
	}
	,setRectColors: function(opacity,color) {
		var baseIndex = this.bufferIndex * 9 * 4;
		var a = opacity * (kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098);
		var value = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 5] = value;
		var value1 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 6] = value1;
		var value2 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 7] = value2;
		this.rectVertices[baseIndex + 8] = a;
		var value3 = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 14] = value3;
		var value4 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 15] = value4;
		var value5 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 16] = value5;
		this.rectVertices[baseIndex + 17] = a;
		var value6 = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 23] = value6;
		var value7 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 24] = value7;
		var value8 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 25] = value8;
		this.rectVertices[baseIndex + 26] = a;
		var value9 = kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 32] = value9;
		var value10 = kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 33] = value10;
		var value11 = kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098;
		this.rectVertices[baseIndex + 34] = value11;
		this.rectVertices[baseIndex + 35] = a;
	}
	,drawBuffer: function() {
		this.rectVertexBuffer.unlock();
		this.g.setVertexBuffer(this.rectVertexBuffer);
		this.g.setIndexBuffer(this.indexBuffer);
		this.g.setPipeline(this.get_pipeline() == null?this.shaderPipeline:this.get_pipeline());
		this.g.setTexture(this.textureLocation,this.lastTexture);
		this.g.setMatrix(this.projectionLocation,this.projectionMatrix);
		this.g.setTextureParameters(this.textureLocation,kha_graphics4_TextureAddressing.Clamp,kha_graphics4_TextureAddressing.Clamp,this.bilinear?kha_graphics4_TextureFilter.LinearFilter:kha_graphics4_TextureFilter.PointFilter,this.bilinear?kha_graphics4_TextureFilter.LinearFilter:kha_graphics4_TextureFilter.PointFilter,kha_graphics4_MipMapFilter.NoMipFilter);
		this.g.drawIndexedVertices(0,this.bufferIndex * 2 * 3);
		this.g.setTexture(this.textureLocation,null);
		this.bufferIndex = 0;
		this.rectVertices = this.rectVertexBuffer.lock();
	}
	,setBilinearFilter: function(bilinear) {
		this.end();
		this.bilinear = bilinear;
	}
	,setFont: function(font) {
		this.font = js_Boot.__cast(font , kha_Kravur);
	}
	,text: null
	,startString: function(text) {
		this.text = text;
	}
	,charCodeAt: function(position) {
		return HxOverrides.cca(this.text,position);
	}
	,stringLength: function() {
		return this.text.length;
	}
	,endString: function() {
		this.text = null;
	}
	,drawString: function(text,opacity,color,x,y,transformation) {
		var font = this.font._get(this.fontSize);
		var tex = font.getTexture();
		if(this.lastTexture != null && tex != this.lastTexture) this.drawBuffer();
		this.lastTexture = tex;
		var xpos = x;
		var ypos = y;
		this.startString(text);
		var _g1 = 0;
		var _g = this.stringLength();
		while(_g1 < _g) {
			var i = _g1++;
			var q = font.getBakedQuad(this.charCodeAt(i) - 32,xpos,ypos);
			if(q != null) {
				if(this.bufferIndex + 1 >= kha_graphics4_TextShaderPainter.bufferSize) this.drawBuffer();
				this.setRectColors(opacity,color);
				this.setRectTexCoords(q.s0 * tex.get_width() / tex.get_realWidth(),q.t0 * tex.get_height() / tex.get_realHeight(),q.s1 * tex.get_width() / tex.get_realWidth(),q.t1 * tex.get_height() / tex.get_realHeight());
				var value_x = q.x0;
				var value_y = q.y1;
				var w = transformation._02 * value_x + transformation._12 * value_y + transformation._22;
				var x1 = (transformation._00 * value_x + transformation._10 * value_y + transformation._20) / w;
				var y1 = (transformation._01 * value_x + transformation._11 * value_y + transformation._21) / w;
				var p0_x = x1;
				var p0_y = y1;
				var value_x1 = q.x0;
				var value_y1 = q.y0;
				var w1 = transformation._02 * value_x1 + transformation._12 * value_y1 + transformation._22;
				var x2 = (transformation._00 * value_x1 + transformation._10 * value_y1 + transformation._20) / w1;
				var y2 = (transformation._01 * value_x1 + transformation._11 * value_y1 + transformation._21) / w1;
				var p1_x = x2;
				var p1_y = y2;
				var value_x2 = q.x1;
				var value_y2 = q.y0;
				var w2 = transformation._02 * value_x2 + transformation._12 * value_y2 + transformation._22;
				var x3 = (transformation._00 * value_x2 + transformation._10 * value_y2 + transformation._20) / w2;
				var y3 = (transformation._01 * value_x2 + transformation._11 * value_y2 + transformation._21) / w2;
				var p2_x = x3;
				var p2_y = y3;
				var value_x3 = q.x1;
				var value_y3 = q.y1;
				var w3 = transformation._02 * value_x3 + transformation._12 * value_y3 + transformation._22;
				var x4 = (transformation._00 * value_x3 + transformation._10 * value_y3 + transformation._20) / w3;
				var y4 = (transformation._01 * value_x3 + transformation._11 * value_y3 + transformation._21) / w3;
				var p3_x = x4;
				var p3_y = y4;
				this.setRectVertices(p0_x,p0_y,p1_x,p1_y,p2_x,p2_y,p3_x,p3_y);
				xpos += q.xadvance;
				++this.bufferIndex;
			}
		}
		this.endString();
	}
	,end: function() {
		if(this.bufferIndex > 0) this.drawBuffer();
		this.lastTexture = null;
	}
	,__class__: kha_graphics4_TextShaderPainter
};
var kha_graphics4_Graphics2 = function(canvas) {
	this.myImageScaleQuality = kha_graphics2_ImageScaleQuality.High;
	kha_graphics2_Graphics.call(this);
	this.set_color(kha__$Color_Color_$Impl_$.White);
	this.canvas = canvas;
	this.g = canvas.get_g4();
	this.imagePainter = new kha_graphics4_ImageShaderPainter(this.g);
	this.coloredPainter = new kha_graphics4_ColoredShaderPainter(this.g);
	this.textPainter = new kha_graphics4_TextShaderPainter(this.g);
	this.textPainter.fontSize = this.get_fontSize();
	this.setProjection();
	this.videoPipeline = new kha_graphics4_PipelineState();
	this.videoPipeline.fragmentShader = kha_Shaders.painter_video_frag;
	this.videoPipeline.vertexShader = kha_Shaders.painter_video_vert;
	var structure = new kha_graphics4_VertexStructure();
	structure.add("vertexPosition",kha_graphics4_VertexData.Float3);
	structure.add("texPosition",kha_graphics4_VertexData.Float2);
	structure.add("vertexColor",kha_graphics4_VertexData.Float4);
	this.videoPipeline.inputLayout = [structure];
	this.videoPipeline.compile();
};
$hxClasses["kha.graphics4.Graphics2"] = kha_graphics4_Graphics2;
kha_graphics4_Graphics2.__name__ = true;
kha_graphics4_Graphics2.upperPowerOfTwo = function(v) {
	v--;
	v |= v >>> 1;
	v |= v >>> 2;
	v |= v >>> 4;
	v |= v >>> 8;
	v |= v >>> 16;
	v++;
	return v;
};
kha_graphics4_Graphics2.__super__ = kha_graphics2_Graphics;
kha_graphics4_Graphics2.prototype = $extend(kha_graphics2_Graphics.prototype,{
	myColor: null
	,myFont: null
	,projectionMatrix: null
	,imagePainter: null
	,coloredPainter: null
	,textPainter: null
	,videoPipeline: null
	,canvas: null
	,g: null
	,setProjection: function() {
		var width = this.canvas.get_width();
		var height = this.canvas.get_height();
		if(js_Boot.__instanceof(this.canvas,kha_Framebuffer)) this.projectionMatrix = kha_math_FastMatrix4.orthogonalProjection(0,width,height,0,0.1,1000); else {
			if(!kha_Image.get_nonPow2Supported()) {
				width = kha_graphics4_Graphics2.upperPowerOfTwo(width);
				height = kha_graphics4_Graphics2.upperPowerOfTwo(height);
			}
			if(this.g.renderTargetsInvertedY()) this.projectionMatrix = kha_math_FastMatrix4.orthogonalProjection(0,width,0,height,0.1,1000); else this.projectionMatrix = kha_math_FastMatrix4.orthogonalProjection(0,width,height,0,0.1,1000);
		}
		this.imagePainter.setProjection(this.projectionMatrix);
		this.coloredPainter.setProjection(this.projectionMatrix);
		this.textPainter.setProjection(this.projectionMatrix);
	}
	,drawImage: function(img,x,y) {
		this.coloredPainter.end();
		this.textPainter.end();
		var xw = x + img.get_width();
		var yh = y + img.get_height();
		var _this = this.transformations[this.transformations.length - 1];
		var value_x = x;
		var value_y = yh;
		var w = _this._02 * value_x + _this._12 * value_y + _this._22;
		var x1 = (_this._00 * value_x + _this._10 * value_y + _this._20) / w;
		var y1 = (_this._01 * value_x + _this._11 * value_y + _this._21) / w;
		var p1_x = x1;
		var p1_y = y1;
		var _this1 = this.transformations[this.transformations.length - 1];
		var value_x1 = x;
		var value_y1 = y;
		var w1 = _this1._02 * value_x1 + _this1._12 * value_y1 + _this1._22;
		var x2 = (_this1._00 * value_x1 + _this1._10 * value_y1 + _this1._20) / w1;
		var y2 = (_this1._01 * value_x1 + _this1._11 * value_y1 + _this1._21) / w1;
		var p2_x = x2;
		var p2_y = y2;
		var _this2 = this.transformations[this.transformations.length - 1];
		var value_x2 = xw;
		var value_y2 = y;
		var w2 = _this2._02 * value_x2 + _this2._12 * value_y2 + _this2._22;
		var x3 = (_this2._00 * value_x2 + _this2._10 * value_y2 + _this2._20) / w2;
		var y3 = (_this2._01 * value_x2 + _this2._11 * value_y2 + _this2._21) / w2;
		var p3_x = x3;
		var p3_y = y3;
		var _this3 = this.transformations[this.transformations.length - 1];
		var value_x3 = xw;
		var value_y3 = yh;
		var w3 = _this3._02 * value_x3 + _this3._12 * value_y3 + _this3._22;
		var x4 = (_this3._00 * value_x3 + _this3._10 * value_y3 + _this3._20) / w3;
		var y4 = (_this3._01 * value_x3 + _this3._11 * value_y3 + _this3._21) / w3;
		var p4_x = x4;
		var p4_y = y4;
		this.imagePainter.drawImage(img,p1_x,p1_y,p2_x,p2_y,p3_x,p3_y,p4_x,p4_y,this.get_opacity(),this.get_color());
	}
	,drawScaledSubImage: function(img,sx,sy,sw,sh,dx,dy,dw,dh) {
		this.coloredPainter.end();
		this.textPainter.end();
		var _this = this.transformations[this.transformations.length - 1];
		var value_x = dx;
		var value_y = dy + dh;
		var w = _this._02 * value_x + _this._12 * value_y + _this._22;
		var x = (_this._00 * value_x + _this._10 * value_y + _this._20) / w;
		var y = (_this._01 * value_x + _this._11 * value_y + _this._21) / w;
		var p1_x = x;
		var p1_y = y;
		var _this1 = this.transformations[this.transformations.length - 1];
		var value_x1 = dx;
		var value_y1 = dy;
		var w1 = _this1._02 * value_x1 + _this1._12 * value_y1 + _this1._22;
		var x1 = (_this1._00 * value_x1 + _this1._10 * value_y1 + _this1._20) / w1;
		var y1 = (_this1._01 * value_x1 + _this1._11 * value_y1 + _this1._21) / w1;
		var p2_x = x1;
		var p2_y = y1;
		var _this2 = this.transformations[this.transformations.length - 1];
		var value_x2 = dx + dw;
		var value_y2 = dy;
		var w2 = _this2._02 * value_x2 + _this2._12 * value_y2 + _this2._22;
		var x2 = (_this2._00 * value_x2 + _this2._10 * value_y2 + _this2._20) / w2;
		var y2 = (_this2._01 * value_x2 + _this2._11 * value_y2 + _this2._21) / w2;
		var p3_x = x2;
		var p3_y = y2;
		var _this3 = this.transformations[this.transformations.length - 1];
		var value_x3 = dx + dw;
		var value_y3 = dy + dh;
		var w3 = _this3._02 * value_x3 + _this3._12 * value_y3 + _this3._22;
		var x3 = (_this3._00 * value_x3 + _this3._10 * value_y3 + _this3._20) / w3;
		var y3 = (_this3._01 * value_x3 + _this3._11 * value_y3 + _this3._21) / w3;
		var p4_x = x3;
		var p4_y = y3;
		this.imagePainter.drawImage2(img,sx,sy,sw,sh,p1_x,p1_y,p2_x,p2_y,p3_x,p3_y,p4_x,p4_y,this.get_opacity(),this.get_color());
	}
	,get_color: function() {
		return this.myColor;
	}
	,set_color: function(color) {
		return this.myColor = color;
	}
	,drawRect: function(x,y,width,height,strength) {
		if(strength == null) strength = 1.0;
		this.imagePainter.end();
		this.textPainter.end();
		var p1;
		var _this = this.transformations[this.transformations.length - 1];
		var value_x = x - strength / 2;
		var value_y = y + strength / 2;
		var w = _this._02 * value_x + _this._12 * value_y + _this._22;
		var x1 = (_this._00 * value_x + _this._10 * value_y + _this._20) / w;
		var y1 = (_this._01 * value_x + _this._11 * value_y + _this._21) / w;
		p1 = new kha_math_FastVector2(x1,y1);
		var p2;
		var _this1 = this.transformations[this.transformations.length - 1];
		var value_x1 = x - strength / 2;
		var value_y1 = y - strength / 2;
		var w1 = _this1._02 * value_x1 + _this1._12 * value_y1 + _this1._22;
		var x2 = (_this1._00 * value_x1 + _this1._10 * value_y1 + _this1._20) / w1;
		var y2 = (_this1._01 * value_x1 + _this1._11 * value_y1 + _this1._21) / w1;
		p2 = new kha_math_FastVector2(x2,y2);
		var p3;
		var _this2 = this.transformations[this.transformations.length - 1];
		var value_x2 = x + width + strength / 2;
		var value_y2 = y - strength / 2;
		var w2 = _this2._02 * value_x2 + _this2._12 * value_y2 + _this2._22;
		var x3 = (_this2._00 * value_x2 + _this2._10 * value_y2 + _this2._20) / w2;
		var y3 = (_this2._01 * value_x2 + _this2._11 * value_y2 + _this2._21) / w2;
		p3 = new kha_math_FastVector2(x3,y3);
		var p4;
		var _this3 = this.transformations[this.transformations.length - 1];
		var value_x3 = x + width + strength / 2;
		var value_y3 = y + strength / 2;
		var w3 = _this3._02 * value_x3 + _this3._12 * value_y3 + _this3._22;
		var x4 = (_this3._00 * value_x3 + _this3._10 * value_y3 + _this3._20) / w3;
		var y4 = (_this3._01 * value_x3 + _this3._11 * value_y3 + _this3._21) / w3;
		p4 = new kha_math_FastVector2(x4,y4);
		this.coloredPainter.fillRect(this.get_opacity(),this.get_color(),p1.x,p1.y,p2.x,p2.y,p3.x,p3.y,p4.x,p4.y);
		var _this4 = this.transformations[this.transformations.length - 1];
		var value_x4 = x - strength / 2;
		var value_y4 = y + height + strength / 2;
		var w4 = _this4._02 * value_x4 + _this4._12 * value_y4 + _this4._22;
		var x5 = (_this4._00 * value_x4 + _this4._10 * value_y4 + _this4._20) / w4;
		var y5 = (_this4._01 * value_x4 + _this4._11 * value_y4 + _this4._21) / w4;
		p1 = new kha_math_FastVector2(x5,y5);
		var _this5 = this.transformations[this.transformations.length - 1];
		var value_x5 = x + strength / 2;
		var value_y5 = y - strength / 2;
		var w5 = _this5._02 * value_x5 + _this5._12 * value_y5 + _this5._22;
		var x6 = (_this5._00 * value_x5 + _this5._10 * value_y5 + _this5._20) / w5;
		var y6 = (_this5._01 * value_x5 + _this5._11 * value_y5 + _this5._21) / w5;
		p3 = new kha_math_FastVector2(x6,y6);
		var _this6 = this.transformations[this.transformations.length - 1];
		var value_x6 = x + strength / 2;
		var value_y6 = y + height + strength / 2;
		var w6 = _this6._02 * value_x6 + _this6._12 * value_y6 + _this6._22;
		var x7 = (_this6._00 * value_x6 + _this6._10 * value_y6 + _this6._20) / w6;
		var y7 = (_this6._01 * value_x6 + _this6._11 * value_y6 + _this6._21) / w6;
		p4 = new kha_math_FastVector2(x7,y7);
		this.coloredPainter.fillRect(this.get_opacity(),this.get_color(),p1.x,p1.y,p2.x,p2.y,p3.x,p3.y,p4.x,p4.y);
		var _this7 = this.transformations[this.transformations.length - 1];
		var value_x7 = x - strength / 2;
		var value_y7 = y + height - strength / 2;
		var w7 = _this7._02 * value_x7 + _this7._12 * value_y7 + _this7._22;
		var x8 = (_this7._00 * value_x7 + _this7._10 * value_y7 + _this7._20) / w7;
		var y8 = (_this7._01 * value_x7 + _this7._11 * value_y7 + _this7._21) / w7;
		p2 = new kha_math_FastVector2(x8,y8);
		var _this8 = this.transformations[this.transformations.length - 1];
		var value_x8 = x + width + strength / 2;
		var value_y8 = y + height - strength / 2;
		var w8 = _this8._02 * value_x8 + _this8._12 * value_y8 + _this8._22;
		var x9 = (_this8._00 * value_x8 + _this8._10 * value_y8 + _this8._20) / w8;
		var y9 = (_this8._01 * value_x8 + _this8._11 * value_y8 + _this8._21) / w8;
		p3 = new kha_math_FastVector2(x9,y9);
		var _this9 = this.transformations[this.transformations.length - 1];
		var value_x9 = x + width + strength / 2;
		var value_y9 = y + height + strength / 2;
		var w9 = _this9._02 * value_x9 + _this9._12 * value_y9 + _this9._22;
		var x10 = (_this9._00 * value_x9 + _this9._10 * value_y9 + _this9._20) / w9;
		var y10 = (_this9._01 * value_x9 + _this9._11 * value_y9 + _this9._21) / w9;
		p4 = new kha_math_FastVector2(x10,y10);
		this.coloredPainter.fillRect(this.get_opacity(),this.get_color(),p1.x,p1.y,p2.x,p2.y,p3.x,p3.y,p4.x,p4.y);
		var _this10 = this.transformations[this.transformations.length - 1];
		var value_x10 = x + width - strength / 2;
		var value_y10 = y + height + strength / 2;
		var w10 = _this10._02 * value_x10 + _this10._12 * value_y10 + _this10._22;
		var x11 = (_this10._00 * value_x10 + _this10._10 * value_y10 + _this10._20) / w10;
		var y11 = (_this10._01 * value_x10 + _this10._11 * value_y10 + _this10._21) / w10;
		p1 = new kha_math_FastVector2(x11,y11);
		var _this11 = this.transformations[this.transformations.length - 1];
		var value_x11 = x + width - strength / 2;
		var value_y11 = y - strength / 2;
		var w11 = _this11._02 * value_x11 + _this11._12 * value_y11 + _this11._22;
		var x12 = (_this11._00 * value_x11 + _this11._10 * value_y11 + _this11._20) / w11;
		var y12 = (_this11._01 * value_x11 + _this11._11 * value_y11 + _this11._21) / w11;
		p2 = new kha_math_FastVector2(x12,y12);
		var _this12 = this.transformations[this.transformations.length - 1];
		var value_x12 = x + width + strength / 2;
		var value_y12 = y - strength / 2;
		var w12 = _this12._02 * value_x12 + _this12._12 * value_y12 + _this12._22;
		var x13 = (_this12._00 * value_x12 + _this12._10 * value_y12 + _this12._20) / w12;
		var y13 = (_this12._01 * value_x12 + _this12._11 * value_y12 + _this12._21) / w12;
		p3 = new kha_math_FastVector2(x13,y13);
		var _this13 = this.transformations[this.transformations.length - 1];
		var value_x13 = x + width + strength / 2;
		var value_y13 = y + height + strength / 2;
		var w13 = _this13._02 * value_x13 + _this13._12 * value_y13 + _this13._22;
		var x14 = (_this13._00 * value_x13 + _this13._10 * value_y13 + _this13._20) / w13;
		var y14 = (_this13._01 * value_x13 + _this13._11 * value_y13 + _this13._21) / w13;
		p4 = new kha_math_FastVector2(x14,y14);
		this.coloredPainter.fillRect(this.get_opacity(),this.get_color(),p1.x,p1.y,p2.x,p2.y,p3.x,p3.y,p4.x,p4.y);
	}
	,fillRect: function(x,y,width,height) {
		this.imagePainter.end();
		this.textPainter.end();
		var _this = this.transformations[this.transformations.length - 1];
		var value_x = x;
		var value_y = y + height;
		var w = _this._02 * value_x + _this._12 * value_y + _this._22;
		var x1 = (_this._00 * value_x + _this._10 * value_y + _this._20) / w;
		var y1 = (_this._01 * value_x + _this._11 * value_y + _this._21) / w;
		var p1_x = x1;
		var p1_y = y1;
		var _this1 = this.transformations[this.transformations.length - 1];
		var value_x1 = x;
		var value_y1 = y;
		var w1 = _this1._02 * value_x1 + _this1._12 * value_y1 + _this1._22;
		var x2 = (_this1._00 * value_x1 + _this1._10 * value_y1 + _this1._20) / w1;
		var y2 = (_this1._01 * value_x1 + _this1._11 * value_y1 + _this1._21) / w1;
		var p2_x = x2;
		var p2_y = y2;
		var _this2 = this.transformations[this.transformations.length - 1];
		var value_x2 = x + width;
		var value_y2 = y;
		var w2 = _this2._02 * value_x2 + _this2._12 * value_y2 + _this2._22;
		var x3 = (_this2._00 * value_x2 + _this2._10 * value_y2 + _this2._20) / w2;
		var y3 = (_this2._01 * value_x2 + _this2._11 * value_y2 + _this2._21) / w2;
		var p3_x = x3;
		var p3_y = y3;
		var _this3 = this.transformations[this.transformations.length - 1];
		var value_x3 = x + width;
		var value_y3 = y + height;
		var w3 = _this3._02 * value_x3 + _this3._12 * value_y3 + _this3._22;
		var x4 = (_this3._00 * value_x3 + _this3._10 * value_y3 + _this3._20) / w3;
		var y4 = (_this3._01 * value_x3 + _this3._11 * value_y3 + _this3._21) / w3;
		var p4_x = x4;
		var p4_y = y4;
		this.coloredPainter.fillRect(this.get_opacity(),this.get_color(),p1_x,p1_y,p2_x,p2_y,p3_x,p3_y,p4_x,p4_y);
	}
	,drawString: function(text,x,y) {
		this.imagePainter.end();
		this.coloredPainter.end();
		this.textPainter.drawString(text,this.get_opacity(),this.get_color(),x,y,this.transformations[this.transformations.length - 1]);
	}
	,get_font: function() {
		return this.myFont;
	}
	,set_font: function(font) {
		this.textPainter.setFont(font);
		return this.myFont = font;
	}
	,set_fontSize: function(value) {
		return kha_graphics2_Graphics.prototype.set_fontSize.call(this,this.textPainter.fontSize = value);
	}
	,drawLine: function(x1,y1,x2,y2,strength) {
		if(strength == null) strength = 1.0;
		this.imagePainter.end();
		this.textPainter.end();
		var vec;
		if(y2 == y1) vec = new kha_math_FastVector2(0,-1); else vec = new kha_math_FastVector2(1,-(x2 - x1) / (y2 - y1));
		vec.set_length(strength);
		var p1 = new kha_math_FastVector2(x1 + 0.5 * vec.x,y1 + 0.5 * vec.y);
		var p2 = new kha_math_FastVector2(x2 + 0.5 * vec.x,y2 + 0.5 * vec.y);
		var p3 = new kha_math_FastVector2(p1.x - vec.x,p1.y - vec.y);
		var p4 = new kha_math_FastVector2(p2.x - vec.x,p2.y - vec.y);
		var _this = this.transformations[this.transformations.length - 1];
		var w = _this._02 * p1.x + _this._12 * p1.y + _this._22;
		var x = (_this._00 * p1.x + _this._10 * p1.y + _this._20) / w;
		var y = (_this._01 * p1.x + _this._11 * p1.y + _this._21) / w;
		p1 = new kha_math_FastVector2(x,y);
		var _this1 = this.transformations[this.transformations.length - 1];
		var w1 = _this1._02 * p2.x + _this1._12 * p2.y + _this1._22;
		var x3 = (_this1._00 * p2.x + _this1._10 * p2.y + _this1._20) / w1;
		var y3 = (_this1._01 * p2.x + _this1._11 * p2.y + _this1._21) / w1;
		p2 = new kha_math_FastVector2(x3,y3);
		var _this2 = this.transformations[this.transformations.length - 1];
		var w2 = _this2._02 * p3.x + _this2._12 * p3.y + _this2._22;
		var x4 = (_this2._00 * p3.x + _this2._10 * p3.y + _this2._20) / w2;
		var y4 = (_this2._01 * p3.x + _this2._11 * p3.y + _this2._21) / w2;
		p3 = new kha_math_FastVector2(x4,y4);
		var _this3 = this.transformations[this.transformations.length - 1];
		var w3 = _this3._02 * p4.x + _this3._12 * p4.y + _this3._22;
		var x5 = (_this3._00 * p4.x + _this3._10 * p4.y + _this3._20) / w3;
		var y5 = (_this3._01 * p4.x + _this3._11 * p4.y + _this3._21) / w3;
		p4 = new kha_math_FastVector2(x5,y5);
		this.coloredPainter.fillTriangle(this.get_opacity(),this.get_color(),p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
		this.coloredPainter.fillTriangle(this.get_opacity(),this.get_color(),p3.x,p3.y,p2.x,p2.y,p4.x,p4.y);
	}
	,fillTriangle: function(x1,y1,x2,y2,x3,y3) {
		this.imagePainter.end();
		this.textPainter.end();
		var _this = this.transformations[this.transformations.length - 1];
		var value_x = x1;
		var value_y = y1;
		var w = _this._02 * value_x + _this._12 * value_y + _this._22;
		var x = (_this._00 * value_x + _this._10 * value_y + _this._20) / w;
		var y = (_this._01 * value_x + _this._11 * value_y + _this._21) / w;
		var p1_x = x;
		var p1_y = y;
		var _this1 = this.transformations[this.transformations.length - 1];
		var value_x1 = x2;
		var value_y1 = y2;
		var w1 = _this1._02 * value_x1 + _this1._12 * value_y1 + _this1._22;
		var x4 = (_this1._00 * value_x1 + _this1._10 * value_y1 + _this1._20) / w1;
		var y4 = (_this1._01 * value_x1 + _this1._11 * value_y1 + _this1._21) / w1;
		var p2_x = x4;
		var p2_y = y4;
		var _this2 = this.transformations[this.transformations.length - 1];
		var value_x2 = x3;
		var value_y2 = y3;
		var w2 = _this2._02 * value_x2 + _this2._12 * value_y2 + _this2._22;
		var x5 = (_this2._00 * value_x2 + _this2._10 * value_y2 + _this2._20) / w2;
		var y5 = (_this2._01 * value_x2 + _this2._11 * value_y2 + _this2._21) / w2;
		var p3_x = x5;
		var p3_y = y5;
		this.coloredPainter.fillTriangle(this.get_opacity(),this.get_color(),p1_x,p1_y,p2_x,p2_y,p3_x,p3_y);
	}
	,myImageScaleQuality: null
	,get_imageScaleQuality: function() {
		return this.myImageScaleQuality;
	}
	,set_imageScaleQuality: function(value) {
		this.imagePainter.setBilinearFilter(value == kha_graphics2_ImageScaleQuality.High);
		this.textPainter.setBilinearFilter(value == kha_graphics2_ImageScaleQuality.High);
		return this.myImageScaleQuality = value;
	}
	,setPipeline: function(pipeline) {
		this.flush();
		this.imagePainter.set_pipeline(pipeline);
		this.coloredPainter.set_pipeline(pipeline);
		this.textPainter.set_pipeline(pipeline);
		if(pipeline != null) this.g.setPipeline(pipeline);
	}
	,setBlendingMode: function(source,destination) {
		this.flush();
		this.imagePainter.sourceBlend = source;
		this.imagePainter.destinationBlend = destination;
		this.coloredPainter.sourceBlend = source;
		this.coloredPainter.destinationBlend = destination;
		this.textPainter.sourceBlend = source;
		this.textPainter.destinationBlend = destination;
	}
	,scissor: function(x,y,width,height) {
		this.flush();
		this.g.scissor(x,y,width,height);
	}
	,disableScissor: function() {
		this.flush();
		this.g.disableScissor();
	}
	,begin: function(clear,clearColor) {
		if(clear == null) clear = true;
		this.g.begin();
		if(clear) this.clear(clearColor);
		this.setProjection();
	}
	,clear: function(color) {
		this.g.clear(color == null?kha__$Color_Color_$Impl_$.Black:color);
	}
	,flush: function() {
		this.imagePainter.end();
		this.textPainter.end();
		this.coloredPainter.end();
	}
	,end: function() {
		this.flush();
		this.g.end();
	}
	,drawVideoInternal: function(video,x,y,width,height) {
	}
	,drawVideo: function(video,x,y,width,height) {
		this.setPipeline(this.videoPipeline);
		this.drawVideoInternal(video,x,y,width,height);
		this.setPipeline(null);
	}
	,__class__: kha_graphics4_Graphics2
});
var kha_graphics4_IndexBuffer = function(indexCount,usage,canRead) {
	if(canRead == null) canRead = false;
	this.usage = usage;
	this.mySize = indexCount;
	this.buffer = kha_SystemImpl.gl.createBuffer();
	this.data = [];
	this.data[indexCount - 1] = 0;
};
$hxClasses["kha.graphics4.IndexBuffer"] = kha_graphics4_IndexBuffer;
kha_graphics4_IndexBuffer.__name__ = true;
kha_graphics4_IndexBuffer.prototype = {
	buffer: null
	,data: null
	,mySize: null
	,usage: null
	,lock: function() {
		return this.data;
	}
	,unlock: function() {
		kha_SystemImpl.gl.bindBuffer(34963,this.buffer);
		kha_SystemImpl.gl.bufferData(34963,new Uint16Array(this.data),this.usage == kha_graphics4_Usage.DynamicUsage?35048:35044);
	}
	,set: function() {
		kha_SystemImpl.gl.bindBuffer(34963,this.buffer);
	}
	,count: function() {
		return this.mySize;
	}
	,__class__: kha_graphics4_IndexBuffer
};
var kha_graphics4_MipMapFilter = $hxClasses["kha.graphics4.MipMapFilter"] = { __ename__ : true, __constructs__ : ["NoMipFilter","PointMipFilter","LinearMipFilter"] };
kha_graphics4_MipMapFilter.NoMipFilter = ["NoMipFilter",0];
kha_graphics4_MipMapFilter.NoMipFilter.toString = $estr;
kha_graphics4_MipMapFilter.NoMipFilter.__enum__ = kha_graphics4_MipMapFilter;
kha_graphics4_MipMapFilter.PointMipFilter = ["PointMipFilter",1];
kha_graphics4_MipMapFilter.PointMipFilter.toString = $estr;
kha_graphics4_MipMapFilter.PointMipFilter.__enum__ = kha_graphics4_MipMapFilter;
kha_graphics4_MipMapFilter.LinearMipFilter = ["LinearMipFilter",2];
kha_graphics4_MipMapFilter.LinearMipFilter.toString = $estr;
kha_graphics4_MipMapFilter.LinearMipFilter.__enum__ = kha_graphics4_MipMapFilter;
var kha_graphics4_PipelineStateBase = function() {
	this.inputLayout = null;
	this.vertexShader = null;
	this.fragmentShader = null;
	this.cullMode = kha_graphics4_CullMode.None;
	this.depthWrite = false;
	this.depthMode = kha_graphics4_CompareMode.Always;
	this.stencilMode = kha_graphics4_CompareMode.Always;
	this.stencilBothPass = kha_graphics4_StencilAction.Keep;
	this.stencilDepthFail = kha_graphics4_StencilAction.Keep;
	this.stencilFail = kha_graphics4_StencilAction.Keep;
	this.stencilReferenceValue = 0;
	this.stencilReadMask = 255;
	this.stencilWriteMask = 255;
	this.blendSource = kha_graphics4_BlendingOperation.BlendOne;
	this.blendDestination = kha_graphics4_BlendingOperation.BlendZero;
};
$hxClasses["kha.graphics4.PipelineStateBase"] = kha_graphics4_PipelineStateBase;
kha_graphics4_PipelineStateBase.__name__ = true;
kha_graphics4_PipelineStateBase.prototype = {
	inputLayout: null
	,vertexShader: null
	,fragmentShader: null
	,cullMode: null
	,depthWrite: null
	,depthMode: null
	,stencilMode: null
	,stencilBothPass: null
	,stencilDepthFail: null
	,stencilFail: null
	,stencilReferenceValue: null
	,stencilReadMask: null
	,stencilWriteMask: null
	,blendSource: null
	,blendDestination: null
	,__class__: kha_graphics4_PipelineStateBase
};
var kha_graphics4_PipelineState = function() {
	kha_graphics4_PipelineStateBase.call(this);
	this.program = kha_SystemImpl.gl.createProgram();
	this.textures = [];
	this.textureValues = [];
};
$hxClasses["kha.graphics4.PipelineState"] = kha_graphics4_PipelineState;
kha_graphics4_PipelineState.__name__ = true;
kha_graphics4_PipelineState.__super__ = kha_graphics4_PipelineStateBase;
kha_graphics4_PipelineState.prototype = $extend(kha_graphics4_PipelineStateBase.prototype,{
	program: null
	,textures: null
	,textureValues: null
	,compile: function() {
		this.compileShader(this.vertexShader);
		this.compileShader(this.fragmentShader);
		kha_SystemImpl.gl.attachShader(this.program,this.vertexShader.shader);
		kha_SystemImpl.gl.attachShader(this.program,this.fragmentShader.shader);
		var index = 0;
		var _g = 0;
		var _g1 = this.inputLayout;
		while(_g < _g1.length) {
			var structure = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = structure.elements;
			while(_g2 < _g3.length) {
				var element = _g3[_g2];
				++_g2;
				kha_SystemImpl.gl.bindAttribLocation(this.program,index,element.name);
				if(element.data == kha_graphics4_VertexData.Float4x4) index += 4; else ++index;
			}
		}
		kha_SystemImpl.gl.linkProgram(this.program);
		if(!kha_SystemImpl.gl.getProgramParameter(this.program,35714)) throw new js__$Boot_HaxeError("Could not link the shader program.");
	}
	,set: function() {
		kha_SystemImpl.gl.useProgram(this.program);
		var _g1 = 0;
		var _g = this.textureValues.length;
		while(_g1 < _g) {
			var index = _g1++;
			kha_SystemImpl.gl.uniform1i(this.textureValues[index],index);
		}
	}
	,compileShader: function(shader) {
		if(shader.shader != null) return;
		var s = kha_SystemImpl.gl.createShader(shader.type);
		kha_SystemImpl.gl.shaderSource(s,shader.source);
		kha_SystemImpl.gl.compileShader(s);
		if(!kha_SystemImpl.gl.getShaderParameter(s,35713)) throw new js__$Boot_HaxeError("Could not compile shader:\n" + kha_SystemImpl.gl.getShaderInfoLog(s));
		shader.shader = s;
	}
	,getConstantLocation: function(name) {
		return new kha_js_graphics4_ConstantLocation(kha_SystemImpl.gl.getUniformLocation(this.program,name));
	}
	,getTextureUnit: function(name) {
		var index = this.findTexture(name);
		if(index < 0) {
			var location = kha_SystemImpl.gl.getUniformLocation(this.program,name);
			index = this.textures.length;
			this.textureValues.push(location);
			this.textures.push(name);
		}
		return new kha_js_graphics4_TextureUnit(index);
	}
	,findTexture: function(name) {
		var _g1 = 0;
		var _g = this.textures.length;
		while(_g1 < _g) {
			var index = _g1++;
			if(this.textures[index] == name) return index;
		}
		return -1;
	}
	,__class__: kha_graphics4_PipelineState
});
var kha_graphics4_StencilAction = $hxClasses["kha.graphics4.StencilAction"] = { __ename__ : true, __constructs__ : ["Keep","Zero","Replace","Increment","IncrementWrap","Decrement","DecrementWrap","Invert"] };
kha_graphics4_StencilAction.Keep = ["Keep",0];
kha_graphics4_StencilAction.Keep.toString = $estr;
kha_graphics4_StencilAction.Keep.__enum__ = kha_graphics4_StencilAction;
kha_graphics4_StencilAction.Zero = ["Zero",1];
kha_graphics4_StencilAction.Zero.toString = $estr;
kha_graphics4_StencilAction.Zero.__enum__ = kha_graphics4_StencilAction;
kha_graphics4_StencilAction.Replace = ["Replace",2];
kha_graphics4_StencilAction.Replace.toString = $estr;
kha_graphics4_StencilAction.Replace.__enum__ = kha_graphics4_StencilAction;
kha_graphics4_StencilAction.Increment = ["Increment",3];
kha_graphics4_StencilAction.Increment.toString = $estr;
kha_graphics4_StencilAction.Increment.__enum__ = kha_graphics4_StencilAction;
kha_graphics4_StencilAction.IncrementWrap = ["IncrementWrap",4];
kha_graphics4_StencilAction.IncrementWrap.toString = $estr;
kha_graphics4_StencilAction.IncrementWrap.__enum__ = kha_graphics4_StencilAction;
kha_graphics4_StencilAction.Decrement = ["Decrement",5];
kha_graphics4_StencilAction.Decrement.toString = $estr;
kha_graphics4_StencilAction.Decrement.__enum__ = kha_graphics4_StencilAction;
kha_graphics4_StencilAction.DecrementWrap = ["DecrementWrap",6];
kha_graphics4_StencilAction.DecrementWrap.toString = $estr;
kha_graphics4_StencilAction.DecrementWrap.__enum__ = kha_graphics4_StencilAction;
kha_graphics4_StencilAction.Invert = ["Invert",7];
kha_graphics4_StencilAction.Invert.toString = $estr;
kha_graphics4_StencilAction.Invert.__enum__ = kha_graphics4_StencilAction;
var kha_graphics4_TexDir = $hxClasses["kha.graphics4.TexDir"] = { __ename__ : true, __constructs__ : ["U","V"] };
kha_graphics4_TexDir.U = ["U",0];
kha_graphics4_TexDir.U.toString = $estr;
kha_graphics4_TexDir.U.__enum__ = kha_graphics4_TexDir;
kha_graphics4_TexDir.V = ["V",1];
kha_graphics4_TexDir.V.toString = $estr;
kha_graphics4_TexDir.V.__enum__ = kha_graphics4_TexDir;
var kha_graphics4_TextureAddressing = $hxClasses["kha.graphics4.TextureAddressing"] = { __ename__ : true, __constructs__ : ["Repeat","Mirror","Clamp"] };
kha_graphics4_TextureAddressing.Repeat = ["Repeat",0];
kha_graphics4_TextureAddressing.Repeat.toString = $estr;
kha_graphics4_TextureAddressing.Repeat.__enum__ = kha_graphics4_TextureAddressing;
kha_graphics4_TextureAddressing.Mirror = ["Mirror",1];
kha_graphics4_TextureAddressing.Mirror.toString = $estr;
kha_graphics4_TextureAddressing.Mirror.__enum__ = kha_graphics4_TextureAddressing;
kha_graphics4_TextureAddressing.Clamp = ["Clamp",2];
kha_graphics4_TextureAddressing.Clamp.toString = $estr;
kha_graphics4_TextureAddressing.Clamp.__enum__ = kha_graphics4_TextureAddressing;
var kha_graphics4_TextureFilter = $hxClasses["kha.graphics4.TextureFilter"] = { __ename__ : true, __constructs__ : ["PointFilter","LinearFilter","AnisotropicFilter"] };
kha_graphics4_TextureFilter.PointFilter = ["PointFilter",0];
kha_graphics4_TextureFilter.PointFilter.toString = $estr;
kha_graphics4_TextureFilter.PointFilter.__enum__ = kha_graphics4_TextureFilter;
kha_graphics4_TextureFilter.LinearFilter = ["LinearFilter",1];
kha_graphics4_TextureFilter.LinearFilter.toString = $estr;
kha_graphics4_TextureFilter.LinearFilter.__enum__ = kha_graphics4_TextureFilter;
kha_graphics4_TextureFilter.AnisotropicFilter = ["AnisotropicFilter",2];
kha_graphics4_TextureFilter.AnisotropicFilter.toString = $estr;
kha_graphics4_TextureFilter.AnisotropicFilter.__enum__ = kha_graphics4_TextureFilter;
var kha_graphics4_TextureFormat = $hxClasses["kha.graphics4.TextureFormat"] = { __ename__ : true, __constructs__ : ["RGBA32","L8","RGBA128"] };
kha_graphics4_TextureFormat.RGBA32 = ["RGBA32",0];
kha_graphics4_TextureFormat.RGBA32.toString = $estr;
kha_graphics4_TextureFormat.RGBA32.__enum__ = kha_graphics4_TextureFormat;
kha_graphics4_TextureFormat.L8 = ["L8",1];
kha_graphics4_TextureFormat.L8.toString = $estr;
kha_graphics4_TextureFormat.L8.__enum__ = kha_graphics4_TextureFormat;
kha_graphics4_TextureFormat.RGBA128 = ["RGBA128",2];
kha_graphics4_TextureFormat.RGBA128.toString = $estr;
kha_graphics4_TextureFormat.RGBA128.__enum__ = kha_graphics4_TextureFormat;
var kha_graphics4_TextureUnit = function() { };
$hxClasses["kha.graphics4.TextureUnit"] = kha_graphics4_TextureUnit;
kha_graphics4_TextureUnit.__name__ = true;
var kha_graphics4_Usage = $hxClasses["kha.graphics4.Usage"] = { __ename__ : true, __constructs__ : ["StaticUsage","DynamicUsage","ReadableUsage"] };
kha_graphics4_Usage.StaticUsage = ["StaticUsage",0];
kha_graphics4_Usage.StaticUsage.toString = $estr;
kha_graphics4_Usage.StaticUsage.__enum__ = kha_graphics4_Usage;
kha_graphics4_Usage.DynamicUsage = ["DynamicUsage",1];
kha_graphics4_Usage.DynamicUsage.toString = $estr;
kha_graphics4_Usage.DynamicUsage.__enum__ = kha_graphics4_Usage;
kha_graphics4_Usage.ReadableUsage = ["ReadableUsage",2];
kha_graphics4_Usage.ReadableUsage.toString = $estr;
kha_graphics4_Usage.ReadableUsage.__enum__ = kha_graphics4_Usage;
var kha_graphics4_VertexBuffer = function(vertexCount,structure,usage,instanceDataStepRate,canRead) {
	if(canRead == null) canRead = false;
	if(instanceDataStepRate == null) instanceDataStepRate = 0;
	this.usage = usage;
	this.instanceDataStepRate = instanceDataStepRate;
	this.mySize = vertexCount;
	this.myStride = 0;
	var _g = 0;
	var _g1 = structure.elements;
	while(_g < _g1.length) {
		var element = _g1[_g];
		++_g;
		var _g2 = element.data;
		switch(_g2[1]) {
		case 0:
			this.myStride += 4;
			break;
		case 1:
			this.myStride += 8;
			break;
		case 2:
			this.myStride += 12;
			break;
		case 3:
			this.myStride += 16;
			break;
		case 4:
			this.myStride += 64;
			break;
		}
	}
	this.buffer = kha_SystemImpl.gl.createBuffer();
	this.data = new Float32Array(vertexCount * this.myStride / 4 | 0);
	this.sizes = [];
	this.offsets = [];
	this.sizes[structure.elements.length - 1] = 0;
	this.offsets[structure.elements.length - 1] = 0;
	var offset = 0;
	var index = 0;
	var _g3 = 0;
	var _g11 = structure.elements;
	while(_g3 < _g11.length) {
		var element1 = _g11[_g3];
		++_g3;
		var size;
		var _g21 = element1.data;
		switch(_g21[1]) {
		case 0:
			size = 1;
			break;
		case 1:
			size = 2;
			break;
		case 2:
			size = 3;
			break;
		case 3:
			size = 4;
			break;
		case 4:
			size = 16;
			break;
		}
		this.sizes[index] = size;
		this.offsets[index] = offset;
		var _g22 = element1.data;
		switch(_g22[1]) {
		case 0:
			offset += 4;
			break;
		case 1:
			offset += 8;
			break;
		case 2:
			offset += 12;
			break;
		case 3:
			offset += 16;
			break;
		case 4:
			offset += 64;
			break;
		}
		++index;
	}
};
$hxClasses["kha.graphics4.VertexBuffer"] = kha_graphics4_VertexBuffer;
kha_graphics4_VertexBuffer.__name__ = true;
kha_graphics4_VertexBuffer.prototype = {
	buffer: null
	,data: null
	,mySize: null
	,myStride: null
	,sizes: null
	,offsets: null
	,usage: null
	,instanceDataStepRate: null
	,lock: function(start,count) {
		return this.data;
	}
	,unlock: function() {
		kha_SystemImpl.gl.bindBuffer(34962,this.buffer);
		kha_SystemImpl.gl.bufferData(34962,this.data,this.usage == kha_graphics4_Usage.DynamicUsage?35048:35044);
	}
	,stride: function() {
		return this.myStride;
	}
	,count: function() {
		return this.mySize;
	}
	,set: function(offset) {
		var ext = kha_SystemImpl.gl.getExtension("ANGLE_instanced_arrays");
		kha_SystemImpl.gl.bindBuffer(34962,this.buffer);
		var attributesOffset = 0;
		var _g1 = 0;
		var _g = this.sizes.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.sizes[i] > 4) {
				var size = this.sizes[i];
				var addonOffset = 0;
				while(size > 0) {
					kha_SystemImpl.gl.enableVertexAttribArray(offset + attributesOffset);
					kha_SystemImpl.gl.vertexAttribPointer(offset + attributesOffset,4,5126,false,this.myStride,this.offsets[i] + addonOffset);
					if(ext) ext.vertexAttribDivisorANGLE(offset + attributesOffset,this.instanceDataStepRate);
					size -= 4;
					addonOffset += 16;
					++attributesOffset;
				}
			} else {
				kha_SystemImpl.gl.enableVertexAttribArray(offset + attributesOffset);
				kha_SystemImpl.gl.vertexAttribPointer(offset + attributesOffset,this.sizes[i],5126,false,this.myStride,this.offsets[i]);
				if(ext) ext.vertexAttribDivisorANGLE(offset + attributesOffset,this.instanceDataStepRate);
				++attributesOffset;
			}
		}
		return attributesOffset;
	}
	,__class__: kha_graphics4_VertexBuffer
};
var kha_graphics4_VertexData = $hxClasses["kha.graphics4.VertexData"] = { __ename__ : true, __constructs__ : ["Float1","Float2","Float3","Float4","Float4x4"] };
kha_graphics4_VertexData.Float1 = ["Float1",0];
kha_graphics4_VertexData.Float1.toString = $estr;
kha_graphics4_VertexData.Float1.__enum__ = kha_graphics4_VertexData;
kha_graphics4_VertexData.Float2 = ["Float2",1];
kha_graphics4_VertexData.Float2.toString = $estr;
kha_graphics4_VertexData.Float2.__enum__ = kha_graphics4_VertexData;
kha_graphics4_VertexData.Float3 = ["Float3",2];
kha_graphics4_VertexData.Float3.toString = $estr;
kha_graphics4_VertexData.Float3.__enum__ = kha_graphics4_VertexData;
kha_graphics4_VertexData.Float4 = ["Float4",3];
kha_graphics4_VertexData.Float4.toString = $estr;
kha_graphics4_VertexData.Float4.__enum__ = kha_graphics4_VertexData;
kha_graphics4_VertexData.Float4x4 = ["Float4x4",4];
kha_graphics4_VertexData.Float4x4.toString = $estr;
kha_graphics4_VertexData.Float4x4.__enum__ = kha_graphics4_VertexData;
var kha_graphics4_VertexElement = function(name,data) {
	this.name = name;
	this.data = data;
};
$hxClasses["kha.graphics4.VertexElement"] = kha_graphics4_VertexElement;
kha_graphics4_VertexElement.__name__ = true;
kha_graphics4_VertexElement.prototype = {
	name: null
	,data: null
	,__class__: kha_graphics4_VertexElement
};
var kha_graphics4_VertexShader = function(source) {
	this.source = source.toString();
	this.type = 35633;
	this.shader = null;
};
$hxClasses["kha.graphics4.VertexShader"] = kha_graphics4_VertexShader;
kha_graphics4_VertexShader.__name__ = true;
kha_graphics4_VertexShader.prototype = {
	source: null
	,type: null
	,shader: null
	,__class__: kha_graphics4_VertexShader
};
var kha_graphics4_VertexStructure = function() {
	this.elements = [];
};
$hxClasses["kha.graphics4.VertexStructure"] = kha_graphics4_VertexStructure;
kha_graphics4_VertexStructure.__name__ = true;
kha_graphics4_VertexStructure.prototype = {
	elements: null
	,add: function(name,data) {
		this.elements.push(new kha_graphics4_VertexElement(name,data));
	}
	,size: function() {
		return this.elements.length;
	}
	,byteSize: function() {
		var byteSize = 0;
		var _g1 = 0;
		var _g = this.elements.length;
		while(_g1 < _g) {
			var i = _g1++;
			byteSize += this.dataByteSize(this.elements[i].data);
		}
		return byteSize;
	}
	,dataByteSize: function(data) {
		switch(data[1]) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 16;
		}
		return 0;
	}
	,get: function(index) {
		return this.elements[index];
	}
	,__class__: kha_graphics4_VertexStructure
};
var kha_input_Gamepad = $hx_exports.kha.input.Gamepad = function(id) {
	if(id == null) id = 0;
	this.axisListeners = [];
	this.buttonListeners = [];
	kha_input_Gamepad.instances[id] = this;
};
$hxClasses["kha.input.Gamepad"] = kha_input_Gamepad;
kha_input_Gamepad.__name__ = true;
kha_input_Gamepad.get = function(num) {
	if(num == null) num = 0;
	if(num >= kha_input_Gamepad.instances.length) return null;
	return kha_input_Gamepad.instances[num];
};
kha_input_Gamepad.prototype = {
	notify: function(axisListener,buttonListener) {
		if(axisListener != null) this.axisListeners.push(axisListener);
		if(buttonListener != null) this.buttonListeners.push(buttonListener);
	}
	,remove: function(axisListener,buttonListener) {
		if(axisListener != null) HxOverrides.remove(this.axisListeners,axisListener);
		if(buttonListener != null) HxOverrides.remove(this.buttonListeners,buttonListener);
	}
	,axisListeners: null
	,buttonListeners: null
	,sendAxisEvent: function(axis,value) {
		var _g = 0;
		var _g1 = this.axisListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(axis,value);
		}
	}
	,sendButtonEvent: function(button,value) {
		var _g = 0;
		var _g1 = this.buttonListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(button,value);
		}
	}
	,__class__: kha_input_Gamepad
};
var kha_network_Controller = function() {
	this.__id = kha_network_ControllerBuilder.nextId++;
};
$hxClasses["kha.network.Controller"] = kha_network_Controller;
kha_network_Controller.__name__ = true;
kha_network_Controller.prototype = {
	__id: null
	,_id: function() {
		return this.__id;
	}
	,_receive: function(offset,bytes) {
	}
	,__class__: kha_network_Controller
};
var kha_input_Keyboard = $hx_exports.kha.input.Keyboard = function() {
	kha_network_Controller.call(this);
	this.downListeners = [];
	this.upListeners = [];
	kha_input_Keyboard.instance = this;
};
$hxClasses["kha.input.Keyboard"] = kha_input_Keyboard;
kha_input_Keyboard.__name__ = true;
kha_input_Keyboard.get = function(num) {
	if(num == null) num = 0;
	return kha_SystemImpl.getKeyboard(num);
};
kha_input_Keyboard.__super__ = kha_network_Controller;
kha_input_Keyboard.prototype = $extend(kha_network_Controller.prototype,{
	notify: function(downListener,upListener) {
		if(downListener != null) this.downListeners.push(downListener);
		if(upListener != null) this.upListeners.push(upListener);
	}
	,remove: function(downListener,upListener) {
		if(downListener != null) HxOverrides.remove(this.downListeners,downListener);
		if(upListener != null) HxOverrides.remove(this.upListeners,upListener);
	}
	,show: function() {
	}
	,hide: function() {
	}
	,downListeners: null
	,upListeners: null
	,sendDownEvent: function(key,$char) {
		if(kha_network_Session.the() != null) {
			var bytes = haxe_io_Bytes.alloc(28);
			bytes.b[0] = 2;
			bytes.setInt32(1,this._id());
			bytes.setDouble(5,kha_Scheduler.realTime());
			bytes.setInt32(13,kha_System.get_pixelWidth());
			bytes.setInt32(17,kha_System.get_pixelHeight());
			bytes.set(21,(function($this) {
				var $r;
				var e = kha_System.get_screenRotation();
				$r = e[1];
				return $r;
			}(this)));
			bytes.setInt32(22,0);
			bytes.b[26] = key[1] & 255;
			bytes.set(27,HxOverrides.cca($char,0));
			kha_network_Session.the().network.send(bytes,false);
		}
		var _g = 0;
		var _g1 = this.downListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(key,$char);
		}
	}
	,sendUpEvent: function(key,$char) {
		if(kha_network_Session.the() != null) {
			var bytes = haxe_io_Bytes.alloc(28);
			bytes.b[0] = 2;
			bytes.setInt32(1,this._id());
			bytes.setDouble(5,kha_Scheduler.realTime());
			bytes.setInt32(13,kha_System.get_pixelWidth());
			bytes.setInt32(17,kha_System.get_pixelHeight());
			bytes.set(21,(function($this) {
				var $r;
				var e = kha_System.get_screenRotation();
				$r = e[1];
				return $r;
			}(this)));
			bytes.setInt32(22,1);
			bytes.b[26] = key[1] & 255;
			bytes.set(27,HxOverrides.cca($char,0));
			kha_network_Session.the().network.send(bytes,false);
		}
		var _g = 0;
		var _g1 = this.upListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(key,$char);
		}
	}
	,_receive: function(offset,bytes) {
		var funcindex = bytes.getInt32(offset);
		if(funcindex == 0) {
			var input0 = Type.createEnumIndex(kha_Key,bytes.b[offset + 4],null);
			var input1 = String.fromCharCode(bytes.b[offset + 5]);
			this.sendDownEvent(input0,input1);
			return;
		}
		if(funcindex == 1) {
			var input01 = Type.createEnumIndex(kha_Key,bytes.b[offset + 4],null);
			var input11 = String.fromCharCode(bytes.b[offset + 5]);
			this.sendUpEvent(input01,input11);
			return;
		}
	}
	,__class__: kha_input_Keyboard
});
var kha_input_Mouse = $hx_exports.kha.input.Mouse = function() {
	kha_network_Controller.call(this);
	this.downListeners = [];
	this.upListeners = [];
	this.moveListeners = [];
	this.wheelListeners = [];
	kha_input_Mouse.instance = this;
};
$hxClasses["kha.input.Mouse"] = kha_input_Mouse;
kha_input_Mouse.__name__ = true;
kha_input_Mouse.get = function(num) {
	if(num == null) num = 0;
	return kha_SystemImpl.getMouse(num);
};
kha_input_Mouse.__super__ = kha_network_Controller;
kha_input_Mouse.prototype = $extend(kha_network_Controller.prototype,{
	notify: function(downListener,upListener,moveListener,wheelListener) {
		if(downListener != null) this.downListeners.push(downListener);
		if(upListener != null) this.upListeners.push(upListener);
		if(moveListener != null) this.moveListeners.push(moveListener);
		if(wheelListener != null) this.wheelListeners.push(wheelListener);
	}
	,remove: function(downListener,upListener,moveListener,wheelListener) {
		if(downListener != null) HxOverrides.remove(this.downListeners,downListener);
		if(upListener != null) HxOverrides.remove(this.upListeners,upListener);
		if(moveListener != null) HxOverrides.remove(this.moveListeners,moveListener);
		if(wheelListener != null) HxOverrides.remove(this.wheelListeners,wheelListener);
	}
	,lock: function() {
	}
	,unlock: function() {
	}
	,canLock: function() {
		return false;
	}
	,isLocked: function() {
		return false;
	}
	,notifyOnLockChange: function(func,error) {
	}
	,removeFromLockChange: function(func,error) {
	}
	,hideSystemCursor: function() {
	}
	,showSystemCursor: function() {
	}
	,downListeners: null
	,upListeners: null
	,moveListeners: null
	,wheelListeners: null
	,sendDownEvent: function(button,x,y) {
		if(kha_network_Session.the() != null) {
			var bytes = haxe_io_Bytes.alloc(38);
			bytes.b[0] = 2;
			bytes.setInt32(1,this._id());
			bytes.setDouble(5,kha_Scheduler.realTime());
			bytes.setInt32(13,kha_System.get_pixelWidth());
			bytes.setInt32(17,kha_System.get_pixelHeight());
			bytes.set(21,(function($this) {
				var $r;
				var e = kha_System.get_screenRotation();
				$r = e[1];
				return $r;
			}(this)));
			bytes.setInt32(22,0);
			bytes.setInt32(26,button);
			bytes.setInt32(30,x);
			bytes.setInt32(34,y);
			kha_network_Session.the().network.send(bytes,false);
		}
		var _g = 0;
		var _g1 = this.downListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(button,x,y);
		}
	}
	,sendUpEvent: function(button,x,y) {
		if(kha_network_Session.the() != null) {
			var bytes = haxe_io_Bytes.alloc(38);
			bytes.b[0] = 2;
			bytes.setInt32(1,this._id());
			bytes.setDouble(5,kha_Scheduler.realTime());
			bytes.setInt32(13,kha_System.get_pixelWidth());
			bytes.setInt32(17,kha_System.get_pixelHeight());
			bytes.set(21,(function($this) {
				var $r;
				var e = kha_System.get_screenRotation();
				$r = e[1];
				return $r;
			}(this)));
			bytes.setInt32(22,1);
			bytes.setInt32(26,button);
			bytes.setInt32(30,x);
			bytes.setInt32(34,y);
			kha_network_Session.the().network.send(bytes,false);
		}
		var _g = 0;
		var _g1 = this.upListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(button,x,y);
		}
	}
	,sendMoveEvent: function(x,y,movementX,movementY) {
		if(kha_network_Session.the() != null) {
			var bytes = haxe_io_Bytes.alloc(42);
			bytes.b[0] = 2;
			bytes.setInt32(1,this._id());
			bytes.setDouble(5,kha_Scheduler.realTime());
			bytes.setInt32(13,kha_System.get_pixelWidth());
			bytes.setInt32(17,kha_System.get_pixelHeight());
			bytes.set(21,(function($this) {
				var $r;
				var e = kha_System.get_screenRotation();
				$r = e[1];
				return $r;
			}(this)));
			bytes.setInt32(22,2);
			bytes.setInt32(26,x);
			bytes.setInt32(30,y);
			bytes.setInt32(34,movementX);
			bytes.setInt32(38,movementY);
			kha_network_Session.the().network.send(bytes,false);
		}
		var _g = 0;
		var _g1 = this.moveListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(x,y,movementX,movementY);
		}
	}
	,sendWheelEvent: function(delta) {
		if(kha_network_Session.the() != null) {
			var bytes = haxe_io_Bytes.alloc(30);
			bytes.b[0] = 2;
			bytes.setInt32(1,this._id());
			bytes.setDouble(5,kha_Scheduler.realTime());
			bytes.setInt32(13,kha_System.get_pixelWidth());
			bytes.setInt32(17,kha_System.get_pixelHeight());
			bytes.set(21,(function($this) {
				var $r;
				var e = kha_System.get_screenRotation();
				$r = e[1];
				return $r;
			}(this)));
			bytes.setInt32(22,3);
			bytes.setInt32(26,delta);
			kha_network_Session.the().network.send(bytes,false);
		}
		var _g = 0;
		var _g1 = this.wheelListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(delta);
		}
	}
	,_receive: function(offset,bytes) {
		var funcindex = bytes.getInt32(offset);
		if(funcindex == 0) {
			var input0 = bytes.getInt32(offset + 4);
			var input1 = bytes.getInt32(offset + 8);
			var input2 = bytes.getInt32(offset + 12);
			this.sendDownEvent(input0,input1,input2);
			return;
		}
		if(funcindex == 1) {
			var input01 = bytes.getInt32(offset + 4);
			var input11 = bytes.getInt32(offset + 8);
			var input21 = bytes.getInt32(offset + 12);
			this.sendUpEvent(input01,input11,input21);
			return;
		}
		if(funcindex == 3) {
			var input02 = bytes.getInt32(offset + 4);
			this.sendWheelEvent(input02);
			return;
		}
	}
	,__class__: kha_input_Mouse
});
var kha_input_MouseImpl = function() {
	kha_input_Mouse.call(this);
};
$hxClasses["kha.input.MouseImpl"] = kha_input_MouseImpl;
kha_input_MouseImpl.__name__ = true;
kha_input_MouseImpl.__super__ = kha_input_Mouse;
kha_input_MouseImpl.prototype = $extend(kha_input_Mouse.prototype,{
	_receive: function(offset,bytes) {
		var funcindex = bytes.getInt32(offset);
	}
	,__class__: kha_input_MouseImpl
});
var kha_input_Surface = $hx_exports.kha.input.Surface = function() {
	this.touchStartListeners = [];
	this.touchEndListeners = [];
	this.moveListeners = [];
	kha_input_Surface.instance = this;
};
$hxClasses["kha.input.Surface"] = kha_input_Surface;
kha_input_Surface.__name__ = true;
kha_input_Surface.get = function(num) {
	if(num == null) num = 0;
	if(num != 0) return null;
	return kha_input_Surface.instance;
};
kha_input_Surface.prototype = {
	notify: function(touchStartListener,touchEndListener,moveListener) {
		if(touchStartListener != null) this.touchStartListeners.push(touchStartListener);
		if(touchEndListener != null) this.touchEndListeners.push(touchEndListener);
		if(moveListener != null) this.moveListeners.push(moveListener);
	}
	,remove: function(touchStartListener,touchEndListener,moveListener) {
		if(touchStartListener != null) HxOverrides.remove(this.touchStartListeners,touchStartListener);
		if(touchEndListener != null) HxOverrides.remove(this.touchEndListeners,touchEndListener);
		if(moveListener != null) this.moveListeners.push(moveListener);
	}
	,touchStartListeners: null
	,touchEndListeners: null
	,moveListeners: null
	,sendTouchStartEvent: function(index,x,y) {
		var _g = 0;
		var _g1 = this.touchStartListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(index,x,y);
		}
	}
	,sendTouchEndEvent: function(index,x,y) {
		var _g = 0;
		var _g1 = this.touchEndListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(index,x,y);
		}
	}
	,sendMoveEvent: function(index,x,y) {
		var _g = 0;
		var _g1 = this.moveListeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			listener(index,x,y);
		}
	}
	,__class__: kha_input_Surface
};
var kha_internal_BytesBlob = function(bytes) {
	this.myFirstLine = true;
	this.bytes = bytes;
	this.buffer = [];
};
$hxClasses["kha.internal.BytesBlob"] = kha_internal_BytesBlob;
kha_internal_BytesBlob.__name__ = true;
kha_internal_BytesBlob.__interfaces__ = [kha_Resource];
kha_internal_BytesBlob.fromBytes = function(bytes) {
	return new kha_internal_BytesBlob(bytes);
};
kha_internal_BytesBlob.alloc = function(size) {
	return new kha_internal_BytesBlob(haxe_io_Bytes.alloc(size));
};
kha_internal_BytesBlob.readF32 = function(i) {
	var sign;
	if((i & -2147483648) == 0) sign = 1; else sign = -1;
	var exp = i >> 23 & 255;
	var man = i & 8388607;
	switch(exp) {
	case 0:
		return 0.0;
	case 255:
		if(man != 0) return NaN; else if(sign > 0) return Infinity; else return -Infinity;
		break;
	default:
		return sign * ((man + 8388608) / 8388608.0) * Math.pow(2,exp - 127);
	}
};
kha_internal_BytesBlob.bit = function(value,position) {
	var b = (value >>> position & 1) == 1;
	if(b) {
		var a = 3;
		++a;
		return true;
	} else {
		var c = 4;
		--c;
		return false;
	}
};
kha_internal_BytesBlob.prototype = {
	bytes: null
	,buffer: null
	,myFirstLine: null
	,sub: function(start,length) {
		return new kha_internal_BytesBlob(this.bytes.sub(start,length));
	}
	,length: null
	,get_length: function() {
		return this.bytes.length;
	}
	,writeU8: function(position,value) {
		this.bytes.b[position] = value & 255;
	}
	,readU8: function(position) {
		var $byte = this.bytes.b[position];
		++position;
		return $byte;
	}
	,readS8: function(position) {
		var $byte = this.bytes.b[position];
		++position;
		var sign;
		if(($byte & 128) == 0) sign = 1; else sign = -1;
		$byte = $byte & 127;
		return sign * $byte;
	}
	,readU16BE: function(position) {
		var first = this.bytes.b[position];
		var second = this.bytes.b[position + 1];
		position += 2;
		return first * 256 + second;
	}
	,readU16LE: function(position) {
		var first = this.bytes.b[position];
		var second = this.bytes.b[position + 1];
		position += 2;
		return second * 256 + first;
	}
	,readS16BE: function(position) {
		var first = this.bytes.b[position];
		var second = this.bytes.b[position + 1];
		position += 2;
		var sign;
		if((first & 128) == 0) sign = 1; else sign = -1;
		first = first & 127;
		if(sign == -1) return -32767 + first * 256 + second; else return first * 256 + second;
	}
	,readS16LE: function(position) {
		var first = this.bytes.b[position];
		var second = this.bytes.b[position + 1];
		var sign;
		if((second & 128) == 0) sign = 1; else sign = -1;
		second = second & 127;
		position += 2;
		if(sign == -1) return -32767 + second * 256 + first; else return second * 256 + first;
	}
	,readS32LE: function(position) {
		var fourth = this.bytes.b[position];
		var third = this.bytes.b[position + 1];
		var second = this.bytes.b[position + 2];
		var first = this.bytes.b[position + 3];
		var sign;
		if((first & 128) == 0) sign = 1; else sign = -1;
		first = first & 127;
		position += 4;
		if(sign == -1) return -2147483647 + fourth + third * 256 + second * 256 * 256 + first * 256 * 256 * 256; else return fourth + third * 256 + second * 256 * 256 + first * 256 * 256 * 256;
	}
	,readS32BE: function(position) {
		var fourth = this.bytes.b[position];
		var third = this.bytes.b[position + 1];
		var second = this.bytes.b[position + 2];
		var first = this.bytes.b[position + 3];
		var sign;
		if((fourth & 128) == 0) sign = 1; else sign = -1;
		fourth = fourth & 127;
		position += 4;
		if(sign == -1) return -2147483647 + first + second * 256 + third * 256 * 256 + fourth * 256 * 256 * 256;
		return first + second * 256 + third * 256 * 256 + fourth * 256 * 256 * 256;
	}
	,readF32LE: function(position) {
		return kha_internal_BytesBlob.readF32(this.readS32LE(position));
	}
	,readF32BE: function(position) {
		return kha_internal_BytesBlob.readF32(this.readS32BE(position));
	}
	,toString: function() {
		return this.bytes.toString();
	}
	,readUtf8Char: function(position) {
		if(position.value >= this.get_length()) return -1;
		var c = this.readU8(position.value);
		++position.value;
		var value = 0;
		if(!kha_internal_BytesBlob.bit(c,7)) value = c; else if(kha_internal_BytesBlob.bit(c,7) && kha_internal_BytesBlob.bit(c,6) && !kha_internal_BytesBlob.bit(c,5)) {
			var a = c & 31;
			var c2 = this.readU8(position.value);
			++position.value;
			var b = c2 & 63;
			value = a << 6 | b;
		} else if(kha_internal_BytesBlob.bit(c,7) && kha_internal_BytesBlob.bit(c,6) && kha_internal_BytesBlob.bit(c,5) && !kha_internal_BytesBlob.bit(c,4)) position.value += 2; else if(kha_internal_BytesBlob.bit(c,7) && kha_internal_BytesBlob.bit(c,6) && kha_internal_BytesBlob.bit(c,5) && kha_internal_BytesBlob.bit(c,4) && !kha_internal_BytesBlob.bit(c,3)) position.value += 3;
		return value;
	}
	,readUtf8Line: function(position) {
		var bufferindex = 0;
		var c = this.readUtf8Char(position);
		if(c < 0) return "";
		while(c != 10 && bufferindex < 2000) {
			this.buffer[bufferindex] = c;
			++bufferindex;
			c = this.readUtf8Char(position);
			if(position.value >= this.get_length()) {
				this.buffer[bufferindex] = c;
				++bufferindex;
				break;
			}
		}
		if(this.myFirstLine) {
			this.myFirstLine = false;
			if(bufferindex > 2 && this.buffer[0] == 239 && this.buffer[1] == 187 && this.buffer[2] == 191) {
				var chars1 = [];
				var _g1 = 3;
				var _g = bufferindex - 3;
				while(_g1 < _g) {
					var i = _g1++;
					chars1[i - 3] = this.buffer[i];
				}
				return this.toText(chars1,bufferindex - 3);
			}
		}
		var chars = [];
		var _g2 = 0;
		while(_g2 < bufferindex) {
			var i1 = _g2++;
			chars[i1] = this.buffer[i1];
		}
		return this.toText(chars,bufferindex);
	}
	,toText: function(chars,length) {
		var value = "";
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			value += String.fromCharCode(chars[i]);
		}
		return value;
	}
	,readUtf8String: function() {
		var text = "";
		var position = { value : 0};
		while(position.value < this.get_length()) text += this.readUtf8Line(position) + "\n";
		return text;
	}
	,toBytes: function() {
		return this.bytes;
	}
	,unload: function() {
		this.bytes = null;
	}
	,__class__: kha_internal_BytesBlob
};
var kha_js_AEAudioChannel = function(sound) {
	this.element = sound.element;
};
$hxClasses["kha.js.AEAudioChannel"] = kha_js_AEAudioChannel;
kha_js_AEAudioChannel.__name__ = true;
kha_js_AEAudioChannel.__interfaces__ = [kha_audio1_AudioChannel];
kha_js_AEAudioChannel.prototype = {
	element: null
	,play: function() {
		this.element.play();
	}
	,pause: function() {
		try {
			this.element.pause();
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			haxe_Log.trace(e,{ fileName : "AEAudioChannel.hx", lineNumber : 22, className : "kha.js.AEAudioChannel", methodName : "pause"});
		}
	}
	,stop: function() {
		try {
			this.element.pause();
			this.element.currentTime = 0;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			haxe_Log.trace(e,{ fileName : "AEAudioChannel.hx", lineNumber : 32, className : "kha.js.AEAudioChannel", methodName : "stop"});
		}
	}
	,length: null
	,get_length: function() {
		if(isFinite(this.element.duration)) return this.element.duration; else return -1;
	}
	,position: null
	,get_position: function() {
		return this.element.currentTime;
	}
	,get_volume: function() {
		return 1;
	}
	,set_volume: function(value) {
		return 1;
	}
	,finished: null
	,get_finished: function() {
		return this.get_position() >= this.get_length();
	}
	,__class__: kha_js_AEAudioChannel
};
var kha_js_AudioElementAudio = function() { };
$hxClasses["kha.js.AudioElementAudio"] = kha_js_AudioElementAudio;
kha_js_AudioElementAudio.__name__ = true;
kha_js_AudioElementAudio._compile = function() {
};
kha_js_AudioElementAudio.play = function(sound,loop,stream) {
	if(stream == null) stream = false;
	if(loop == null) loop = false;
	sound.element.loop = loop;
	sound.element.play();
	return new kha_js_AEAudioChannel(sound);
};
var kha_js_CanvasGraphics = function(canvas,width,height) {
	kha_graphics2_Graphics.call(this);
	this.canvas = canvas;
	this.width = width;
	this.height = height;
	kha_js_CanvasGraphics.instance = this;
	this.myColor = kha__$Color_Color_$Impl_$.fromBytes(0,0,0);
	canvas.save();
};
$hxClasses["kha.js.CanvasGraphics"] = kha_js_CanvasGraphics;
kha_js_CanvasGraphics.__name__ = true;
kha_js_CanvasGraphics.stringWidth = function(font,text) {
	if(kha_js_CanvasGraphics.instance == null) return 5 * text.length; else {
		kha_js_CanvasGraphics.instance.set_font(font);
		return kha_js_CanvasGraphics.instance.canvas.measureText(text).width;
	}
};
kha_js_CanvasGraphics.__super__ = kha_graphics2_Graphics;
kha_js_CanvasGraphics.prototype = $extend(kha_graphics2_Graphics.prototype,{
	canvas: null
	,webfont: null
	,width: null
	,height: null
	,myColor: null
	,scaleQuality: null
	,begin: function(clear,clearColor) {
		if(clear == null) clear = true;
		if(clear) this.clear(clearColor);
	}
	,clear: function(color) {
		if(color == null) color = 0;
		this.canvas.strokeStyle = "rgba(" + kha__$Color_Color_$Impl_$.get_Rb(color) + "," + kha__$Color_Color_$Impl_$.get_Gb(color) + "," + kha__$Color_Color_$Impl_$.get_Bb(color) + "," + kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098 + ")";
		this.canvas.fillStyle = "rgba(" + kha__$Color_Color_$Impl_$.get_Rb(color) + "," + kha__$Color_Color_$Impl_$.get_Gb(color) + "," + kha__$Color_Color_$Impl_$.get_Bb(color) + "," + kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098 + ")";
		if(kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098 == 0) this.canvas.clearRect(0,0,this.width,this.height); else this.canvas.fillRect(0,0,this.width,this.height);
		this.set_color(this.myColor);
	}
	,end: function() {
	}
	,drawImage: function(img,x,y) {
		this.canvas.globalAlpha = this.get_opacity();
		this.canvas.drawImage((js_Boot.__cast(img , kha_CanvasImage)).image,x,y);
		this.canvas.globalAlpha = 1;
	}
	,drawScaledSubImage: function(image,sx,sy,sw,sh,dx,dy,dw,dh) {
		this.canvas.globalAlpha = this.get_opacity();
		try {
			if(dw < 0 || dh < 0) {
				this.canvas.save();
				this.canvas.translate(dx,dy);
				var x = 0.0;
				var y = 0.0;
				if(dw < 0) {
					this.canvas.scale(-1,1);
					x = -dw;
				}
				if(dh < 0) {
					this.canvas.scale(1,-1);
					y = -dh;
				}
				this.canvas.drawImage((js_Boot.__cast(image , kha_CanvasImage)).image,sx,sy,sw,sh,x,y,dw,dh);
				this.canvas.restore();
			} else this.canvas.drawImage((js_Boot.__cast(image , kha_CanvasImage)).image,sx,sy,sw,sh,dx,dy,dw,dh);
		} catch( ex ) {
			if (ex instanceof js__$Boot_HaxeError) ex = ex.val;
		}
		this.canvas.globalAlpha = 1;
	}
	,set_color: function(color) {
		this.myColor = color;
		this.canvas.strokeStyle = "rgba(" + kha__$Color_Color_$Impl_$.get_Rb(color) + "," + kha__$Color_Color_$Impl_$.get_Gb(color) + "," + kha__$Color_Color_$Impl_$.get_Bb(color) + "," + kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098 + ")";
		this.canvas.fillStyle = "rgba(" + kha__$Color_Color_$Impl_$.get_Rb(color) + "," + kha__$Color_Color_$Impl_$.get_Gb(color) + "," + kha__$Color_Color_$Impl_$.get_Bb(color) + "," + kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098 + ")";
		return color;
	}
	,get_color: function() {
		return this.myColor;
	}
	,get_imageScaleQuality: function() {
		return this.scaleQuality;
	}
	,set_imageScaleQuality: function(value) {
		if(value == kha_graphics2_ImageScaleQuality.Low) {
			this.canvas.mozImageSmoothingEnabled = false;
			this.canvas.webkitImageSmoothingEnabled = false;
			this.canvas.msImageSmoothingEnabled = false;
			this.canvas.imageSmoothingEnabled = false;
		} else {
			this.canvas.mozImageSmoothingEnabled = true;
			this.canvas.webkitImageSmoothingEnabled = true;
			this.canvas.msImageSmoothingEnabled = true;
			this.canvas.imageSmoothingEnabled = true;
		}
		return this.scaleQuality = value;
	}
	,drawRect: function(x,y,width,height,strength) {
		if(strength == null) strength = 1.0;
		this.canvas.beginPath();
		var oldStrength = this.canvas.lineWidth;
		this.canvas.lineWidth = Math.round(strength);
		this.canvas.rect(x,y,width,height);
		this.canvas.stroke();
		this.canvas.lineWidth = oldStrength;
	}
	,fillRect: function(x,y,width,height) {
		this.canvas.globalAlpha = this.get_opacity() * (kha__$Color_Color_$Impl_$.get_Ab(this.myColor) * 0.00392156862745098);
		this.canvas.fillRect(x,y,width,height);
		this.canvas.globalAlpha = this.get_opacity();
	}
	,drawCircle: function(cx,cy,radius,strength) {
		if(strength == null) strength = 1.0;
		this.canvas.beginPath();
		var oldStrength = this.canvas.lineWidth;
		this.canvas.lineWidth = Math.round(strength);
		this.canvas.arc(cx,cy,radius,0,2 * Math.PI,false);
		this.canvas.stroke();
		this.canvas.lineWidth = oldStrength;
	}
	,fillCircle: function(cx,cy,radius) {
		this.canvas.beginPath();
		this.canvas.arc(cx,cy,radius,0,2 * Math.PI,false);
		this.canvas.fill();
	}
	,drawString: function(text,x,y) {
		var image = this.webfont.getImage(this.get_fontSize(),this.myColor);
		if(image.width > 0) {
			var xpos = x;
			var ypos = y;
			var _g1 = 0;
			var _g = text.length;
			while(_g1 < _g) {
				var i = _g1++;
				var q = this.webfont.kravur._get(this.get_fontSize()).getBakedQuad(HxOverrides.cca(text,i) - 32,xpos,ypos);
				if(q != null) {
					if(q.s1 - q.s0 > 0 && q.t1 - q.t0 > 0 && q.x1 - q.x0 > 0 && q.y1 - q.y0 > 0) this.canvas.drawImage(image,q.s0 * image.width,q.t0 * image.height,(q.s1 - q.s0) * image.width,(q.t1 - q.t0) * image.height,q.x0,q.y0,q.x1 - q.x0,q.y1 - q.y0);
					xpos += q.xadvance;
				}
			}
		}
	}
	,set_font: function(font) {
		this.webfont = js_Boot.__cast(font , kha_js_Font);
		return this.webfont;
	}
	,get_font: function() {
		return this.webfont;
	}
	,drawLine: function(x1,y1,x2,y2,strength) {
		if(strength == null) strength = 1.0;
		this.canvas.beginPath();
		var oldWith = this.canvas.lineWidth;
		this.canvas.lineWidth = Math.round(strength);
		this.canvas.moveTo(x1,y1);
		this.canvas.lineTo(x2,y2);
		this.canvas.moveTo(0,0);
		this.canvas.stroke();
		this.canvas.lineWidth = oldWith;
	}
	,fillTriangle: function(x1,y1,x2,y2,x3,y3) {
		this.canvas.beginPath();
		this.canvas.closePath();
		this.canvas.fill();
	}
	,scissor: function(x,y,width,height) {
		this.canvas.beginPath();
		this.canvas.rect(x,y,width,height);
		this.canvas.clip();
	}
	,disableScissor: function() {
		this.canvas.restore();
	}
	,drawVideo: function(video,x,y,width,height) {
		this.canvas.drawImage((js_Boot.__cast(video , kha_js_Video)).element,x,y,width,height);
	}
	,setTransformation: function(transformation) {
		this.canvas.setTransform(transformation._00,transformation._01,transformation._10,transformation._11,transformation._20,transformation._21);
	}
	,__class__: kha_js_CanvasGraphics
});
var kha_js_URLParser = function(url) {
	this._parts = null;
	this._parts = ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];
	this.url = url;
	var r = new EReg("^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?://)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\\d*))?)(((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[?#]|$)))*/?)?([^?#/]*))(?:\\?([^#]*))?(?:#(.*))?)","");
	r.match(url);
	var _g1 = 0;
	var _g = this._parts.length;
	while(_g1 < _g) {
		var i = _g1++;
		Reflect.setField(this,this._parts[i],r.matched(i));
	}
};
$hxClasses["kha.js.URLParser"] = kha_js_URLParser;
kha_js_URLParser.__name__ = true;
kha_js_URLParser.parse = function(url) {
	return new kha_js_URLParser(url);
};
kha_js_URLParser.prototype = {
	url: null
	,source: null
	,protocol: null
	,authority: null
	,userInfo: null
	,user: null
	,password: null
	,host: null
	,port: null
	,relative: null
	,path: null
	,directory: null
	,file: null
	,query: null
	,anchor: null
	,_parts: null
	,toString: function() {
		var s = "For Url -> " + this.url + "\n";
		var _g1 = 0;
		var _g = this._parts.length;
		while(_g1 < _g) {
			var i = _g1++;
			s += this._parts[i] + ": " + Std.string(Reflect.field(this,this._parts[i])) + (i == this._parts.length - 1?"":"\n");
		}
		return s;
	}
	,__class__: kha_js_URLParser
};
var kha_js_EnvironmentVariables = function() {
	kha_EnvironmentVariables.call(this);
};
$hxClasses["kha.js.EnvironmentVariables"] = kha_js_EnvironmentVariables;
kha_js_EnvironmentVariables.__name__ = true;
kha_js_EnvironmentVariables.__super__ = kha_EnvironmentVariables;
kha_js_EnvironmentVariables.prototype = $extend(kha_EnvironmentVariables.prototype,{
	getVariable: function(name) {
		var parser = new kha_js_URLParser(window.location.href);
		var query = parser.query;
		var parts = query.split("&");
		var _g = 0;
		while(_g < parts.length) {
			var part = parts[_g];
			++_g;
			var subparts = part.split("=");
			if(subparts[0] == name) return subparts[1];
		}
		haxe_Log.trace("Environment variables requested.",{ fileName : "EnvironmentVariables.hx", lineNumber : 90, className : "kha.js.EnvironmentVariables", methodName : "getVariable"});
		return "";
	}
	,__class__: kha_js_EnvironmentVariables
});
var kha_js_Font = function(kravur) {
	this.images = new haxe_ds_IntMap();
	this.kravur = kravur;
};
$hxClasses["kha.js.Font"] = kha_js_Font;
kha_js_Font.__name__ = true;
kha_js_Font.__interfaces__ = [kha_Font];
kha_js_Font.prototype = {
	kravur: null
	,images: null
	,height: function(fontSize) {
		return this.kravur._get(fontSize).getHeight();
	}
	,width: function(fontSize,str) {
		return this.kravur._get(fontSize).stringWidth(str);
	}
	,baseline: function(fontSize) {
		return this.kravur._get(fontSize).getBaselinePosition();
	}
	,getImage: function(fontSize,color) {
		if(!this.images.h.hasOwnProperty(fontSize)) {
			var v = new haxe_ds_IntMap();
			this.images.h[fontSize] = v;
			v;
		}
		if(!(function($this) {
			var $r;
			var this1 = $this.images.h[fontSize];
			$r = this1.exists(color);
			return $r;
		}(this))) {
			var kravur = this.kravur._get(fontSize);
			var canvas = window.document.createElement("canvas");
			canvas.width = kravur.width;
			canvas.height = kravur.height;
			var ctx = canvas.getContext("2d");
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,kravur.width,kravur.height);
			var imageData = ctx.getImageData(0,0,kravur.width,kravur.height);
			var bytes;
			bytes = (js_Boot.__cast(kravur.getTexture() , kha_CanvasImage)).bytes;
			var _g1 = 0;
			var _g = bytes.length;
			while(_g1 < _g) {
				var i = _g1++;
				imageData.data[i * 4] = kha__$Color_Color_$Impl_$.get_Rb(color);
				imageData.data[i * 4 + 1] = kha__$Color_Color_$Impl_$.get_Gb(color);
				imageData.data[i * 4 + 2] = kha__$Color_Color_$Impl_$.get_Bb(color);
				imageData.data[i * 4 + 3] = bytes.b[i];
			}
			ctx.putImageData(imageData,0,0);
			var img = window.document.createElement("img");
			img.src = canvas.toDataURL("image/png");
			var this2 = this.images.h[fontSize];
			this2.set(color,img);
			img;
			return img;
		}
		var this3 = this.images.h[fontSize];
		return this3.get(color);
	}
	,unload: function() {
		this.kravur = null;
		this.images = null;
	}
	,__class__: kha_js_Font
};
var kha_js_Sound = function(filenames,done) {
	kha_Sound.call(this);
	this.done = done;
	kha_js_Sound.loading.add(this);
	var _this = window.document;
	this.element = _this.createElement("audio");
	this.filenames = [];
	var _g = 0;
	while(_g < filenames.length) {
		var filename = filenames[_g];
		++_g;
		if(this.element.canPlayType("audio/ogg") != "" && StringTools.endsWith(filename,".ogg")) this.filenames.push(filename);
		if(this.element.canPlayType("audio/mp4") != "" && StringTools.endsWith(filename,".mp4")) this.filenames.push(filename);
	}
	this.element.addEventListener("error",$bind(this,this.errorListener),false);
	this.element.addEventListener("canplay",$bind(this,this.canPlayThroughListener),false);
	this.element.src = this.filenames[0];
	this.element.preload = "auto";
	this.element.load();
};
$hxClasses["kha.js.Sound"] = kha_js_Sound;
kha_js_Sound.__name__ = true;
kha_js_Sound.__super__ = kha_Sound;
kha_js_Sound.prototype = $extend(kha_Sound.prototype,{
	filenames: null
	,done: null
	,element: null
	,errorListener: function(eventInfo) {
		if(this.element.error.code == 4) {
			var _g1 = 0;
			var _g = this.filenames.length - 1;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.element.src == this.filenames[i]) {
					this.element.src = this.filenames[i + 1];
					return;
				}
			}
		}
		haxe_Log.trace("Error loading " + this.element.src,{ fileName : "Sound.hx", lineNumber : 108, className : "kha.js.Sound", methodName : "errorListener"});
		window.console.log("loadSound failed");
		this.finishAsset();
	}
	,canPlayThroughListener: function(eventInfo) {
		this.finishAsset();
	}
	,finishAsset: function() {
		this.element.removeEventListener("error",$bind(this,this.errorListener),false);
		this.element.removeEventListener("canplaythrough",$bind(this,this.canPlayThroughListener),false);
		this.done(this);
		kha_js_Sound.loading.remove(this);
	}
	,__class__: kha_js_Sound
});
var kha_js_Video = function(filenames,done) {
	kha_Video.call(this);
	this.done = done;
	kha_js_Video.loading.add(this);
	this.element = window.document.createElement("video");
	this.filenames = [];
	var _g = 0;
	while(_g < filenames.length) {
		var filename = filenames[_g];
		++_g;
		if(this.element.canPlayType("video/webm") != "" && StringTools.endsWith(filename,".webm")) this.filenames.push(filename);
		if(this.element.canPlayType("video/mp4") != "" && StringTools.endsWith(filename,".mp4")) this.filenames.push(filename);
	}
	this.element.addEventListener("error",$bind(this,this.errorListener),false);
	this.element.addEventListener("canplaythrough",$bind(this,this.canPlayThroughListener),false);
	this.element.preload = "auto";
	this.element.src = this.filenames[0];
};
$hxClasses["kha.js.Video"] = kha_js_Video;
kha_js_Video.__name__ = true;
kha_js_Video.__super__ = kha_Video;
kha_js_Video.prototype = $extend(kha_Video.prototype,{
	filenames: null
	,element: null
	,done: null
	,texture: null
	,width: function() {
		return this.element.videoWidth;
	}
	,height: function() {
		return this.element.videoHeight;
	}
	,play: function(loop) {
		if(loop == null) loop = false;
		try {
			this.element.loop = loop;
			this.element.play();
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			haxe_Log.trace(e,{ fileName : "Video.hx", lineNumber : 53, className : "kha.js.Video", methodName : "play"});
		}
	}
	,pause: function() {
		try {
			this.element.pause();
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			haxe_Log.trace(e,{ fileName : "Video.hx", lineNumber : 62, className : "kha.js.Video", methodName : "pause"});
		}
	}
	,stop: function() {
		try {
			this.element.pause();
			this.element.currentTime = 0;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			haxe_Log.trace(e,{ fileName : "Video.hx", lineNumber : 72, className : "kha.js.Video", methodName : "stop"});
		}
	}
	,getCurrentPos: function() {
		return Math.ceil(this.element.currentTime * 1000);
	}
	,getLength: function() {
		if(isFinite(this.element.duration)) return Math.floor(this.element.duration * 1000); else return -1;
	}
	,errorListener: function(eventInfo) {
		if(this.element.error.code == 4) {
			var _g1 = 0;
			var _g = this.filenames.length - 1;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.element.src == this.filenames[i]) {
					this.element.src = this.filenames[i + 1];
					return;
				}
			}
		}
		haxe_Log.trace("Error loading " + this.element.src,{ fileName : "Video.hx", lineNumber : 100, className : "kha.js.Video", methodName : "errorListener"});
		this.finishAsset();
	}
	,canPlayThroughListener: function(eventInfo) {
		this.finishAsset();
	}
	,finishAsset: function() {
		this.element.removeEventListener("error",$bind(this,this.errorListener),false);
		this.element.removeEventListener("canplaythrough",$bind(this,this.canPlayThroughListener),false);
		if(kha_SystemImpl.gl != null) this.texture = kha_Image.fromVideo(this);
		this.done(this);
		kha_js_Video.loading.remove(this);
	}
	,__class__: kha_js_Video
});
var kha_js_WebAudioSound = function(filename,done) {
	var _g = this;
	kha_Sound.call(this);
	this.done = done;
	var request = new XMLHttpRequest();
	request.open("GET",filename,true);
	request.responseType = "arraybuffer";
	request.onerror = function() {
		haxe_Log.trace("Error loading " + filename,{ fileName : "WebAudioSound.hx", lineNumber : 79, className : "kha.js.WebAudioSound", methodName : "new"});
		window.console.log("loadSound failed");
	};
	request.onload = function() {
		var arrayBuffer = request.response;
		var output = new haxe_io_BytesOutput();
		var header = kha_audio2_ogg_vorbis_Reader.readAll(haxe_io_Bytes.ofData(arrayBuffer),output,true);
		var soundBytes = output.getBytes();
		var count = soundBytes.length / 4 | 0;
		if(header.channel == 1) {
			var this1;
			this1 = new Array(count * 2);
			_g.data = this1;
			var _g1 = 0;
			while(_g1 < count) {
				var i = _g1++;
				var val = soundBytes.getFloat(i * 4);
				_g.data[i * 2] = val;
				var val1 = soundBytes.getFloat(i * 4);
				_g.data[i * 2 + 1] = val1;
			}
		} else {
			var this2;
			this2 = new Array(count);
			_g.data = this2;
			var _g11 = 0;
			while(_g11 < count) {
				var i1 = _g11++;
				var val2 = soundBytes.getFloat(i1 * 4);
				_g.data[i1] = val2;
			}
		}
		done(_g);
	};
	request.send(null);
};
$hxClasses["kha.js.WebAudioSound"] = kha_js_WebAudioSound;
kha_js_WebAudioSound.__name__ = true;
kha_js_WebAudioSound.__super__ = kha_Sound;
kha_js_WebAudioSound.prototype = $extend(kha_Sound.prototype,{
	done: null
	,buffer: null
	,__class__: kha_js_WebAudioSound
});
var kha_js_graphics4_ConstantLocation = function(value) {
	this.value = value;
};
$hxClasses["kha.js.graphics4.ConstantLocation"] = kha_js_graphics4_ConstantLocation;
kha_js_graphics4_ConstantLocation.__name__ = true;
kha_js_graphics4_ConstantLocation.__interfaces__ = [kha_graphics4_ConstantLocation];
kha_js_graphics4_ConstantLocation.prototype = {
	value: null
	,__class__: kha_js_graphics4_ConstantLocation
};
var kha_js_graphics4_Graphics = function(renderTarget) {
	this.matrixCache = (function($this) {
		var $r;
		var this1;
		this1 = new Array(16);
		$r = this1;
		return $r;
	}(this));
	this.renderTarget = renderTarget;
	this.instancedExtension = kha_SystemImpl.gl.getExtension("ANGLE_instanced_arrays");
};
$hxClasses["kha.js.graphics4.Graphics"] = kha_js_graphics4_Graphics;
kha_js_graphics4_Graphics.__name__ = true;
kha_js_graphics4_Graphics.__interfaces__ = [kha_graphics4_Graphics];
kha_js_graphics4_Graphics.prototype = {
	framebuffer: null
	,indicesCount: null
	,renderTarget: null
	,instancedExtension: null
	,begin: function(additionalRenderTargets) {
		kha_SystemImpl.gl.enable(3042);
		kha_SystemImpl.gl.blendFunc(770,771);
		if(this.renderTarget == null) {
			kha_SystemImpl.gl.bindFramebuffer(36160,null);
			kha_SystemImpl.gl.viewport(0,0,kha_System.get_pixelWidth(),kha_System.get_pixelHeight());
		} else {
			kha_SystemImpl.gl.bindFramebuffer(36160,this.renderTarget.frameBuffer);
			kha_SystemImpl.gl.viewport(0,0,this.renderTarget.get_width(),this.renderTarget.get_height());
			if(additionalRenderTargets != null) {
				kha_SystemImpl.gl.framebufferTexture2D(36160,kha_SystemImpl.drawBuffers.COLOR_ATTACHMENT0_WEBGL,3553,this.renderTarget.texture,0);
				var _g1 = 0;
				var _g = additionalRenderTargets.length;
				while(_g1 < _g) {
					var i = _g1++;
					kha_SystemImpl.gl.framebufferTexture2D(36160,kha_SystemImpl.drawBuffers.COLOR_ATTACHMENT0_WEBGL + i + 1,3553,(js_Boot.__cast(additionalRenderTargets[i] , kha_WebGLImage)).texture,0);
				}
				var attachments = [kha_SystemImpl.drawBuffers.COLOR_ATTACHMENT0_WEBGL];
				var _g11 = 0;
				var _g2 = additionalRenderTargets.length;
				while(_g11 < _g2) {
					var i1 = _g11++;
					attachments.push(kha_SystemImpl.drawBuffers.COLOR_ATTACHMENT0_WEBGL + i1 + 1);
				}
				kha_SystemImpl.drawBuffers.drawBuffersWEBGL(attachments);
			}
		}
	}
	,end: function() {
	}
	,flush: function() {
	}
	,vsynced: function() {
		return true;
	}
	,refreshRate: function() {
		return 60;
	}
	,clear: function(color,depth,stencil) {
		var clearMask = 0;
		if(color != null) {
			clearMask |= 16384;
			kha_SystemImpl.gl.clearColor(kha__$Color_Color_$Impl_$.get_Rb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Gb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Bb(color) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Ab(color) * 0.00392156862745098);
		}
		if(depth != null) {
			clearMask |= 256;
			kha_SystemImpl.gl.clearDepth(depth);
		}
		if(stencil != null) clearMask |= 1024;
		kha_SystemImpl.gl.clear(clearMask);
	}
	,viewport: function(x,y,width,height) {
		kha_SystemImpl.gl.viewport(x,y,width,height);
	}
	,setDepthMode: function(write,mode) {
		switch(mode[1]) {
		case 0:
			kha_SystemImpl.gl.disable(2929);
			kha_SystemImpl.gl.depthFunc(519);
			break;
		case 1:
			kha_SystemImpl.gl.enable(2929);
			kha_SystemImpl.gl.depthFunc(512);
			break;
		case 2:
			kha_SystemImpl.gl.enable(2929);
			kha_SystemImpl.gl.depthFunc(514);
			break;
		case 3:
			kha_SystemImpl.gl.enable(2929);
			kha_SystemImpl.gl.depthFunc(517);
			break;
		case 4:
			kha_SystemImpl.gl.enable(2929);
			kha_SystemImpl.gl.depthFunc(513);
			break;
		case 5:
			kha_SystemImpl.gl.enable(2929);
			kha_SystemImpl.gl.depthFunc(515);
			break;
		case 6:
			kha_SystemImpl.gl.enable(2929);
			kha_SystemImpl.gl.depthFunc(516);
			break;
		case 7:
			kha_SystemImpl.gl.enable(2929);
			kha_SystemImpl.gl.depthFunc(518);
			break;
		}
		kha_SystemImpl.gl.depthMask(write);
	}
	,getBlendFunc: function(op) {
		switch(op[1]) {
		case 2:case 0:
			return 0;
		case 1:
			return 1;
		case 3:
			return 770;
		case 4:
			return 772;
		case 5:
			return 771;
		case 6:
			return 773;
		}
	}
	,setBlendingMode: function(source,destination) {
		if(source == kha_graphics4_BlendingOperation.BlendOne && destination == kha_graphics4_BlendingOperation.BlendZero) kha_SystemImpl.gl.disable(3042); else {
			kha_SystemImpl.gl.enable(3042);
			kha_SystemImpl.gl.blendFunc(this.getBlendFunc(source),this.getBlendFunc(destination));
		}
	}
	,createVertexBuffer: function(vertexCount,structure,usage,canRead) {
		if(canRead == null) canRead = false;
		return new kha_graphics4_VertexBuffer(vertexCount,structure,usage);
	}
	,setVertexBuffer: function(vertexBuffer) {
		(js_Boot.__cast(vertexBuffer , kha_graphics4_VertexBuffer)).set(0);
	}
	,setVertexBuffers: function(vertexBuffers) {
		var offset = 0;
		var _g = 0;
		while(_g < vertexBuffers.length) {
			var vertexBuffer = vertexBuffers[_g];
			++_g;
			offset += (js_Boot.__cast(vertexBuffer , kha_graphics4_VertexBuffer)).set(offset);
		}
	}
	,createIndexBuffer: function(indexCount,usage,canRead) {
		if(canRead == null) canRead = false;
		return new kha_graphics4_IndexBuffer(indexCount,usage);
	}
	,setIndexBuffer: function(indexBuffer) {
		this.indicesCount = indexBuffer.count();
		(js_Boot.__cast(indexBuffer , kha_graphics4_IndexBuffer)).set();
	}
	,createCubeMap: function(size,format,usage,canRead) {
		if(canRead == null) canRead = false;
		return null;
	}
	,setTexture: function(stage,texture) {
		if(texture == null) {
			kha_SystemImpl.gl.activeTexture(33984 + (js_Boot.__cast(stage , kha_js_graphics4_TextureUnit)).value);
			kha_SystemImpl.gl.bindTexture(3553,null);
		} else (js_Boot.__cast(texture , kha_WebGLImage)).set((js_Boot.__cast(stage , kha_js_graphics4_TextureUnit)).value);
	}
	,setVideoTexture: function(unit,texture) {
		if(texture == null) {
			kha_SystemImpl.gl.activeTexture(33984 + (js_Boot.__cast(unit , kha_js_graphics4_TextureUnit)).value);
			kha_SystemImpl.gl.bindTexture(3553,null);
		} else (js_Boot.__cast((js_Boot.__cast(texture , kha_js_Video)).texture , kha_WebGLImage)).set((js_Boot.__cast(unit , kha_js_graphics4_TextureUnit)).value);
	}
	,setTextureParameters: function(texunit,uAddressing,vAddressing,minificationFilter,magnificationFilter,mipmapFilter) {
		kha_SystemImpl.gl.activeTexture(33984 + (js_Boot.__cast(texunit , kha_js_graphics4_TextureUnit)).value);
		switch(uAddressing[1]) {
		case 2:
			kha_SystemImpl.gl.texParameteri(3553,10242,33071);
			break;
		case 0:
			kha_SystemImpl.gl.texParameteri(3553,10242,10497);
			break;
		case 1:
			kha_SystemImpl.gl.texParameteri(3553,10242,33648);
			break;
		}
		switch(vAddressing[1]) {
		case 2:
			kha_SystemImpl.gl.texParameteri(3553,10243,33071);
			break;
		case 0:
			kha_SystemImpl.gl.texParameteri(3553,10243,10497);
			break;
		case 1:
			kha_SystemImpl.gl.texParameteri(3553,10243,33648);
			break;
		}
		switch(minificationFilter[1]) {
		case 0:
			switch(mipmapFilter[1]) {
			case 0:
				kha_SystemImpl.gl.texParameteri(3553,10241,9728);
				break;
			case 1:
				kha_SystemImpl.gl.texParameteri(3553,10241,9984);
				break;
			case 2:
				kha_SystemImpl.gl.texParameteri(3553,10241,9986);
				break;
			}
			break;
		case 1:case 2:
			switch(mipmapFilter[1]) {
			case 0:
				kha_SystemImpl.gl.texParameteri(3553,10241,9729);
				break;
			case 1:
				kha_SystemImpl.gl.texParameteri(3553,10241,9985);
				break;
			case 2:
				kha_SystemImpl.gl.texParameteri(3553,10241,9987);
				break;
			}
			break;
		}
		switch(magnificationFilter[1]) {
		case 0:
			kha_SystemImpl.gl.texParameteri(3553,10240,9728);
			break;
		case 1:case 2:
			kha_SystemImpl.gl.texParameteri(3553,10240,9729);
			break;
		}
	}
	,setCullMode: function(mode) {
		switch(mode[1]) {
		case 2:
			kha_SystemImpl.gl.disable(2884);
			break;
		case 0:
			kha_SystemImpl.gl.enable(2884);
			kha_SystemImpl.gl.cullFace(1028);
			break;
		case 1:
			kha_SystemImpl.gl.enable(2884);
			kha_SystemImpl.gl.cullFace(1029);
			break;
		}
	}
	,setPipeline: function(pipe) {
		this.setCullMode(pipe.cullMode);
		this.setDepthMode(pipe.depthWrite,pipe.depthMode);
		this.setStencilParameters(pipe.stencilMode,pipe.stencilBothPass,pipe.stencilDepthFail,pipe.stencilFail,pipe.stencilReferenceValue,pipe.stencilReferenceValue,pipe.stencilWriteMask);
		this.setBlendingMode(pipe.blendSource,pipe.blendDestination);
		pipe.set();
	}
	,setBool: function(location,value) {
		kha_SystemImpl.gl.uniform1i((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value?1:0);
	}
	,setInt: function(location,value) {
		kha_SystemImpl.gl.uniform1i((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value);
	}
	,setFloat: function(location,value) {
		kha_SystemImpl.gl.uniform1f((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value);
	}
	,setFloat2: function(location,value1,value2) {
		kha_SystemImpl.gl.uniform2f((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value1,value2);
	}
	,setFloat3: function(location,value1,value2,value3) {
		kha_SystemImpl.gl.uniform3f((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value1,value2,value3);
	}
	,setFloat4: function(location,value1,value2,value3,value4) {
		kha_SystemImpl.gl.uniform4f((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value1,value2,value3,value4);
	}
	,setFloats: function(location,values) {
		kha_SystemImpl.gl.uniform1fv((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,values);
	}
	,setVector2: function(location,value) {
		kha_SystemImpl.gl.uniform2f((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value.x,value.y);
	}
	,setVector3: function(location,value) {
		kha_SystemImpl.gl.uniform3f((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value.x,value.y,value.z);
	}
	,setVector4: function(location,value) {
		kha_SystemImpl.gl.uniform4f((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,value.x,value.y,value.z,value.w);
	}
	,matrixCache: null
	,setMatrix: function(location,matrix) {
		this.matrixCache[0] = matrix._00;
		this.matrixCache[1] = matrix._01;
		this.matrixCache[2] = matrix._02;
		this.matrixCache[3] = matrix._03;
		this.matrixCache[4] = matrix._10;
		this.matrixCache[5] = matrix._11;
		this.matrixCache[6] = matrix._12;
		this.matrixCache[7] = matrix._13;
		this.matrixCache[8] = matrix._20;
		this.matrixCache[9] = matrix._21;
		this.matrixCache[10] = matrix._22;
		this.matrixCache[11] = matrix._23;
		this.matrixCache[12] = matrix._30;
		this.matrixCache[13] = matrix._31;
		this.matrixCache[14] = matrix._32;
		this.matrixCache[15] = matrix._33;
		kha_SystemImpl.gl.uniformMatrix4fv((js_Boot.__cast(location , kha_js_graphics4_ConstantLocation)).value,false,this.matrixCache);
	}
	,drawIndexedVertices: function(start,count) {
		if(count == null) count = -1;
		if(start == null) start = 0;
		kha_SystemImpl.gl.drawElements(4,count == -1?this.indicesCount:count,5123,start * 2);
	}
	,setStencilParameters: function(compareMode,bothPass,depthFail,stencilFail,referenceValue,readMask,writeMask) {
		if(writeMask == null) writeMask = 255;
		if(readMask == null) readMask = 255;
	}
	,scissor: function(x,y,width,height) {
		kha_SystemImpl.gl.enable(3089);
		var h;
		if(this.renderTarget == null) h = kha_System.get_pixelHeight(); else h = this.renderTarget.get_height();
		kha_SystemImpl.gl.scissor(x,h - y - height,width,height);
	}
	,disableScissor: function() {
		kha_SystemImpl.gl.disable(3089);
	}
	,renderTargetsInvertedY: function() {
		return true;
	}
	,drawIndexedVerticesInstanced: function(instanceCount,start,count) {
		if(count == null) count = -1;
		if(start == null) start = 0;
		if(this.instancedRenderingAvailable()) this.instancedExtension.drawElementsInstancedANGLE(4,count == -1?this.indicesCount:count,5123,start * 2,instanceCount);
	}
	,instancedRenderingAvailable: function() {
		return this.instancedExtension;
	}
	,__class__: kha_js_graphics4_Graphics
};
var kha_js_graphics4_Graphics2 = function(canvas) {
	kha_graphics4_Graphics2.call(this,canvas);
};
$hxClasses["kha.js.graphics4.Graphics2"] = kha_js_graphics4_Graphics2;
kha_js_graphics4_Graphics2.__name__ = true;
kha_js_graphics4_Graphics2.__super__ = kha_graphics4_Graphics2;
kha_js_graphics4_Graphics2.prototype = $extend(kha_graphics4_Graphics2.prototype,{
	drawVideoInternal: function(video,x,y,width,height) {
		var v;
		v = js_Boot.__cast(video , kha_js_Video);
		this.drawScaledSubImage(v.texture,0,0,v.texture.get_width(),v.texture.get_height(),x,y,width,height);
	}
	,begin: function(clear,clearColor) {
		if(clear == null) clear = true;
		kha_SystemImpl.gl.colorMask(true,true,true,true);
		kha_SystemImpl.gl.disable(2929);
		kha_SystemImpl.gl.depthFunc(519);
		kha_graphics4_Graphics2.prototype.begin.call(this,clear,clearColor);
	}
	,__class__: kha_js_graphics4_Graphics2
});
var kha_js_graphics4_TextureUnit = function(value) {
	this.value = value;
};
$hxClasses["kha.js.graphics4.TextureUnit"] = kha_js_graphics4_TextureUnit;
kha_js_graphics4_TextureUnit.__name__ = true;
kha_js_graphics4_TextureUnit.__interfaces__ = [kha_graphics4_TextureUnit];
kha_js_graphics4_TextureUnit.prototype = {
	value: null
	,__class__: kha_js_graphics4_TextureUnit
};
var kha_math_FastMatrix3 = function(_00,_10,_20,_01,_11,_21,_02,_12,_22) {
	this._00 = _00;
	this._10 = _10;
	this._20 = _20;
	this._01 = _01;
	this._11 = _11;
	this._21 = _21;
	this._02 = _02;
	this._12 = _12;
	this._22 = _22;
};
$hxClasses["kha.math.FastMatrix3"] = kha_math_FastMatrix3;
kha_math_FastMatrix3.__name__ = true;
kha_math_FastMatrix3.prototype = {
	_00: null
	,_10: null
	,_20: null
	,_01: null
	,_11: null
	,_21: null
	,_02: null
	,_12: null
	,_22: null
	,__class__: kha_math_FastMatrix3
};
var kha_math_FastMatrix4 = function(_00,_10,_20,_30,_01,_11,_21,_31,_02,_12,_22,_32,_03,_13,_23,_33) {
	this._00 = _00;
	this._10 = _10;
	this._20 = _20;
	this._30 = _30;
	this._01 = _01;
	this._11 = _11;
	this._21 = _21;
	this._31 = _31;
	this._02 = _02;
	this._12 = _12;
	this._22 = _22;
	this._32 = _32;
	this._03 = _03;
	this._13 = _13;
	this._23 = _23;
	this._33 = _33;
};
$hxClasses["kha.math.FastMatrix4"] = kha_math_FastMatrix4;
kha_math_FastMatrix4.__name__ = true;
kha_math_FastMatrix4.orthogonalProjection = function(left,right,bottom,top,zn,zf) {
	var tx = -(right + left) / (right - left);
	var ty = -(top + bottom) / (top - bottom);
	var tz = -(zf + zn) / (zf - zn);
	return new kha_math_FastMatrix4(2 / (right - left),0,0,tx,0,2 / (top - bottom),0,ty,0,0,-2 / (zf - zn),tz,0,0,0,1);
};
kha_math_FastMatrix4.perspectiveProjection = function(fovY,aspect,zn,zf) {
	var uh = 1.0 / Math.tan(fovY / 2 * (Math.PI / 180));
	var uw = uh / aspect;
	return new kha_math_FastMatrix4(uw,0,0,0,0,uh,0,0,0,0,(zf + zn) / (zn - zf),2 * zf * zn / (zn - zf),0,0,-1,0);
};
kha_math_FastMatrix4.lookAt = function(eye,at,up) {
	var zaxis = new kha_math_FastVector3(at.x - eye.x,at.y - eye.y,at.z - eye.z);
	zaxis.set_length(1);
	var xaxis;
	var _x1 = zaxis.y * up.z - zaxis.z * up.y;
	var _y1 = zaxis.z * up.x - zaxis.x * up.z;
	var _z1 = zaxis.x * up.y - zaxis.y * up.x;
	xaxis = new kha_math_FastVector3(_x1,_y1,_z1);
	xaxis.set_length(1);
	var _x = xaxis.y * zaxis.z - xaxis.z * zaxis.y;
	var _y = xaxis.z * zaxis.x - xaxis.x * zaxis.z;
	var _z = xaxis.x * zaxis.y - xaxis.y * zaxis.x;
	var yaxis_x = _x;
	var yaxis_y = _y;
	var yaxis_z = _z;
	return new kha_math_FastMatrix4(xaxis.x,xaxis.y,xaxis.z,-(xaxis.x * eye.x + xaxis.y * eye.y + xaxis.z * eye.z),yaxis_x,yaxis_y,yaxis_z,-(yaxis_x * eye.x + yaxis_y * eye.y + yaxis_z * eye.z),-zaxis.x,-zaxis.y,-zaxis.z,zaxis.x * eye.x + zaxis.y * eye.y + zaxis.z * eye.z,0,0,0,1);
};
kha_math_FastMatrix4.prototype = {
	_00: null
	,_10: null
	,_20: null
	,_30: null
	,_01: null
	,_11: null
	,_21: null
	,_31: null
	,_02: null
	,_12: null
	,_22: null
	,_32: null
	,_03: null
	,_13: null
	,_23: null
	,_33: null
	,__class__: kha_math_FastMatrix4
};
var kha_math_FastVector2 = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
$hxClasses["kha.math.FastVector2"] = kha_math_FastVector2;
kha_math_FastVector2.__name__ = true;
kha_math_FastVector2.prototype = {
	x: null
	,y: null
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,set_length: function(length) {
		var currentLength = this.get_length();
		if(currentLength == 0) return 0;
		var mul = length / currentLength;
		this.x *= mul;
		this.y *= mul;
		return length;
	}
	,__class__: kha_math_FastVector2
};
var kha_math_FastVector3 = function(x,y,z) {
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
};
$hxClasses["kha.math.FastVector3"] = kha_math_FastVector3;
kha_math_FastVector3.__name__ = true;
kha_math_FastVector3.prototype = {
	x: null
	,y: null
	,z: null
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	,set_length: function(length) {
		var currentLength = this.get_length();
		if(currentLength == 0) return 0;
		var mul = length / currentLength;
		this.x *= mul;
		this.y *= mul;
		this.z *= mul;
		return length;
	}
	,__class__: kha_math_FastVector3
};
var kha_math_FastVector4 = function(x,y,z,w) {
	if(w == null) w = 1;
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
$hxClasses["kha.math.FastVector4"] = kha_math_FastVector4;
kha_math_FastVector4.__name__ = true;
kha_math_FastVector4.prototype = {
	x: null
	,y: null
	,z: null
	,w: null
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	,set_length: function(length) {
		var currentLength = this.get_length();
		if(currentLength == 0) return 0;
		var mul = length / currentLength;
		this.x *= mul;
		this.y *= mul;
		this.z *= mul;
		this.w *= mul;
		return length;
	}
	,__class__: kha_math_FastVector4
};
var kha_math_Matrix3 = function(_00,_10,_20,_01,_11,_21,_02,_12,_22) {
	this._00 = _00;
	this._10 = _10;
	this._20 = _20;
	this._01 = _01;
	this._11 = _11;
	this._21 = _21;
	this._02 = _02;
	this._12 = _12;
	this._22 = _22;
};
$hxClasses["kha.math.Matrix3"] = kha_math_Matrix3;
kha_math_Matrix3.__name__ = true;
kha_math_Matrix3.prototype = {
	_00: null
	,_10: null
	,_20: null
	,_01: null
	,_11: null
	,_21: null
	,_02: null
	,_12: null
	,_22: null
	,__class__: kha_math_Matrix3
};
var kha_math_Matrix4 = function(_00,_10,_20,_30,_01,_11,_21,_31,_02,_12,_22,_32,_03,_13,_23,_33) {
	this._00 = _00;
	this._10 = _10;
	this._20 = _20;
	this._30 = _30;
	this._01 = _01;
	this._11 = _11;
	this._21 = _21;
	this._31 = _31;
	this._02 = _02;
	this._12 = _12;
	this._22 = _22;
	this._32 = _32;
	this._03 = _03;
	this._13 = _13;
	this._23 = _23;
	this._33 = _33;
};
$hxClasses["kha.math.Matrix4"] = kha_math_Matrix4;
kha_math_Matrix4.__name__ = true;
kha_math_Matrix4.orthogonalProjection = function(left,right,bottom,top,zn,zf) {
	var tx = -(right + left) / (right - left);
	var ty = -(top + bottom) / (top - bottom);
	var tz = -(zf + zn) / (zf - zn);
	return new kha_math_Matrix4(2 / (right - left),0,0,tx,0,2 / (top - bottom),0,ty,0,0,-2 / (zf - zn),tz,0,0,0,1);
};
kha_math_Matrix4.perspectiveProjection = function(fovY,aspect,zn,zf) {
	var uh = 1.0 / Math.tan(fovY / 2 * (Math.PI / 180));
	var uw = uh / aspect;
	return new kha_math_Matrix4(uw,0,0,0,0,uh,0,0,0,0,(zf + zn) / (zn - zf),2 * zf * zn / (zn - zf),0,0,-1,0);
};
kha_math_Matrix4.lookAt = function(eye,at,up) {
	var zaxis = new kha_math_Vector3(at.x - eye.x,at.y - eye.y,at.z - eye.z);
	zaxis.set_length(1);
	var xaxis;
	var _x1 = zaxis.y * up.z - zaxis.z * up.y;
	var _y1 = zaxis.z * up.x - zaxis.x * up.z;
	var _z1 = zaxis.x * up.y - zaxis.y * up.x;
	xaxis = new kha_math_Vector3(_x1,_y1,_z1);
	xaxis.set_length(1);
	var _x = xaxis.y * zaxis.z - xaxis.z * zaxis.y;
	var _y = xaxis.z * zaxis.x - xaxis.x * zaxis.z;
	var _z = xaxis.x * zaxis.y - xaxis.y * zaxis.x;
	var yaxis_x = _x;
	var yaxis_y = _y;
	var yaxis_z = _z;
	return new kha_math_Matrix4(xaxis.x,xaxis.y,xaxis.z,-(xaxis.x * eye.x + xaxis.y * eye.y + xaxis.z * eye.z),yaxis_x,yaxis_y,yaxis_z,-(yaxis_x * eye.x + yaxis_y * eye.y + yaxis_z * eye.z),-zaxis.x,-zaxis.y,-zaxis.z,zaxis.x * eye.x + zaxis.y * eye.y + zaxis.z * eye.z,0,0,0,1);
};
kha_math_Matrix4.prototype = {
	_00: null
	,_10: null
	,_20: null
	,_30: null
	,_01: null
	,_11: null
	,_21: null
	,_31: null
	,_02: null
	,_12: null
	,_22: null
	,_32: null
	,_03: null
	,_13: null
	,_23: null
	,_33: null
	,__class__: kha_math_Matrix4
};
var kha_math_Vector2 = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
$hxClasses["kha.math.Vector2"] = kha_math_Vector2;
kha_math_Vector2.__name__ = true;
kha_math_Vector2.prototype = {
	x: null
	,y: null
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,set_length: function(length) {
		var currentLength = this.get_length();
		if(currentLength == 0) return 0;
		var mul = length / currentLength;
		this.x *= mul;
		this.y *= mul;
		return length;
	}
	,__class__: kha_math_Vector2
};
var kha_math_Vector3 = function(x,y,z) {
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
};
$hxClasses["kha.math.Vector3"] = kha_math_Vector3;
kha_math_Vector3.__name__ = true;
kha_math_Vector3.prototype = {
	x: null
	,y: null
	,z: null
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	,set_length: function(length) {
		var currentLength = this.get_length();
		if(currentLength == 0) return 0;
		var mul = length / currentLength;
		this.x *= mul;
		this.y *= mul;
		this.z *= mul;
		return length;
	}
	,__class__: kha_math_Vector3
};
var kha_math_Vector4 = function(x,y,z,w) {
	if(w == null) w = 1;
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
$hxClasses["kha.math.Vector4"] = kha_math_Vector4;
kha_math_Vector4.__name__ = true;
kha_math_Vector4.prototype = {
	x: null
	,y: null
	,z: null
	,w: null
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	,set_length: function(length) {
		var currentLength = this.get_length();
		if(currentLength == 0) return 0;
		var mul = length / currentLength;
		this.x *= mul;
		this.y *= mul;
		this.z *= mul;
		this.w *= mul;
		return length;
	}
	,__class__: kha_math_Vector4
};
var kha_network_Client = function() { };
$hxClasses["kha.network.Client"] = kha_network_Client;
kha_network_Client.__name__ = true;
kha_network_Client.prototype = {
	get_id: null
	,id: null
	,send: null
	,receive: null
	,onClose: null
	,__class__: kha_network_Client
};
var kha_network_ControllerBuilder = function() { };
$hxClasses["kha.network.ControllerBuilder"] = kha_network_ControllerBuilder;
kha_network_ControllerBuilder.__name__ = true;
var kha_network_Entity = function() { };
$hxClasses["kha.network.Entity"] = kha_network_Entity;
kha_network_Entity.__name__ = true;
kha_network_Entity.prototype = {
	_id: null
	,_size: null
	,_send: null
	,_receive: null
	,__class__: kha_network_Entity
};
var kha_network_LocalClient = function(id) {
	this.myId = id;
};
$hxClasses["kha.network.LocalClient"] = kha_network_LocalClient;
kha_network_LocalClient.__name__ = true;
kha_network_LocalClient.__interfaces__ = [kha_network_Client];
kha_network_LocalClient.prototype = {
	myId: null
	,send: function(bytes,mandatory) {
	}
	,receive: function(receiver) {
	}
	,onClose: function(close) {
	}
	,controllers: null
	,get_controllers: function() {
		return null;
	}
	,id: null
	,get_id: function() {
		return this.myId;
	}
	,__class__: kha_network_LocalClient
};
var kha_network_Network = function(url,port) {
	this.socket = new WebSocket("ws://" + url + ":" + port);
	this.socket.binaryType = "arraybuffer";
};
$hxClasses["kha.network.Network"] = kha_network_Network;
kha_network_Network.__name__ = true;
kha_network_Network.prototype = {
	socket: null
	,send: function(bytes,mandatory) {
		this.socket.send(bytes.b.bufferValue);
	}
	,listen: function(listener) {
		this.socket.onmessage = function(message) {
			listener(haxe_io_Bytes.ofData(message.data));
		};
	}
	,__class__: kha_network_Network
};
var kha_network_State = function(time,data) {
	this.time = time;
	this.data = data;
};
$hxClasses["kha.network.State"] = kha_network_State;
kha_network_State.__name__ = true;
kha_network_State.prototype = {
	time: null
	,data: null
	,__class__: kha_network_State
};
var kha_network_Session = function(players) {
	this.controllers = new haxe_ds_IntMap();
	this.entities = new haxe_ds_IntMap();
	kha_network_Session.instance = this;
	this.players = players;
};
$hxClasses["kha.network.Session"] = kha_network_Session;
kha_network_Session.__name__ = true;
kha_network_Session.the = function() {
	return kha_network_Session.instance;
};
kha_network_Session.prototype = {
	entities: null
	,controllers: null
	,players: null
	,startCallback: null
	,localClient: null
	,network: null
	,me: null
	,get_me: function() {
		return this.localClient;
	}
	,addEntity: function(entity) {
		var key = entity._id();
		this.entities.h[key] = entity;
	}
	,addController: function(controller) {
		haxe_Log.trace("Adding controller id " + controller._id(),{ fileName : "Session.hx", lineNumber : 71, className : "kha.network.Session", methodName : "addController"});
		var key = controller._id();
		this.controllers.h[key] = controller;
	}
	,receive: function(bytes,client) {
		var _g = bytes.b[0];
		switch(_g) {
		case 0:
			var index = bytes.b[1];
			this.localClient = new kha_network_LocalClient(index);
			kha_Scheduler.resetTime();
			this.startCallback();
			break;
		case 1:
			var time = bytes.getDouble(1);
			var offset = 9;
			var $it0 = this.entities.iterator();
			while( $it0.hasNext() ) {
				var entity = $it0.next();
				entity._receive(offset,bytes);
				offset += entity._size();
			}
			kha_Scheduler.back(time);
			break;
		case 3:
			var args = [];
			var index1 = 1;
			var classnamelength = bytes.getUInt16(index1);
			index1 += 2;
			var classname = "";
			var _g1 = 0;
			while(_g1 < classnamelength) {
				var i = _g1++;
				classname += String.fromCharCode(bytes.b[index1]);
				++index1;
			}
			var methodnamelength = bytes.getUInt16(index1);
			index1 += 2;
			var methodname = "";
			var _g11 = 0;
			while(_g11 < methodnamelength) {
				var i1 = _g11++;
				methodname += String.fromCharCode(bytes.b[index1]);
				++index1;
			}
			while(index1 < bytes.length) {
				var type = bytes.b[index1];
				++index1;
				switch(type) {
				case 66:
					var value = bytes.b[index1] == 1;
					++index1;
					haxe_Log.trace("Bool: " + (value == null?"null":"" + value),{ fileName : "Session.hx", lineNumber : 182, className : "kha.network.Session", methodName : "receive"});
					args.push(value);
					break;
				case 70:
					var value1 = bytes.getDouble(index1);
					index1 += 8;
					haxe_Log.trace("Float: " + value1,{ fileName : "Session.hx", lineNumber : 187, className : "kha.network.Session", methodName : "receive"});
					args.push(value1);
					break;
				case 73:
					var value2 = bytes.getInt32(index1);
					index1 += 4;
					haxe_Log.trace("Int: " + value2,{ fileName : "Session.hx", lineNumber : 192, className : "kha.network.Session", methodName : "receive"});
					args.push(value2);
					break;
				case 83:
					var length = bytes.getUInt16(index1);
					index1 += 2;
					var str = "";
					var _g12 = 0;
					while(_g12 < length) {
						var i2 = _g12++;
						str += String.fromCharCode(bytes.b[index1]);
						++index1;
					}
					haxe_Log.trace("String: " + str,{ fileName : "Session.hx", lineNumber : 202, className : "kha.network.Session", methodName : "receive"});
					args.push(str);
					break;
				default:
					haxe_Log.trace("Unknown argument type.",{ fileName : "Session.hx", lineNumber : 205, className : "kha.network.Session", methodName : "receive"});
				}
			}
			Reflect.callMethod(null,Reflect.field(Type.resolveClass(classname),methodname + "_remotely"),args);
			break;
		}
	}
	,waitForStart: function(callback) {
		var _g = this;
		this.startCallback = callback;
		this.network = new kha_network_Network("localhost",6789);
		this.network.listen(function(bytes) {
			_g.receive(bytes);
		});
	}
	,update: function() {
	}
	,__class__: kha_network_Session
};
var kha_simd_Float32x4 = function(_0,_1,_2,_3) {
	this._0 = _0;
	this._1 = _1;
	this._2 = _2;
	this._3 = _3;
};
$hxClasses["kha.simd.Float32x4"] = kha_simd_Float32x4;
kha_simd_Float32x4.__name__ = true;
kha_simd_Float32x4.create = function() {
	return new kha_simd_Float32x4(0,0,0,0);
};
kha_simd_Float32x4.loadAllFast = function(t) {
	return new kha_simd_Float32x4(t,t,t,t);
};
kha_simd_Float32x4.load = function(a,b,c,d) {
	return new kha_simd_Float32x4(a,b,c,d);
};
kha_simd_Float32x4.loadFast = function(a,b,c,d) {
	return new kha_simd_Float32x4(a,b,c,d);
};
kha_simd_Float32x4.get = function(t,index) {
	var value = 0;
	switch(index) {
	case 0:
		value = t._0;
		break;
	case 1:
		value = t._1;
		break;
	case 2:
		value = t._2;
		break;
	case 3:
		value = t._3;
		break;
	}
	return value;
};
kha_simd_Float32x4.getFast = function(t,index) {
	switch(index) {
	case 0:
		return t._0;
	case 1:
		return t._1;
	case 2:
		return t._2;
	case 3:
		return t._3;
	}
	return 0;
};
kha_simd_Float32x4.abs = function(t) {
	return new kha_simd_Float32x4(Math.abs(t._0),Math.abs(t._1),Math.abs(t._2),Math.abs(t._3));
};
kha_simd_Float32x4.add = function(a,b) {
	return new kha_simd_Float32x4(a._0 + b._0,a._1 + b._1,a._2 + b._2,a._3 + b._3);
};
kha_simd_Float32x4.div = function(a,b) {
	return new kha_simd_Float32x4(a._0 / b._0,a._1 / b._1,a._2 / b._2,a._3 / b._3);
};
kha_simd_Float32x4.mul = function(a,b) {
	return new kha_simd_Float32x4(a._0 * b._0,a._1 * b._1,a._2 * b._2,a._3 * b._3);
};
kha_simd_Float32x4.neg = function(t) {
	return new kha_simd_Float32x4(-t._0,-t._1,-t._2,-t._3);
};
kha_simd_Float32x4.reciprocalApproximation = function(t) {
	return new kha_simd_Float32x4(0,0,0,0);
};
kha_simd_Float32x4.reciprocalSqrtApproximation = function(t) {
	return new kha_simd_Float32x4(0,0,0,0);
};
kha_simd_Float32x4.sub = function(a,b) {
	return new kha_simd_Float32x4(a._0 - b._0,a._1 - b._1,a._2 - b._2,a._3 - b._3);
};
kha_simd_Float32x4.sqrt = function(t) {
	return new kha_simd_Float32x4(Math.sqrt(t._0),Math.sqrt(t._1),Math.sqrt(t._2),Math.sqrt(t._3));
};
kha_simd_Float32x4.prototype = {
	_0: null
	,_1: null
	,_2: null
	,_3: null
	,__class__: kha_simd_Float32x4
};
var mint_Control = function(_options,_emit_oncreate) {
	if(_emit_oncreate == null) _emit_oncreate = false;
	this.ignore_spatial = false;
	this.updating = false;
	this.update_vis_state = true;
	this.vis_state = true;
	this.depth_offset = 0;
	this.depth = 1.0;
	this.visible = true;
	this.renderable = false;
	this.key_input = false;
	this.mouse_input = false;
	this.ishovered = false;
	this.iscaptured = false;
	this.ismarked = false;
	this.isfocused = false;
	this.h_max = 0;
	this.w_max = 0;
	this.h_min = 0;
	this.w_min = 0;
	this.name = "control";
	this._options_ = _options;
	if(this._options_.options == null) this._options_.options = { };
	this._options_.options;
	this.oncreate = new mint_core_Signal();
	this.onrender = new mint_core_Signal();
	this.onbounds = new mint_core_Signal();
	this.ondestroy = new mint_core_Signal();
	this.onvisible = new mint_core_Signal();
	this.ondepth = new mint_core_Signal();
	this.onclip = new mint_core_Signal();
	this.onchildadd = new mint_core_Signal();
	this.onchildremove = new mint_core_Signal();
	this.onmousedown = new mint_core_Signal();
	this.onmouseup = new mint_core_Signal();
	this.onmousemove = new mint_core_Signal();
	this.onmousewheel = new mint_core_Signal();
	this.onmouseleave = new mint_core_Signal();
	this.onmouseenter = new mint_core_Signal();
	this.onkeydown = new mint_core_Signal();
	this.onkeyup = new mint_core_Signal();
	this.ontextinput = new mint_core_Signal();
	this.onfocused = new mint_core_Signal();
	this.onmarked = new mint_core_Signal();
	this.oncaptured = new mint_core_Signal();
	this.children = [];
	if(this._options_.name == null) this._options_.name = "control";
	this.name = this._options_.name;
	if(this._options_.depth == null) this._options_.depth = 0;
	this.depth_offset = this._options_.depth;
	this.set_w_min((function($this) {
		var $r;
		if($this._options_.w_min == null) $this._options_.w_min = 0;
		$r = $this._options_.w_min;
		return $r;
	}(this)));
	this.set_h_min((function($this) {
		var $r;
		if($this._options_.h_min == null) $this._options_.h_min = 0;
		$r = $this._options_.h_min;
		return $r;
	}(this)));
	this.set_w_max((function($this) {
		var $r;
		if($this._options_.w_max == null) $this._options_.w_max = 0;
		$r = $this._options_.w_max;
		return $r;
	}(this)));
	this.set_h_max((function($this) {
		var $r;
		if($this._options_.h_max == null) $this._options_.h_max = 0;
		$r = $this._options_.h_max;
		return $r;
	}(this)));
	this.ignore_spatial = true;
	this.set_x((function($this) {
		var $r;
		if($this._options_.x == null) $this._options_.x = 0;
		$r = $this._options_.x;
		return $r;
	}(this)));
	this.set_y((function($this) {
		var $r;
		if($this._options_.y == null) $this._options_.y = 0;
		$r = $this._options_.y;
		return $r;
	}(this)));
	this.set_w((function($this) {
		var $r;
		if($this._options_.w == null) $this._options_.w = 32;
		$r = $this._options_.w;
		return $r;
	}(this)));
	this.set_h((function($this) {
		var $r;
		if($this._options_.h == null) $this._options_.h = 32;
		$r = $this._options_.h;
		return $r;
	}(this)));
	this.set_x_local(this.x);
	this.set_y_local(this.y);
	this.ignore_spatial = false;
	if(this._options_.mouse_input == null) this._options_.mouse_input = false;
	this.mouse_input = this._options_.mouse_input;
	if(this._options_.key_input == null) this._options_.key_input = false;
	this.key_input = this._options_.key_input;
	this.children_bounds = { x : 0, y : 0, right : 0, bottom : 0, real_x : 0, real_y : 0, real_w : 0, real_h : 0};
	if(this._options_.parent != null) {
		this.canvas = this._options_.parent.canvas;
		this._options_.parent.add(this);
	} else if(!js_Boot.__instanceof(this,mint_Canvas) && this.canvas == null) throw new js__$Boot_HaxeError("Control without a canvas " + Std.string(this._options_));
	this.closest_to_canvas = this.find_top_parent();
	if(_options.rendering == null) _options.rendering = this.canvas.rendering;
	this.rendering = _options.rendering;
	if(this._options_.renderable != null) this.renderable = this._options_.renderable; else if(this.canvas != null) this.renderable = this.canvas.renderable;
	if(this._options_.visible != null) this.set_visible(this._options_.visible); else if(this._options_.internal_visible != null) {
		this.update_vis_state = false;
		this.set_visible(this._options_.internal_visible);
		this.update_vis_state = true;
	} else if(this.parent != null) {
		this.update_vis_state = false;
		this.set_visible(this.parent.visible);
		this.update_vis_state = true;
	}
	if(_emit_oncreate) {
		var _g = 0;
		var _g1 = this.oncreate.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l();
		}
	}
};
$hxClasses["mint.Control"] = mint_Control;
mint_Control.__name__ = true;
mint_Control.prototype = {
	name: null
	,canvas: null
	,closest_to_canvas: null
	,x: null
	,y: null
	,w: null
	,h: null
	,w_min: null
	,h_min: null
	,w_max: null
	,h_max: null
	,x_local: null
	,y_local: null
	,clip_with: null
	,children: null
	,isfocused: null
	,ismarked: null
	,iscaptured: null
	,ishovered: null
	,mouse_input: null
	,key_input: null
	,renderable: null
	,visible: null
	,children_bounds: null
	,oncreate: null
	,onrender: null
	,onbounds: null
	,ondestroy: null
	,onvisible: null
	,ondepth: null
	,onclip: null
	,onchildadd: null
	,onchildremove: null
	,onmousedown: null
	,onmouseup: null
	,onmousemove: null
	,onmousewheel: null
	,onmouseenter: null
	,onmouseleave: null
	,onkeydown: null
	,onkeyup: null
	,ontextinput: null
	,onfocused: null
	,onmarked: null
	,oncaptured: null
	,parent: null
	,depth: null
	,renderer: null
	,rendering: null
	,_options_: null
	,depth_offset: null
	,topmost_child_at_point: function(_x,_y) {
		if(this.children.length == 0) return this;
		var highest_child = this;
		var highest_depth = 0.0;
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var _child = _g1[_g];
			++_g;
			if(_child.contains(_x,_y) && _child.mouse_input && _child.visible) {
				if(_child.depth >= highest_depth) {
					highest_child = _child;
					highest_depth = _child.depth;
				}
			}
		}
		if(highest_child != this && highest_child.children.length != 0) return highest_child.topmost_child_at_point(_x,_y); else return highest_child;
	}
	,contains: function(_x,_y) {
		var inside = mint_types_Helper.in_rect(_x,_y,this.x,this.y,this.w,this.h);
		if(this.clip_with == null) return inside;
		return inside && this.clip_with.contains(_x,_y);
	}
	,onclipchanged: function() {
		if(this.clip_with != null) {
			var _g = 0;
			var _g1 = this.onclip.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(false,this.clip_with.x,this.clip_with.y,this.clip_with.w,this.clip_with.h);
			}
		}
	}
	,set_clip_with: function(_other) {
		if(this.clip_with != null) this.clip_with.onbounds.remove($bind(this,this.onclipchanged));
		this.clip_with = _other;
		if(this.clip_with != null) {
			this.clip_with.onbounds.listen($bind(this,this.onclipchanged));
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.set_clip_with(this.clip_with);
			}
			this.onclipchanged();
		} else {
			var _g2 = 0;
			var _g11 = this.onclip.listeners;
			while(_g2 < _g11.length) {
				var l = _g11[_g2];
				++_g2;
				l(true,0,0,0,0);
			}
		}
		return this.clip_with;
	}
	,vis_state: null
	,update_vis_state: null
	,set_visible_only: function(_visible) {
		this.update_vis_state = false;
		this.set_visible(_visible);
		this.update_vis_state = true;
	}
	,set_visible: function(_visible) {
		this.visible = _visible;
		if(this.update_vis_state) this.vis_state = _visible;
		var _g = 0;
		var _g1 = this.onvisible.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.visible);
		}
		var _g2 = 0;
		var _g11 = this.children;
		while(_g2 < _g11.length) {
			var _child = _g11[_g2];
			++_g2;
			_child.update_vis_state = false;
			_child.set_visible(this.visible && _child.vis_state);
			_child.update_vis_state = true;
		}
		this.canvas.focus_invalid = true;
		return this.visible;
	}
	,find_top_parent: function(_from) {
		var _target;
		if(_from == null) _target = this; else _target = _from;
		if(_target == null || _target.parent == null) return null;
		if(js_Boot.__instanceof(_target.parent,mint_Canvas)) return _target; else return this.parent.find_top_parent(this);
	}
	,add: function(child) {
		if(child.parent != null) child.parent.remove(child);
		if(child.parent != this) {
			this.children.push(child);
			child.set_parent(this);
			var _g = 0;
			var _g1 = this.onchildadd.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(child);
			}
		}
		this.canvas.sync_depth();
	}
	,remove: function(child) {
		if(child.parent == this) {
			HxOverrides.remove(this.children,child);
			var _g = 0;
			var _g1 = this.onchildremove.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(child);
			}
			child.set_parent(null);
			this.canvas.sync_depth();
		}
	}
	,get_children_bounds: function() {
		if(this.children.length == 0) {
			this.children_bounds.x = 0;
			this.children_bounds.y = 0;
			this.children_bounds.right = 0;
			this.children_bounds.bottom = 0;
			this.children_bounds.real_x = 0;
			this.children_bounds.real_y = 0;
			this.children_bounds.real_w = 0;
			this.children_bounds.real_h = 0;
			return this.children_bounds;
		}
		var _first_child = this.children[0];
		var _current_x = _first_child.get_x_local();
		var _current_y = _first_child.get_y_local();
		var _current_r = _first_child.get_x_local() + _first_child.w;
		var _current_b = _first_child.get_y_local() + _first_child.h;
		var _real_x = _first_child.x;
		var _real_y = _first_child.y;
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			_current_x = Math.min(child.get_x_local(),_current_x);
			_current_y = Math.min(child.get_y_local(),_current_y);
			_current_r = Math.max(_current_r,child.get_x_local() + child.w);
			_current_b = Math.max(_current_b,child.get_y_local() + child.h);
			_real_x = Math.min(child.x,_real_x);
			_real_y = Math.min(child.y,_real_y);
		}
		this.children_bounds.x = _current_x;
		this.children_bounds.y = _current_y;
		this.children_bounds.right = _current_r;
		this.children_bounds.bottom = _current_b;
		this.children_bounds.real_x = _real_x;
		this.children_bounds.real_y = _real_y;
		this.children_bounds.real_w = _current_r;
		this.children_bounds.real_h = _current_b;
		return this.children_bounds;
	}
	,render: function() {
		if(this.renderable) {
			var _g = 0;
			var _g1 = this.onrender.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l();
			}
		}
		var _g2 = 0;
		var _g11 = this.children;
		while(_g2 < _g11.length) {
			var child = _g11[_g2];
			++_g2;
			child.render();
		}
	}
	,keyup: function(e) {
		var _g = 0;
		var _g1 = this.onkeyup.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		if(this.parent != null && this.parent != this.canvas && this.canvas != this && e.bubble) this.parent.keyup(e);
	}
	,keydown: function(e) {
		var _g = 0;
		var _g1 = this.onkeydown.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		if(this.parent != null && this.parent != this.canvas && this.canvas != this && e.bubble) this.parent.keydown(e);
	}
	,textinput: function(e) {
		var _g = 0;
		var _g1 = this.ontextinput.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		if(this.parent != null && this.parent != this.canvas && this.canvas != this && e.bubble) this.parent.textinput(e);
	}
	,mousemove: function(e) {
		var _g = 0;
		var _g1 = this.onmousemove.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		if(this.parent != null && this.parent != this.canvas && this.canvas != this && e.bubble) this.parent.mousemove(e);
	}
	,mouseup: function(e) {
		var _g = 0;
		var _g1 = this.onmouseup.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		if(this.parent != null && this.parent != this.canvas && this.canvas != this && e.bubble) this.parent.mouseup(e);
	}
	,mousewheel: function(e) {
		var _g = 0;
		var _g1 = this.onmousewheel.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		if(this.parent != null && this.parent != this.canvas && this.canvas != this && e.bubble) this.parent.mousewheel(e);
	}
	,mousedown: function(e) {
		var _g = 0;
		var _g1 = this.onmousedown.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		if(this.parent != null && this.parent != this.canvas && this.canvas != this && e.bubble) this.parent.mousedown(e);
	}
	,mouseenter: function(e) {
		var _g = 0;
		var _g1 = this.onmouseenter.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		this.ishovered = true;
	}
	,mouseleave: function(e) {
		var _g = 0;
		var _g1 = this.onmouseleave.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
		this.ishovered = false;
	}
	,destroy_children: function() {
		while(this.children.length > 0) {
			var child = this.children.shift();
			child.destroy();
		}
	}
	,destroy: function() {
		this.unmark();
		this.unfocus();
		this.uncapture();
		if(this.parent != null) this.parent.remove(this);
		this.destroy_children();
		var _g = 0;
		var _g1 = this.ondestroy.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l();
		}
	}
	,update: function(dt) {
	}
	,focus: function() {
		if(this.canvas == this) return;
		var _pre = this.canvas.get_focused() == this;
		this.canvas.set_focused(this);
		if(!_pre) {
			var _g = 0;
			var _g1 = this.onfocused.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(true);
			}
		}
	}
	,unfocus: function() {
		if(this.canvas == this) return;
		if(this.canvas.get_focused() == this) {
			this.canvas.set_focused(null);
			var _g = 0;
			var _g1 = this.onfocused.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(false);
			}
		}
	}
	,capture: function() {
		if(this.canvas == this) return;
		var _pre = this.canvas.get_captured() == this;
		this.canvas.set_captured(this);
		if(!_pre) {
			var _g = 0;
			var _g1 = this.oncaptured.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(true);
			}
		}
	}
	,uncapture: function() {
		if(this.canvas == this) return;
		if(this.canvas.get_captured() == this) {
			this.canvas.set_captured(null);
			var _g = 0;
			var _g1 = this.oncaptured.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(false);
			}
		}
	}
	,mark: function() {
		if(this.canvas == this) return;
		var _pre = this.canvas.get_marked() == this;
		this.canvas.set_marked(this);
		if(!_pre) {
			var _g = 0;
			var _g1 = this.onmarked.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(true);
			}
		}
	}
	,unmark: function() {
		if(this.canvas == this) return;
		if(this.canvas.get_marked() == this) {
			this.canvas.set_marked(null);
			var _g = 0;
			var _g1 = this.onmarked.listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l(false);
			}
		}
	}
	,updating: null
	,bounds_changed: function(_dx,_dy,_dw,_dh) {
		if(_dh == null) _dh = 0.0;
		if(_dw == null) _dw = 0.0;
		if(_dy == null) _dy = 0.0;
		if(_dx == null) _dx = 0.0;
		if(this.updating) return;
		if(_dx != 0.0 || _dy != 0.0) {
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.set_pos(child.x + _dx,child.y + _dy);
			}
		}
		var _g2 = 0;
		var _g11 = this.onbounds.listeners;
		while(_g2 < _g11.length) {
			var l = _g11[_g2];
			++_g2;
			l();
		}
	}
	,set_pos: function(_x,_y) {
		this.updating = true;
		var _dx = _x - this.x;
		var _dy = _y - this.y;
		this.set_x(_x);
		this.set_y(_y);
		this.updating = false;
		this.bounds_changed(_dx,_dy,0,0);
	}
	,set_size: function(_w,_h) {
		this.updating = true;
		var _dw = _w - this.w;
		var _dh = _h - this.h;
		this.set_w(_w);
		this.set_h(_h);
		this.updating = false;
		this.bounds_changed(0,0,_dw,_dh);
	}
	,get_right: function() {
		return this.x + this.w;
	}
	,get_bottom: function() {
		return this.y + this.h;
	}
	,set_x: function(_x) {
		var _dx = _x - this.x;
		this.x = _x;
		if(!this.ignore_spatial) {
			this.ignore_spatial = true;
			if(this.parent != null) this.set_x_local(this.x - this.parent.x); else this.set_x_local(this.x);
			this.ignore_spatial = false;
		}
		this.bounds_changed(_dx);
		return this.x;
	}
	,set_y: function(_y) {
		var _dy = _y - this.y;
		this.y = _y;
		if(!this.ignore_spatial) {
			this.ignore_spatial = true;
			if(this.parent != null) this.set_y_local(this.y - this.parent.y); else this.set_y_local(this.y);
			this.ignore_spatial = false;
		}
		this.bounds_changed(0,_dy);
		return this.y;
	}
	,set_w_min: function(_w_min) {
		this.w_min = _w_min;
		if(this.w < this.w_min) this.set_w(this.w_min);
		return this.w_min;
	}
	,set_h_min: function(_h_min) {
		this.h_min = _h_min;
		if(this.h < this.h_min) this.set_h(this.h_min);
		return this.h_min;
	}
	,set_w_max: function(_w_max) {
		this.w_max = _w_max;
		if(this.w > this.w_max) this.set_w(this.w_max);
		return this.w_max;
	}
	,set_h_max: function(_h_max) {
		this.h_max = _h_max;
		if(this.h > this.h_max) this.set_h(this.h_max);
		return this.h_max;
	}
	,set_w: function(_w) {
		if(_w < this.w_min) _w = this.w_min;
		if(_w > this.w_max && this.w_max != 0) _w = this.w_max;
		var _dw = _w - this.w;
		this.w = _w;
		this.bounds_changed(0,0,_dw);
		return this.w;
	}
	,set_h: function(_h) {
		if(_h < this.h_min) _h = this.h_min;
		if(_h > this.h_max && this.h_max != 0) _h = this.h_max;
		var _dh = _h - this.h;
		this.h = _h;
		this.bounds_changed(0,0,0,_dh);
		return this.h;
	}
	,ignore_spatial: null
	,set_x_local: function(_x) {
		this.x_local = _x;
		if(!this.ignore_spatial) {
			this.ignore_spatial = true;
			if(this.parent != null) this.set_x(this.parent.x + this.get_x_local()); else this.set_x(this.get_x_local());
			this.ignore_spatial = false;
		}
		return this.get_x_local();
	}
	,set_y_local: function(_y) {
		this.y_local = _y;
		if(!this.ignore_spatial) {
			this.ignore_spatial = true;
			if(this.parent != null) this.set_y(this.parent.y + this.get_y_local()); else this.set_y(this.get_y_local());
			this.ignore_spatial = false;
		}
		return this.get_y_local();
	}
	,get_x_local: function() {
		return this.x_local;
	}
	,get_y_local: function() {
		return this.y_local;
	}
	,get_nodes: function() {
		var _nodes = 1;
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			_nodes += child.get_nodes();
		}
		return _nodes;
	}
	,get_depth: function() {
		return this.depth;
	}
	,set_depth: function(_depth) {
		this.depth = _depth;
		var _g = 0;
		var _g1 = this.ondepth.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.depth);
		}
		return this.depth;
	}
	,set_parent: function(p) {
		this.parent = p;
		if(this.parent != null) {
			this.ignore_spatial = true;
			this.set_x(this.parent.x + this.get_x_local());
			this.set_y(this.parent.y + this.get_y_local());
			this.ignore_spatial = false;
		}
		return this.parent;
	}
	,get_parent: function() {
		return this.parent;
	}
	,__class__: mint_Control
};
var mint_Button = function(_options) {
	this.options = _options;
	if(this.options.name == null) this.options.name = "button";
	this.options.name;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	mint_Control.call(this,this.options);
	if(this.options.align == null) this.options.align = 3;
	this.options.align;
	if(this.options.align_vertical == null) this.options.align_vertical = 3;
	this.options.align_vertical;
	if(this.options.text_size == null) this.options.text_size = 14;
	this.options.text_size;
	this.label = new mint_Label({ parent : this, x : 0, y : 0, w : this.w, h : this.h, text : this.options.text, text_size : this.options.text_size, name : this.name + ".label", options : this.options.options.label, mouse_input : false, internal_visible : this.options.visible});
	this.renderer = this.rendering.get(mint_Button,this);
	if(this.options.onclick != null) this.onmouseup.listen(this.options.onclick);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Button"] = mint_Button;
mint_Button.__name__ = true;
mint_Button.__super__ = mint_Control;
mint_Button.prototype = $extend(mint_Control.prototype,{
	label: null
	,options: null
	,__class__: mint_Button
});
var mint_Canvas = function(_options) {
	this._mouse_down = false;
	this.depth_idx = 0.0;
	this.focus_invalid = true;
	this.options = _options;
	this.onfocusedchange = new mint_core_Signal();
	this.onmarkedchange = new mint_core_Signal();
	this.oncapturedchange = new mint_core_Signal();
	if(this.options == null) throw new js__$Boot_HaxeError(mint_core_DebugError.null_assertion("options was null" + (" ( " + "No options given to canvas, at least a Renderer is required." + " )")));
	if(this.options.rendering == null) throw new js__$Boot_HaxeError(mint_core_DebugError.null_assertion("options.rendering was null" + (" ( " + "No Rendering given to Canvas, cannot create a canvas without one." + " )")));
	if(this.options.name == null) this.options.name = "canvas";
	this.options.name;
	if(this.options.w == null) this.options.w = 800;
	this.options.w;
	if(this.options.h == null) this.options.h = 600;
	this.options.h;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	mint_Control.call(this,this.options);
	this.canvas = this;
	this.set_captured(null);
	this.set_focused(null);
	this.set_marked(null);
	this.renderer = this.rendering.get(mint_Canvas,this);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Canvas"] = mint_Canvas;
mint_Canvas.__name__ = true;
mint_Canvas.__super__ = mint_Control;
mint_Canvas.prototype = $extend(mint_Control.prototype,{
	focused: null
	,marked: null
	,captured: null
	,focus_invalid: null
	,onfocusedchange: null
	,onmarkedchange: null
	,oncapturedchange: null
	,options: null
	,bring_to_front: function(control) {
		this.canvas.add(control);
		this.sync_depth();
	}
	,topmost_at_point: function(_x,_y) {
		var _control = this.topmost_child_at_point(_x,_y);
		if(_control != this) return _control;
		return null;
	}
	,depth_idx: null
	,apply_depth: function(control) {
		control.set_depth(this.depth_idx + control.depth_offset);
		this.depth_idx++;
		var _g = 0;
		var _g1 = control.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			this.apply_depth(child);
		}
	}
	,sync_depth: function() {
		this.depth_idx = 0;
		this.apply_depth(this);
	}
	,mouseup: function(e) {
		this._mouse_down = false;
		var _g = 0;
		var _g1 = this.onmouseup.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
	}
	,_mouse_down: null
	,mousedown: function(e) {
		this._mouse_down = true;
		var _g = 0;
		var _g1 = this.onmousedown.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
	}
	,mousemove: function(e) {
		var _inside = mint_types_Helper.in_rect(e.x,e.y,this.x,this.y,this.w,this.h);
		if(this.ishovered && !_inside) {
			this.mouseleave(e);
			if(this._mouse_down) this.mouseup(e);
		} else if(!this.ishovered && _inside) this.mouseenter(e);
		var _g = 0;
		var _g1 = this.onmousemove.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
	}
	,mousewheel: function(e) {
		var _g = 0;
		var _g1 = this.onmousewheel.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
	}
	,keyup: function(e) {
		var _g = 0;
		var _g1 = this.onkeyup.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
	}
	,keydown: function(e) {
		var _g = 0;
		var _g1 = this.onkeydown.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
	}
	,textinput: function(e) {
		var _g = 0;
		var _g1 = this.ontextinput.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(e,this);
		}
	}
	,update: function(dt) {
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var control = _g1[_g];
			++_g;
			control.update(dt);
		}
	}
	,get_focused: function() {
		return this.focused;
	}
	,set_focused: function(_control) {
		if(this.get_focused() != null) this.get_focused().isfocused = false;
		this.focused = _control;
		var _g = 0;
		var _g1 = this.onfocusedchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.get_focused());
		}
		if(this.get_focused() != null) this.get_focused().isfocused = true;
		return this.get_focused();
	}
	,get_captured: function() {
		return this.captured;
	}
	,set_captured: function(_control) {
		if(this.get_captured() != null) this.get_captured().iscaptured = false;
		this.captured = _control;
		var _g = 0;
		var _g1 = this.oncapturedchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.get_captured());
		}
		if(this.get_captured() != null) this.get_captured().iscaptured = true;
		return this.get_captured();
	}
	,get_marked: function() {
		return this.marked;
	}
	,set_marked: function(_control) {
		if(this.get_marked() != null) this.get_marked().ismarked = false;
		this.marked = _control;
		var _g = 0;
		var _g1 = this.onmarkedchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.get_captured());
		}
		if(this.get_marked() != null) this.get_marked().ismarked = true;
		return this.get_marked();
	}
	,__class__: mint_Canvas
});
var mint_Checkbox = function(_options) {
	this.state = true;
	this.options = _options;
	if(this.options.name == null) this.options.name = "checkbox";
	this.options.name;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	mint_Control.call(this,_options);
	this.onchange = new mint_core_Signal();
	if(this.options.state != null) this.set_state(this.options.state);
	this.renderer = this.rendering.get(mint_Checkbox,this);
	if(this.options.onchange != null) this.onchange.listen(this.options.onchange);
	this.onmouseup.listen($bind(this,this.onclick));
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Checkbox"] = mint_Checkbox;
mint_Checkbox.__name__ = true;
mint_Checkbox.__super__ = mint_Control;
mint_Checkbox.prototype = $extend(mint_Control.prototype,{
	state: null
	,onchange: null
	,options: null
	,onclick: function(_,_1) {
		this.set_state(!this.state);
	}
	,set_state: function(_b) {
		var prev = this.state;
		this.state = _b;
		var _g = 0;
		var _g1 = this.onchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.state,prev);
		}
		return this.state;
	}
	,__class__: mint_Checkbox
});
var mint_Dropdown = function(_options) {
	this.skip_mouse_up = false;
	this._height = 110;
	this.is_open = false;
	this.options = _options;
	if(this.options.name == null) this.options.name = "dropdown";
	this.options.name;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	mint_Control.call(this,this.options);
	this.onselect = new mint_core_Signal();
	if(this.options.align == null) this.options.align = 1;
	this.options.align;
	if(this.options.align_vertical == null) this.options.align_vertical = 3;
	this.options.align_vertical;
	if(this.options.text_size == null) this.options.text_size = 14;
	this.options.text_size;
	this.list = new mint_List({ parent : this, name : this.name + ".list", x : 0, y : this.options.h + 1, w : this.w - 1, h : this._height, options : this.options.options.list, internal_visible : this.options.visible});
	this.list.onselect.listen($bind(this,this.onselected));
	this.list.onmousedown.listen($bind(this,this.ondeselect));
	this.label = new mint_Label({ parent : this, x : 5, y : 0, w : this.w - 10, h : this.h, text : this.options.text, text_size : this.options.text_size, name : this.name + ".label", options : this.options.options.label, align : this.options.align, align_vertical : this.options.align_vertical, internal_visible : this.options.visible});
	this.renderer = this.rendering.get(mint_Dropdown,this);
	this.list.set_visible(false);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Dropdown"] = mint_Dropdown;
mint_Dropdown.__name__ = true;
mint_Dropdown.__super__ = mint_Control;
mint_Dropdown.prototype = $extend(mint_Control.prototype,{
	list: null
	,label: null
	,is_open: null
	,onselect: null
	,_height: null
	,options: null
	,ondeselect: function(e,c) {
		if(!this.list.contains(e.x,e.y)) this.close_list();
	}
	,onselected: function(idx,c,e) {
		var _g = 0;
		var _g1 = this.onselect.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(idx,c,e);
		}
		this.close_list();
	}
	,add_item: function(_item,offset_x,offset_y) {
		if(offset_y == null) offset_y = 0.0;
		if(offset_x == null) offset_x = 0.0;
		this.list.add_item(_item,offset_x,offset_y);
		this.list.set_visible(this.is_open);
	}
	,close_list: function() {
		this.list.uncapture();
		this.list.set_visible(false);
		this.list.set_x(0);
		this.list.set_y(this.h + 1);
		this.add(this.list);
		this.is_open = false;
	}
	,open_list: function() {
		this.list.set_visible(true);
		this.canvas.bring_to_front(this.list);
		this.list.set_x(this.x);
		this.list.set_y(this.y + this.h + 1);
		this.list.capture();
		this.is_open = true;
	}
	,skip_mouse_up: null
	,mousedown: function(e) {
		mint_Control.prototype.mousedown.call(this,e);
		if(e.button == 0) {
			if(this.contains(e.x,e.y) && !this.is_open) {
				this.open_list();
				this.skip_mouse_up = true;
			}
		}
	}
	,mouseup: function(e) {
		mint_Control.prototype.mouseup.call(this,e);
		if(e.button == 0) {
			if(this.is_open && !this.skip_mouse_up) {
				this.close_list();
				return;
			}
			this.skip_mouse_up = false;
		}
	}
	,bounds_changed: function(_dx,_dy,_dw,_dh) {
		if(_dh == null) _dh = 0.0;
		if(_dw == null) _dw = 0.0;
		if(_dy == null) _dy = 0.0;
		if(_dx == null) _dx = 0.0;
		mint_Control.prototype.bounds_changed.call(this,_dx,_dy,_dw,_dh);
		if(this.list != null) {
			if(this.is_open) this.list.set_pos(this.x,this.y + this.h + 1);
			this.list.set_size(this.w,this.list.h);
		}
		if(this.label != null) this.label.set_size(this.w - 1,this.h);
	}
	,__class__: mint_Dropdown
});
var mint_Image = function(_options) {
	this.options = _options;
	if(this.options.name == null) this.options.name = "image";
	this.options.name;
	mint_Control.call(this,_options);
	this.onchange = new mint_core_Signal();
	this.set_path((function($this) {
		var $r;
		if($this.options.path == null) $this.options.path = "";
		$r = $this.options.path;
		return $r;
	}(this)));
	this.renderer = this.rendering.get(mint_Image,this);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Image"] = mint_Image;
mint_Image.__name__ = true;
mint_Image.__super__ = mint_Control;
mint_Image.prototype = $extend(mint_Control.prototype,{
	options: null
	,path: null
	,onchange: null
	,set_path: function(_p) {
		if(this.path == null) return this.path = _p;
		this.path = _p;
		var _g = 0;
		var _g1 = this.onchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.path);
		}
		return this.path;
	}
	,__class__: mint_Image
});
var mint_Label = function(_options) {
	this.options = _options;
	if(this.options.name == null) this.options.name = "label";
	this.options.name;
	mint_Control.call(this,this.options);
	this.onchange = new mint_core_Signal();
	if(this.options.align == null) this.options.align = 3;
	this.options.align;
	if(this.options.align_vertical == null) this.options.align_vertical = 3;
	this.options.align_vertical;
	if(this.options.text_size == null) this.options.text_size = 14;
	this.options.text_size;
	if(this.options.onclick != null) {
		this.mouse_input = true;
		this.onmouseup.listen(this.options.onclick);
	}
	this.set_text(this.options.text);
	this.renderer = this.rendering.get(mint_Label,this);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Label"] = mint_Label;
mint_Label.__name__ = true;
mint_Label.__super__ = mint_Control;
mint_Label.prototype = $extend(mint_Control.prototype,{
	text: null
	,onchange: null
	,options: null
	,set_text: function(_s) {
		this.text = _s;
		var _g = 0;
		var _g1 = this.onchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.text);
		}
		return this.text;
	}
	,__class__: mint_Label
});
var mint_List = function(_options) {
	this.items = [];
	this.options = _options;
	if(this.options.name == null) this.options.name = "list";
	this.options.name;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	mint_Control.call(this,this.options);
	this.onselect = new mint_core_Signal();
	this.onitemleave = new mint_core_Signal();
	this.onitementer = new mint_core_Signal();
	this.view = new mint_Scroll({ parent : this, x : 0, y : 0, w : this.w, h : this.h, name : this.name + ".view", options : this.options.options.view, internal_visible : this.options.visible});
	this.renderer = this.rendering.get(mint_List,this);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.List"] = mint_List;
mint_List.__name__ = true;
mint_List.__super__ = mint_Control;
mint_List.prototype = $extend(mint_Control.prototype,{
	view: null
	,items: null
	,options: null
	,onselect: null
	,onitementer: null
	,onitemleave: null
	,add_item: function(item,offset_x,offset_y) {
		if(offset_y == null) offset_y = 0.0;
		if(offset_x == null) offset_x = 0.0;
		var _childbounds = this.view.container.get_children_bounds();
		var _g = item;
		_g.set_y_local(_g.get_y_local() + (_childbounds.bottom + offset_y));
		var _g1 = item;
		_g1.set_x_local(_g1.get_x_local() + offset_x);
		this.view.add(item);
		item.mouse_input = true;
		this.items.push(item);
		item.onmouseup.listen($bind(this,this.item_mousedown));
		item.onmouseenter.listen($bind(this,this.item_mouseenter));
		item.onmouseleave.listen($bind(this,this.item_mouseleave));
	}
	,item_mouseenter: function(event,ctrl) {
		var idx = HxOverrides.indexOf(this.items,ctrl,0);
		var _g = 0;
		var _g1 = this.onitementer.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(idx,ctrl,event);
		}
	}
	,item_mouseleave: function(event,ctrl) {
		var idx = HxOverrides.indexOf(this.items,ctrl,0);
		var _g = 0;
		var _g1 = this.onitemleave.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(idx,ctrl,event);
		}
	}
	,item_mousedown: function(event,ctrl) {
		var idx = HxOverrides.indexOf(this.items,ctrl,0);
		var _g = 0;
		var _g1 = this.onselect.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(idx,ctrl,event);
		}
	}
	,clear: function() {
		var _g = 0;
		var _g1 = this.items;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			item.destroy();
			item = null;
		}
		this.items = null;
		this.items = [];
		var _g2 = 0;
		var _g11 = this.onselect.listeners;
		while(_g2 < _g11.length) {
			var l = _g11[_g2];
			++_g2;
			l(-1,null,null);
		}
	}
	,bounds_changed: function(_dx,_dy,_dw,_dh) {
		if(_dh == null) _dh = 0.0;
		if(_dw == null) _dw = 0.0;
		if(_dy == null) _dy = 0.0;
		if(_dx == null) _dx = 0.0;
		mint_Control.prototype.bounds_changed.call(this,_dx,_dy,_dw,_dh);
		if(this.view != null) this.view.set_size(this.w,this.h);
	}
	,__class__: mint_List
});
var mint_Panel = function(_options) {
	this.options = _options;
	if(this.options.name == null) this.options.name = "panel";
	this.options.name;
	mint_Control.call(this,this.options);
	this.renderer = this.rendering.get(mint_Panel,this);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Panel"] = mint_Panel;
mint_Panel.__name__ = true;
mint_Panel.__super__ = mint_Control;
mint_Panel.prototype = $extend(mint_Control.prototype,{
	options: null
	,__class__: mint_Panel
});
var mint_Progress = function(_options) {
	this.progress = 0.5;
	this.options = _options;
	if(this.options.name == null) this.options.name = "progress";
	this.options.name;
	mint_Control.call(this,this.options);
	this.onchange = new mint_core_Signal();
	this.set_progress((function($this) {
		var $r;
		if($this.options.progress == null) $this.options.progress = 0.5;
		$r = $this.options.progress;
		return $r;
	}(this)));
	this.renderer = this.rendering.get(mint_Progress,this);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Progress"] = mint_Progress;
mint_Progress.__name__ = true;
mint_Progress.__super__ = mint_Control;
mint_Progress.prototype = $extend(mint_Control.prototype,{
	progress: null
	,onchange: null
	,options: null
	,set_progress: function(_value) {
		var prev = this.progress;
		if(_value < 0.0) _value = 0.0; else if(_value > 1.0) _value = 1.0; else _value = _value;
		this.progress = _value;
		var _g = 0;
		var _g1 = this.onchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.progress,prev);
		}
		return this.progress;
	}
	,__class__: mint_Progress
});
var mint_Scroll = function(_options) {
	this.ready = false;
	this.visible_h = false;
	this.percent_h = 0.0;
	this.drag_x = 0.0;
	this.drag_h = false;
	this.visible_v = false;
	this.percent_v = 0.0;
	this.drag_y = 0.0;
	this.drag_v = false;
	this.onchange = new mint_core_Signal();
	this.onhandlevis = new mint_core_Signal();
	this.options = _options;
	if(this.options.name == null) this.options.name = "scroll";
	this.options.name;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	mint_Control.call(this,_options);
	this.container = new mint_Control({ parent : this, name : "" + this.name + ".container", mouse_input : true, internal_visible : this.options.visible, x : 0, y : 0, w : this.w, h : this.h});
	this.scrollv = new mint_Control({ parent : this, name : "" + this.name + ".scroll_v", mouse_input : true, internal_visible : this.options.visible, x : this.w - 8, y : 0, w : 8, h : 16});
	this.scrollh = new mint_Control({ parent : this, name : "" + this.name + ".scroll_h", mouse_input : true, internal_visible : this.options.visible, x : 0, y : this.h - 8, w : 16, h : 8});
	this.child_bounds = this.container.get_children_bounds();
	this.container.set_clip_with(this);
	this.scrollv.set_clip_with(this);
	this.scrollh.set_clip_with(this);
	this.ready = true;
	this.scrollv.onmousedown.listen($bind(this,this.scrollvdown));
	this.scrollv.onmouseup.listen($bind(this,this.scrollvup));
	this.scrollv.onmousemove.listen($bind(this,this.scrollvmove));
	this.scrollh.onmousedown.listen($bind(this,this.scrollhdown));
	this.scrollh.onmouseup.listen($bind(this,this.scrollhup));
	this.scrollh.onmousemove.listen($bind(this,this.scrollhmove));
	this.renderer = this.rendering.get(mint_Scroll,this);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.Scroll"] = mint_Scroll;
mint_Scroll.__name__ = true;
mint_Scroll.__super__ = mint_Control;
mint_Scroll.prototype = $extend(mint_Control.prototype,{
	scrollh: null
	,scrollv: null
	,container: null
	,child_bounds: null
	,onchange: null
	,onhandlevis: null
	,drag_v: null
	,drag_y: null
	,percent_v: null
	,visible_v: null
	,drag_h: null
	,drag_x: null
	,percent_h: null
	,visible_h: null
	,options: null
	,ready: null
	,set_scroll_percent: function(_horizontal,_vertical) {
		if(_vertical == null) _vertical = this.percent_v;
		this.percent_v = _vertical;
		if(_horizontal == null) _horizontal = this.percent_h;
		this.percent_h = _horizontal;
		this.percent_v = mint_types_Helper.clamp(this.percent_v,0,1);
		this.percent_h = mint_types_Helper.clamp(this.percent_h,0,1);
		this.update_scroll();
	}
	,update_container: function() {
		if(!this.ready) return;
		this.child_bounds = this.container.get_children_bounds();
		this.container.set_w(this.child_bounds.real_w);
		this.container.set_h(this.child_bounds.real_h);
	}
	,scrollvdown: function(e,_) {
		if(!this.visible_v) return;
		this.drag_v = true;
		this.drag_y = e.y - this.scrollv.y;
		this.scrollv.focus();
	}
	,scrollvup: function(e,_) {
		this.drag_v = false;
		this.scrollv.unfocus();
	}
	,scrollvmove: function(e,_) {
		if(this.drag_v && this.visible_v) {
			var _dest = mint_types_Helper.clamp(e.y - this.drag_y,this.y,this.y + this.h - this.scrollv.h);
			this.percent_v = (_dest - this.y) / (this.h - this.scrollv.h);
			this.update_scroll();
		}
	}
	,scrollhdown: function(e,_) {
		if(!this.visible_h) return;
		this.drag_h = true;
		this.drag_x = e.x - this.scrollh.x;
		this.scrollh.focus();
	}
	,scrollhup: function(e,_) {
		this.drag_h = false;
		this.scrollh.unfocus();
	}
	,scrollhmove: function(e,_) {
		if(this.drag_h && this.visible_h) {
			var _dest = mint_types_Helper.clamp(e.x - this.drag_x,this.x,this.x + this.w - this.scrollh.w);
			this.percent_h = (_dest - this.x) / (this.w - this.scrollh.w);
			this.update_scroll();
		}
	}
	,update_scroll: function() {
		if(!this.ready) return;
		var _dy = this.h - this.container.h;
		var _dx = this.w - this.container.w;
		this.visible_h = _dx < 0;
		this.visible_v = _dy < 0;
		if(_dx >= 0) _dx = 0;
		if(_dy >= 0) _dy = 0;
		this.container.set_x(this.x + _dx * this.percent_h);
		this.container.set_y(this.y + _dy * this.percent_v);
		this.scrollh.set_x(this.x + this.percent_h * (this.w - this.scrollh.w));
		this.scrollv.set_y(this.y + this.percent_v * (this.h - this.scrollv.h));
		var _g = 0;
		var _g1 = this.onchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l();
		}
		var _g2 = 0;
		var _g11 = this.onhandlevis.listeners;
		while(_g2 < _g11.length) {
			var l1 = _g11[_g2];
			++_g2;
			l1(this.visible_h,this.visible_v);
		}
	}
	,get_step_h: function() {
		return 0.01;
	}
	,get_step_v: function() {
		return 0.01;
	}
	,add: function(child) {
		if(!this.ready) mint_Control.prototype.add.call(this,child); else {
			this.container.add(child);
			this.refresh_scroll();
			child.set_clip_with(this);
		}
	}
	,refresh_scroll: function() {
		this.update_container();
		this.update_scroll();
	}
	,remove: function(child) {
		mint_Control.prototype.remove.call(this,child);
		this.refresh_scroll();
	}
	,mousewheel: function(e) {
		mint_Control.prototype.mousewheel.call(this,e);
		if(e.x != 0 && this.visible_h) this.set_scroll_percent(this.percent_h + e.x * 0.01,this.percent_v);
		if(e.y != 0 && this.visible_v) this.set_scroll_percent(this.percent_h,this.percent_v + e.y * 0.01);
	}
	,bounds_changed: function(_dx,_dy,_dw,_dh) {
		if(_dh == null) _dh = 0.0;
		if(_dw == null) _dw = 0.0;
		if(_dy == null) _dy = 0.0;
		if(_dx == null) _dx = 0.0;
		mint_Control.prototype.bounds_changed.call(this,_dx,_dy,_dw,_dh);
		this.refresh_scroll();
		if(this.scrollh != null) this.scrollh.set_y_local(this.h - 8);
		if(this.scrollv != null) this.scrollv.set_x_local(this.w - 8);
	}
	,__class__: mint_Scroll
});
var mint_Slider = function(_options) {
	this.ignore_set = true;
	this.dragging = false;
	this.bar_h = 0.0;
	this.bar_w = 0.0;
	this.bar_y = 2.0;
	this.bar_x = 2.0;
	this.invert = false;
	this.vertical = false;
	this.percent = 1;
	this.value = 1;
	this.max = 1;
	this.min = 0;
	this.options = _options;
	if(this.options.name == null) this.options.name = "slider";
	this.options.name;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	if(this.options.max == null) this.options.max = 1;
	this.max = this.options.max;
	if(this.options.min == null) this.options.min = 0;
	this.min = this.options.min;
	this.set_value((function($this) {
		var $r;
		if($this.options.value == null) $this.options.value = $this.max;
		$r = $this.options.value;
		return $r;
	}(this)));
	if(this.options.vertical == null) this.options.vertical = false;
	this.vertical = this.options.vertical;
	if(this.options.invert == null) this.options.invert = false;
	this.invert = this.options.invert;
	this.step = this.options.step;
	mint_Control.call(this,this.options);
	this.onchange = new mint_core_Signal();
	this.renderer = this.rendering.get(mint_Slider,this);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
	this.update_value(this.value);
};
$hxClasses["mint.Slider"] = mint_Slider;
mint_Slider.__name__ = true;
mint_Slider.__super__ = mint_Control;
mint_Slider.prototype = $extend(mint_Control.prototype,{
	options: null
	,min: null
	,max: null
	,value: null
	,percent: null
	,step: null
	,vertical: null
	,invert: null
	,bar_x: null
	,bar_y: null
	,bar_w: null
	,bar_h: null
	,onchange: null
	,dragging: null
	,mousedown: function(e) {
		mint_Control.prototype.mousedown.call(this,e);
		this.dragging = true;
		this.focus();
		this.update_value_from_mouse(e);
	}
	,get_range: function() {
		return this.max - this.min;
	}
	,ignore_set: null
	,update_value: function(_value) {
		_value = mint_types_Helper.clamp(_value,this.min,this.max);
		if(this.step != null) _value = Math.round(_value / this.step) * this.step;
		if(this.vertical) {
			this.bar_w = this.w - 4;
			this.bar_h = (this.h - 4) * (_value - this.min) / (this.max - this.min);
			if(!this.invert) this.bar_y = this.h - (this.h - 4) * (_value - this.min) / (this.max - this.min) - 2; else this.bar_y = 2;
			this.bar_h = mint_types_Helper.clamp(this.bar_h,1,this.h - 4);
		} else {
			this.bar_w = (this.w - 4) * (_value - this.min) / (this.max - this.min);
			this.bar_w = mint_types_Helper.clamp(this.bar_w,1,this.w - 4);
			this.bar_h = this.h - 4;
			if(!this.invert) this.bar_x = 2; else this.bar_x = this.w - (this.w - 4) * (_value - this.min) / (this.max - this.min) - 2;
		}
		this.percent = _value / (this.max - this.min);
		this.ignore_set = true;
		this.set_value(_value);
		this.ignore_set = false;
		var _g = 0;
		var _g1 = this.onchange.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.value,this.percent);
		}
	}
	,set_value: function(_value) {
		if(this.ignore_set) return this.value = _value;
		this.update_value(_value);
		return this.value;
	}
	,update_value_from_mouse: function(e) {
		if(!this.vertical) {
			var _dx;
			if(!this.invert) _dx = e.x - this.x; else _dx = this.w - (e.x - this.x);
			if(_dx < 1) _dx = 1;
			if(_dx >= this.w - 4) _dx = this.w - 4;
			var _v = (_dx - 1) / (this.w - 5) * (this.max - this.min) + this.min;
			this.update_value(_v);
		} else {
			var _dy;
			if(!this.invert) _dy = this.h - (e.y - this.y); else _dy = e.y - this.y;
			if(_dy < 1) _dy = 1;
			if(_dy >= this.h - 4) _dy = this.h - 4;
			var _v1 = (_dy - 1) / (this.h - 5) * (this.max - this.min) + this.min;
			this.update_value(_v1);
		}
	}
	,mousemove: function(e) {
		if(this.dragging) this.update_value_from_mouse(e);
	}
	,mouseup: function(e) {
		this.dragging = false;
		this.unfocus();
		mint_Control.prototype.mouseup.call(this,e);
	}
	,__class__: mint_Slider
});
var mint_TextEdit = function(_options) {
	this.display = "";
	this.composition_length = 0;
	this.composition_start = 0;
	this.composition = "";
	this.edit = "";
	this.index = 0;
	this.options = _options;
	if(this.options.name == null) this.options.name = "textedit";
	this.options.name;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	if(this.options.key_input == null) this.options.key_input = true;
	this.options.key_input;
	mint_Control.call(this,this.options);
	this.onchangeindex = new mint_core_Signal();
	this.onchange = new mint_core_Signal();
	if(this.options.filter == null) this.options.filter = null;
	this.filter = this.options.filter;
	if(this.options.text == null) this.options.text = "mint.TextEdit";
	this.options.text;
	if(this.options.text_size == null) this.options.text_size = this.options.h * 0.8;
	this.options.text_size;
	this.label = new mint_Label({ parent : this, x : 2, y : 0, w : this.w, h : this.h, text : this.options.text, text_size : this.options.text_size, align : 1, align_vertical : 3, options : this.options.options.label, name : this.name + ".label", mouse_input : false, depth : this.options.depth + 0.001, internal_visible : this.options.visible});
	this.edit = this.label.text;
	this.index = mint_core_unifill_Unifill.uLength(this.edit);
	this.renderer = this.rendering.get(mint_TextEdit,this);
	if(this.options.display_char != null) this.set_display_char(this.options.display_char);
	this.refresh(this.edit,false,null);
	var _g = 0;
	var _g1 = this.oncreate.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l();
	}
};
$hxClasses["mint.TextEdit"] = mint_TextEdit;
mint_TextEdit.__name__ = true;
mint_TextEdit.__super__ = mint_Control;
mint_TextEdit.prototype = $extend(mint_Control.prototype,{
	label: null
	,filter: null
	,index: null
	,display_char: null
	,onchangeindex: null
	,onchange: null
	,edit: null
	,composition: null
	,composition_start: null
	,composition_length: null
	,display: null
	,options: null
	,mousedown: function(event) {
		mint_Control.prototype.mousedown.call(this,event);
		if(this.contains(event.x,event.y)) this.focus(); else this.unfocus();
	}
	,unfocus: function() {
		mint_Control.prototype.unfocus.call(this);
		this.composition = "";
		this.composition_start = this.composition_length = 0;
	}
	,textinput: function(event) {
		mint_Control.prototype.textinput.call(this,event);
		var _bef = mint_core_unifill_Unifill.uSubstr(this.edit,0,this.index);
		var _aft = mint_core_unifill_Unifill.uSubstr(this.edit,this.index,this.edit.length);
		var _new = _bef + event.text + _aft;
		var _g = event.type;
		switch(_g[1]) {
		case 1:
			this.composition = event.text;
			this.composition_start = event.start;
			this.composition_length = event.length;
			this.refresh(this.edit,true,false);
			break;
		case 2:
			this.composition = "";
			this.composition_start = this.composition_length = 0;
			if(this.filter != null && !this.filter(event.text,_new,this.edit)) return;
			this.index += mint_core_unifill_Unifill.uLength(event.text);
			this.refresh(_new,null,null);
			break;
		default:
		}
	}
	,keydown: function(event) {
		mint_Control.prototype.keydown.call(this,event);
		var _g = event.key;
		switch(_g) {
		case 4:
			this.move(-1);
			this.cut(this.index,1);
			break;
		case 5:
			this.cut(this.index,1);
			break;
		case 0:
			this.move(-1);
			break;
		case 1:
			this.move(1);
			break;
		case 7:
			break;
		case 6:
			break;
		case -1:
			break;
		case 3:
			break;
		case 2:
			break;
		}
	}
	,refresh: function(str,_from_typing,_emit) {
		if(_emit == null) _emit = true;
		if(_from_typing == null) _from_typing = true;
		this.edit = str;
		if(this.display_char != null) {
			this.display = "";
			var _l = mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointCount(str,0,str.length);
			var _g = 0;
			while(_g < _l) {
				var i = _g++;
				this.display += this.display_char;
			}
		} else this.display = mint_core_unifill_Unifill.uSubstr(this.edit,0,this.index) + this.composition + mint_core_unifill_Unifill.uSubstr(this.edit,this.index,this.edit.length);
		this.label.set_text(this.display);
		this.update_cur();
		if(_emit) {
			var _g1 = 0;
			var _g11 = this.onchange.listeners;
			while(_g1 < _g11.length) {
				var l = _g11[_g1];
				++_g1;
				l(this.edit,this.display,_from_typing);
			}
		}
		return this.edit;
	}
	,get_text: function() {
		return this.edit;
	}
	,get_display_text: function() {
		return this.display;
	}
	,get_display_char: function() {
		return this.display_char;
	}
	,set_text: function(v) {
		this.index = mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointCount(v,0,v.length);
		return this.refresh(v,false,null);
	}
	,set_display_char: function(v) {
		if(v != null) this.display_char = mint_core_unifill_Unifill.uCharAt(v,0); else this.display_char = v;
		this.refresh(this.edit,false,null);
		this.update_cur();
		return this.display_char;
	}
	,move: function(amount) {
		if(amount == null) amount = -1;
		this.index += amount;
		this.index = Std["int"](mint_types_Helper.clamp(this.index,0,mint_core_unifill_Unifill.uLength(this.edit)));
		this.update_cur();
	}
	,cut: function(start,count) {
		if(count == null) count = 1;
		if(start == null) start = 0;
		var a = mint_core_unifill_Unifill.uSubstr(this.edit,start,this.edit.length);
		return this.refresh(mint_core_unifill_Unifill.uSubstr(this.edit,0,start) + mint_core_unifill_Unifill.uSubstr(a,count,mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointCount(a,0,a.length)),null,null);
	}
	,after: function(cur) {
		if(cur == null) cur = 0;
		return mint_core_unifill_Unifill.uSubstr(this.edit,cur,this.edit.length);
	}
	,before: function(cur) {
		if(cur == null) cur = 0;
		return mint_core_unifill_Unifill.uSubstr(this.edit,0,cur);
	}
	,after_display: function(cur) {
		if(cur == null) cur = 0;
		return mint_core_unifill_Unifill.uSubstr(this.display,cur,this.display.length);
	}
	,before_display: function(cur) {
		if(cur == null) cur = 0;
		return mint_core_unifill_Unifill.uSubstr(this.display,0,cur);
	}
	,update_cur: function() {
		var _g = 0;
		var _g1 = this.onchangeindex.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(this.index);
		}
	}
	,__class__: mint_TextEdit
});
var mint_Window = function(_options) {
	this.pre_resize = true;
	this.pre_h_min = 0.0;
	this.pre_h = 0.0;
	this.collapsed = false;
	this.resize_y = 0.0;
	this.resize_x = 0.0;
	this.resizing = false;
	this.ready = false;
	this.drag_y = 0;
	this.drag_x = 0;
	this.dragging = false;
	this.collapsible = false;
	this.resizable = true;
	this.moveable = true;
	this.focusable = true;
	this.closable = true;
	var _g = this;
	this.options = _options;
	this.onclose = new mint_core_Signal();
	this.oncollapse = new mint_core_Signal();
	if(this.options.name == null) this.options.name = "window";
	this.options.name;
	if(this.options.mouse_input == null) this.options.mouse_input = true;
	this.options.mouse_input;
	mint_Control.call(this,this.options);
	if(this.options.moveable == null) this.options.moveable = true;
	this.moveable = this.options.moveable;
	if(this.options.resizable == null) this.options.resizable = true;
	this.resizable = this.options.resizable;
	if(this.options.closable == null) this.options.closable = true;
	this.closable = this.options.closable;
	if(this.options.focusable == null) this.options.focusable = true;
	this.focusable = this.options.focusable;
	if(this.options.collapsible == null) this.options.collapsible = false;
	this.collapsible = this.options.collapsible;
	this.resize_handle = new mint_Control({ parent : this, x : this.w - 24, y : this.h - 24, w : 24, h : 24, name : this.name + ".resize_handle", internal_visible : this.options.visible});
	this.resize_handle.mouse_input = this.resizable;
	this.resize_handle.onmousedown.listen($bind(this,this.on_resize_down));
	this.resize_handle.onmouseup.listen($bind(this,this.on_resize_up));
	this.title = new mint_Label({ parent : this, x : 2, y : 2, w : this.w - 4, h : 22, text : this.options.title, align : 3, align_vertical : 3, text_size : this.options.text_size, options : this.options.options.label, name : this.name + ".titlelabel", internal_visible : this.options.visible});
	this.close_button = new mint_Label({ parent : this, x : this.w - 24, y : 2, w : 22, h : 22, text : "x", align : 3, align_vertical : 3, text_size : this.options.text_size, options : this.options.options.close_button, name : this.name + ".closelabel", internal_visible : this.options.visible});
	this.ready = true;
	this.close_button.mouse_input = this.closable;
	if(!this.closable) this.close_button.set_visible(false); else this.close_button.onmousedown.listen(function(_,_1) {
		_g.on_close();
	});
	this.collapse_handle = new mint_Control({ parent : this, x : this.closable?this.w - 48:this.w - 24, y : 2, w : 22, h : 22, name : this.name + ".collapselabel", internal_visible : this.options.visible});
	this.collapse_handle.mouse_input = this.collapsible;
	if(!this.collapsible) this.collapse_handle.set_visible(false); else this.collapse_handle.onmousedown.listen($bind(this,this.on_collapse));
	this.renderer = this.rendering.get(mint_Window,this);
	var _g1 = 0;
	var _g11 = this.oncreate.listeners;
	while(_g1 < _g11.length) {
		var l = _g11[_g1];
		++_g1;
		l();
	}
};
$hxClasses["mint.Window"] = mint_Window;
mint_Window.__name__ = true;
mint_Window.__super__ = mint_Control;
mint_Window.prototype = $extend(mint_Control.prototype,{
	title: null
	,close_button: null
	,resize_handle: null
	,collapse_handle: null
	,closable: null
	,focusable: null
	,moveable: null
	,resizable: null
	,collapsible: null
	,onclose: null
	,oncollapse: null
	,dragging: null
	,drag_x: null
	,drag_y: null
	,options: null
	,ready: null
	,resizing: null
	,resize_x: null
	,resize_y: null
	,on_resize_up: function(e,_) {
		if(!this.resizable) return;
		if(this.collapsed) return;
		this.resizing = false;
		this.resize_handle.unfocus();
	}
	,on_resize_down: function(e,_) {
		if(!this.resizable) return;
		if(this.collapsed) return;
		if(this.resizing) return;
		this.resizing = true;
		this.resize_x = e.x;
		this.resize_y = e.y;
		this.resize_handle.focus();
		e.bubble = false;
	}
	,collapsed: null
	,pre_h: null
	,pre_h_min: null
	,pre_resize: null
	,on_collapse: function(e,_) {
		if(!this.collapsible) return;
		this.collapsed = !this.collapsed;
		if(this.collapsed == true) {
			this.pre_resize = this.resize_handle.visible;
			this.pre_h = this.h;
			this.pre_h_min = this.h_min;
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child == this.title) continue;
				if(child == this.collapse_handle) continue;
				if(child == this.close_button) continue;
				child.update_vis_state = false;
				child.set_visible(false);
				child.update_vis_state = true;
			}
			this.set_h_min(this.title.h + 6);
			this.set_h(this.title.h);
		} else {
			var _g2 = 0;
			var _g11 = this.children;
			while(_g2 < _g11.length) {
				var child1 = _g11[_g2];
				++_g2;
				if(child1 == this.title) continue;
				if(child1 == this.collapse_handle) continue;
				if(child1 == this.close_button) continue;
				child1.update_vis_state = false;
				child1.set_visible(true);
				child1.update_vis_state = true;
			}
			this.set_h_min(this.pre_h_min);
			this.set_h(this.pre_h);
		}
		var _g3 = 0;
		var _g12 = this.oncollapse.listeners;
		while(_g3 < _g12.length) {
			var l = _g12[_g3];
			++_g3;
			l(this.collapsed);
		}
		e.bubble = false;
	}
	,on_close: function() {
		var _g = 0;
		var _g1 = this.onclose.listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l();
		}
		if(this.closable) this.close();
	}
	,close: function() {
		this.set_visible(false);
	}
	,open: function() {
		this.set_visible(true);
	}
	,add: function(child) {
		mint_Control.prototype.add.call(this,child);
		if(this.ready && child != this.resize_handle) this.add(this.resize_handle);
	}
	,mousemove: function(e) {
		if(this.resizing) {
			var _dx = e.x - this.resize_x;
			var _dy = e.y - this.resize_y;
			var ww = this.w + _dx;
			var hh = this.h + _dy;
			var resized = false;
			if((ww >= this.w_min || ww <= this.w_max) && e.x >= this.x) {
				this.resize_x = e.x;
				resized = true;
			}
			if((hh >= this.h_min || hh <= this.h_max) && e.y >= this.y) {
				this.resize_y = e.y;
				resized = true;
			}
			if(resized) this.set_size(ww,hh);
		} else if(this.dragging) {
			var _dx1 = e.x - this.drag_x;
			var _dy1 = e.y - this.drag_y;
			this.drag_x = e.x;
			this.drag_y = e.y;
			this.set_pos(this.x + _dx1,this.y + _dy1);
		} else mint_Control.prototype.mousemove.call(this,e);
	}
	,mousedown: function(e) {
		if(this.close_button.contains(e.x,e.y) && this.closable) return;
		if(this.collapse_handle.contains(e.x,e.y) && this.collapsible) return;
		var in_title = this.title.contains(e.x,e.y);
		if(!in_title) mint_Control.prototype.mousedown.call(this,e);
		if(this.focusable) this.canvas.bring_to_front(this);
		if(!this.dragging && this.moveable) {
			if(in_title) {
				this.dragging = true;
				this.drag_x = e.x;
				this.drag_y = e.y;
				this.focus();
			}
		}
	}
	,mouseup: function(e) {
		mint_Control.prototype.mouseup.call(this,e);
		if(this.dragging) {
			this.dragging = false;
			this.unfocus();
		}
	}
	,bounds_changed: function(_dx,_dy,_dw,_dh) {
		if(_dh == null) _dh = 0.0;
		if(_dw == null) _dw = 0.0;
		if(_dy == null) _dy = 0.0;
		if(_dx == null) _dx = 0.0;
		mint_Control.prototype.bounds_changed.call(this,_dx,_dy,_dw,_dh);
		if(this.close_button != null) this.close_button.set_x_local(this.w - 24);
		if(this.collapse_handle != null) this.collapse_handle.set_x_local(this.closable?this.w - 48:this.w - 24);
		if(this.title != null) this.title.set_w(this.w - 4);
		if(this.resize_handle != null) this.resize_handle.set_pos(this.x + this.w - 24,this.y + this.h - 24);
	}
	,__class__: mint_Window
});
var mint_core_Macros = function() { };
$hxClasses["mint.core.Macros"] = mint_core_Macros;
mint_core_Macros.__name__ = true;
var mint_core_DebugError = $hxClasses["mint.core.DebugError"] = { __ename__ : true, __constructs__ : ["assertion","null_assertion"] };
mint_core_DebugError.assertion = function(expr) { var $x = ["assertion",0,expr]; $x.__enum__ = mint_core_DebugError; $x.toString = $estr; return $x; };
mint_core_DebugError.null_assertion = function(expr) { var $x = ["null_assertion",1,expr]; $x.__enum__ = mint_core_DebugError; $x.toString = $estr; return $x; };
var mint_core_Signal = function() {
	this.listeners = [];
};
$hxClasses["mint.core.Signal"] = mint_core_Signal;
mint_core_Signal.__name__ = true;
mint_core_Signal.prototype = {
	listeners: null
	,listen: function(_handler) {
		if(HxOverrides.indexOf(this.listeners,_handler,0) != -1) {
			throw new js__$Boot_HaxeError("mint / signal / listen / attempted to add the same listener twice");
			return;
		}
		this.listeners.push(_handler);
	}
	,remove: function(_handler) {
		if(HxOverrides.remove(this.listeners,_handler) == false) throw new js__$Boot_HaxeError("mint / signal / remove failed / WTF?!?");
	}
	,has: function(_handler) {
		return HxOverrides.indexOf(this.listeners,_handler,0) != -1;
	}
	,__class__: mint_core_Signal
};
var mint_core_unifill__$CodePoint_CodePoint_$Impl_$ = {};
$hxClasses["mint.core.unifill._CodePoint.CodePoint_Impl_"] = mint_core_unifill__$CodePoint_CodePoint_$Impl_$;
mint_core_unifill__$CodePoint_CodePoint_$Impl_$.__name__ = true;
mint_core_unifill__$CodePoint_CodePoint_$Impl_$.cons = function(a,b) {
	return mint_core_unifill_InternalEncoding.fromCodePoint(a) + b;
};
mint_core_unifill__$CodePoint_CodePoint_$Impl_$.snoc = function(a,b) {
	return a + mint_core_unifill_InternalEncoding.fromCodePoint(b);
};
mint_core_unifill__$CodePoint_CodePoint_$Impl_$.addInt = function(a,b) {
	return a + b;
};
mint_core_unifill__$CodePoint_CodePoint_$Impl_$.sub = function(a,b) {
	return a - b;
};
mint_core_unifill__$CodePoint_CodePoint_$Impl_$.subInt = function(a,b) {
	return a - b;
};
mint_core_unifill__$CodePoint_CodePoint_$Impl_$._new = function(code) {
	var this1;
	if(!(0 <= code && code <= 1114111 && !(55296 <= code && code <= 56319) && !(56320 <= code && code <= 57343))) throw new js__$Boot_HaxeError(mint_core_unifill_Exception.InvalidCodePoint(code));
	this1 = code;
	return this1;
};
mint_core_unifill__$CodePoint_CodePoint_$Impl_$.toString = function(this1) {
	return mint_core_unifill_InternalEncoding.fromCodePoint(this1);
};
mint_core_unifill__$CodePoint_CodePoint_$Impl_$.toInt = function(this1) {
	return this1;
};
var mint_core_unifill_CodePointIter = function(s) {
	this.i = 0;
	this.string = s;
	this.index = 0;
	this.endIndex = s.length;
};
$hxClasses["mint.core.unifill.CodePointIter"] = mint_core_unifill_CodePointIter;
mint_core_unifill_CodePointIter.__name__ = true;
mint_core_unifill_CodePointIter.prototype = {
	string: null
	,index: null
	,endIndex: null
	,hasNext: function() {
		return this.index < this.endIndex;
	}
	,i: null
	,next: function() {
		this.i = this.index;
		this.index += mint_core_unifill_InternalEncoding.codePointWidthAt(this.string,this.index);
		return mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointAt(this.string,this.i);
	}
	,__class__: mint_core_unifill_CodePointIter
};
var mint_core_unifill_Exception = $hxClasses["mint.core.unifill.Exception"] = { __ename__ : true, __constructs__ : ["InvalidCodePoint","InvalidCodeUnitSequence"] };
mint_core_unifill_Exception.InvalidCodePoint = function(code) { var $x = ["InvalidCodePoint",0,code]; $x.__enum__ = mint_core_unifill_Exception; $x.toString = $estr; return $x; };
mint_core_unifill_Exception.InvalidCodeUnitSequence = function(index) { var $x = ["InvalidCodeUnitSequence",1,index]; $x.__enum__ = mint_core_unifill_Exception; $x.toString = $estr; return $x; };
var mint_core_unifill_InternalEncoding = function() { };
$hxClasses["mint.core.unifill.InternalEncoding"] = mint_core_unifill_InternalEncoding;
mint_core_unifill_InternalEncoding.__name__ = true;
mint_core_unifill_InternalEncoding.get_internalEncoding = function() {
	return "UTF-16";
};
mint_core_unifill_InternalEncoding.codeUnitAt = function(s,index) {
	return s.charCodeAt(index);
};
mint_core_unifill_InternalEncoding.codePointAt = function(s,index) {
	return mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointAt(s,index);
};
mint_core_unifill_InternalEncoding.charAt = function(s,index) {
	var this1;
	var this2 = s;
	var s1;
	var len;
	var c = this2.charCodeAt(index);
	if(!(55296 <= c && c <= 56319)) len = 1; else len = 2;
	var s2 = HxOverrides.substr(this2,index,len);
	s1 = s2;
	this1 = s1;
	return this1;
};
mint_core_unifill_InternalEncoding.codePointCount = function(s,beginIndex,endIndex) {
	return mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointCount(s,beginIndex,endIndex);
};
mint_core_unifill_InternalEncoding.codePointWidthAt = function(s,index) {
	var c = s.charCodeAt(index);
	if(!(55296 <= c && c <= 56319)) return 1; else return 2;
};
mint_core_unifill_InternalEncoding.codePointWidthBefore = function(s,index) {
	var this1 = s;
	return mint_core_unifill__$Utf16_Utf16Impl.find_prev_code_point(function(i) {
		return this1.charCodeAt(i);
	},index);
};
mint_core_unifill_InternalEncoding.offsetByCodePoints = function(s,index,codePointOffset) {
	var this1 = s;
	if(codePointOffset >= 0) {
		var index1 = index;
		var len = this1.length;
		var i = 0;
		while(i < codePointOffset && index1 < len) {
			var c = this1.charCodeAt(index1);
			if(!(55296 <= c && c <= 56319)) index1 += 1; else index1 += 2;
			++i;
		}
		return index1;
	} else {
		var index2 = index;
		var count = 0;
		while(count < -codePointOffset && 0 < index2) {
			var this2 = [this1];
			index2 -= mint_core_unifill__$Utf16_Utf16Impl.find_prev_code_point((function(this2) {
				return function(i1) {
					return this2[0].charCodeAt(i1);
				};
			})(this2),index2);
			++count;
		}
		return index2;
	}
};
mint_core_unifill_InternalEncoding.backwardOffsetByCodePoints = function(s,index,codePointOffset) {
	var this1 = s;
	var codePointOffset1 = -codePointOffset;
	if(codePointOffset1 >= 0) {
		var index1 = index;
		var len = this1.length;
		var i = 0;
		while(i < codePointOffset1 && index1 < len) {
			var c = this1.charCodeAt(index1);
			if(!(55296 <= c && c <= 56319)) index1 += 1; else index1 += 2;
			++i;
		}
		return index1;
	} else {
		var index2 = index;
		var count = 0;
		while(count < -codePointOffset1 && 0 < index2) {
			var this2 = [this1];
			index2 -= mint_core_unifill__$Utf16_Utf16Impl.find_prev_code_point((function(this2) {
				return function(i1) {
					return this2[0].charCodeAt(i1);
				};
			})(this2),index2);
			++count;
		}
		return index2;
	}
};
mint_core_unifill_InternalEncoding.fromCodePoint = function(codePoint) {
	var this1;
	if(codePoint <= 65535) {
		var s;
		var s1 = String.fromCharCode(codePoint);
		s = s1;
		this1 = s;
	} else {
		var s2;
		var s3 = String.fromCharCode((codePoint >> 10) + 55232) + String.fromCharCode(codePoint & 1023 | 56320);
		s2 = s3;
		this1 = s2;
	}
	return this1;
};
mint_core_unifill_InternalEncoding.fromCodePoints = function(codePoints) {
	var this1;
	var buf = new StringBuf();
	var $it0 = $iterator(codePoints)();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		mint_core_unifill__$Utf16_Utf16Impl.encode_code_point(function(x) {
			buf.b += String.fromCharCode(x);
		},c);
	}
	this1 = buf.b;
	return this1;
};
mint_core_unifill_InternalEncoding.validate = function(s) {
	mint_core_unifill__$Utf16_Utf16_$Impl_$.validate(s);
};
mint_core_unifill_InternalEncoding.isValidString = function(s) {
	try {
		mint_core_unifill__$Utf16_Utf16_$Impl_$.validate(s);
		return true;
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		if( js_Boot.__instanceof(e,mint_core_unifill_Exception) ) {
			switch(e[1]) {
			case 1:
				var index = e[2];
				return false;
			default:
				throw new js__$Boot_HaxeError(e);
			}
		} else throw(e);
	}
};
var mint_core_unifill_InternalEncodingIter = function(s,beginIndex,endIndex) {
	this.i = 0;
	this.string = s;
	this.index = beginIndex;
	this.endIndex = endIndex;
};
$hxClasses["mint.core.unifill.InternalEncodingIter"] = mint_core_unifill_InternalEncodingIter;
mint_core_unifill_InternalEncodingIter.__name__ = true;
mint_core_unifill_InternalEncodingIter.prototype = {
	string: null
	,index: null
	,endIndex: null
	,hasNext: function() {
		return this.index < this.endIndex;
	}
	,i: null
	,next: function() {
		this.i = this.index;
		this.index += mint_core_unifill_InternalEncoding.codePointWidthAt(this.string,this.index);
		return this.i;
	}
	,__class__: mint_core_unifill_InternalEncodingIter
};
var mint_core_unifill_Unicode = function() { };
$hxClasses["mint.core.unifill.Unicode"] = mint_core_unifill_Unicode;
mint_core_unifill_Unicode.__name__ = true;
mint_core_unifill_Unicode.decodeSurrogate = function(hi,lo) {
	return hi - 55232 << 10 | lo & 1023;
};
mint_core_unifill_Unicode.encodeHighSurrogate = function(c) {
	return (c >> 10) + 55232;
};
mint_core_unifill_Unicode.encodeLowSurrogate = function(c) {
	return c & 1023 | 56320;
};
mint_core_unifill_Unicode.isScalar = function(code) {
	return 0 <= code && code <= 1114111 && !(55296 <= code && code <= 56319) && !(56320 <= code && code <= 57343);
};
mint_core_unifill_Unicode.isHighSurrogate = function(code) {
	return 55296 <= code && code <= 56319;
};
mint_core_unifill_Unicode.isLowSurrogate = function(code) {
	return 56320 <= code && code <= 57343;
};
var mint_core_unifill_Unifill = function() { };
$hxClasses["mint.core.unifill.Unifill"] = mint_core_unifill_Unifill;
mint_core_unifill_Unifill.__name__ = true;
mint_core_unifill_Unifill.uLength = function(s) {
	return mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointCount(s,0,s.length);
};
mint_core_unifill_Unifill.uCharAt = function(s,index) {
	var i = mint_core_unifill_InternalEncoding.offsetByCodePoints(s,0,index);
	return mint_core_unifill_InternalEncoding.charAt(s,i);
};
mint_core_unifill_Unifill.uCharCodeAt = function(s,index) {
	var i = mint_core_unifill_InternalEncoding.offsetByCodePoints(s,0,index);
	return mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointAt(s,i);
};
mint_core_unifill_Unifill.uCodePointAt = function(s,index) {
	return mint_core_unifill_Unifill.uCharCodeAt(s,index);
};
mint_core_unifill_Unifill.uIndexOf = function(s,value,startIndex) {
	if(startIndex == null) startIndex = 0;
	var index = s.indexOf(value,mint_core_unifill_InternalEncoding.offsetByCodePoints(s,0,startIndex));
	if(index >= 0) return mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointCount(s,0,index); else return -1;
};
mint_core_unifill_Unifill.uLastIndexOf = function(s,value,startIndex) {
	if(startIndex == null) startIndex = s.length - 1;
	var index = s.lastIndexOf(value,mint_core_unifill_InternalEncoding.offsetByCodePoints(s,0,startIndex));
	if(index >= 0) return mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointCount(s,0,index); else return -1;
};
mint_core_unifill_Unifill.uSplit = function(s,delimiter) {
	if(delimiter.length == 0) {
		var _g = [];
		var _g1_i = 0;
		var _g1_string = s;
		var _g1_index = 0;
		var _g1_endIndex = s.length;
		while(_g1_index < _g1_endIndex) {
			var i;
			_g1_i = _g1_index;
			_g1_index += mint_core_unifill_InternalEncoding.codePointWidthAt(_g1_string,_g1_index);
			i = _g1_i;
			_g.push(mint_core_unifill_InternalEncoding.charAt(s,i));
		}
		return _g;
	} else return s.split(delimiter);
};
mint_core_unifill_Unifill.uSubstr = function(s,startIndex,length) {
	var si = mint_core_unifill_InternalEncoding.offsetByCodePoints(s,startIndex >= 0?0:s.length,startIndex);
	var ei;
	if(length == null) ei = s.length; else if(length < 0) ei = si; else ei = mint_core_unifill_InternalEncoding.offsetByCodePoints(s,si,length);
	return s.substring(si,ei);
};
mint_core_unifill_Unifill.uSubstring = function(s,startIndex,endIndex) {
	var si;
	if(startIndex < 0) si = 0; else si = mint_core_unifill_InternalEncoding.offsetByCodePoints(s,0,startIndex);
	var ei;
	if(endIndex == null) ei = s.length; else if(endIndex < 0) ei = 0; else ei = mint_core_unifill_InternalEncoding.offsetByCodePoints(s,0,endIndex);
	return s.substring(si,ei);
};
mint_core_unifill_Unifill.uIterator = function(s) {
	return new mint_core_unifill_CodePointIter(s);
};
mint_core_unifill_Unifill.uCompare = function(a,b) {
	var aiter_i = 0;
	var aiter_string = a;
	var aiter_index = 0;
	var aiter_endIndex = a.length;
	var biter_i = 0;
	var biter_string = b;
	var biter_index = 0;
	var biter_endIndex = b.length;
	while(aiter_index < aiter_endIndex && biter_index < biter_endIndex) {
		var acode = mint_core_unifill_InternalEncoding.codePointAt(a,(function($this) {
			var $r;
			aiter_i = aiter_index;
			aiter_index += mint_core_unifill_InternalEncoding.codePointWidthAt(aiter_string,aiter_index);
			$r = aiter_i;
			return $r;
		}(this)));
		var bcode = mint_core_unifill_InternalEncoding.codePointAt(b,(function($this) {
			var $r;
			biter_i = biter_index;
			biter_index += mint_core_unifill_InternalEncoding.codePointWidthAt(biter_string,biter_index);
			$r = biter_i;
			return $r;
		}(this)));
		if(acode < bcode) return -1;
		if(acode > bcode) return 1;
	}
	if(biter_index < biter_endIndex) return -1;
	if(aiter_index < aiter_endIndex) return 1;
	return 0;
};
mint_core_unifill_Unifill.uToString = function(codePoints) {
	return mint_core_unifill_InternalEncoding.fromCodePoints(codePoints);
};
var mint_core_unifill__$Utf16_Utf16_$Impl_$ = {};
$hxClasses["mint.core.unifill._Utf16.Utf16_Impl_"] = mint_core_unifill__$Utf16_Utf16_$Impl_$;
mint_core_unifill__$Utf16_Utf16_$Impl_$.__name__ = true;
mint_core_unifill__$Utf16_Utf16_$Impl_$.fromCodePoint = function(codePoint) {
	if(codePoint <= 65535) {
		var s;
		var s1 = String.fromCharCode(codePoint);
		s = s1;
		return s;
	} else {
		var s2;
		var s3 = String.fromCharCode((codePoint >> 10) + 55232) + String.fromCharCode(codePoint & 1023 | 56320);
		s2 = s3;
		return s2;
	}
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.fromCodePoints = function(codePoints) {
	var buf = new StringBuf();
	var $it0 = $iterator(codePoints)();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		mint_core_unifill__$Utf16_Utf16Impl.encode_code_point(function(x) {
			buf.b += String.fromCharCode(x);
		},c);
	}
	return buf.b;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.fromString = function(s) {
	return s;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.fromArray = function(a) {
	var s;
	var buf_b = "";
	var _g = 0;
	while(_g < a.length) {
		var x = a[_g];
		++_g;
		buf_b += String.fromCharCode(x);
	}
	s = buf_b;
	return s;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.codeUnitAt = function(this1,index) {
	return this1.charCodeAt(index);
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointAt = function(this1,index) {
	return mint_core_unifill__$Utf16_Utf16Impl.decode_code_point(this1.length,function(i) {
		return this1.charCodeAt(i);
	},index);
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.charAt = function(this1,index) {
	var s;
	var len;
	var c = this1.charCodeAt(index);
	if(!(55296 <= c && c <= 56319)) len = 1; else len = 2;
	var s1 = HxOverrides.substr(this1,index,len);
	s = s1;
	return s;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointCount = function(this1,beginIndex,endIndex) {
	var index = beginIndex;
	var i = 0;
	while(index < endIndex) {
		var c = this1.charCodeAt(index);
		if(!(55296 <= c && c <= 56319)) index += 1; else index += 2;
		++i;
	}
	return i;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointWidthAt = function(this1,index) {
	var c = this1.charCodeAt(index);
	if(!(55296 <= c && c <= 56319)) return 1; else return 2;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.codePointWidthBefore = function(this1,index) {
	return mint_core_unifill__$Utf16_Utf16Impl.find_prev_code_point(function(i) {
		return this1.charCodeAt(i);
	},index);
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.offsetByCodePoints = function(this1,index,codePointOffset) {
	if(codePointOffset >= 0) {
		var index1 = index;
		var len = this1.length;
		var i = 0;
		while(i < codePointOffset && index1 < len) {
			var c = this1.charCodeAt(index1);
			if(!(55296 <= c && c <= 56319)) index1 += 1; else index1 += 2;
			++i;
		}
		return index1;
	} else {
		var index2 = index;
		var count = 0;
		while(count < -codePointOffset && 0 < index2) {
			var this2 = [this1];
			index2 -= mint_core_unifill__$Utf16_Utf16Impl.find_prev_code_point((function(this2) {
				return function(i1) {
					return this2[0].charCodeAt(i1);
				};
			})(this2),index2);
			++count;
		}
		return index2;
	}
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.substr = function(this1,index,len) {
	var s;
	var s1 = HxOverrides.substr(this1,index,len);
	s = s1;
	return s;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.validate = function(this1) {
	var len = this1.length;
	var accessor = function(i) {
		return this1.charCodeAt(i);
	};
	var i1 = 0;
	while(i1 < len) {
		mint_core_unifill__$Utf16_Utf16Impl.decode_code_point(len,accessor,i1);
		var c = this1.charCodeAt(i1);
		if(!(55296 <= c && c <= 56319)) i1 += 1; else i1 += 2;
	}
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.toString = function(this1) {
	return this1;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.toArray = function(this1) {
	var i = 0;
	var len = this1.length;
	var _g = [];
	while(i < len) _g.push(StringTools.fastCodeAt(this1,i++));
	return _g;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$._new = function(s) {
	return s;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.get_length = function(this1) {
	return this1.length;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.forward_offset_by_code_points = function(this1,index,codePointOffset) {
	var len = this1.length;
	var i = 0;
	while(i < codePointOffset && index < len) {
		var c = this1.charCodeAt(index);
		if(!(55296 <= c && c <= 56319)) index += 1; else index += 2;
		++i;
	}
	return index;
};
mint_core_unifill__$Utf16_Utf16_$Impl_$.backward_offset_by_code_points = function(this1,index,codePointOffset) {
	var count = 0;
	while(count < codePointOffset && 0 < index) {
		var this2 = [this1];
		index -= mint_core_unifill__$Utf16_Utf16Impl.find_prev_code_point((function(this2) {
			return function(i) {
				return this2[0].charCodeAt(i);
			};
		})(this2),index);
		++count;
	}
	return index;
};
var mint_core_unifill__$Utf16_Utf16Impl = function() { };
$hxClasses["mint.core.unifill._Utf16.Utf16Impl"] = mint_core_unifill__$Utf16_Utf16Impl;
mint_core_unifill__$Utf16_Utf16Impl.__name__ = true;
mint_core_unifill__$Utf16_Utf16Impl.code_point_width = function(c) {
	if(!(55296 <= c && c <= 56319)) return 1; else return 2;
};
mint_core_unifill__$Utf16_Utf16Impl.find_prev_code_point = function(accessor,index) {
	var c = accessor(index - 1);
	if(!(56320 <= c && c <= 57343)) return 1; else return 2;
};
mint_core_unifill__$Utf16_Utf16Impl.encode_code_point = function(addUnit,codePoint) {
	if(codePoint <= 65535) addUnit(codePoint); else {
		addUnit((codePoint >> 10) + 55232);
		addUnit(codePoint & 1023 | 56320);
	}
};
mint_core_unifill__$Utf16_Utf16Impl.decode_code_point = function(len,accessor,index) {
	if(index < 0 || len <= index) throw new js__$Boot_HaxeError(mint_core_unifill_Exception.InvalidCodeUnitSequence(index));
	var hi = accessor(index);
	if(55296 <= hi && hi <= 56319) {
		if(index + 1 < 0 || len <= index + 1) throw new js__$Boot_HaxeError(mint_core_unifill_Exception.InvalidCodeUnitSequence(index));
		var lo = accessor(index + 1);
		if(56320 <= lo && lo <= 57343) return hi - 55232 << 10 | lo & 1023; else throw new js__$Boot_HaxeError(mint_core_unifill_Exception.InvalidCodeUnitSequence(index));
	} else if(56320 <= hi && hi <= 57343) throw new js__$Boot_HaxeError(mint_core_unifill_Exception.InvalidCodeUnitSequence(index)); else return hi;
};
var mint_core_unifill__$Utf16_StringU16Buffer_$Impl_$ = {};
$hxClasses["mint.core.unifill._Utf16.StringU16Buffer_Impl_"] = mint_core_unifill__$Utf16_StringU16Buffer_$Impl_$;
mint_core_unifill__$Utf16_StringU16Buffer_$Impl_$.__name__ = true;
mint_core_unifill__$Utf16_StringU16Buffer_$Impl_$._new = function() {
	return new StringBuf();
};
mint_core_unifill__$Utf16_StringU16Buffer_$Impl_$.addUnit = function(this1,unit) {
	this1.b += String.fromCharCode(unit);
};
mint_core_unifill__$Utf16_StringU16Buffer_$Impl_$.getStringU16 = function(this1) {
	return this1.b;
};
var mint_core_unifill__$Utf16_StringU16_$Impl_$ = {};
$hxClasses["mint.core.unifill._Utf16.StringU16_Impl_"] = mint_core_unifill__$Utf16_StringU16_$Impl_$;
mint_core_unifill__$Utf16_StringU16_$Impl_$.__name__ = true;
mint_core_unifill__$Utf16_StringU16_$Impl_$.fromString = function(s) {
	return s;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.fromCodeUnit = function(u) {
	var s = String.fromCharCode(u);
	return s;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.fromTwoCodeUnits = function(u0,u1) {
	var s = String.fromCharCode(u0) + String.fromCharCode(u1);
	return s;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.ofArray = function(a) {
	var buf_b = "";
	var _g = 0;
	while(_g < a.length) {
		var x = a[_g];
		++_g;
		buf_b += String.fromCharCode(x);
	}
	return buf_b;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.fromArray = function(a) {
	var buf_b = "";
	var _g = 0;
	while(_g < a.length) {
		var x = a[_g];
		++_g;
		buf_b += String.fromCharCode(x);
	}
	return buf_b;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.codeUnitAt = function(this1,index) {
	return this1.charCodeAt(index);
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.substr = function(this1,index,len) {
	var s = HxOverrides.substr(this1,index,len);
	return s;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.toString = function(this1) {
	return this1;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.toArray = function(this1) {
	var i = 0;
	var len = this1.length;
	var _g = [];
	while(i < len) _g.push(StringTools.fastCodeAt(this1,i++));
	return _g;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$._new = function(s) {
	return s;
};
mint_core_unifill__$Utf16_StringU16_$Impl_$.get_length = function(this1) {
	return this1.length;
};
var mint_focus_Focus = function(_canvas) {
	this.canvas = _canvas;
	this.canvas.onmousemove.listen($bind(this,this.mousemove));
	this.canvas.onmousedown.listen($bind(this,this.mousedown));
	this.canvas.onmouseup.listen($bind(this,this.mouseup));
	this.canvas.onmousewheel.listen($bind(this,this.mousewheel));
	this.canvas.onkeydown.listen($bind(this,this.keydown));
	this.canvas.onkeyup.listen($bind(this,this.keyup));
	this.canvas.ontextinput.listen($bind(this,this.textinput));
};
$hxClasses["mint.focus.Focus"] = mint_focus_Focus;
mint_focus_Focus.__name__ = true;
mint_focus_Focus.prototype = {
	canvas: null
	,destroy: function() {
		this.canvas.onmousemove.remove($bind(this,this.mousemove));
		this.canvas.onmousedown.remove($bind(this,this.mousedown));
		this.canvas.onmouseup.remove($bind(this,this.mouseup));
		this.canvas.onmousewheel.remove($bind(this,this.mousewheel));
		this.canvas.onkeydown.remove($bind(this,this.keydown));
		this.canvas.onkeyup.remove($bind(this,this.keyup));
		this.canvas.ontextinput.remove($bind(this,this.textinput));
	}
	,keydown: function(e,target) {
		if(this.canvas.get_focused() != null && this.canvas.get_focused().key_input) this.canvas.get_focused().keydown(e);
	}
	,keyup: function(e,target) {
		if(this.canvas.get_focused() != null && this.canvas.get_focused().key_input) this.canvas.get_focused().keyup(e);
	}
	,textinput: function(e,target) {
		if(this.canvas.get_focused() != null && this.canvas.get_focused().key_input) this.canvas.get_focused().textinput(e);
	}
	,mousedown: function(e,target) {
		if(this.canvas.get_focused() != null && this.canvas.get_focused().mouse_input) this.canvas.get_focused().mousedown(e);
		if(this.marked_mouse()) this.canvas.get_marked().mousedown(e);
	}
	,mouseup: function(e,target) {
		if(this.canvas.get_focused() != null && this.canvas.get_focused().mouse_input) this.canvas.get_focused().mouseup(e);
		if(this.marked_mouse()) this.canvas.get_marked().mouseup(e);
	}
	,mousewheel: function(e,target) {
		if(this.canvas.get_focused() != null && this.canvas.get_focused().mouse_input) this.canvas.get_focused().mousewheel(e);
		if(this.marked_mouse()) this.canvas.get_marked().mousewheel(e);
	}
	,marked_mouse: function() {
		return this.canvas.get_marked() != this.canvas.get_focused() && this.canvas.get_marked() != null && this.canvas.get_marked().mouse_input;
	}
	,mousemove: function(e,target) {
		if(this.canvas.ishovered) {
			var _marked = this.canvas.get_marked();
			if(_marked != null) {
				if(_marked.contains(e.x,e.y)) {
					var _target = _marked.parent;
					if(_target == null) _target = this.canvas;
					var _hovered = _target.topmost_child_at_point(e.x,e.y);
					if(_hovered != null && _hovered != _marked && _hovered != this.canvas) {
						this.unmark_control(_marked,e);
						this.mark_control(_hovered,e);
						this.canvas.set_marked(_hovered);
					}
				} else {
					this.unmark_control(_marked,e);
					this.find_marked(e);
				}
			} else if(this.canvas.ishovered) this.find_marked(e); else this.reset_marked(null,e);
		}
		if(this.canvas.get_focused() != null && this.canvas.get_focused().mouse_input) this.canvas.get_focused().mousemove(e);
		if(this.marked_mouse()) this.canvas.get_marked().mousemove(e);
	}
	,reset_marked: function(_control,e) {
		if(_control != null && _control.ismarked) this.unmark_control(_control,e);
	}
	,get_focusable: function(_x,_y) {
		if(this.canvas.get_captured() != null) return this.canvas.get_captured(); else return this.canvas.topmost_at_point(_x,_y);
	}
	,find_marked: function(e) {
		var _marked = this.get_focusable(e.x,e.y);
		if(_marked != null) this.mark_control(_marked,e);
		return _marked;
	}
	,unmark_control: function(_control,e) {
		if(_control != null) {
			_control.unmark();
			if(_control.mouse_input) _control.mouseleave(e);
		}
	}
	,mark_control: function(_control,e) {
		if(_control != null) {
			_control.mark();
			if(_control.mouse_input) _control.mouseenter(e);
		}
	}
	,__class__: mint_focus_Focus
};
var mint_layout_margins_Margins = function() {
	this.observed = new haxe_ds_ObjectMap();
};
$hxClasses["mint.layout.margins.Margins"] = mint_layout_margins_Margins;
mint_layout_margins_Margins.__name__ = true;
mint_layout_margins_Margins.prototype = {
	observed: null
	,size: function(self,other,target,value) {
		if(self == null) throw new js__$Boot_HaxeError(mint_core_DebugError.null_assertion("self was null" + ""));
		if(other == null) other = self.parent;
		other;
		var lay = this.get(other);
		var sizer = { target : target, value : value, self : self, other : other};
		lay.sizers.push(sizer);
		this.update_sizer(sizer);
	}
	,anchor: function(self,other,self_anchor,other_anchor) {
		if(self == null) throw new js__$Boot_HaxeError(mint_core_DebugError.null_assertion("self was null" + ""));
		if(other == null) other = self.parent;
		other;
		var lay = this.get(other);
		var anchor = { self_anchor : self_anchor, other_anchor : other_anchor, self : self, other : other};
		lay.anchors.push(anchor);
		this.update_anchor(anchor);
	}
	,margin: function(self,other,target,type,value) {
		if(self == null) throw new js__$Boot_HaxeError(mint_core_DebugError.null_assertion("self was null" + ""));
		if(other == null) other = self.parent;
		other;
		var lay = this.get(other);
		var margin = { target : target, type : type, value : value, self : self, other : other};
		lay.margins.push(margin);
		this.update_margin(margin);
	}
	,get: function(other) {
		if(this.observed.h.__keys__[other.__id__] != null) return this.observed.h[other.__id__];
		var ref = { margins : [], anchors : [], sizers : []};
		this.observed.set(other,ref);
		other.onbounds.listen((function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.update_layout),other));
		return ref;
	}
	,update_layout: function(other) {
		var lay = this.observed.h[other.__id__];
		if(lay.margins.length > 0) {
			var _g = 0;
			var _g1 = lay.margins;
			while(_g < _g1.length) {
				var m = _g1[_g];
				++_g;
				this.update_margin(m);
			}
		}
		if(lay.anchors.length > 0) {
			var _g2 = 0;
			var _g11 = lay.anchors;
			while(_g2 < _g11.length) {
				var a = _g11[_g2];
				++_g2;
				this.update_anchor(a);
			}
		}
		if(lay.sizers.length > 0) {
			var _g3 = 0;
			var _g12 = lay.sizers;
			while(_g3 < _g12.length) {
				var s = _g12[_g3];
				++_g3;
				this.update_sizer(s);
			}
		}
	}
	,update_margin: function(margin) {
		var self = margin.self;
		var other = margin.other;
		var value = margin.value;
		var target = margin.target;
		var _g = margin.type;
		switch(_g) {
		case 2:
			switch(target) {
			case 1:
				self.set_x(Math.abs(other.x + value));
				break;
			case 3:
				self.set_y(Math.abs(other.y + value));
				break;
			case 2:
				self.set_w(Math.abs(other.x + other.w - value - self.x));
				break;
			case 4:
				self.set_h(Math.abs(other.y + other.h - value - self.y));
				break;
			}
			break;
		case 1:
			var per = value / 100;
			switch(target) {
			case 1:
				self.set_x(Math.abs(other.x + other.w * per));
				break;
			case 3:
				self.set_y(Math.abs(other.y + other.h * per));
				break;
			case 2:
				self.set_w(Math.abs(other.x + other.w - other.w * per - self.x));
				break;
			case 4:
				self.set_h(Math.abs(other.y + other.h - other.h * per - self.y));
				break;
			}
			break;
		}
	}
	,update_anchor: function(anchor) {
		var other = anchor.other;
		var self = anchor.self;
		var ref;
		var _g = anchor.other_anchor;
		switch(_g) {
		case 1:
			ref = other.x + other.w / 2;
			break;
		case 2:
			ref = other.y + other.h / 2;
			break;
		case 4:
			ref = other.x + other.w;
			break;
		case 6:
			ref = other.y + other.h;
			break;
		case 3:
			ref = other.x;
			break;
		case 5:
			ref = other.y;
			break;
		}
		var _g1 = anchor.self_anchor;
		switch(_g1) {
		case 1:
			self.set_x(ref - self.w / 2);
			break;
		case 2:
			self.set_y(ref - self.h / 2);
			break;
		case 4:
			self.set_x(ref - self.w);
			break;
		case 6:
			self.set_y(ref - self.h);
			break;
		case 3:
			self.set_x(ref);
			break;
		case 5:
			self.set_y(ref);
			break;
		}
	}
	,update_sizer: function(sizer) {
		var self = sizer.self;
		var other = sizer.other;
		var per = sizer.value / 100;
		var _g = sizer.target;
		switch(_g) {
		case 1:
			self.set_w(other.w * per);
			break;
		case 2:
			self.set_h(other.h * per);
			break;
		}
	}
	,__class__: mint_layout_margins_Margins
};
var mint_render_Renderer = function() { };
$hxClasses["mint.render.Renderer"] = mint_render_Renderer;
mint_render_Renderer.__name__ = true;
mint_render_Renderer.prototype = {
	rendering: null
	,control: null
	,__class__: mint_render_Renderer
};
var mint_render_Render = function(_render,_control) {
	this.control = _control;
	this.rendering = _render;
	this.control.oncreate.listen($bind(this,this.internal_connect));
};
$hxClasses["mint.render.Render"] = mint_render_Render;
mint_render_Render.__name__ = true;
mint_render_Render.__interfaces__ = [mint_render_Renderer];
mint_render_Render.prototype = {
	rendering: null
	,control: null
	,internal_connect: function() {
		this.control.onvisible.listen($bind(this,this.onvisible));
		this.control.ondepth.listen($bind(this,this.ondepth));
		this.control.ondestroy.listen($bind(this,this.ondestroy));
		this.control.onclip.listen($bind(this,this.onclip));
		this.control.onchildadd.listen($bind(this,this.onchildadd));
		this.control.onchildremove.listen($bind(this,this.onchildremove));
		this.control.onbounds.listen($bind(this,this.onbounds));
		this.control.ondestroy.listen($bind(this,this.internal_disconnect));
	}
	,internal_disconnect: function() {
		this.control.onvisible.remove($bind(this,this.onvisible));
		this.control.ondepth.remove($bind(this,this.ondepth));
		this.control.ondestroy.remove($bind(this,this.ondestroy));
		this.control.onclip.remove($bind(this,this.onclip));
		this.control.onchildadd.remove($bind(this,this.onchildadd));
		this.control.onchildremove.remove($bind(this,this.onchildremove));
		this.control.onbounds.remove($bind(this,this.onbounds));
		this.control.oncreate.remove($bind(this,this.internal_connect));
		this.control.ondestroy.remove($bind(this,this.internal_disconnect));
	}
	,onvisible: function(_v) {
	}
	,ondepth: function(_d) {
	}
	,ondestroy: function() {
	}
	,onbounds: function() {
	}
	,onclip: function(_disable,_x,_y,_w,_h) {
	}
	,onchildadd: function(_c) {
	}
	,onchildremove: function(_c) {
	}
	,__class__: mint_render_Render
};
var mint_render_Rendering = function() {
};
$hxClasses["mint.render.Rendering"] = mint_render_Rendering;
mint_render_Rendering.__name__ = true;
mint_render_Rendering.prototype = {
	get: function(type,control) {
		haxe_Log.trace("" + Std.string(type) + " / " + Std.string(control) + " / This is probably not expected : landed in root Rendering class.",{ fileName : "Rendering.hx", lineNumber : 19, className : "mint.render.Rendering", methodName : "get"});
		return null;
	}
	,__class__: mint_render_Rendering
};
var mint_render_kha_KhaRenderer = function(rendering,control) {
	mint_render_Render.call(this,rendering,control);
	this.khaRendering = rendering;
	this.prevW = control.w;
	this.prevH = control.h;
	control.onrender.listen($bind(this,this.onrender));
};
$hxClasses["mint.render.kha.KhaRenderer"] = mint_render_kha_KhaRenderer;
mint_render_kha_KhaRenderer.__name__ = true;
mint_render_kha_KhaRenderer.__super__ = mint_render_Render;
mint_render_kha_KhaRenderer.prototype = $extend(mint_render_Render.prototype,{
	khaRendering: null
	,prevW: null
	,prevH: null
	,ondestroy: function() {
		this.control.onrender.remove($bind(this,this.onrender));
	}
	,onrender: function() {
	}
	,__class__: mint_render_kha_KhaRenderer
});
var mint_render_kha_Button = function(render,control) {
	var _g = this;
	mint_render_kha_KhaRenderer.call(this,render,control);
	this.button = control;
	var opt = this.button.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-13158601);
	this.color = opt.color;
	if(opt.color_down == null) opt.color_down = kha__$Color_Color_$Impl_$._new(-12303292);
	this.color_down = opt.color_down;
	if(opt.color_hover == null) opt.color_hover = kha__$Color_Color_$Impl_$._new(-12299944);
	this.color_hover = opt.color_hover;
	this.visual = new mint_render_kha_visuals_Visual(control.x,control.y,control.w,control.h).color(this.color);
	this.button.onmouseenter.listen(function(e,c) {
		_g.visual.color(_g.color_hover);
	});
	this.button.onmouseleave.listen(function(e1,c1) {
		_g.visual.color(_g.color);
	});
	this.button.onmousedown.listen(function(e2,c2) {
		_g.visual.color(_g.color_down);
	});
	this.button.onmouseup.listen(function(e3,c3) {
		_g.visual.color(_g.color_hover);
	});
};
$hxClasses["mint.render.kha.Button"] = mint_render_kha_Button;
mint_render_kha_Button.__name__ = true;
mint_render_kha_Button.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Button.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	visual: null
	,button: null
	,texture: null
	,color: null
	,color_hover: null
	,color_down: null
	,onrender: function() {
		if(!this.button.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
	}
	,onbounds: function() {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y);
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y).clip(x,y,w,h);
	}
	,__class__: mint_render_kha_Button
});
var mint_render_kha_Canvas = function(khaRendering,control) {
	mint_render_kha_KhaRenderer.call(this,khaRendering,control);
	this.canvas = control;
	var opt = this.canvas.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$.fromBytes(0,0,0,0);
	this.color = opt.color;
	this.visual = new mint_render_kha_visuals_Visual(control.x,control.y,control.w,control.h).color(this.color);
};
$hxClasses["mint.render.kha.Canvas"] = mint_render_kha_Canvas;
mint_render_kha_Canvas.__name__ = true;
mint_render_kha_Canvas.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Canvas.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	canvas: null
	,color: null
	,visual: null
	,onrender: function() {
		if(!this.canvas.visible) return;
		var g = this.khaRendering.frame.get_g2();
		g.setBlendingMode(kha_graphics4_BlendingOperation.SourceAlpha,kha_graphics4_BlendingOperation.InverseSourceAlpha);
		this.visual.draw(g);
		g.flush();
	}
	,__class__: mint_render_kha_Canvas
});
var mint_render_kha_Checkbox = function(khaRendering,control) {
	var _g = this;
	mint_render_kha_KhaRenderer.call(this,khaRendering,control);
	this.checkbox = control;
	var opt = this.checkbox.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-13158601);
	this.color = opt.color;
	if(opt.color_hover == null) opt.color_hover = kha__$Color_Color_$Impl_$._new(-12299944);
	this.color_hover = opt.color_hover;
	if(opt.color_node == null) opt.color_node = kha__$Color_Color_$Impl_$._new(-6436253);
	this.color_node = opt.color_node;
	if(opt.color_node_hover == null) opt.color_node_hover = kha__$Color_Color_$Impl_$._new(-5387677);
	this.color_node_hover = opt.color_node_hover;
	this.node = new mint_render_kha_visuals_Visual(this.checkbox.x + 4,this.checkbox.y + 4,this.checkbox.w - 8,this.checkbox.h - 8).color(this.color_node);
	this.nodeOff = new mint_render_kha_visuals_Visual(this.checkbox.x + 4,this.checkbox.y + 4,this.checkbox.w - 8,this.checkbox.h - 8).color(kha__$Color_Color_$Impl_$.fromFloats(kha__$Color_Color_$Impl_$.get_Rb(this.color_node) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Gb(this.color_node) * 0.00392156862745098,kha__$Color_Color_$Impl_$.get_Bb(this.color_node) * 0.00392156862745098,0.70));
	this.visual = new mint_render_kha_visuals_Border(this.checkbox.x + 4,this.checkbox.y + 4,this.checkbox.w - 8,this.checkbox.h - 8,4).color(this.color);
	this.checkbox.onmouseenter.listen(function(e,c) {
		_g.visual.color(_g.color_hover);
		_g.node.color(_g.color_node_hover);
	});
	this.checkbox.onmouseleave.listen(function(e1,c1) {
		_g.visual.color(_g.color);
		_g.node.color(_g.color_node);
	});
};
$hxClasses["mint.render.kha.Checkbox"] = mint_render_kha_Checkbox;
mint_render_kha_Checkbox.__name__ = true;
mint_render_kha_Checkbox.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Checkbox.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	checkbox: null
	,color: null
	,color_hover: null
	,color_node: null
	,color_node_hover: null
	,visual: null
	,node: null
	,nodeOff: null
	,onrender: function() {
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
		if(this.checkbox.state) this.node.draw(g); else this.nodeOff.draw(g);
	}
	,ondestroy: function() {
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,onclip: function(disable,x,y,w,h) {
		this.node.pos(this.checkbox.x + 4,this.checkbox.y + 4).clip(x,y,w,h);
		this.nodeOff.pos(this.checkbox.x + 4,this.checkbox.y + 4).clip(x,y,w,h);
		this.visual.pos(this.checkbox.x,this.checkbox.y).clip(x,y,w,h);
		mint_render_kha_KhaRenderer.prototype.onclip.call(this,disable,x,y,w,h);
	}
	,__class__: mint_render_kha_Checkbox
});
var mint_render_kha_Dropdown = function(render,control) {
	mint_render_kha_KhaRenderer.call(this,render,control);
	this.dropdown = control;
	var opt = this.dropdown.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-13158601);
	this.color = opt.color;
	if(opt.color_border == null) opt.color_border = kha__$Color_Color_$Impl_$._new(-15592942);
	this.color_border = opt.color_border;
	this.border = new mint_render_kha_visuals_Border(control.x - 1,control.y - 1,control.w + 2,control.h + 2,1).color(this.color_border);
	this.visual = new mint_render_kha_visuals_Visual(control.x,control.y,control.w,control.h).color(this.color);
};
$hxClasses["mint.render.kha.Dropdown"] = mint_render_kha_Dropdown;
mint_render_kha_Dropdown.__name__ = true;
mint_render_kha_Dropdown.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Dropdown.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	dropdown: null
	,visual: null
	,border: null
	,color: null
	,color_border: null
	,onrender: function() {
		if(!this.control.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
		this.border.draw(g);
		g.flush();
	}
	,onbounds: function() {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y);
		this.border.size(this.control.w + 2,this.control.h + 2).pos(this.control.x - 1,this.control.y - 1);
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y).clip(x,y,w,h);
		this.border.size(this.control.w + 2,this.control.h + 2).pos(this.control.x - 1,this.control.y - 1).clip(x,y,w,h);
	}
	,__class__: mint_render_kha_Dropdown
});
var mint_render_kha_Image = function(render,control) {
	this.textureLoaded = false;
	this.ratioH = 1.0;
	this.ratioW = 1.0;
	var _g1 = this;
	mint_render_kha_KhaRenderer.call(this,render,control);
	this.imageCtrl = control;
	var opt = this.imageCtrl.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-1);
	this.color = opt.color;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-1);
	this.color = opt.color;
	var resourceName = this.imageCtrl.options.path;
	var texture = null;
	this.visual = new mint_render_kha_visuals_Sprite(control.x,control.y,control.w,control.h);
	var ontextureloaded = function(image) {
		texture = image;
		if(opt.sizing != null) {
			var _g = opt.sizing;
			if(_g != null) switch(_g) {
			case "fit":
				if(texture.get_width() > texture.get_height()) _g1.ratioH = texture.get_height() / texture.get_width(); else _g1.ratioW = texture.get_width() / texture.get_height();
				break;
			case "cover":
				var rx = 1.0;
				var ry = 1.0;
				if(texture.get_width() > texture.get_height()) rx = texture.get_height() / texture.get_width(); else ry = texture.get_width() / texture.get_height();
				opt.uv = new kha_math_Vector4(0,0,rx,ry);
				break;
			}
		}
		_g1.visual = new mint_render_kha_visuals_Sprite(control.x,control.y,control.w * _g1.ratioW,control.h * _g1.ratioH).texture(texture).color(_g1.color);
		if(opt.uv != null) _g1.visual.setUv(opt.uv);
		if(control.clip_with != null) _g1.visual.clip(control.clip_with.x,control.clip_with.y,control.clip_with.w,control.clip_with.h);
		_g1.textureLoaded = true;
	};
	if(Object.prototype.hasOwnProperty.call(kha_Assets.images,resourceName)) kha_Assets.loadImage(resourceName,ontextureloaded); else kha_Assets.loadImageFromPath(resourceName,true,ontextureloaded);
};
$hxClasses["mint.render.kha.Image"] = mint_render_kha_Image;
mint_render_kha_Image.__name__ = true;
mint_render_kha_Image.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Image.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	imageCtrl: null
	,visual: null
	,color: null
	,ratioW: null
	,ratioH: null
	,textureLoaded: null
	,onrender: function() {
		if(!this.control.visible || !this.textureLoaded) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
		g.flush();
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.clip(x,y,w,h);
	}
	,onbounds: function() {
		this.visual.pos(this.control.x,this.control.y).size(this.control.w,this.control.h);
	}
	,ondestroy: function() {
		this.visual.ondestroy();
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,__class__: mint_render_kha_Image
});
var mint_render_kha_KhaMintAdapter = function() {
	this.prevMouseY = 0;
	this.prevMouseX = 0;
	this.scrollSpeed = 5;
	this.modState = { none : true, lshift : false, rshift : false, lctrl : false, rctrl : false, lalt : false, ralt : false, lmeta : false, rmeta : false, num : false, caps : false, mode : false, ctrl : false, shift : false, alt : false, meta : false};
};
$hxClasses["mint.render.kha.KhaMintAdapter"] = mint_render_kha_KhaMintAdapter;
mint_render_kha_KhaMintAdapter.__name__ = true;
mint_render_kha_KhaMintAdapter.prototype = {
	scrollSpeed: null
	,modState: null
	,prevMouseX: null
	,prevMouseY: null
	,keyCode: function(k,c) {
		var keycode;
		switch(k[1]) {
		case 5:
			keycode = 18;
			break;
		case 0:
			keycode = 8;
			break;
		case 4:
			keycode = 17;
			break;
		case 8:
			keycode = 46;
			break;
		case 10:
			keycode = 40;
			break;
		case 7:
			keycode = 27;
			break;
		case 2:
			keycode = 13;
			break;
		case 11:
			keycode = 37;
			break;
		case 12:
			keycode = 39;
			break;
		case 3:
			keycode = 16;
			break;
		case 1:
			keycode = 9;
			break;
		case 9:
			keycode = 38;
			break;
		case 6:case 13:
			keycode = -1;
			break;
		}
		if(keycode == -1 && c.length > 0) keycode = HxOverrides.cca(c,0);
		return keycode;
	}
	,mintKeyCode: function(k) {
		switch(k[1]) {
		case 11:
			return 0;
		case 12:
			return 1;
		case 9:
			return 2;
		case 10:
			return 3;
		case 0:
			return 4;
		case 8:
			return 5;
		case 1:
			return 6;
		case 2:
			return 7;
		default:
			return -1;
		}
	}
	,checkMods: function(k,down) {
		switch(k[1]) {
		case 5:
			this.modState.alt = down;
			break;
		case 4:
			this.modState.ctrl = down;
			break;
		case 3:
			this.modState.shift = down;
			break;
		default:
		}
	}
	,keyDown: function(k,c) {
		this.checkMods(k,true);
		return { state : 2, keycode : this.keyCode(k,c), timestamp : haxe_Timer.stamp(), key : this.mintKeyCode(k), mod : this.modState, bubble : true};
	}
	,keyUp: function(k,c) {
		this.checkMods(k,false);
		return { state : 3, keycode : this.keyCode(k,c), timestamp : haxe_Timer.stamp(), key : this.mintKeyCode(k), mod : this.modState, bubble : true};
	}
	,textEvent: function(k,c) {
		return { text : c, type : mint_types_TextEventType.input, timestamp : haxe_Timer.stamp(), start : 0, length : c.length, bubble : true};
	}
	,mouseButton: function(button) {
		switch(button) {
		case 0:
			return 0;
		case 1:
			return 2;
		case 2:
			return 1;
		default:
			return -1;
		}
	}
	,mouseDownEvent: function(button,x,y) {
		return { state : 2, button : this.mouseButton(button), timestamp : haxe_Timer.stamp(), x : x, y : y, xrel : 0, yrel : 0, bubble : true};
	}
	,mouseUpEvent: function(button,x,y) {
		return { state : 3, button : this.mouseButton(button), timestamp : haxe_Timer.stamp(), x : x, y : y, xrel : 0, yrel : 0, bubble : true};
	}
	,mouseMoveEvent: function(x,y) {
		var res = { state : 4, button : -1, timestamp : haxe_Timer.stamp(), x : x, y : y, xrel : 0, yrel : 0, bubble : true};
		this.prevMouseX = x;
		this.prevMouseY = y;
		return res;
	}
	,mouseWheelEvent: function(w) {
		return { state : 5, button : -1, timestamp : haxe_Timer.stamp(), x : 0, y : w < 0?-this.scrollSpeed:this.scrollSpeed, xrel : 0, yrel : 0, bubble : true};
	}
	,__class__: mint_render_kha_KhaMintAdapter
};
var mint_render_kha_KhaMintRendering = function(options,viewportWidth,viewportHeight) {
	mint_render_Rendering.call(this);
	this.font = options.font;
	this.viewportWidth = viewportWidth;
	this.viewportHeight = viewportHeight;
};
$hxClasses["mint.render.kha.KhaMintRendering"] = mint_render_kha_KhaMintRendering;
mint_render_kha_KhaMintRendering.__name__ = true;
mint_render_kha_KhaMintRendering.__super__ = mint_render_Rendering;
mint_render_kha_KhaMintRendering.prototype = $extend(mint_render_Rendering.prototype,{
	frame: null
	,font: null
	,viewportWidth: null
	,viewportHeight: null
	,get: function(type,control) {
		return (function($this) {
			var $r;
			switch(type) {
			case mint_Canvas:
				$r = new mint_render_kha_Canvas($this,control);
				break;
			case mint_Label:
				$r = new mint_render_kha_Label($this,control);
				break;
			case mint_Button:
				$r = new mint_render_kha_Button($this,control);
				break;
			case mint_Image:
				$r = new mint_render_kha_Image($this,control);
				break;
			case mint_List:
				$r = new mint_render_kha_List($this,control);
				break;
			case mint_Scroll:
				$r = new mint_render_kha_Scroll($this,control);
				break;
			case mint_Panel:
				$r = new mint_render_kha_Panel($this,control);
				break;
			case mint_Checkbox:
				$r = new mint_render_kha_Checkbox($this,control);
				break;
			case mint_Window:
				$r = new mint_render_kha_Window($this,control);
				break;
			case mint_TextEdit:
				$r = new mint_render_kha_TextEdit($this,control);
				break;
			case mint_Dropdown:
				$r = new mint_render_kha_Dropdown($this,control);
				break;
			case mint_Slider:
				$r = new mint_render_kha_Slider($this,control);
				break;
			case mint_Progress:
				$r = new mint_render_kha_Progress($this,control);
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,__class__: mint_render_kha_KhaMintRendering
});
var mint_render_kha_Label = function(khaRendering,control) {
	var _g = this;
	mint_render_kha_KhaRenderer.call(this,khaRendering,control);
	this.label = control;
	this.textStr = this.label.text;
	var opt = this.label.options.options;
	if(opt.font == null) opt.font = khaRendering.font;
	this.font = opt.font;
	this.fontSize = this.label.options.text_size | 0;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$.White;
	this.color = opt.color;
	if(opt.color_hover == null) opt.color_hover = kha__$Color_Color_$Impl_$._new(-6436253);
	this.colorHover = opt.color_hover;
	this.currentColor = this.color;
	this.label.onchange.listen($bind(this,this.ontext));
	this.text = new mint_render_kha_visuals_Text(control.x,control.y,control.w,control.h,khaRendering.viewportHeight).align(this.label.options.align,this.label.options.align_vertical).text(this.textStr).font(this.fontSize,this.font).color(this.color);
	control.onmouseenter.listen(function(e,c) {
		_g.text.color(_g.colorHover);
	});
	control.onmouseleave.listen(function(e1,c1) {
		_g.text.color(_g.color);
	});
};
$hxClasses["mint.render.kha.Label"] = mint_render_kha_Label;
mint_render_kha_Label.__name__ = true;
mint_render_kha_Label.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Label.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	label: null
	,textStr: null
	,colorHover: null
	,color: null
	,currentColor: null
	,text: null
	,font: null
	,fontSize: null
	,ondestroy: function() {
		this.label.onchange.remove($bind(this,this.ontext));
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,ontext: function(str) {
		this.text.text(str);
	}
	,onrender: function() {
		if(!this.control.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.text.draw(g);
		g.flush();
	}
	,onclip: function(disable,x,y,w,h) {
		this.text.pos(this.control.x,this.control.y).size(this.control.w,this.control.h).clip(x,y,w,h);
	}
	,onbounds: function() {
		this.text.pos(this.control.x,this.control.y).size(this.control.w,this.control.h);
	}
	,__class__: mint_render_kha_Label
});
var mint_render_kha_List = function(render,control) {
	mint_render_kha_KhaRenderer.call(this,render,control);
	this.list = control;
	var opt = this.list.options.options;
};
$hxClasses["mint.render.kha.List"] = mint_render_kha_List;
mint_render_kha_List.__name__ = true;
mint_render_kha_List.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_List.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	list: null
	,ondestroy: function() {
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,onrender: function() {
	}
	,onbounds: function() {
	}
	,onclip: function(disable,x,y,w,h) {
	}
	,__class__: mint_render_kha_List
});
var mint_render_kha_Panel = function(khaRendering,control) {
	mint_render_kha_KhaRenderer.call(this,khaRendering,control);
	this.panel = control;
	var opt = this.panel.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-14408668);
	this.color = opt.color;
	this.visual = new mint_render_kha_visuals_Visual(control.x,control.y,control.w,control.h).color(this.color);
};
$hxClasses["mint.render.kha.Panel"] = mint_render_kha_Panel;
mint_render_kha_Panel.__name__ = true;
mint_render_kha_Panel.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Panel.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	panel: null
	,color: null
	,visual: null
	,onrender: function() {
		if(!this.panel.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
	}
	,onbounds: function() {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y);
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y).clip(x,y,w,h);
	}
	,__class__: mint_render_kha_Panel
});
var mint_render_kha_Progress = function(render,control) {
	this.margin = 2.0;
	mint_render_kha_KhaRenderer.call(this,render,control);
	this.progress = control;
	var opt = this.progress.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(2368548);
	this.color = opt.color;
	if(opt.color_bar == null) opt.color_bar = kha__$Color_Color_$Impl_$._new(10340963);
	this.colorBar = opt.color_bar;
	this.visual = new mint_render_kha_visuals_Visual(control.x,control.y,control.w,control.h).color(this.color);
	this.bar = new mint_render_kha_visuals_Visual(control.x + this.margin,control.y + this.margin,this.getBarWidth(this.progress.progress),control.h - this.margin * 2).color(this.colorBar);
	this.progress.onchange.listen($bind(this,this.onprogresschange));
};
$hxClasses["mint.render.kha.Progress"] = mint_render_kha_Progress;
mint_render_kha_Progress.__name__ = true;
mint_render_kha_Progress.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Progress.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	progress: null
	,color: null
	,colorBar: null
	,visual: null
	,bar: null
	,margin: null
	,ondestroy: function() {
		this.progress.onchange.remove($bind(this,this.onprogresschange));
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,onrender: function() {
		if(!this.control.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
		this.bar.draw(g);
		g.flush();
	}
	,onprogresschange: function(cur,prev) {
		this.bar.size(this.getBarWidth(cur),this.control.h - this.margin * 2);
	}
	,getBarWidth: function(progressValue) {
		var width = (this.control.w - this.margin * 2) * progressValue;
		if(width <= 1) width = 1;
		var controlW = this.control.w - this.margin;
		if(width >= controlW) width = controlW;
		return width;
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.pos(this.control.x,this.control.y).size(this.control.w,this.control.h).clip(x,y,w,h);
		this.bar.pos(this.control.x + this.margin,this.control.y + this.margin).size(this.getBarWidth(this.progress.progress),this.control.h - this.margin * 2).clip(x,y,w,h);
	}
	,onbounds: function() {
		this.visual.pos(this.control.x,this.control.y).size(this.control.w,this.control.h);
		this.bar.pos(this.control.x + this.margin,this.control.y + this.margin).size(this.getBarWidth(this.progress.progress),this.control.h - this.margin * 2);
	}
	,__class__: mint_render_kha_Progress
});
var mint_render_kha_Scroll = function(render,control) {
	mint_render_kha_KhaRenderer.call(this,render,control);
	this.scroll = control;
	var _opt = this.scroll.options.options;
	if(_opt.color == null) _opt.color = kha__$Color_Color_$Impl_$._new(-13355980);
	this.color = _opt.color;
	if(_opt.color_handles == null) _opt.color_handles = kha__$Color_Color_$Impl_$._new(-6436253);
	this.color_handles = _opt.color_handles;
	this.visual = new mint_render_kha_visuals_Visual(control.x,control.y,control.w,control.h).color(this.color);
	this.scrollh = new mint_render_kha_visuals_Visual(this.scroll.scrollh.x,this.scroll.scrollh.y,this.scroll.scrollh.w,this.scroll.scrollh.h).color(this.color_handles);
	this.scrollv = new mint_render_kha_visuals_Visual(this.scroll.scrollv.x,this.scroll.scrollv.y,this.scroll.scrollv.w,this.scroll.scrollv.h).color(this.color_handles);
	this.scroll.onchange.listen($bind(this,this.onchange));
	this.scroll.onhandlevis.listen($bind(this,this.onhandlevis));
};
$hxClasses["mint.render.kha.Scroll"] = mint_render_kha_Scroll;
mint_render_kha_Scroll.__name__ = true;
mint_render_kha_Scroll.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Scroll.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	scroll: null
	,visual: null
	,scrollh: null
	,scrollv: null
	,color: null
	,color_handles: null
	,onrender: function() {
		if(!this.control.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
		this.scrollh.draw(g);
		this.scrollv.draw(g);
	}
	,ondestroy: function() {
		this.scroll.onchange.remove($bind(this,this.onchange));
		this.scroll.onhandlevis.remove($bind(this,this.onhandlevis));
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,onhandlevis: function(_h,_v) {
		this.scrollh.visible(_h && this.scroll.visible);
		this.scrollv.visible(_v && this.scroll.visible);
	}
	,onchange: function() {
		this.scrollh.pos(this.scroll.scrollh.x,this.scroll.scrollh.y);
		this.scrollv.pos(this.scroll.scrollv.x,this.scroll.scrollv.y);
	}
	,onbounds: function() {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y);
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y).clip(x,y,w,h);
	}
	,__class__: mint_render_kha_Scroll
});
var mint_render_kha_Slider = function(render,control) {
	mint_render_kha_KhaRenderer.call(this,render,control);
	this.slider = control;
	var opt = this.slider.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-13553351);
	this.color = opt.color;
	if(opt.color_bar == null) opt.color_bar = kha__$Color_Color_$Impl_$._new(-6436253);
	this.color_bar = opt.color_bar;
	this.visual = new mint_render_kha_visuals_Visual(control.x,control.y,control.w,control.h).color(this.color);
	this.bar = new mint_render_kha_visuals_Visual(control.x + this.slider.bar_x,control.y + this.slider.bar_y,this.slider.bar_w,this.slider.bar_h).color(this.color_bar);
	this.slider.onchange.listen($bind(this,this.onchange));
};
$hxClasses["mint.render.kha.Slider"] = mint_render_kha_Slider;
mint_render_kha_Slider.__name__ = true;
mint_render_kha_Slider.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Slider.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	slider: null
	,visual: null
	,bar: null
	,color: null
	,color_bar: null
	,onrender: function() {
		if(!this.slider.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
		this.bar.draw(g);
	}
	,ondestroy: function() {
		this.slider.onchange.remove($bind(this,this.onchange));
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,onchange: function(value,prevValue) {
		this.bar.pos(this.slider.x + this.slider.bar_x,this.slider.y + this.slider.bar_y).size(this.slider.bar_w,this.slider.bar_h);
	}
	,onbounds: function() {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y);
		this.bar.size(this.slider.bar_w,this.slider.bar_h).pos(this.slider.x + this.slider.bar_x,this.slider.y + this.slider.bar_y);
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.size(this.control.w,this.control.h).pos(this.control.x,this.control.y).clip(x,y,w,h);
		this.bar.size(this.slider.bar_w,this.slider.bar_h).pos(this.slider.bar_x,this.slider.bar_y).clip(x,y,w,h);
	}
	,__class__: mint_render_kha_Slider
});
var mint_render_kha_TextEdit = function(render,control) {
	this.blinkTaskId = -1;
	var _g = this;
	mint_render_kha_KhaRenderer.call(this,render,control);
	this.textedit = control;
	var opt = this.textedit.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-10197911);
	this.color = opt.color;
	if(opt.color_hover == null) opt.color_hover = kha__$Color_Color_$Impl_$._new(-12303287);
	this.colorHover = opt.color_hover;
	if(opt.color_cursor == null) opt.color_cursor = kha__$Color_Color_$Impl_$._new(-6436253);
	this.colorCursor = opt.color_cursor;
	if(opt.cursor_blink_rate == null) opt.cursor_blink_rate = 0.5;
	this.cursorBlinkRate = opt.cursor_blink_rate;
	this.visual = new mint_render_kha_visuals_Visual(control.x,control.y,control.w,control.h).color(this.color);
	this.cursor = new mint_render_kha_visuals_Visual(0,0,0,0).color(this.colorCursor).visible(false);
	this.border = new mint_render_kha_visuals_Border(this.textedit.x,this.textedit.y,this.textedit.w,this.textedit.h,1).color(this.colorCursor);
	this.textedit.onmouseenter.listen(function(e,c) {
		_g.visual.color(_g.colorHover);
	});
	this.textedit.onmouseleave.listen(function(c1,e1) {
		_g.visual.color(_g.color);
	});
	this.textedit.onfocused.listen(function(state) {
		if(state) _g.startCursor(); else _g.stopCursor();
	});
	this.textedit.onchangeindex.listen(function(index) {
		_g.updateCursor();
	});
};
$hxClasses["mint.render.kha.TextEdit"] = mint_render_kha_TextEdit;
mint_render_kha_TextEdit.__name__ = true;
mint_render_kha_TextEdit.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_TextEdit.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	textedit: null
	,visual: null
	,cursor: null
	,border: null
	,color: null
	,colorHover: null
	,colorCursor: null
	,cursorBlinkRate: null
	,onrender: function() {
		if(!this.control.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
		if(this.textedit.isfocused) this.border.draw(g);
		this.cursor.draw(g);
		g.flush();
	}
	,blinkTaskId: null
	,startCursor: function() {
		this.cursor.visible(true);
		this.updateCursor();
		this.blinkTaskId = kha_Scheduler.addTimeTask($bind(this,this.blinkCursor),0,this.cursorBlinkRate,0);
	}
	,stopCursor: function() {
		this.cursor.visible(false);
		kha_Scheduler.removeTimeTask(this.blinkTaskId);
		this.blinkTaskId = -1;
	}
	,blinkCursor: function() {
		if(this.blinkTaskId == -1) return;
		this.cursor.visible(!this.cursor.isVisible());
	}
	,updateCursor: function() {
		var label = this.textedit.label.renderer;
		var fSize = label.fontSize;
		var text = mint_core_unifill_Unifill.uSubstr(this.textedit.display,0,this.textedit.index);
		var tw = label.font.width(fSize,this.textedit.edit);
		var twh = tw / 2;
		var w = label.font.width(fSize,text);
		var th = label.font.height(fSize);
		var thh = th / 2;
		var x = w;
		var y = 0.0;
		x += this.textedit.label.x;
		y += this.textedit.label.y + 2;
		this.cursor.pos(x,y);
		this.cursor.size(1,this.textedit.label.h - 8);
	}
	,ondestroy: function() {
		this.stopCursor();
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,onvisible: function(visible) {
		this.visual.visible(visible);
		if(!visible) this.stopCursor(); else if(visible && this.textedit.isfocused) this.startCursor();
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.pos(this.control.x,this.control.y).size(this.control.w,this.control.h).clip(x,y,w,h);
		this.border.pos(this.control.x,this.control.y).size(this.control.w,this.control.h).clip(x,y,w,h);
		this.updateCursor();
	}
	,onbounds: function() {
		this.visual.pos(this.control.x,this.control.y).size(this.control.w,this.control.h);
		this.border.pos(this.control.x,this.control.y).size(this.control.w,this.control.h);
		this.updateCursor();
	}
	,__class__: mint_render_kha_TextEdit
});
var mint_render_kha_Window = function(khaRendering,control) {
	mint_render_kha_KhaRenderer.call(this,khaRendering,control);
	this.window = control;
	var opt = this.window.options.options;
	if(opt.color == null) opt.color = kha__$Color_Color_$Impl_$._new(-14408668);
	this.color = opt.color;
	if(opt.color_border == null) opt.color_border = kha__$Color_Color_$Impl_$._new(-13158599);
	this.color_border = opt.color_border;
	if(opt.color_titlebar == null) opt.color_titlebar = kha__$Color_Color_$Impl_$._new(-13158601);
	this.color_titlebar = opt.color_titlebar;
	if(opt.color_collapse == null) opt.color_collapse = kha__$Color_Color_$Impl_$._new(-10066330);
	this.color_collapse = opt.color_collapse;
	var clipRect = this.window.clip_with;
	this.visual = new mint_render_kha_visuals_Visual(this.window.x,this.window.y,this.window.w,this.window.h).color(this.color);
	this.top = new mint_render_kha_visuals_Visual(this.window.title.x,this.window.title.y,this.window.title.w,this.window.title.h).color(this.color_titlebar);
	this.border = new mint_render_kha_visuals_Border(this.window.x + 1,this.window.y + 1,this.window.w - 1,this.window.h - 1,1).color(this.color_border);
	var ch = this.window.collapse_handle;
	this.collapse = new mint_render_kha_visuals_Triangle(ch.x + ch.w / 2,ch.y + ch.h / 2,new kha_math_Vector2(0,0),new kha_math_Vector2(10,0),new kha_math_Vector2(5,10)).color(this.color_collapse);
	this.window.oncollapse.listen($bind(this,this.oncollapse));
};
$hxClasses["mint.render.kha.Window"] = mint_render_kha_Window;
mint_render_kha_Window.__name__ = true;
mint_render_kha_Window.__super__ = mint_render_kha_KhaRenderer;
mint_render_kha_Window.prototype = $extend(mint_render_kha_KhaRenderer.prototype,{
	window: null
	,color: null
	,color_titlebar: null
	,color_border: null
	,color_collapse: null
	,visual: null
	,top: null
	,border: null
	,collapse: null
	,onbounds: function() {
		this.visual.size(this.window.w,this.window.h).pos(this.window.x,this.window.y);
		this.top.size(this.window.title.w,this.window.title.h).pos(this.window.title.x,this.window.title.y);
		this.border.size(this.window.w,this.window.h).pos(this.window.x,this.window.y);
		var ch = this.window.collapse_handle;
		this.collapse.size(10,10).pos(ch.x + ch.w / 2,ch.y + ch.h / 2);
	}
	,onclip: function(disable,x,y,w,h) {
		this.visual.size(this.window.w,this.window.h).pos(this.window.x,this.window.y).clip(x,y,w,h);
		this.top.size(this.window.title.w,this.window.title.h).pos(this.window.title.x,this.window.title.y).clip(x,y,w,h);
		this.border.size(this.window.w,this.window.h).pos(this.window.x,this.window.y).clip(x,y,w,h);
	}
	,ondestroy: function() {
		this.window.oncollapse.remove($bind(this,this.oncollapse));
		mint_render_kha_KhaRenderer.prototype.ondestroy.call(this);
	}
	,onrender: function() {
		if(!this.control.visible) return;
		var g = this.khaRendering.frame.get_g2();
		this.visual.draw(g);
		this.top.draw(g);
		this.border.draw(g);
		if(this.window.collapsible) this.collapse.draw(g);
		g.flush();
	}
	,oncollapse: function(doCollapse) {
		this.visual.size(this.window.w,this.window.h).pos(this.window.x,this.window.y);
		this.top.size(this.window.title.w,this.window.title.h).pos(this.window.title.x,this.window.title.y);
		this.border.size(this.window.w,this.window.h).pos(this.window.x,this.window.y);
		this.collapse.rotation(doCollapse?-Math.PI / 2:0);
	}
	,__class__: mint_render_kha_Window
});
var mint_render_kha_visuals_Visual = function(x,y,width,height) {
	this.myVisibility = true;
	this.myOpacity = -1.0;
	this.myColor = kha__$Color_Color_$Impl_$.White;
	this.doClip = false;
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.cx = x;
	this.cy = y;
	this.cw = this.w;
	this.ch = this.h;
	this.refreshClip();
	if(mint_render_kha_visuals_Visual.baseImage == null) {
		mint_render_kha_visuals_Visual.baseImage = kha_Image.createRenderTarget(1,1);
		var g = mint_render_kha_visuals_Visual.baseImage.get_g2();
		g.begin();
		g.set_color(kha__$Color_Color_$Impl_$.White);
		g.fillRect(0,0,1,1);
		g.end();
	}
};
$hxClasses["mint.render.kha.visuals.Visual"] = mint_render_kha_visuals_Visual;
mint_render_kha_visuals_Visual.__name__ = true;
mint_render_kha_visuals_Visual.prototype = {
	w: null
	,h: null
	,x: null
	,y: null
	,cw: null
	,ch: null
	,cx: null
	,cy: null
	,rx: null
	,ry: null
	,rw: null
	,rh: null
	,doClip: null
	,myColor: null
	,myOpacity: null
	,myVisibility: null
	,color: function(color) {
		this.myColor = color;
		if(this.myOpacity == -1) this.myOpacity = kha__$Color_Color_$Impl_$.get_Ab(this.myColor) * 0.00392156862745098;
		return this;
	}
	,opacity: function(opacity) {
		this.myOpacity = opacity;
		return this;
	}
	,size: function(width,height) {
		this.w = width;
		this.h = height;
		this.refreshClip();
		return this;
	}
	,pos: function(x,y) {
		this.x = x;
		this.y = y;
		this.refreshClip();
		return this;
	}
	,visible: function(visible) {
		this.myVisibility = visible;
		return this;
	}
	,isVisible: function() {
		return this.myVisibility;
	}
	,clip: function(_x,_y,_w,_h) {
		this.cx = _x;
		this.cy = _y;
		this.cw = _w;
		this.ch = _h;
		this.doClip = _x != null && _y != null && _w != null && _h != null;
		this.refreshClip();
	}
	,refreshClip: function() {
		if(this.doClip) {
			this.rx = Math.min(Math.max(this.cx,this.x),this.cx + this.cw);
			this.ry = Math.min(Math.max(this.cy,this.y),this.cy + this.ch);
			this.rw = Math.max(0,Math.min(this.cx + this.cw,this.x + this.w) - Math.max(this.cx,this.x));
			this.rh = Math.max(0,Math.min(this.cy + this.ch,this.y + this.h) - Math.max(this.cy,this.y));
		} else {
			this.rx = this.x;
			this.ry = this.y;
			this.rw = this.w;
			this.rh = this.h;
		}
	}
	,draw: function(g) {
		if(!this.myVisibility) return;
		g.pushOpacity(this.myOpacity);
		g.set_color(this.myColor);
		g.setBlendingMode(kha_graphics4_BlendingOperation.SourceAlpha,kha_graphics4_BlendingOperation.InverseSourceAlpha);
		g.drawScaledImage(mint_render_kha_visuals_Visual.baseImage,this.rx,this.ry,this.rw,this.rh);
		g.popOpacity();
	}
	,__class__: mint_render_kha_visuals_Visual
};
var mint_render_kha_visuals_Border = function(innerX,innerY,innerW,innerH,borderLength) {
	this.innerX = innerX;
	this.innerY = innerY;
	this.innerW = innerW;
	this.innerH = innerH;
	this.borderLength = borderLength;
	mint_render_kha_visuals_Visual.call(this,innerX - borderLength,innerY - borderLength,innerW + borderLength,innerH + borderLength);
};
$hxClasses["mint.render.kha.visuals.Border"] = mint_render_kha_visuals_Border;
mint_render_kha_visuals_Border.__name__ = true;
mint_render_kha_visuals_Border.__super__ = mint_render_kha_visuals_Visual;
mint_render_kha_visuals_Border.prototype = $extend(mint_render_kha_visuals_Visual.prototype,{
	innerX: null
	,innerY: null
	,innerW: null
	,innerH: null
	,borderLength: null
	,inner: function(x,y,w,h) {
		this.innerX = x;
		this.innerY = y;
		this.innerW = w;
		this.innerH = h;
		this.pos(this.innerX - this.borderLength,this.innerY - this.borderLength);
		this.size(this.innerW + this.borderLength,this.innerH + this.borderLength);
		return this;
	}
	,length: function(length) {
		this.borderLength = length;
		this.pos(this.innerX - this.borderLength,this.innerY - this.borderLength);
		this.size(this.innerW + this.borderLength,this.innerH + this.borderLength);
		return this;
	}
	,draw: function(g) {
		if(!this.myVisibility) return;
		if(this.doClip) {
			this.rx = Math.min(Math.max(this.cx,this.x),this.cx + this.cw);
			this.ry = Math.min(Math.max(this.cy,this.y),this.cy + this.ch);
			this.rw = Math.max(0,Math.min(this.w,this.cx + this.cw - this.x));
			this.rh = Math.max(0,Math.min(this.h,this.cy + this.ch - this.y));
		} else {
			this.rx = this.x;
			this.ry = this.y;
			this.rw = this.w;
			this.rh = this.h;
		}
		g.pushOpacity(this.myOpacity);
		g.set_color(this.myColor);
		g.setBlendingMode(kha_graphics4_BlendingOperation.SourceAlpha,kha_graphics4_BlendingOperation.InverseSourceAlpha);
		g.drawScaledImage(mint_render_kha_visuals_Visual.baseImage,this.rx,this.ry,this.rw,this.borderLength);
		g.drawScaledImage(mint_render_kha_visuals_Visual.baseImage,this.rx,this.ry + this.rh,this.rw,this.borderLength);
		g.drawScaledImage(mint_render_kha_visuals_Visual.baseImage,this.rx,this.ry + this.borderLength,this.borderLength,this.rh);
		g.drawScaledImage(mint_render_kha_visuals_Visual.baseImage,this.rx + this.rw,this.ry,this.borderLength,this.rh + this.borderLength);
		g.popOpacity();
	}
	,__class__: mint_render_kha_visuals_Border
});
var mint_render_kha_visuals_Sprite = function(x,y,width,height) {
	mint_render_kha_visuals_Visual.call(this,x,y,width,height);
	this.uv = new kha_math_Vector4(0,0,1,1);
};
$hxClasses["mint.render.kha.visuals.Sprite"] = mint_render_kha_visuals_Sprite;
mint_render_kha_visuals_Sprite.__name__ = true;
mint_render_kha_visuals_Sprite.__super__ = mint_render_kha_visuals_Visual;
mint_render_kha_visuals_Sprite.prototype = $extend(mint_render_kha_visuals_Visual.prototype,{
	myTexture: null
	,uv: null
	,texture: function(tex) {
		if(this.myTexture != null) this.ondestroy();
		this.myTexture = tex;
		return this;
	}
	,setUv: function(uv) {
		this.uv = uv;
		return this;
	}
	,draw: function(g) {
		if(!this.myVisibility) return;
		g.pushOpacity(this.myOpacity);
		g.set_color(this.myColor);
		g.setBlendingMode(kha_graphics4_BlendingOperation.SourceAlpha,kha_graphics4_BlendingOperation.InverseSourceAlpha);
		if(this.doClip) g.scissor(this.cx | 0,this.cy | 0,this.cw | 0,this.ch | 0); else g.scissor(this.x | 0,this.y | 0,this.w | 0,this.h | 0);
		g.drawScaledImage(this.myTexture,this.x,this.y,this.uv.z * this.w,this.uv.w * this.h);
		g.disableScissor();
		g.popOpacity();
	}
	,ondestroy: function() {
		this.myTexture.unload();
	}
	,__class__: mint_render_kha_visuals_Sprite
});
var mint_render_kha_visuals_Text = function(x,y,width,height,viewportHeight) {
	this.myAlignementV = 3;
	this.myAlignementH = 1;
	this.myText = "";
	mint_render_kha_visuals_Visual.call(this,x,y,width,height);
	this.viewportHeight = viewportHeight;
};
$hxClasses["mint.render.kha.visuals.Text"] = mint_render_kha_visuals_Text;
mint_render_kha_visuals_Text.__name__ = true;
mint_render_kha_visuals_Text.__super__ = mint_render_kha_visuals_Visual;
mint_render_kha_visuals_Text.prototype = $extend(mint_render_kha_visuals_Visual.prototype,{
	myText: null
	,lines: null
	,myAlignementH: null
	,myAlignementV: null
	,myFont: null
	,fontSize: null
	,viewportHeight: null
	,checkLength: function() {
		if(this.myFont == null) return;
		var maxLineLength = 0;
		var lineCount = 0;
		if(this.lines != null) {
			lineCount = this.lines.length;
			var _g = 0;
			var _g1 = this.lines;
			while(_g < _g1.length) {
				var line = _g1[_g];
				++_g;
				if(line.length > maxLineLength) maxLineLength = line.length;
			}
		}
		this.lines = [];
		var strLen = this.myFont.width(this.fontSize,this.myText);
		if(strLen > this.rw && this.myFont.width(this.fontSize,"a") < this.rw) {
			var len = 0.0;
			var currentLine = "";
			var _g11 = 0;
			var _g2 = this.myText.length;
			while(_g11 < _g2) {
				var i = _g11++;
				var c = this.myText.charAt(i);
				len += this.myFont.width(this.fontSize,c);
				if(len < this.rw) currentLine += c; else {
					this.lines.push(currentLine);
					currentLine = c;
					len = this.myFont.width(this.fontSize,c);
				}
			}
			if(currentLine.length > 0) this.lines.push(currentLine);
		} else this.lines.push(this.myText);
	}
	,text: function(text) {
		this.myText = text;
		this.checkLength();
		return this;
	}
	,font: function(size,font) {
		this.fontSize = size;
		this.myFont = font;
		this.checkLength();
		return this;
	}
	,clip: function(x,y,w,h) {
		mint_render_kha_visuals_Visual.prototype.clip.call(this,x,y,w,h);
		this.checkLength();
	}
	,align: function(alignH,alignV) {
		this.myAlignementH = alignH;
		this.myAlignementV = alignV;
		return this;
	}
	,draw: function(g) {
		if(!this.myVisibility) return;
		g.set_color(this.myColor);
		g.pushOpacity(this.myOpacity);
		g.set_font(this.myFont);
		var dy = 0.0;
		var lh = this.myFont.height(this.fontSize);
		var i = 0;
		if(this.doClip) g.scissor(this.cx | 0,this.cy | 0,this.cw | 0,this.ch | 0);
		var _g = 0;
		var _g1 = this.lines;
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			var xOff = 0.0;
			var yOff = 0.0;
			var _g2 = this.myAlignementH;
			switch(_g2) {
			case 2:
				xOff = this.rw - this.myFont.width(this.fontSize,line);
				break;
			case 3:
				xOff = this.rw / 2 - this.myFont.width(this.fontSize,line) / 2;
				break;
			default:
			}
			var _g21 = this.myAlignementV;
			switch(_g21) {
			case 4:case 0:
				yOff = i * lh;
				break;
			case 3:
				yOff = this.h / 2 - (this.lines.length % 2 == 0?0:lh / 2) - Math.floor(this.lines.length / 2) * lh + i * lh;
				break;
			case 5:
				yOff = this.h - lh - (this.lines.length - i) * lh;
				break;
			default:
			}
			g.set_fontSize(this.fontSize);
			g.drawString(line,this.x + xOff,this.y + yOff);
			g.flush();
			dy += lh;
			i++;
		}
		if(this.doClip) g.disableScissor();
		g.flush();
		g.popOpacity();
	}
	,__class__: mint_render_kha_visuals_Text
});
var mint_render_kha_visuals_Triangle = function(x,y,p0,p1,p2) {
	mint_render_kha_visuals_Visual.call(this,x,y,0,0);
	this.p0 = p0;
	this.p1 = p1;
	this.p2 = p2;
	this.center = new kha_math_Vector2(0,0);
	this.computeCenter();
};
$hxClasses["mint.render.kha.visuals.Triangle"] = mint_render_kha_visuals_Triangle;
mint_render_kha_visuals_Triangle.__name__ = true;
mint_render_kha_visuals_Triangle.__super__ = mint_render_kha_visuals_Visual;
mint_render_kha_visuals_Triangle.prototype = $extend(mint_render_kha_visuals_Visual.prototype,{
	p0: null
	,p1: null
	,p2: null
	,center: null
	,myRotation: null
	,rotation: function(rot) {
		this.myRotation = rot;
		return this;
	}
	,computeCenter: function() {
		var _this = this.p0;
		var vec = this.p1;
		var _this_x = _this.x + vec.x;
		var _this_y = _this.y + vec.y;
		var vec1 = this.p2;
		var _this_x1 = _this_x + vec1.x;
		var _this_y1 = _this_y + vec1.y;
		var value = 0.333333333333333315;
		this.center = new kha_math_Vector2(_this_x1 * value,_this_y1 * value);
	}
	,draw: function(g) {
		if(!this.myVisibility) return;
		g.pushOpacity(this.myOpacity);
		g.set_color(this.myColor);
		g.pushRotation(this.myRotation,this.x + this.center.x,this.y + this.center.y);
		g.setBlendingMode(kha_graphics4_BlendingOperation.SourceAlpha,kha_graphics4_BlendingOperation.InverseSourceAlpha);
		g.fillTriangle(this.x + this.p0.x,this.y + this.p0.y,this.x + this.p1.x,this.y + this.p1.y,this.x + this.p2.x,this.y + this.p2.y);
		g.popOpacity();
		g.popTransformation();
	}
	,__class__: mint_render_kha_visuals_Triangle
});
var mint_types_TextEventType = $hxClasses["mint.types.TextEventType"] = { __ename__ : true, __constructs__ : ["unknown","edit","input"] };
mint_types_TextEventType.unknown = ["unknown",0];
mint_types_TextEventType.unknown.toString = $estr;
mint_types_TextEventType.unknown.__enum__ = mint_types_TextEventType;
mint_types_TextEventType.edit = ["edit",1];
mint_types_TextEventType.edit.toString = $estr;
mint_types_TextEventType.edit.__enum__ = mint_types_TextEventType;
mint_types_TextEventType.input = ["input",2];
mint_types_TextEventType.input.toString = $estr;
mint_types_TextEventType.input.__enum__ = mint_types_TextEventType;
var mint_types_Helper = function() { };
$hxClasses["mint.types.Helper"] = mint_types_Helper;
mint_types_Helper.__name__ = true;
mint_types_Helper.clamp = function(value,a,b) {
	if(value < a) return a; else if(value > b) return b; else return value;
};
mint_types_Helper.in_rect = function(x,y,rx,ry,rw,rh) {
	if(x < rx) return false;
	if(y < ry) return false;
	if(x > rx + rw) return false;
	if(y > ry + rh) return false;
	return true;
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
$hxClasses.Array = Array;
Array.__name__ = true;
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
var ArrayBuffer = (Function("return typeof ArrayBuffer != 'undefined' ? ArrayBuffer : null"))() || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var Uint8Array = (Function("return typeof Uint8Array != 'undefined' ? Uint8Array : null"))() || js_html_compat_Uint8Array._new;
KhaMint.canvasDebug = "";
KhaMint.debugControlBounds = false;
haxe_Unserializer.DEFAULT_RESOLVER = Type;
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
kha_Assets.images = new kha_ImageList();
kha_Assets.sounds = new kha_SoundList();
kha_Assets.blobs = new kha_BlobList();
kha_Assets.fonts = new kha_FontList();
kha_Assets.videos = new kha_VideoList();
kha__$Color_Color_$Impl_$.Black = kha__$Color_Color_$Impl_$._new(-16777216);
kha__$Color_Color_$Impl_$.White = kha__$Color_Color_$Impl_$._new(-1);
kha__$Color_Color_$Impl_$.Red = kha__$Color_Color_$Impl_$._new(-65536);
kha__$Color_Color_$Impl_$.Blue = kha__$Color_Color_$Impl_$._new(-16776961);
kha__$Color_Color_$Impl_$.Green = kha__$Color_Color_$Impl_$._new(-16711936);
kha__$Color_Color_$Impl_$.Magenta = kha__$Color_Color_$Impl_$._new(-65281);
kha__$Color_Color_$Impl_$.Yellow = kha__$Color_Color_$Impl_$._new(-256);
kha__$Color_Color_$Impl_$.Cyan = kha__$Color_Color_$Impl_$._new(-16711681);
kha__$Color_Color_$Impl_$.Purple = kha__$Color_Color_$Impl_$._new(-8388480);
kha__$Color_Color_$Impl_$.Pink = kha__$Color_Color_$Impl_$._new(-16181);
kha__$Color_Color_$Impl_$.Orange = kha__$Color_Color_$Impl_$._new(-23296);
kha__$Color_Color_$Impl_$.invMaxChannelValue = 0.00392156862745098;
kha_FontStyle.Default = new kha_FontStyle(false,false,false);
kha_Scheduler.DIF_COUNT = 3;
kha_Scheduler.maxframetime = 0.5;
kha_Scheduler.startTime = 0;
kha_Scheduler.lastNow = 0;
kha_Shaders.painter_colored_fragData = "s202:I3ZlcnNpb24gMTAwCi8vIFVua25vd24gZXhlY3V0aW9uIG1vZGUKcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7CnZhcnlpbmcgdmVjNCBmcmFnbWVudENvbG9yOwoKCnZvaWQgbWFpbigpCnsKCWdsX0ZyYWdDb2xvciA9IGZyYWdtZW50Q29sb3I7CglyZXR1cm47Cn0KCg";
kha_Shaders.painter_colored_vertData = "s424:I3ZlcnNpb24gMTAwCnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0Owp1bmlmb3JtIG1hdDQgcHJvamVjdGlvbk1hdHJpeDsKYXR0cmlidXRlIHZlYzMgdmVydGV4UG9zaXRpb247CnZhcnlpbmcgdmVjNCBmcmFnbWVudENvbG9yOwphdHRyaWJ1dGUgdmVjNCB2ZXJ0ZXhDb2xvcjsKCgp2b2lkIG1haW4oKQp7CglnbF9Qb3NpdGlvbiA9IChwcm9qZWN0aW9uTWF0cml4ICogdmVjNCh2ZXJ0ZXhQb3NpdGlvblswXSwgdmVydGV4UG9zaXRpb25bMV0sIHZlcnRleFBvc2l0aW9uWzJdLCAxLjApKTsKCWZyYWdtZW50Q29sb3IgPSB2ZXJ0ZXhDb2xvcjsKCXJldHVybjsKfQoK";
kha_Shaders.painter_image_fragData = "s616:I3ZlcnNpb24gMTAwCi8vIFVua25vd24gZXhlY3V0aW9uIG1vZGUKcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7CnVuaWZvcm0gc2FtcGxlcjJEIHRleDsKdmFyeWluZyB2ZWMyIHRleENvb3JkOwp2YXJ5aW5nIHZlYzQgY29sb3I7CgoKdm9pZCBtYWluKCkKewoJdmVjNCB0ZXhjb2xvcjsKCXRleGNvbG9yID0gKHRleHR1cmUyRCh0ZXgsIHRleENvb3JkKSAqIGNvbG9yKTsKCXRleGNvbG9yID0gdmVjNCgodmVjMyh0ZXhjb2xvclswXSwgdGV4Y29sb3JbMV0sIHRleGNvbG9yWzJdKSAqIGNvbG9yWzNdKVswXSwgKHZlYzModGV4Y29sb3JbMF0sIHRleGNvbG9yWzFdLCB0ZXhjb2xvclsyXSkgKiBjb2xvclszXSlbMV0sICh2ZWMzKHRleGNvbG9yWzBdLCB0ZXhjb2xvclsxXSwgdGV4Y29sb3JbMl0pICogY29sb3JbM10pWzJdLCB0ZXhjb2xvclszXSk7CglnbF9GcmFnQ29sb3IgPSB0ZXhjb2xvcjsKCXJldHVybjsKfQoK";
kha_Shaders.painter_image_vertData = "s504:I3ZlcnNpb24gMTAwCnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0Owp1bmlmb3JtIG1hdDQgcHJvamVjdGlvbk1hdHJpeDsKYXR0cmlidXRlIHZlYzMgdmVydGV4UG9zaXRpb247CnZhcnlpbmcgdmVjMiB0ZXhDb29yZDsKYXR0cmlidXRlIHZlYzIgdGV4UG9zaXRpb247CnZhcnlpbmcgdmVjNCBjb2xvcjsKYXR0cmlidXRlIHZlYzQgdmVydGV4Q29sb3I7CgoKdm9pZCBtYWluKCkKewoJZ2xfUG9zaXRpb24gPSAocHJvamVjdGlvbk1hdHJpeCAqIHZlYzQodmVydGV4UG9zaXRpb25bMF0sIHZlcnRleFBvc2l0aW9uWzFdLCB2ZXJ0ZXhQb3NpdGlvblsyXSwgMS4wKSk7Cgl0ZXhDb29yZCA9IHRleFBvc2l0aW9uOwoJY29sb3IgPSB2ZXJ0ZXhDb2xvcjsKCXJldHVybjsKfQoK";
kha_Shaders.painter_text_fragData = "s570:I3ZlcnNpb24gMTAwCi8vIFVua25vd24gZXhlY3V0aW9uIG1vZGUKcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7CnZhcnlpbmcgdmVjNCBmcmFnbWVudENvbG9yOwp1bmlmb3JtIHNhbXBsZXIyRCB0ZXg7CnZhcnlpbmcgdmVjMiB0ZXhDb29yZDsKCgp2b2lkIG1haW4oKQp7CglnbF9GcmFnQ29sb3IgPSB2ZWM0KHZlYzMoZnJhZ21lbnRDb2xvclswXSwgZnJhZ21lbnRDb2xvclsxXSwgZnJhZ21lbnRDb2xvclsyXSlbMF0sIHZlYzMoZnJhZ21lbnRDb2xvclswXSwgZnJhZ21lbnRDb2xvclsxXSwgZnJhZ21lbnRDb2xvclsyXSlbMV0sIHZlYzMoZnJhZ21lbnRDb2xvclswXSwgZnJhZ21lbnRDb2xvclsxXSwgZnJhZ21lbnRDb2xvclsyXSlbMl0sICh0ZXh0dXJlMkQodGV4LCB0ZXhDb29yZClbMF0gKiBmcmFnbWVudENvbG9yWzNdKSk7CglyZXR1cm47Cn0KCg";
kha_Shaders.painter_text_vertData = "s526:I3ZlcnNpb24gMTAwCnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0Owp1bmlmb3JtIG1hdDQgcHJvamVjdGlvbk1hdHJpeDsKYXR0cmlidXRlIHZlYzMgdmVydGV4UG9zaXRpb247CnZhcnlpbmcgdmVjMiB0ZXhDb29yZDsKYXR0cmlidXRlIHZlYzIgdGV4UG9zaXRpb247CnZhcnlpbmcgdmVjNCBmcmFnbWVudENvbG9yOwphdHRyaWJ1dGUgdmVjNCB2ZXJ0ZXhDb2xvcjsKCgp2b2lkIG1haW4oKQp7CglnbF9Qb3NpdGlvbiA9IChwcm9qZWN0aW9uTWF0cml4ICogdmVjNCh2ZXJ0ZXhQb3NpdGlvblswXSwgdmVydGV4UG9zaXRpb25bMV0sIHZlcnRleFBvc2l0aW9uWzJdLCAxLjApKTsKCXRleENvb3JkID0gdGV4UG9zaXRpb247CglmcmFnbWVudENvbG9yID0gdmVydGV4Q29sb3I7CglyZXR1cm47Cn0KCg";
kha_Shaders.painter_video_fragData = "s616:I3ZlcnNpb24gMTAwCi8vIFVua25vd24gZXhlY3V0aW9uIG1vZGUKcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7CnVuaWZvcm0gc2FtcGxlcjJEIHRleDsKdmFyeWluZyB2ZWMyIHRleENvb3JkOwp2YXJ5aW5nIHZlYzQgY29sb3I7CgoKdm9pZCBtYWluKCkKewoJdmVjNCB0ZXhjb2xvcjsKCXRleGNvbG9yID0gKHRleHR1cmUyRCh0ZXgsIHRleENvb3JkKSAqIGNvbG9yKTsKCXRleGNvbG9yID0gdmVjNCgodmVjMyh0ZXhjb2xvclswXSwgdGV4Y29sb3JbMV0sIHRleGNvbG9yWzJdKSAqIGNvbG9yWzNdKVswXSwgKHZlYzModGV4Y29sb3JbMF0sIHRleGNvbG9yWzFdLCB0ZXhjb2xvclsyXSkgKiBjb2xvclszXSlbMV0sICh2ZWMzKHRleGNvbG9yWzBdLCB0ZXhjb2xvclsxXSwgdGV4Y29sb3JbMl0pICogY29sb3JbM10pWzJdLCB0ZXhjb2xvclszXSk7CglnbF9GcmFnQ29sb3IgPSB0ZXhjb2xvcjsKCXJldHVybjsKfQoK";
kha_Shaders.painter_video_vertData = "s504:I3ZlcnNpb24gMTAwCnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0Owp1bmlmb3JtIG1hdDQgcHJvamVjdGlvbk1hdHJpeDsKYXR0cmlidXRlIHZlYzMgdmVydGV4UG9zaXRpb247CnZhcnlpbmcgdmVjMiB0ZXhDb29yZDsKYXR0cmlidXRlIHZlYzIgdGV4UG9zaXRpb247CnZhcnlpbmcgdmVjNCBjb2xvcjsKYXR0cmlidXRlIHZlYzQgdmVydGV4Q29sb3I7CgoKdm9pZCBtYWluKCkKewoJZ2xfUG9zaXRpb24gPSAocHJvamVjdGlvbk1hdHJpeCAqIHZlYzQodmVydGV4UG9zaXRpb25bMF0sIHZlcnRleFBvc2l0aW9uWzFdLCB2ZXJ0ZXhQb3NpdGlvblsyXSwgMS4wKSk7Cgl0ZXhDb29yZCA9IHRleFBvc2l0aW9uOwoJY29sb3IgPSB2ZXJ0ZXhDb2xvcjsKCXJldHVybjsKfQoK";
kha_System.renderListeners = [];
kha_System.foregroundListeners = [];
kha_System.resumeListeners = [];
kha_System.pauseListeners = [];
kha_System.backgroundListeners = [];
kha_System.shutdownListeners = [];
kha_SystemImpl.maxGamepads = 4;
kha_SystemImpl.leftMouseCtrlDown = false;
kha_SystemImpl.lastFirstTouchX = 0;
kha_SystemImpl.lastFirstTouchY = 0;
kha_audio2_Audio1.channelCount = 16;
kha_audio2_ogg_tools_Crc32.POLY = 79764919;
kha_audio2_ogg_vorbis_VorbisDecodeState.INVALID_BITS = -1;
kha_audio2_ogg_vorbis_VorbisTools.EOP = -1;
kha_audio2_ogg_vorbis_VorbisTools.M__PI = 3.14159265358979323846264;
kha_audio2_ogg_vorbis_VorbisTools.DIVTAB_NUMER = 32;
kha_audio2_ogg_vorbis_VorbisTools.DIVTAB_DENOM = 64;
kha_audio2_ogg_vorbis_VorbisTools.INVERSE_DB_TABLE = [1.0649863e-07,1.1341951e-07,1.2079015e-07,1.2863978e-07,1.3699951e-07,1.4590251e-07,1.5538408e-07,1.6548181e-07,1.7623575e-07,1.8768855e-07,1.9988561e-07,2.1287530e-07,2.2670913e-07,2.4144197e-07,2.5713223e-07,2.7384213e-07,2.9163793e-07,3.1059021e-07,3.3077411e-07,3.5226968e-07,3.7516214e-07,3.9954229e-07,4.2550680e-07,4.5315863e-07,4.8260743e-07,5.1396998e-07,5.4737065e-07,5.8294187e-07,6.2082472e-07,6.6116941e-07,7.0413592e-07,7.4989464e-07,7.9862701e-07,8.5052630e-07,9.0579828e-07,9.6466216e-07,1.0273513e-06,1.0941144e-06,1.1652161e-06,1.2409384e-06,1.3215816e-06,1.4074654e-06,1.4989305e-06,1.5963394e-06,1.7000785e-06,1.8105592e-06,1.9282195e-06,2.0535261e-06,2.1869758e-06,2.3290978e-06,2.4804557e-06,2.6416497e-06,2.8133190e-06,2.9961443e-06,3.1908506e-06,3.3982101e-06,3.6190449e-06,3.8542308e-06,4.1047004e-06,4.3714470e-06,4.6555282e-06,4.9580707e-06,5.2802740e-06,5.6234160e-06,5.9888572e-06,6.3780469e-06,6.7925283e-06,7.2339451e-06,7.7040476e-06,8.2047000e-06,8.7378876e-06,9.3057248e-06,9.9104632e-06,1.0554501e-05,1.1240392e-05,1.1970856e-05,1.2748789e-05,1.3577278e-05,1.4459606e-05,1.5399272e-05,1.6400004e-05,1.7465768e-05,1.8600792e-05,1.9809576e-05,2.1096914e-05,2.2467911e-05,2.3928002e-05,2.5482978e-05,2.7139006e-05,2.8902651e-05,3.0780908e-05,3.2781225e-05,3.4911534e-05,3.7180282e-05,3.9596466e-05,4.2169667e-05,4.4910090e-05,4.7828601e-05,5.0936773e-05,5.4246931e-05,5.7772202e-05,6.1526565e-05,6.5524908e-05,6.9783085e-05,7.4317983e-05,7.9147585e-05,8.4291040e-05,8.9768747e-05,9.5602426e-05,0.00010181521,0.00010843174,0.00011547824,0.00012298267,0.00013097477,0.00013948625,0.00014855085,0.00015820453,0.00016848555,0.00017943469,0.00019109536,0.00020351382,0.00021673929,0.00023082423,0.00024582449,0.00026179955,0.00027881276,0.00029693158,0.00031622787,0.00033677814,0.00035866388,0.00038197188,0.00040679456,0.00043323036,0.00046138411,0.00049136745,0.00052329927,0.00055730621,0.00059352311,0.00063209358,0.00067317058,0.00071691700,0.00076350630,0.00081312324,0.00086596457,0.00092223983,0.00098217216,0.0010459992,0.0011139742,0.0011863665,0.0012634633,0.0013455702,0.0014330129,0.0015261382,0.0016253153,0.0017309374,0.0018434235,0.0019632195,0.0020908006,0.0022266726,0.0023713743,0.0025254795,0.0026895994,0.0028643847,0.0030505286,0.0032487691,0.0034598925,0.0036847358,0.0039241906,0.0041792066,0.0044507950,0.0047400328,0.0050480668,0.0053761186,0.0057254891,0.0060975636,0.0064938176,0.0069158225,0.0073652516,0.0078438871,0.0083536271,0.0088964928,0.009474637,0.010090352,0.010746080,0.011444421,0.012188144,0.012980198,0.013823725,0.014722068,0.015678791,0.016697687,0.017782797,0.018938423,0.020169149,0.021479854,0.022875735,0.024362330,0.025945531,0.027631618,0.029427276,0.031339626,0.033376252,0.035545228,0.037855157,0.040315199,0.042935108,0.045725273,0.048696758,0.051861348,0.055231591,0.058820850,0.062643361,0.066714279,0.071049749,0.075666962,0.080584227,0.085821044,0.091398179,0.097337747,0.10366330,0.11039993,0.11757434,0.12521498,0.13335215,0.14201813,0.15124727,0.16107617,0.17154380,0.18269168,0.19456402,0.20720788,0.22067342,0.23501402,0.25028656,0.26655159,0.28387361,0.30232132,0.32196786,0.34289114,0.36517414,0.38890521,0.41417847,0.44109412,0.46975890,0.50028648,0.53279791,0.56742212,0.60429640,0.64356699,0.68538959,0.72993007,0.77736504,0.82788260,0.88168307,0.9389798,1.0];
kha_audio2_ogg_vorbis_data_Codebook.NO_CODE = 255;
kha_audio2_ogg_vorbis_data_Codebook.delay = 0;
kha_audio2_ogg_vorbis_data_Header.PACKET_ID = 1;
kha_audio2_ogg_vorbis_data_Header.PACKET_COMMENT = 3;
kha_audio2_ogg_vorbis_data_Header.PACKET_SETUP = 5;
kha_audio2_ogg_vorbis_data_PageFlag.CONTINUED_PACKET = 1;
kha_audio2_ogg_vorbis_data_PageFlag.FIRST_PAGE = 2;
kha_audio2_ogg_vorbis_data_PageFlag.LAST_PAGE = 4;
kha_audio2_ogg_vorbis_data_Setting.MAX_CHANNELS = 16;
kha_audio2_ogg_vorbis_data_Setting.PUSHDATA_CRC_COUNT = 4;
kha_audio2_ogg_vorbis_data_Setting.FAST_HUFFMAN_LENGTH = 10;
kha_audio2_ogg_vorbis_data_Setting.FAST_HUFFMAN_TABLE_SIZE = 1024;
kha_audio2_ogg_vorbis_data_Setting.FAST_HUFFMAN_TABLE_MASK = 1023;
kha_graphics2_truetype_StbTruetype.STBTT_vmove = 1;
kha_graphics2_truetype_StbTruetype.STBTT_vline = 2;
kha_graphics2_truetype_StbTruetype.STBTT_vcurve = 3;
kha_graphics2_truetype_StbTruetype.STBTT_MACSTYLE_DONTCARE = 0;
kha_graphics2_truetype_StbTruetype.STBTT_MACSTYLE_BOLD = 1;
kha_graphics2_truetype_StbTruetype.STBTT_MACSTYLE_ITALIC = 2;
kha_graphics2_truetype_StbTruetype.STBTT_MACSTYLE_UNDERSCORE = 4;
kha_graphics2_truetype_StbTruetype.STBTT_MACSTYLE_NONE = 8;
kha_graphics2_truetype_StbTruetype.STBTT_PLATFORM_ID_UNICODE = 0;
kha_graphics2_truetype_StbTruetype.STBTT_PLATFORM_ID_MAC = 1;
kha_graphics2_truetype_StbTruetype.STBTT_PLATFORM_ID_ISO = 2;
kha_graphics2_truetype_StbTruetype.STBTT_PLATFORM_ID_MICROSOFT = 3;
kha_graphics2_truetype_StbTruetype.STBTT_UNICODE_EID_UNICODE_1_0 = 0;
kha_graphics2_truetype_StbTruetype.STBTT_UNICODE_EID_UNICODE_1_1 = 1;
kha_graphics2_truetype_StbTruetype.STBTT_UNICODE_EID_ISO_10646 = 2;
kha_graphics2_truetype_StbTruetype.STBTT_UNICODE_EID_UNICODE_2_0_BMP = 3;
kha_graphics2_truetype_StbTruetype.STBTT_UNICODE_EID_UNICODE_2_0_FULL = 4;
kha_graphics2_truetype_StbTruetype.STBTT_MS_EID_SYMBOL = 0;
kha_graphics2_truetype_StbTruetype.STBTT_MS_EID_UNICODE_BMP = 1;
kha_graphics2_truetype_StbTruetype.STBTT_MS_EID_SHIFTJIS = 2;
kha_graphics2_truetype_StbTruetype.STBTT_MS_EID_UNICODE_FULL = 10;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_EID_ROMAN = 0;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_EID_ARABIC = 4;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_EID_JAPANESE = 1;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_EID_HEBREW = 5;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_EID_CHINESE_TRAD = 2;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_EID_GREEK = 6;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_EID_KOREAN = 3;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_EID_RUSSIAN = 7;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_ENGLISH = 1033;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_ITALIAN = 1040;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_CHINESE = 2052;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_JAPANESE = 1041;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_DUTCH = 1043;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_KOREAN = 1042;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_FRENCH = 1036;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_RUSSIAN = 1049;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_GERMAN = 1031;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_SPANISH = 1033;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_HEBREW = 1037;
kha_graphics2_truetype_StbTruetype.STBTT_MS_LANG_SWEDISH = 1053;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_ENGLISH = 0;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_JAPANESE = 11;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_ARABIC = 12;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_KOREAN = 23;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_DUTCH = 4;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_RUSSIAN = 32;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_FRENCH = 1;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_SPANISH = 6;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_GERMAN = 2;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_SWEDISH = 5;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_HEBREW = 10;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_CHINESE_SIMPLIFIED = 33;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_ITALIAN = 3;
kha_graphics2_truetype_StbTruetype.STBTT_MAC_LANG_CHINESE_TRAD = 19;
kha_graphics2_truetype_StbTruetype.STBTT_MAX_OVERSAMPLE = 8;
kha_graphics2_truetype_StbTruetype.STBTT_RASTERIZER_VERSION = 2;
kha_graphics4_ImageShaderPainter.bufferSize = 1500;
kha_graphics4_ImageShaderPainter.vertexSize = 9;
kha_graphics4_ColoredShaderPainter.bufferSize = 100;
kha_graphics4_ColoredShaderPainter.triangleBufferSize = 100;
kha_graphics4_TextShaderPainter.bufferSize = 100;
kha_input_Gamepad.instances = [];
kha_input_Keyboard.__meta__ = { fields : { sendDownEvent : { input : null}, sendUpEvent : { input : null}}};
kha_input_Mouse.__meta__ = { fields : { sendDownEvent : { input : null}, sendUpEvent : { input : null}, sendMoveEvent : { input : null}, sendWheelEvent : { input : null}}};
kha_js_Sound.loading = new List();
kha_js_Video.loading = new List();
kha_math_FastMatrix3.width = 3;
kha_math_FastMatrix3.height = 3;
kha_math_FastMatrix4.width = 4;
kha_math_FastMatrix4.height = 4;
kha_math_Matrix3.width = 3;
kha_math_Matrix3.height = 3;
kha_math_Matrix4.width = 4;
kha_math_Matrix4.height = 4;
kha_network_ControllerBuilder.nextId = 0;
kha_network_Session.START = 0;
kha_network_Session.ENTITY_UPDATES = 1;
kha_network_Session.CONTROLLER_UPDATES = 2;
kha_network_Session.REMOTE_CALL = 3;
mint_core_unifill_Unicode.minCodePoint = 0;
mint_core_unifill_Unicode.maxCodePoint = 1114111;
mint_core_unifill_Unicode.minHighSurrogate = 55296;
mint_core_unifill_Unicode.maxHighSurrogate = 56319;
mint_core_unifill_Unicode.minLowSurrogate = 56320;
mint_core_unifill_Unicode.maxLowSurrogate = 57343;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);
