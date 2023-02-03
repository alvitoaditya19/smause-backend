const mqtt = require("mqtt");
const { storeData, storeDataKAir, storeDataWaterUdara, storeDataWaterTanah } = require("./dataHandler");

const client = mqtt.connect(process.env.MQTT_HOST)

client.on('connect', () => {
    console.log("MQTT Broker connected");
    client.subscribe('intern-KIREI/IOT', () => console.log('intern-KIREI/IOT subscribed'));
    client.subscribe('intern-KIREI/IOT/Control', () => console.log('intern-KIREI/IOT/Control subscribed'));
    client.subscribe('intern-KIREI/IOT/Air', () => console.log('intern-KIREI/IOT/Air subscribed'));
    client.subscribe('intern-KIREI/IOT/Udara', () => console.log('intern-KIREI/IOT/Udara subscribed'));
    client.subscribe('intern-KIREI/IOT/Tanah', () => console.log('intern-KIREI/IOT/Tanah subscribed'));

})

client.on('message', (topic, payload) => {
    if (topic === 'intern-KIREI/IOT') {
        storeData(payload)
    } else if (topic === 'intern-KIREI/IOT/Control') {
        GetDataControl(payload)
    }
    else if (topic === 'intern-KIREI/IOT/Air') {
        storeDataKAir(payload)
    } else if (topic === 'intern-KIREI/IOT/Udara') {
        storeDataWaterUdara(payload)
    }
    else if (topic === 'intern-KIREI/IOT/Tanah') {
        storeDataWaterTanah(payload)
    }
})

module.exports = client