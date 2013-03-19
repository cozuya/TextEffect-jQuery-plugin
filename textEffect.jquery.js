if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {

	var TextEffect = {
		init: function (options, elem) {
			var self = this;
			self.elem = elem;
			self.$elem = $(elem);
			self.oldText = self.$elem.html();

			if (typeof options === 'string') {
				var json = '{"effect": "' + options + '"}';
				options = $.parseJSON(json);
			}

			self.options = $.extend( {}, $.fn.textEffect.options, options );

			self.whichEffect(self.options.effect);
		},

		whichEffect: function (toSwitch) {
			var self = this;
			switch (toSwitch) {
				case 'grow':
					self.grow();
					break;
				case 'fade':
					self.fade();
					break;
				case 'jumble':
					self.jumble();
					break;
				case 'slide':
					self.slide();
					break;
				case 'dropdown':
					self.dropdown();
					break;
				case 'random':
					self.random();
					break;
				default:
					self.random();
					break;
			}
		},

		toArray: function (effectOption) {
			var self = this;
			self.textArray = [];
			self.innerArray = [];
			for (i = 0; i < self.oldText.length; i++) {
				self.innerArray[i] = self.$elem.html().substr(i, 1);
				self.textArray[i] = "<span class='text-effect' style='" + effectOption + "'>" + self.innerArray[i] + "</span>";
			}
		},

		append: function () {
			var self = this;
			for (i = 0; i < self.textArray.length; i++) {
				self.$elem.append(self.textArray[i]);
			}
		},

		random: function () {
			var self = this;
			var effects = ['grow', 'fade', 'jumble', 'slide', 'dropdown'];
			var effect = effects[(Math.floor(Math.random() * effects.length))];
			self.whichEffect(effect);
		},

		slide: function () {
			var self = this;
			var oldPosition = self.$elem.css('position');
			var offscreen = self.$elem.offset().left + self.$elem.width();
			self.toArray('position: relative; left: ' + offscreen + 'px;');
			self.$elem.html('');
			self.append();
			self.apply('left', 0);
		},

		dropdown: function () {
			var self = this;
			var oldPosition = self.$elem.css('position');
			var offscreen = self.$elem.offset().top + self.$elem.height();
			self.toArray('position: relative; bottom: ' + offscreen + 'px;');
			self.$elem.html('');
			self.append();
			self.apply('bottom', 0);			
		},

		grow: function () {
			var self = this;
			var oldTextSize = self.$elem.css('fontSize');
			self.toArray('font-size: 0px;');
			self.$elem.html('');		
			self.append();
			self.apply('fontSize', oldTextSize);
		},

		fade: function () {
			var self = this;

			// object.style.filter = "progid:DXImageTransform.Microsoft.Alpha(sProperties)"

			// object.filters.item("DXImageTransform.Microsoft.Alpha").Opacity [ = iOpacity ]

			var oldOpacity = self.$elem.css('opacity');
			self.toArray('opacity: 0;');
			self.$elem.html('');
			self.append();
			self.apply('opacity', oldOpacity);
		},

		jumble: function () {
			var self = this;
			var letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			var ii = 0;
			var oldColor = self.$elem.css('color');
			self.toArray();
			self.$elem.html('');
			self.append();
			var jumbleEffectInterval = setInterval(function () {
				if (self.jumbleInterval) {
					clearInterval(self.jumbleInterval);
				}
				self.jumbleIt(letterArray, ii);
				self.$elem.children('span.text-effect').eq(ii).html(self.innerArray[ii]).css('color', oldColor);
				if (ii === (self.innerArray.length - 1)) {
					clearInterval(jumbleEffectInterval);
					self.reset();
				} else {
					ii++;
				}
			}, self.options.effectSpeed);
		},

		jumbleIt: function (letterArray, jumbleLength) {
			var self = this;
			self.jumbleInterval = setInterval(function () {
				for (var i = (self.textArray.length - 1); i > jumbleLength; i--) {
					if (self.innerArray[i] !==' ') {
						self.$elem.children('span.text-effect').eq(i).html(letterArray[Math.floor(Math.random() * 35)]).css('color', self.options.jumbleColor);
					} else {
						self.$elem.children('span.text-effect').eq(i).html(' ');
					}
				}
			}, 70);
		},

		apply: function (effect, oldEffect) {
			var self = this;
			var obj = {};
			obj[effect] = oldEffect;
			var i = 0;
			var effectInterval = setInterval(function () {
				self.$elem.children('span').eq(i).animate(obj, self.options.completionSpeed / self.textArray.length, function () {
						if (i === (self.$elem.children('span.text-effect').length)) {
							clearInterval(effectInterval);
							setTimeout(function () {
								self.reset();								
							}, self.options.effectSpeed * 3);
						}
					});
				i++;
			}, self.options.effectSpeed);
		},

		reset: function () {
			var self = this;
			self.$elem.html(self.oldText);
		}
	}

	$.fn.textEffect = function(options) {
		return this.each(function() {
			var texteffect = Object.create(TextEffect);
			texteffect.init(options, this);
		});
	};

	$.fn.textEffect.options = {
		effect: 'random',
		effectSpeed: 150,
		completionSpeed: 6000,
		jumbleColor: '#7f7f7f'
	}
})( jQuery, window, document );
