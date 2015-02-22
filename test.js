var im = require('imagemagick');

var public_theta_dir='./public/images/theta/';
var theta_imagepath=public_theta_dir + 'current.jpg';
var speech_balloon_image_dir='./resource/';
var speech_balloon_imagepath= speech_balloon_image_dir + 'speechballoon_gomi_nashi.png';
var out_dir=public_theta_dir;
var outfile=out_dir + 'out.jpg';
var sb_pos='600x600-100+200';

im.convert([theta_imagepath, speech_balloon_imagepath, 
'-gravity','center','-geometry', sb_pos,'-composite',outfile], 
function(err, metadata){
	if (err) throw err;
	console.log("end");
});


