;

// jQuery text effect plugin created by Chris Ozols copywrite MIT license
// v0.12

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
			var _options = {};
			this.$elem = $(elem);
			this.oldText = this.$elem.html();
			typeof options === 'string' ? _options.effect = options : _options = options;
			this.options = $.extend( {}, $.fn.textEffect.options, _options );
			this.whichEffect(this.options.effect);
		},

		whichEffect: function (effect) {
			switch (effect) {
				case 'grow':
					this.grow();
					break;
				case 'fade':
					this.fade();
					break;
				case 'jumble':
					this.jumble();
					break;
				case 'slide':
					this.slide();
					break;
				case 'dropdown':
					this.dropdown();
					break;
				case 'random':
					this.random();
					break;
			}
		},

		setup: function (effectOption) {
			this.textArray = [];
			this.innerArray = [];
			for (var i = 0; i < this.oldText.length; i++) {
				this.innerArray[i] = this.$elem.html().substr(i, 1);
				this.textArray[i] = "<span class='text-effect' style='" + effectOption + "'>" + this.innerArray[i] + "</span>";
			}
			this.$elem.html('');
			for (var i = 0; i < this.textArray.length; i++) {
				this.$elem.append(this.textArray[i]);
			}
		},

		random: function () {
			var effects = ['grow', 'fade', 'jumble', 'slide', 'dropdown'];
			var effect = effects[(Math.floor(Math.random() * effects.length))];
			this.whichEffect(effect);
		},

		slide: function () {
			var startPosition = (this.$elem.offset().left + this.$elem.width());
			this.setup('visibility: hidden; position: relative; left: ' + startPosition + 'px;');
			this.apply('left', 0);
		},

		dropdown: function () {
			var offscreen = this.$elem.offset().top + this.$elem.height() * 1.1;  // little extra padding
			this.setup('position: relative; bottom: ' + offscreen + 'px;');
			this.apply('bottom', 0);			
		},

		grow: function () {
			this.setup('font-size: 0px;');
			this.apply('fontSize', this.$elem.css('fontSize'));
		},

		fade: function () {
			// object.style.filter = "progid:DXImageTransform.Microsoft.Alpha(sProperties)"
			// object.filters.item("DXImageTransform.Microsoft.Alpha").Opacity [ = iOpacity ]
			this.setup('opacity: 0;');
			this.apply('opacity', this.$elem.css('opacity'));
		},

		jumble: function () {
			var self = this;
			var letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			var ii = 0;
			this.setup();
			var jumbleEffectInterval = setInterval(function () {
				if (self.jumbleInterval) {
					clearInterval(self.jumbleInterval);
				}
				self.jumbleIt(letterArray, ii);
				self.$elem.children('span.text-effect').eq(ii).html(self.innerArray[ii]).css('color', self.$elem.css('color'));
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
			this.jumbleInterval = setInterval(function () {
				for (var i = (self.textArray.length - 1); i > jumbleLength; i--) {
					if (self.innerArray[i] !== ' ') {
						self.$elem.children('span.text-effect').eq(i).html(letterArray[Math.floor(Math.random() * (letterArray.length - 1))]).css('color', self.options.jumbleColor);
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
			var $spans = self.$elem.children('span.text-effect');
			var effectInterval = setInterval(function () {
				$spans.eq(i).css('visibility', 'visible').animate(obj, self.options.completionSpeed / self.textArray.length, function () {
						if ($(this).index() === self.textArray.length - 1) {
							clearInterval(effectInterval);
							self.reset();
						}
					});
				i++;
			}, self.options.effectSpeed);
		},

		reset: function () {
			this.$elem.html(this.oldText);
		}
	};

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
	};
})( jQuery, window, document );
