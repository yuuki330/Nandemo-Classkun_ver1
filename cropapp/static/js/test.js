// let faceapi;
// // let video;
// let box;
// let parts;

// const isEmpty = (o) => o == undefined;

// const detectionOptions = {
//   withLandmarks: true,
//   withDescriptors: false,
// };

// function gotResult(err, result) {
//   if (err) {
//     box = null;
//     parts = null;
//     faceapi.detectSingle(gotResult);
//     return;
//   }

//   if (!result || result.length === 0) {
//     box = null;
//     parts = null;
//     return;
//   }

//   const { x, y, height, width } = result.detection.box;
//   box = {
//     x,
//     y,
//     width,
//     height,
//   };
//   parts = result.parts;
//   faceapi.detectSingle(gotResult);
// }

// const onModelReady = () => {
//   console.log("model ready");
//   faceapi.detectSingle(gotResult);
// };

// const drawVertices = (vertices) => {
//   vertices.forEach((t) => {
//     curveVertex(t._x, t._y);
//   });
// };

// // const video = document.getElementById("input_video"),
// //   constraints = {
// //     audio: false,
// //     video: {
// //       facingMode: {
// //         exact: "environment"
// //       }
// //     }
// //   };
// const video = document.getElementById("input_video"),
//   constraints = {
//     audio: false,
//     video: true,
//   };
// video.style.display = "none";

// navigator.mediaDevices
//   .getUserMedia(constraints)
//   .then(function (stream) {
//     video.srcObject = stream;
//     video.onloadedmetadata = function (e) {
//       video.play();
//     };
//   })
//   .catch(function (err) {
//     console.log(err.name + ": " + err.message);
//   });

// let videoImage;

// function setup() {
//   // createCanvas(windowWidth, windowHeight);
//   createCanvas(500, 400);
//   // video = createCapture(video);
//   // video.size(width, height);
//   // video.hide();
//   videoImage = createGraphics(width, height);
//   videoImage.drawingContext.drawImage(video, 0, 0);
//   videoImage2 = 
//   faceapi = ml5.faceApi(videoImage, detectionOptions, onModelReady);
//   // faceapi = ml5.faceApi(video, detectionOptions, onModelReady);
// }

// function draw() {
//   background(0);
//   videoImage.drawingContext.drawImage(video, 0, 0);
//   // videoImage.drawingContext.drawImage(video, 0, 0);
//   image(videoImage, 0, 0, width, height);

//   if (isEmpty(box) || isEmpty(parts)) {
//     return;
//   }

//   ellipse(
//     box.x + box.width / 2,
//     box.y + box.height / 2,
//     box.width * 1.2,
//     box.height * 1.2
//   );
//   const { leftEye, rightEye, mouth, nose } = parts;

//   strokeWeight(3);
//   stroke(50);
//   strokeCap(ROUND);
//   strokeJoin(ROUND);

//   beginShape();
//   drawVertices(leftEye);
//   endShape(CLOSE);

//   beginShape();
//   drawVertices(nose);
//   endShape(CLOSE);

//   beginShape();
//   drawVertices(mouth);
//   endShape(CLOSE);

//   beginShape();
//   drawVertices(rightEye);
//   endShape(CLOSE);
// }

/*ここから*/

// // const video = document.getElementById("input_video"),
// let video = document.getElementById("input_video"),
// constraints = {
//   audio: false,
//   video: {
//     facingMode: {
//       exact: "environment"
//     }
//   }
// };
// // constraints = {
// //   audio: false,
// //   video: true,
// // };
// video.style.display = "none";

// navigator.mediaDevices
//   .getUserMedia(constraints)
//   .then(function (stream) {
//     video.srcObject = stream;
//     video.onloadedmetadata = function (e) {
//       video.play();
//     };
//   })
//   .catch(function (err) {
//     console.log(err.name + ": " + err.message);
//   });

// let videoImage;

// function setup() {
//   createCanvas(500, 400);
//   // videoImage = createGraphics(width, height);
//   // video = createCapture(VIDEO);
// }

// function draw() {
//   background(0);

//   // videoImage.drawingContext.drawImage(video, 0, 0);
//   image(video, 0, 0);
// }

// /*モバイルネット*/
// let classifier;
// let video;
// let resultsP;

// function setup() {
//   noCanvas();
//   // Create a camera input
//   video = createCapture(VIDEO);
//   // Initialize the Image Classifier method with MobileNet and the video as the second argument
//   classifier = ml5.imageClassifier('MobileNet', video, modelReady);
//   resultsP = createP('Loading model and video...');
// }

// function modelReady() {
//   console.log('Model Ready');
//   classifyVideo();
// }

// // Get a prediction for the current video frame
// function classifyVideo() {
//   classifier.classify(gotResult);
// }

// // When we get a result
// function gotResult(err, results) {
//   // The results are in an array ordered by confidence.
//   resultsP.html(`${results[0].label  } ${nf(results[0].confidence, 0, 2)}`);
//   classifyVideo();
// }

/*COCO*/
// Copyright (c) 2020 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Object Detection using COCOSSD
This example uses a callback pattern to create the classifier
=== */

// let video;
// let detector;
// let detections = [];

// function setup() {
//   createCanvas(640, 480);
//   video = createCapture(VIDEO, videoReady);
//   video.size(640, 480);
//   video.hide();
// }

// function videoReady() {
//   // Models available are 'cocossd', 'yolo'
//   // detector = ml5.objectDetector('yolo', modelReady);
//   detector = ml5.objectDetector('../best_web_model/model.json', modelReady);
// }

// function gotDetections(error, results) {
//   if (error) {
//     console.error(error);
//   }
//   detections = results;
//   detector.detect(video, gotDetections);
// }

// function modelReady() {
//   detector.detect(video, gotDetections);
// }

// function draw() {
//   image(video, 0, 0);

//   for (let i = 0; i < detections.length; i += 1) {
//     const object = detections[i];
//     stroke(0, 255, 0);
//     strokeWeight(4);
//     noFill();
//     rect(object.x, object.y, object.width, object.height);
//     noStroke();
//     fill(255);
//     textSize(24);
//     text(object.label, object.x + 10, object.y + 24);
//   }
// }

window.onload = () => {
  var container = document.getElementById("container");
  var video  = document.getElementById("camera");
  video.style.maxWidth = container.clientWidth + "px";
  video.style.maxHeight = container.clientHeight + "px";
  var canvas, camera_canvas = null;
  var context, camera_context = null;

  const constraints = {
      audio: false,
      video: { facingMode: { exact: "environment" }
      }
  };

  navigator.mediaDevices.getUserMedia(constraints)
  .then( (stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
      video.play();
      // canvas
      canvas = document.getElementById("canvas");
      canvas.style.width = video.clientWidth + "px";
      canvas.style.height = video.clientHeight + "px";
      context = canvas.getContext("2d");
      camera_canvas = document.getElementById("camera_canvas");
      camera_canvas.style.width = video.clientWidth + "px";
      camera_canvas.style.height = video.clientHeight + "px";
      camera_context = camera_canvas.getContext("2d");
      };
  })
  .catch( (err) => {
      console.log(err.name + ": " + err.message);
  });

  cocoSsd.load().then(model => {
      setInterval(function(){detect(model, video, canvas, context)}, 250);
  });
  
  const detect = (model, video, canvas, context) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      camera_context.clearRect(0, 0, camera_canvas.width, camera_canvas.height);
      // video.pause();
      camera_context.drawImage(video, 0, 0, camera_canvas.width, camera_canvas.height);
      model.detect(camera_canvas).then(res => {
          // video.play();
          if(res.length == 0) return;
          for (var i = 0; i < res.length; i++) {
              var score = parseInt(res[i]["score"] * 100 ,10);
              drawRect(context, res[i].bbox[0], res[i].bbox[1], res[i].bbox[2], res[i].bbox[3], score)
              drawName(context, res[i]["class"], res[i].bbox[0], res[i].bbox[1], score);
          }
      });
  }
};
function drawRect(ctx, x, y, w, h, score) {
  ctx.beginPath();
  ctx.rect(parseInt(x, 10), parseInt(y, 10), parseInt(w, 10), parseInt(h, 10));
  ctx.lineWidth = 7.5;
  ctx.strokeStyle =  score < 75 ? "rgb(255, 255, 0)" : "rgb(50, 240, 60)";
  ctx.stroke();
  ctx.closePath();
}

function drawName(ctx, text, x, y, score) {
  ctx.beginPath();
  ctx.fillText(text + " : " + score + "%", parseInt(x, 10), parseInt(y, 10));
  ctx.fillStyle = "red";
  ctx.font = "10px serif";
  ctx.closePath();
}