// 表示用のCanvas
const canvas = document.getElementById("main-stream-canvas");
const ctx = canvas.getContext("2d");
// 画像処理用のオフスクリーンCanvas
const offscreen = document.createElement("canvas");
const offscreenCtx = offscreen.getContext("2d");
// カメラから映像を取得するためのvideo要素
const video = document.createElement("video");
video.setAttribute('playsinline', "");

const stream = await navigator.mediaDevices.getUserMedia({
  video: true
});

// const stream = navigator.mediaDevices.getUserMedia({
//     video: true
// });

video.srcObject = stream;
let model;


async function main() {
    console.log("model loading..");
	$("#console").html(`<li>model loading...</li>`);
	model=await tf.loadGraphModel(`https://raw.githubusercontent.com/yuuki330/tomato_model/master/tfjs/model.json`);
    // model=tf.loadGraphModel(`https://raw.githubusercontent.com/yuuki330/tomato_model/master/tfjs/model.json`);
	console.log("model loaded.");
    MODEL_HEIGHT  = model.inputs[0].shape[2];
    MODEL_WIDTH  = model.inputs[0].shape[3];
	$("#console").html(`<li>tomato_color trained model loaded.</li>`);

    // streamの読み込み完了
    video.onloadedmetadata = () => {
      video.play();
  
      // Canvasのサイズを映像に合わせる
      canvas.width = offscreen.width = video.videoWidth;
      canvas.height = offscreen.height = video.videoHeight;
    //   cut_x = (video.videoWidth/2)-100;
    //   cut_y = (video.videoHeight/2)-100;
    //   console.log(video.videoWidth);
    //   console.log(video.videoHeight);
  
      tick();
    };
  
    // 1フレームごとに呼び出される処理
    function tick() {
      // カメラの映像をCanvasに描画する
    //   offscreenCtx.drawImage(video, 0, 0);
      offscreenCtx.drawImage(video, 0, 0, 640, 640);

      predict();
  
      // 表示用Canvasに描画する
      ctx.drawImage(offscreen, 0, 0);
    //   ctx.strokeRect(cut_x, cut_y, 200, 200);
  
      // 次フレームを処理する
      window.requestAnimationFrame(tick);
    }

    async function predict(){
        let tensor = captureWebcam();
        var out = model.execute(tensor);
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
        offscreenCtx.font = '32px serif';
        var x;
        var y;

        offscreenCtx.lineWidth = 5;
        offscreenCtx.strokeStyle = "rgb(255, 0, 0)";
        offscreenCtx.textBaseline = 'center';
        offscreenCtx.textAlign = 'center';
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
            offscreenCtx.fillStyle = "rgb(0, 255, 255)";
            if(aa==0) {
                x = list1[i][0] + 50;
                y = list1[i][1] - 10;
                offscreenCtx.fillText(text.value, x, y);
                offscreenCtx.strokeRect(list1[i][0], list1[i][1], list1[i][2], list1[i][3]);
                console.log("1");
            }
        }
        
        offscreenCtx.lineWidth = 5;
        offscreenCtx.strokeStyle = "rgb(255, 102, 153)";
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
            offscreenCtx.fillStyle = "rgb(0, 255, 255)";
            if(aa==0) {
                x = list2[i][0] + 50;
                y = list2[i][1] - 10;
                offscreenCtx.fillText(text.value, x, y);
                offscreenCtx.strokeRect(list2[i][0], list2[i][1], list2[i][2], list2[i][3]);
                console.log("2");
            }
        }

        offscreenCtx.lineWidth = 5;
        offscreenCtx.strokeStyle = "rgb(255, 51, 0)";
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
            offscreenCtx.fillStyle = "rgb(0, 255, 255)";
            if(aa==0) {
                x = list3[i][0] + 50;
                y = list3[i][1] - 10;
                offscreenCtx.fillText(text.value, x, y);
                offscreenCtx.strokeRect(list3[i][0], list3[i][1], list3[i][2], list3[i][3]);
                console.log("3");
            }
        }

        offscreenCtx.lineWidth = 5;
        offscreenCtx.strokeStyle = "rgb(153, 255, 0)";
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
            offscreenCtx.fillStyle = "rgb(0, 255, 255)";
            if(aa==0) {
                x = list4[i][0] + 50;
                y = list4[i][1] - 10;
                offscreenCtx.fillText(text.value, x, y);
                offscreenCtx.strokeRect(list4[i][0], list4[i][1], list4[i][2], list4[i][3]);
                console.log("4");
            }
        }

        offscreenCtx.lineWidth = 5;
        offscreenCtx.strokeStyle = "rgb(0, 0, 255)";
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
            offscreenCtx.fillStyle = "rgb(0, 255, 255)";
            if(aa==0) {
                x = list5[i][0] + 50;
                y = list5[i][1] - 10;
                offscreenCtx.fillText(text.value, x, y);
                offscreenCtx.strokeRect(list5[i][0], list5[i][1], list5[i][2], list5[i][3]);
                console.log("5");
            }
        }
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
    

    function captureWebcam() {
        // ctx.drawImage(video, 0, 0, video.width, video.height);
        tensor_image = preprocessImage(offscreen);
    
        return tensor_image;
    }

    function preprocessImage(image){
        let tensor = tf.browser.fromPixels(image, 3).resizeBilinear([MODEL_HEIGHT,MODEL_WIDTH]).toFloat();	
        let offset = tf.scalar(255);
        imageTensor = tensor.div(offset).expandDims(0);
        imageTensor = imageTensor.transpose([0, 3, 1, 2]);
        return imageTensor;
    }

  }

    main();