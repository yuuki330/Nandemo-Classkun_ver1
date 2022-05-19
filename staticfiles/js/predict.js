var MODEL_HEIGHT = 1;
var MODEL_WIDTH = 1;

var video = document.getElementById("main-stream-video");
var canvas = document.getElementById("main-stream-canvas");
var ctx = canvas.getContext('2d');
var deviceid;

var clientRect = video.getBoundingClientRect();
var x = window.pageXOffset + clientRect.left;
var y = window.pageYOffset + clientRect.top;

// 接続されているカメラとマイクのMediaStreamオブジェクトを取得する
navigator.mediaDevices.enumerateDevices().then(function(sourcesInfo) {
  // 取得できたカメラとマイクを含むデバイスからカメラだけをフィルターする
  var videoSroucesArray = sourcesInfo.filter(function(elem) {
      return elem.kind == 'videoinput';
  });
  // console.log(videoSroucesArray[0]["deviceId"]);
  deviceid = videoSroucesArray[0]["deviceId"];
});

loadModel() ;

//-----------------------
// start button event
//-----------------------

$("#camera1").click(function(){
	startWebcam1();

  // video.style.display = 'none';
  canvas.style.left = `${x}px`;
  canvas.style.top = `${y}px`;

  // setInterval(predict, 1000/30);
  setInterval(captureWebcam, 500);
});


//-----------------------
// predict button event
//-----------------------

$("#camera2").click(function(){
	startWebcam2();

  // video.style.display = 'none';
  canvas.style.left = `${x}px`;
  canvas.style.top = `${y}px`;

  // setInterval(predict, 1000/30);
  setInterval(predict, 500);
});

//-----------------------
// clear button event
//-----------------------

$("#clear-button").click(function clear() {
	// location.reload();
  predict();
});


const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

//-----------------------
// load model
//-----------------------

let model;
async function loadModel() {
	console.log("model loading..");
	$("#console").html(`<li>model loading...</li>`);
	model=await tf.loadGraphModel(`https://raw.githubusercontent.com/yuuki330/tomato_model/master/tfjs/model.json`);
	console.log("model loaded.");
  MODEL_HEIGHT  = model.inputs[0].shape[2];
  MODEL_WIDTH  = model.inputs[0].shape[3];
	$("#console").html(`<li>tomato_color trained model loaded.</li>`);
};

//-----------------------
// start webcam 
//-----------------------

function startWebcam1() {
	console.log("video streaming start.");
	$("#console").html(`<li>video streaming start.</li>`);
  console.log(deviceid);

  media = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      deviceId: deviceid,
    }
  }).then(function(stream) {
    video.srcObject = stream;
  });
}

function startWebcam2() {
	console.log("video streaming start.");
	$("#console").html(`<li>video streaming start.</li>`);
  console.log(deviceid);

  media = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "environment",
    }
  }).then(function(stream) {
    video.srcObject = stream;
  });
}



//-----------------------
// TensorFlow.js method
// predict tensor
//-----------------------

async function predict(){
	let tensor = captureWebcam();
  var out = model.execute(imageTensor);
  const o0 = out[3].arraySync();
  const OBJECT_TH = 0.4; // 物体検出の閾値
  const IOU_TH = 0.5; // ボックスの重なり具合閾値
  const bairitu_w = video.width/640;
  const bairitu_h = video.height/640;

  let a=0;

  var list1 = new Array();
  var list2 = new Array();
  var list3 = new Array();
  var list4 = new Array();
  var list5 = new Array();

  for (let i = 0; i < o0[0].length; i++) {
      if((o0[0][i][4]*o0[0][i][5])>OBJECT_TH){
          a = a+1;
          const dx = o0[0][i][2]*bairitu_w/2;
          const dy = o0[0][i][2]*bairitu_h/2;

          var ary = new Array();
          ary.push(o0[0][i][0]*bairitu_w - dx);
          ary.push(o0[0][i][1]*bairitu_h - dy);
          ary.push(o0[0][i][2]*bairitu_w);
          ary.push(o0[0][i][3]*bairitu_h);
          ary.push(o0[0][i][4]*o0[0][i][5]);

          list1.push(ary);
      }
      else if((o0[0][i][4]*o0[0][i][6])>OBJECT_TH){
          a = a+1;
          const dx = o0[0][i][2]*bairitu_w/2;
          const dy = o0[0][i][2]*bairitu_h/2;

          var ary = new Array();
          ary.push(o0[0][i][0]*bairitu_w - dx);
          ary.push(o0[0][i][1]*bairitu_h - dy);
          ary.push(o0[0][i][2]*bairitu_w);
          ary.push(o0[0][i][3]*bairitu_h);
          ary.push(o0[0][i][4]*o0[0][i][6]);

          list2.push(ary);
      }
      else if((o0[0][i][4]*o0[0][i][7])>OBJECT_TH){
          a = a+1;
          const dx = o0[0][i][2]*bairitu_w/2;
          const dy = o0[0][i][2]*bairitu_h/2;

          var ary = new Array();
          ary.push(o0[0][i][0]*bairitu_w - dx);
          ary.push(o0[0][i][1]*bairitu_h - dy);
          ary.push(o0[0][i][2]*bairitu_w);
          ary.push(o0[0][i][3]*bairitu_h);
          ary.push(o0[0][i][4]*o0[0][i][7]);

          list3.push(ary);
      }
      else if((o0[0][i][4]*o0[0][i][8])>OBJECT_TH){
          a = a+1;
          const dx = o0[0][i][2]*bairitu_w/2;
          const dy = o0[0][i][2]*bairitu_h/2;

          var ary = new Array();
          ary.push(o0[0][i][0]*bairitu_w - dx);
          ary.push(o0[0][i][1]*bairitu_h - dy);
          ary.push(o0[0][i][2]*bairitu_w);
          ary.push(o0[0][i][3]*bairitu_h);
          ary.push(o0[0][i][4]*o0[0][i][8]);

          list4.push(ary);
      }
      else if((o0[0][i][4]*o0[0][i][9])>OBJECT_TH){
          a = a+1;
          const dx = o0[0][i][2]*bairitu_w/2;
          const dy = o0[0][i][2]*bairitu_h/2;

          var ary = new Array();
          ary.push(o0[0][i][0]*bairitu_w - dx);
          ary.push(o0[0][i][1]*bairitu_h - dy);
          ary.push(o0[0][i][2]*bairitu_w);
          ary.push(o0[0][i][3]*bairitu_h);
          ary.push(o0[0][i][4]*o0[0][i][9]);

          list5.push(ary);
      }
      else{

      }
  }

  list1.sort(function(a,b){return(a[4] - b[4]);});
  list2.sort(function(a,b){return(a[4] - b[4]);});
  list3.sort(function(a,b){return(a[4] - b[4]);});
  list4.sort(function(a,b){return(a[4] - b[4]);});
  list5.sort(function(a,b){return(a[4] - b[4]);});
  
  var text = document.createElement('p');
  ctx.font = '32px serif';
  var x;
  var y;

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgb(255, 0, 0)";
  ctx.textBaseline = 'center';
  ctx.textAlign = 'center';
  text.value = "Level_1"

  for (let i = 0; i < list1.length; i++) {
      let aa = 0;
      for(let j = i+1; j< list1.length; j++) {
          var iou = bbox_iou(list1[i], list1[j]);
          if(iou > IOU_TH) {
              aa = 1;
              break;
          }
      }
      ctx.fillStyle = "rgb(0, 255, 255)";
      if(aa==0) {
          x = list1[i][0] + 50;
          y = list1[i][1] - 10;
          ctx.fillText(text.value, x, y);
          ctx.strokeRect(list1[i][0], list1[i][1], list1[i][2], list1[i][3]);
          console.log("1");
      }
  }
  
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgb(255, 102, 153)";
  text.value = "Level_2"

  for (let i = 0; i < list2.length; i++) {
      let aa = 0;
      for(let j = i+1; j< list2.length; j++) {
          var iou = bbox_iou(list2[i], list2[j]);
          if(iou > IOU_TH) {
              aa = 1;
              break;
          }
      }
      ctx.fillStyle = "rgb(0, 255, 255)";
      if(aa==0) {
          x = list2[i][0] + 50;
        y = list2[i][1] - 10;
          ctx.fillText(text.value, x, y);
          ctx.strokeRect(list2[i][0], list2[i][1], list2[i][2], list2[i][3]);
          console.log("2");
      }
  }

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgb(255, 51, 0)";
  text.value = "Level_3"

  for (let i = 0; i < list3.length; i++) {
      let aa = 0;
      for(let j = i+1; j< list3.length; j++) {
          var iou = bbox_iou(list3[i], list3[j]);
          if(iou > IOU_TH) {
              aa = 1;
              break;
          }
      }
      ctx.fillStyle = "rgb(0, 255, 255)";
      if(aa==0) {
          x = list3[i][0] + 50;
        y = list3[i][1] - 10;
          ctx.fillText(text.value, x, y);
          ctx.strokeRect(list3[i][0], list3[i][1], list3[i][2], list3[i][3]);
          console.log("3");
      }
  }

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgb(153, 255, 0)";
  text.value = "Level_4"

  for (let i = 0; i < list4.length; i++) {
      let aa = 0;
      for(let j = i+1; j< list4.length; j++) {
          var iou = bbox_iou(list4[i], list4[j]);
          if(iou > IOU_TH) {
              aa = 1;
              break;
          }
      }
      ctx.fillStyle = "rgb(0, 255, 255)";
      if(aa==0) {
          x = list4[i][0] + 50;
        y = list4[i][1] - 10;
          ctx.fillText(text.value, x, y);
          ctx.strokeRect(list4[i][0], list4[i][1], list4[i][2], list4[i][3]);
          console.log("4");
      }
  }

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgb(0, 0, 255)";
  text.value = "Level_5"

  for (let i = 0; i < list5.length; i++) {
      let aa = 0;
      for(let j = i+1; j< list5.length; j++) {
          var iou = bbox_iou(list5[i], list5[j]);
          if(iou > IOU_TH) {
              aa = 1;
              break;
          }
      }
      ctx.fillStyle = "rgb(0, 255, 255)";
      if(aa==0) {
          x = list5[i][0] + 50;
        y = list5[i][1] - 10;
          ctx.fillText(text.value, x, y);
          ctx.strokeRect(list5[i][0], list5[i][1], list5[i][2], list5[i][3]);
          console.log("5");
      }
  }
  await sleep( 2000 );
}

function bbox_iou(box1, box2){
  xs1 = Math.max(box1[0], box2[0]);
  ys1 = Math.max(box1[1], box2[1]);
  xs2 = Math.min(box1[0] + box1[2], box2[0] + box2[2]);
  ys2 = Math.min(box1[1] + box1[3], box2[1] + box2[3]);

  intersections  = Math.max(ys2 - ys1, 0) * Math.max(xs2 - xs1, 0);

  unions = (box1[2] * box1[3]) + (box2[2] * box2[3]) - intersections;

  ious = intersections / unions;

  return ious;
}

//------------------------------
// capture streaming video 
// to a canvas object
//------------------------------

function captureWebcam() {
	canvas.width  = video.width;
	canvas.height = video.height;

  ctx.drawImage(video, 0, 0, 640, 640);
	tensor_image = preprocessImage(canvas);

	return tensor_image;
}

//-----------------------
// TensorFlow.js method
// image to tensor
//-----------------------

function preprocessImage(image){
	let tensor = tf.browser.fromPixels(image, 3).resizeBilinear([MODEL_HEIGHT,MODEL_WIDTH]).toFloat();	
  let offset = tf.scalar(255);
  imageTensor = tensor.div(offset).expandDims(0);
  imageTensor = imageTensor.transpose([0, 3, 1, 2]);
  return imageTensor;
}
