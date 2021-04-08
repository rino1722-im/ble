let device = null;
let chracteristics = null;
let isConnectted = false;

async function onButtonClick()
{
  let serviceUuid =        "28a9e388-2cc8-46f1-a125-a5b17860411f"
  let characteristicUuid = "f1445c0c-a803-4ca7-abeb-651ac724c103"

  try {
    console.log('Requesting Bluetooth Device...');
    device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [serviceUuid] },
        { name: ["m5stack-bbled"] },
      ],
    });
  
    console.log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    console.log('Getting Service...');
    const service = await server.getPrimaryService(serviceUuid);

    console.log('Getting Characteristics...');
    characteristics = await service.getCharacteristics(characteristicUuid);

    isConnected = true;

    if (characteristics.length > 0) {
      const myCharacteristic = characteristics[0];

      console.log('Reading Characteristics...');
      const value = await myCharacteristic.readValue();
      const decoder = new TextDecoder('utf-8');
      console.log(decoder.decode(value));

      const encoder = new TextEncoder('utf-8');
      const text = 'hi!';

      await myCharacteristic.writeValue(encoder.encode(text));
      await myCharacteristic.startNotifications();

//データの受け取り     
      myCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const decoder = new TextDecoder('utf-8');
        console.log(decoder.decode(value));//コンソールログに表示
      });

      console.log('Waiting 60 seconds to receive data from the device...')
      await sleep(100 * 1000);//oo秒間接続
    }
  } catch(error) {
    console.log('Argh! ' + error);
  }
  
  if (device) {
    if (device.gatt.connected) {
      device.gatt.disconnect();
      console.log('disconnect');
      isConnected = false;
    }
  }
}

/*function sendData(e)//データ送信の設定
{
  if ( isConnected && characteristics != null ){
    if ( characteristics[0] != null ){

      const encoder = new TextEncoder('utf-8');
      let ch = characteristics[0];
      ch.writeValue(encoder.encode("Right")).then(
        char => {ch.startNotifications();}
      );
    }
  }
}

let btn = document.getElementById('send_button');
btn.addEventListener('click',sendData );*/

function sendData(e){//データ送信の設定
  if ( isConnected && characteristics != null ){
    if ( characteristics[0] != null ){
      const encoder = new TextEncoder('utf-8');
      let ch = characteristics[0];
      ch.writeValue(encoder.encode("Light")).then(
        char => {ch.startNotifications();}
      );
    }
  }
}

function sendData_r(e){//データ送信の設定
  if ( isConnected && characteristics != null ){
    if ( characteristics[0] != null ){
      const encoder = new TextEncoder('utf-8');
      let ch = characteristics[0];
      ch.writeValue(encoder.encode("Red")).then(
        char => {ch.startNotifications();}
      );
    }
  }
}


  function sendData_b(e){//データ送信の設定
    if ( isConnected && characteristics != null ){
      if ( characteristics[0] != null ){
        const encoder = new TextEncoder('utf-8');
        let ch = characteristics[0];
        ch.writeValue(encoder.encode("Blue")).then(
          char => {ch.startNotifications();}
        );
      }
    }
  }

let btn = document.getElementById('send_button');
let btn1 = document.getElementById('send_button1');
let btn2 = document.getElementById('send_button2');
btn.addEventListener('click',sendData );
btn1.addEventListener('click',sendData_r );
btn2.addEventListener('click',sendData_b );


async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
