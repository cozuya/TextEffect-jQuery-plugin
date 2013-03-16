TextEffect-jQuery-plugin
========================

A simple plugin with various effects you can apply to text, letter by letter.  Currently in ultra-super-alpha.

Basic usage: $(selector).textEffect({
  effect: //effect string,
  effectSpeed: //number
});

It effectively works by turning your original target into a big ole bunch of spans via building an array, and then replaces it on completion.

Current effects are fade, grow, and jumble.  Jumble takes an optional option of "jumbleColor".  Grow is not recommended at this time and needs some work.  Also, you need to pass an object originally, not a string or null.  Yeah.  And who the heck knows about browser support or any of that nonsense.
