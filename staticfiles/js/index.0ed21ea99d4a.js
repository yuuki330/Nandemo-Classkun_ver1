let net;
const classifier = knnClassifier.create();
var webcamElement = document.getElementById('webcam');
var deviceid;
const WEBCAM_CONFIG = {facingMode: "environment"};

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // Create an object from Tensorflow.js data API which could capture image
  // from the web camera as Tensor.
  const webcam = await tf.data.webcam(webcamElement, WEBCAM_CONFIG);

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = async classId => {
    // Capture an image from the web camera.
    const img = await webcam.capture();

    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(img, true);

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
  };

  // When clicking a button, add an example for that class.
  document.getElementById('class-1').addEventListener('click', () => addExample(0));
  document.getElementById('class-2').addEventListener('click', () => addExample(1));
  document.getElementById('class-3').addEventListener('click', () => addExample(2));
  document.getElementById('class-4').addEventListener('click', () => addExample(3));
  document.getElementById('class-5').addEventListener('click', () => addExample(4));
  document.getElementById('SAVE').addEventListener('click', () => save());
  // document.getElementById('LOAD').addEventListener('click', () => load());

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidence from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['Level_1', 'Level2', 'Level3', 'Level4', 'Level5'];
      let probability;
      probability = Math.floor(result.confidences[result.label] * 100);
      document.getElementById('result').innerText = `
        予測: ${classes[result.label]}    確率: ${probability}%
      `;

      // Dispose the tensor to release the memory.
      img.dispose();
    }

    await tf.nextFrame();
    // await model.save('localstorage://my-model');
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
    // console.log(data);
    datasetObj[key] = Array.from(data); 
  });
  console.log(datasetObj);
  let jsonStr = JSON.stringify(datasetObj)
  //can be change to other source
  // console.log(jsonStr);
  // localStorage.setItem("myData", jsonStr);
  const blob = new Blob([jsonStr], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = 'save_model.txt';
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