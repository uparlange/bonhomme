const fs = require('fs');
fs.copyFileSync('./node_modules/pixi.js/dist/pixi.min.js', './app/js/vendors/pixi.min.js');
fs.copyFileSync('./node_modules/pixi-plugin-bump/bin/pixi-bump.min.js', './app/js/vendors/pixi-bump.min.js');
fs.copyFileSync('./node_modules/pixi-sound/dist/pixi-sound.js', './app/js/vendors/pixi-sound.min.js');