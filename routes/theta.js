var express = require('express');
var router = express.Router();
var Theta = require('ricoh-theta');
var fs = require('fs');


var im = require('imagemagick');
var public_theta_dir='./public/images/theta/';
var speech_balloon_image_dir='./resource/';
var out_dir=public_theta_dir;


var cronJob = require('cron').CronJob;
 
// 毎秒実行
var cronTime = "*/30 * * * * *";
 
// 一度だけ実行したい場合、Dateオブジェクトで指定も可能
// var cronTime = new Date();
 
var job = new cronJob({
  //実行したい日時 or crontab書式
  cronTime: cronTime
 
  //指定時に実行したい関数
  , onTick: function() {
    console.log('onTick!');
 
//ジョブ開始

try{
var theta = new Theta();

theta.connect('192.168.1.1');

// capture
theta.on('connect', function(){
  theta.capture(function(err){
    if(err) return console.error(err);
    console.log('capture success');
  });
});

// get picture
theta.on('objectAdded', function(object_id){
	theta.getPicture(object_id, function(err, picture){
		var savefilename='public/images/theta/current.jpg';
		var temp_filename=savefilename+".temp.jpg";
		fs.writeFile(temp_filename, picture, function(err){
			console.log('picture saved => .jpg');
			theta.disconnect();

			//var theta_imagepath=public_theta_dir + 'current.jpg';
			var theta_imagepath=temp_filename;
			var speech_balloon_imagepath= speech_balloon_image_dir + 'speechballoon_gomi_nashi.png';
			//var outfile=out_dir + 'out.jpg';
			var outfile=savefilename;//overwrite
			var sb_pos='600x600-100+200';//widthxheight+left+top(from center)

			im.convert([theta_imagepath, speech_balloon_imagepath, 
				'-gravity','center','-geometry', sb_pos,'-composite',outfile], 
				function(err, metadata){
					if (err) throw err;
					console.log("save end");
				});
		});
	});
});

}catch( e ){
  console.log( e );

}


  }
 
  //ジョブの完了または停止時に実行する関数 
  , onComplete: function() {
    console.log('onComplete!')
  }
 
  // コンストラクタを終する前にジョブを開始するかどうか
  , start: false
   
  //タイムゾーン
  , timeZone: "Japan/Tokyo"
})

job.start();

//}

module.exports = router;
