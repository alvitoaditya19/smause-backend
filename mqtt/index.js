const mqtt = require("mqtt");
const { storeData, storeDataUdara, storeDataTanah, storeDataAir, storeDataAirEnc, storeDataUdaraEnc, storeDataTanahEnc, GetDataControl,storeDataKelembapanTanah, storeDataKelembapatanTanahEnc} = require("./dataHandler");


const host = 'tos.kirei.co.id';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}}`;

// const client = mqtt.connect(process.env.MQTT_HOST)

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
})

client.on('connect', () => {
    console.log("MQTT Broker connected");
    client.subscribe('intern-KIREI/IOT', () => console.log('intern-KIREI/IOT subscribed'));
    client.subscribe('intern-KIREI/IOT/Control', () => console.log('intern-KIREI/IOT/Control subscribed'));
    client.subscribe('intern-KIREI/IOT/Air', () => console.log('intern-KIREI/IOT/Air subscribed'));
    client.subscribe('intern-KIREI/IOT/Udara', () => console.log('intern-KIREI/IOT/Udara subscribed'));
    client.subscribe('intern-KIREI/IOT/Tanah', () => console.log('intern-KIREI/IOT/Tanah subscribed'));
    client.subscribe('intern-KIREI/IOT/AirEnc', () => console.log('intern-KIREI/IOT/AirEnc subscribed'));
    client.subscribe('intern-KIREI/IOT/UdaraEnc', () => console.log('intern-KIREI/IOT/UdaraEnc subscribed'));
    client.subscribe('intern-KIREI/IOT/TanahEnc', () => console.log('intern-KIREI/IOT/TanahEnc subscribed'));
    client.subscribe('intern-KIREI/IOT/KelembapanTanah', () => console.log('intern-KIREI/IOT/KelembapanTanah subscribed'));
    client.subscribe('intern-KIREI/IOT/KelembapanTanahEnc', () => console.log('intern-KIREI/IOT/KelembapanTanahEnc subscribed'));

})

client.on('message', (topic, payload) => {
    if (topic === 'intern-KIREI/IOT') {
        storeData(payload)
    } else if (topic === 'intern-KIREI/IOT/Control') {
        GetDataControl(payload)
    }
    else if (topic === 'intern-KIREI/IOT/Air') {
        storeDataAir(payload)
    } else if (topic === 'intern-KIREI/IOT/Udara') {
        storeDataUdara(payload)
    }
    else if (topic === 'intern-KIREI/IOT/Tanah') {
        storeDataTanah(payload)
    }
    else if (topic === 'intern-KIREI/IOT/AirEnc') {
        storeDataAirEnc(payload)
    } else if (topic === 'intern-KIREI/IOT/UdaraEnc') {
        storeDataUdaraEnc(payload)
    }
    else if (topic === 'intern-KIREI/IOT/TanahEnc') {
        storeDataTanahEnc(payload)
    }else if (topic === 'intern-KIREI/IOT/KelembapanTanahEnc') {
        storeDataKelembapatanTanahEnc(payload)
    }  else if (topic === 'intern-KIREI/IOT/KelembapanTanah') {
        storeDataKelembapanTanah(payload)
    }
})

module.exports = client