// 初期化
/* 
net           : mobilenetの学習済みモデルを格納
classifier    : 分類器を格納(knn分類器)
webcamElement : webcamの要素を格納
WEBCAM_CONFIG : フロントカメラ(user)・リアカメラ(environment)切り替え
*/

let net;
const classifier = knnClassifier.create();
var webcamElement = document.getElementById('webcam');
//var deviceid;
const WEBCAM_CONFIG = {facingMode: "environment"};

async function app() {
  console.log('Loading mobilenet..');

  // mobilenetのモデル読み込み
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // ウェブカメラの映像をキャプチャし、テンソルとして格納
  const webcam = await tf.data.webcam(webcamElement, WEBCAM_CONFIG);

  // ウェブカメラから読み出した画像を特定のクラス番号と結びつける
  const addExample = async classId => {
    // ウェブカメラの映像をキャプチャ
    const img = await webcam.capture();

    // mobilenetの学習モデルの出力層にKNN分類器を接続(転移学習)
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);

    // メモリ確保のためにテンソルデータを削除
    img.dispose();
  };

  // ボタンが押されたときに、それぞれのクラスに学習させる機能を追加
  document.getElementById('class-1').addEventListener('click', () => addExample(0));
  document.getElementById('class-2').addEventListener('click', () => addExample(1));
  document.getElementById('class-3').addEventListener('click', () => addExample(2));
  document.getElementById('class-4').addEventListener('click', () => addExample(3));
  document.getElementById('class-5').addEventListener('click', () => addExample(4));
  document.getElementById('SAVE').addEventListener('click', () => save());

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();

      // ウェブカメラの映像をキャプチャし、推論を行う
      const activation = net.infer(img, 'conv_preds');
      const result = await classifier.predictClass(activation);

      // 推論から予測される結果を確率と共に表示
      const classes = ['Level_1', 'Level2', 'Level3', 'Level4', 'Level5'];
      let probability;
      probability = Math.floor(result.confidences[result.label] * 100);
      document.getElementById('result').innerText = `
        予測: ${classes[result.label]}    確率: ${probability}%
      `;

      // メモリ確保のためにテンソルデータを削除
      img.dispose();
    }

    // 画面更新の度にこの関数を動かす
    await tf.nextFrame();
  }
};


async function save() {
  let dataset = classifier.getClassifierDataset()
  console.log(dataset);
  var datasetObj = {0:'A', 1:'B', 2:'C'}
  Object.keys(dataset).forEach((key) => {
    let data = dataset[key].dataSync();
    // use Array.from() so when JSON.stringify() it covert to an array string e.g [0.1,-0.2...] 
    // instead of object e.g {0:"0.1", 1:"-0.2"...}
    console.log(data);
    datasetObj[key] = Array.from(data); 
  });
  console.log(datasetObj);
  let jsonStr = JSON.stringify(datasetObj)
  //can be change to other source
  console.log(jsonStr);
  // localStorage.setItem("myData", jsonStr);
  const blob = new Blob([jsonStr], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  let fname = document.getElementById('fname').value;
  // a.download = 'save_model.txt';
  a.download = fname + ".txt";
  a.href = url;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function load(fileReader) {
  //can be change to other source
 let dataset = fileReader.result;
//  console.log(dataset);
 let tensorObj = JSON.parse(dataset)
 console.log(tensorObj); 
 //covert back to tensor
 Object.keys(tensorObj).forEach((key) => {
  tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024])
  // tensorObj[key] = tf.tensor(tensorObj[key])
  console.log(tensorObj[key]); 
  // tensorObj[key] = tensorObj[key].reshape([3, 1024])
  // console.log(tensorObj[key]); 
 })
//  console.log(tensorObj);
 classifier.setClassifierDataset(tensorObj);
}

let fileInput = document.getElementById('file');
let fileReader = new FileReader();
fileInput.onchange = () => {
  let file = fileInput.files[0];
  console.log(file.name);
  console.log(file.size);
  console.log(file.type);
  fileReader.readAsText(file);
};

fileReader.onload = () => load(fileReader);

app();