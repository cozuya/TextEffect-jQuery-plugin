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
				// self.effect = options;
			} else {
				self.options = $.extend( {}, $.fn.textEffect.options, options );
			}
			self.toArray();
		},

		toArray: function () {
			var self = this;
			self.textArray = [];
			self.innerArray = [];
			for (i = 0; i < self.$elem.html().length; i++) {
				self.textArray[i] = "<span class='text-effect'>" + self.$elem.html().substr(i, 1) + "</span>";
				self.innerArray[i] = self.$elem.html().substr(i, 1);
			}

			switch (self.options.effect) {
				case 'grow':
					self.grow();
					break;
				case 'fade':
					self.fade();
					break;
				case 'jumble':
					self.jumble();
					break;
			}
		},

		append: function () {
			var self = this;
			for (i = 0; i < self.textArray.length; i++) {
				self.$elem.append(self.textArray[i]);
			}
		},

		grow: function () {
			var self = this;
			var textSize = self.$elem.css('fontSize');

			self.$elem.html('');		
			self.$elem.css('fontSize', '0px');
			self.append();
			self.apply('fontSize', textSize);
		},

		fade: function () {
			var self = this;
			var oldOpacity = self.$elem.css('opacity');
			self.$elem.html('');
			self.append();
			self.$elem.children('span.text-effect').css('opacity', '0');
			var i = 0;
			self.apply('opacity', oldOpacity);
		},

		jumble: function () {
			var self = this;
			var letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			var ii = 0;
			var oldColor = self.$elem.css('color');
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
							self.reset();
							clearInterval(effectInterval);
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

	$.fn.textEffect = function( options ) {
		return this.each(function() {
			var texteffect = Object.create(TextEffect);
			texteffect.init(options, this);
		});
	};

	$.fn.textEffect.options = {
		effect: 'fade',
		effectSpeed: 150,
		completionSpeed: 6000,
		jumbleColor: '#7f7f7f'
	}
})( jQuery, window, document );
