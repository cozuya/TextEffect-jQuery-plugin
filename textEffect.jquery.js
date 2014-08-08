;
// jQuery text effect plugin created by Chris Ozols copywrite MIT license 2013
// v0.1.6
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {}
		F.prototype = obj;
		return new F();
	};
}
(function( $, window, document, undefined ) {
	"use strict";
	var TextEffect = {
		init: function (options, elem) {
			var _options = {};
			this.$elem = $(elem);
			this.oldText = this.$elem.html();
			if (typeof options === 'string') {
				_options.effect = options;
			} else {
				_options = options;
			}
			this.options = $.extend( {}, $.fn.textEffect.options, _options );
			this[this.options.effect]();
		},
		setup: function (effectOption) {
			this.textArray = [];
			this.$elem.html('');  // oddly jQuery.empty() doesn't work as well here.
			for (var i = 0; i < this.oldText.length; i++) {
				this.textArray[i] = "<span class='text-effect' style='" + effectOption + "'>" + this.oldText.substr(i, 1) + "</span>";
				this.$elem.append(this.textArray[i]);
			}
		},
		random: function () {
			var effects = ['grow', 'fade', 'jumble', 'slide', 'dropdown'];
			this[effects[(Math.floor(Math.random() * effects.length))]]();
		},
		slide: function () {
			var startPosition = (this.$elem.offset().left + this.$elem.width());
			this.setup('visibility: hidden; position: relative; left: ' + startPosition + 'px;');
			this.run('left', 0);
		},
		dropdown: function () {
			var offscreen = this.$elem.offset().top + this.$elem.height() * 1.1;  // little extra padding
			this.setup('position: relative; bottom: ' + offscreen + 'px;');
			this.run('bottom', 0);			
		},
		grow: function () {
			this.setup('font-size: 0px;');
			this.run('fontSize', this.$elem.css('fontSize'));
		},
		shrink: function () {
			this.setup('');
			this.run('fontSize', '0px');
		},
		fade: function () {
			this.setup(this.$elem[0].style.opacity !== undefined ? 'opacity: 0;' : 'filter: alpha(opacity=0); display: inline-block;');
			this.run('opacity', this.$elem.css('opacity'));
		},
		jumble: function () {
			var letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			var i = 0;
			this.setup();
			var jumbleEffectInterval = setInterval(function () {
				if (this.jumbleInterval) {
					clearInterval(this.jumbleInterval);
				}
				this.runJumble(letterArray, i);
				this.$elem.children('span.text-effect').eq(i).html(this.oldText.substr(i, 1)).css('color', this.$elem.css('color'));
				if (i === (this.oldText.length - 1)) {
					clearInterval(jumbleEffectInterval);
					this.reset();
				} else {
					i++;
				}
			}.bind(this), this.options.effectSpeed);
		},
		runJumble: function (letterArray, jumbleLength) {
			this.jumbleInterval = setInterval(function () {
				for (var i = (this.textArray.length - 1); i > jumbleLength; i--) {
					if (this.oldText.substr(i, 1) !== ' ') {
						this.$elem.children('span.text-effect').eq(i).html(letterArray[Math.floor(Math.random() * (letterArray.length - 1))]).css('color', this.options.jumbleColor);
					} else {
						this.$elem.children('span.text-effect').eq(i).html(' ');
					}
				}
			}.bind(this), 70);
		},
		run: function (effect, oldEffect) {
			var obj = {};
			var i = this.options.reverse ? this.textArray.length - 1 : 0;
			var $spans = this.$elem.children('span.text-effect');
			obj[effect] = oldEffect;
			var effectInterval = setInterval(function () {
				var self = this;
				$spans.eq(i).css('visibility', 'visible').animate(obj, this.options.completionSpeed / this.textArray.length, function () {
						if ($(this).index() === self.textArray.length - 1 && !self.options.reverse || self.options.reverse && $(this).index() === 0) {
							clearInterval(effectInterval);
							self.reset();
						}
					});
				if (this.options.reverse) {
					i--;
				} else {
					i++;
				}
			}.bind(this), this.options.effectSpeed);
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
		jumbleColor: '#7f7f7f',
		reverse: false
	};
})( jQuery, window, document );
