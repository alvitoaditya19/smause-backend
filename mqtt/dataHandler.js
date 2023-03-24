const Control = require("../app/control/model");
const Air = require("../app/water/model");
const Tanah = require("../app/soil/model");
const Udara = require("../app/temperature/model");

const AirEnc = require("../app/water/model-enc");
const TanahEnc = require("../app/soil/model-enc");
const Message = require("../app/message/model");

const UdaraEnc = require("../app/temperature/model-enc");

const crypto = require('crypto');
const socket = require('../bin/www');

const cryptoAlgorithm = 'aes-128-cbc';
const key = 'tugasakhir421654'; //16 karakter
const iv = '4567123212343219'; //16 karakter
// 1234567890123456

module.exports = {
    storeData: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData = await new Sensor(dataJson).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    GetDataControl: async (payload) => {
        try {
            const newData = await Control.findOne().select('lamp1 lamp2 pump1 pump2 valve blend status');
            console.log(newData)
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    StoreDataControl: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)

            const badData = new Control({
                lamp1: dataJson.lamp1,
                lamp2: dataJson.lamp2,
                pump1: dataJson.pump1,
                pump2: dataJson.pump2,
                valve: dataJson.valve,
                blend: dataJson.blend,
                status:  dataJson.status
              });
              const error = badData.validateSync();
            
              if(error){
                return Error()
              }
            await Control.findByIdAndUpdate(
                {
                  _id: "63d1decc37a463ae302eeba3",
                },
                {
                  lamp1: dataJson.lamp1,
                  lamp2: dataJson.lamp2,
                  pump1: dataJson.pump1,
                  pump2: dataJson.pump2,
                  valve: dataJson.valve,
                  blend: dataJson.blend,
                  status:  dataJson.status
                },
              )
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataAir: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData = await new Air(dataJson).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataAirEnc: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData =  await AirEnc(dataJson).save()

            const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            let dataCipher1 = dataEncrypt1.update(dataJson.ketinggianAir, 'utf8', 'hex');
            dataCipher1 += dataEncrypt1.final('hex');

            const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            let dataCipher2 = dataEncrypt2.update(dataJson.oksigen, 'utf8', 'hex');
            dataCipher2 += dataEncrypt2.final('hex');

            const dataEncrypt3 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            let dataCipher3 = dataEncrypt3.update(dataJson.kekeruhanAir, 'utf8', 'hex');
            dataCipher3 += dataEncrypt3.final('hex');

            const payloadEnc = {
                ketinggianAir: dataCipher1,
                oksigen: dataCipher2,
                kekeruhanAir: dataCipher3
            };


            const water = await AirEnc.find({});

            const waterMap = water.map((waterDataMap, index) => {
                const waterCalender = new Date(waterDataMap.createdAt);

                const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decKetinngianAir = dataDecipher1.update(waterDataMap.ketinggianAir, 'hex', 'utf8');
                decKetinngianAir += dataDecipher1.final('utf8');

                const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decOksigen = dataDecipher2.update(waterDataMap.oksigen, 'hex', 'utf8');
                decOksigen += dataDecipher2.final('utf8');


                const dataDecipher3 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decKekeruhanAir = dataDecipher3.update(waterDataMap.kekeruhanAir, 'hex', 'utf8');
                decKekeruhanAir += dataDecipher3.final('utf8');

                return {
                    no: index + 1,
                    id: waterDataMap.id,
                    ketinggianAir: decKetinngianAir,
                    oksigen: decOksigen,
                    kekeruhanAir: decKekeruhanAir,
                    date:
                        waterCalender.getDate() +
                        " - " +
                        (waterCalender.getMonth() + 1) +
                        " - " +
                        waterCalender.getFullYear(),
                    time:
                        waterCalender.getHours() +
                        ":" +
                        waterCalender.getMinutes() +
                        ":" +
                        waterCalender.getSeconds(),
                };
            });
            console.log("adojaiodjoa", dataJson.oksigen)

            socket.socketConnection.socket.emit("dataCardAir", waterMap.slice(-1))

            socket.socketConnection.socket.emit("dataGraphAir", waterMap.slice(-4))

        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataUdara: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData = await new Udara(dataJson).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataUdaraEnc: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            // const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            // let dataCipher1 = dataEncrypt1.update(dataJson.celcius, 'utf8', 'hex');
            // dataCipher1 += dataEncrypt1.final('hex');

            // const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            // let dataCipher2 = dataEncrypt2.update(dataJson.humidity, 'utf8', 'hex');
            // dataCipher2 += dataEncrypt2.final('hex');

            // const payloadEnc = {
            //     celcius: dataCipher1,
            //     humidity: dataCipher2,
            // };
            const newData = await new UdaraEnc(dataJson).save()
            const temperature = await UdaraEnc.find({});

            const temperatureMap = temperature.map((suhuDataMap, index) => {
                const suhuCalender = new Date(suhuDataMap.createdAt);
                const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decCelcius = dataDecipher1.update(suhuDataMap.celcius, 'hex', 'utf8');
                decCelcius += dataDecipher1.final('utf8');

                const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decHumidty = dataDecipher2.update(suhuDataMap.humidity, 'hex', 'utf8');
                decHumidty += dataDecipher2.final('utf8');

                return {
                    no: index + 1,
                    id: suhuDataMap.id,
                    celcius: decCelcius,
                    humidity: decHumidty,
                    date:
                        suhuCalender.getDate() +
                        " - " +
                        (suhuCalender.getMonth() + 1) +
                        " - " +
                        suhuCalender.getFullYear(),
                    time:
                        suhuCalender.getHours() +
                        ":" +
                        suhuCalender.getMinutes() +
                        ":" +
                        suhuCalender.getSeconds(),
                };
            });
            socket.socketConnection.socket.emit("dataCardUdara", temperatureMap.slice(-1))

            socket.socketConnection.socket.emit("dataGraphUdara", temperatureMap.slice(-4))
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataTanah: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData = await new Tanah(dataJson).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataKelembapanTanah: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData = await new Tanah(dataJson).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataTanahEnc: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            // const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            // let dataCipher1 = dataEncrypt1.update(dataJson.kelembapanTanah, 'utf8', 'hex');
            // dataCipher1 += dataEncrypt1.final('hex');

            // const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            // let dataCipher2 = dataEncrypt2.update(dataJson.phTanah, 'utf8', 'hex');
            // dataCipher2 += dataEncrypt2.final('hex');

            // const payloadEnc = {
            //     kelembapanTanah: dataCipher1,
            //     phTanah: dataCipher2,
            // };

            const newData = await new TanahEnc(dataJson).save()

            const soilData = await TanahEnc.find({});

            const soilDataMap = soilData.map((soilDataMap, index) => {
                const soilCalender = new Date(soilDataMap.createdAt);
                const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decKelembapanTanah = dataDecipher1.update(soilDataMap.kelembapanTanah, 'hex', 'utf8');
                decKelembapanTanah += dataDecipher1.final('utf8');

                const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decPhTanah = dataDecipher2.update(soilDataMap.phTanah, 'hex', 'utf8');
                decPhTanah += dataDecipher2.final('utf8');

                return {
                    no: index + 1,
                    id: soilDataMap.id,
                    kelembapanTanah: decKelembapanTanah,
                    phTanah: decPhTanah,
                    date:
                        soilCalender.getDate() +
                        " - " +
                        (soilCalender.getMonth() + 1) +
                        " - " +
                        soilCalender.getFullYear(),
                    time:
                        soilCalender.getHours() +
                        ":" +
                        soilCalender.getMinutes() +
                        ":" +
                        soilCalender.getSeconds(),
                };
            });
            socket.socketConnection.socket.emit("dataCardTanah",  soilDataMap.slice(-1))

            socket.socketConnection.socket.emit("dataGraphTanah", soilDataMap.slice(-4))


            // const newData = await new TanahEnc(payloadEnc).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataKelembapatanTanahEnc: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            // const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            // let dataCipher1 = dataEncrypt1.update(dataJson.kelembapanTanah, 'utf8', 'hex');
            // dataCipher1 += dataEncrypt1.final('hex');

            // const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            // let dataCipher2 = dataEncrypt2.update(dataJson.phTanah, 'utf8', 'hex');
            // dataCipher2 += dataEncrypt2.final('hex');

            // const payloadEnc = {
            //     kelembapanTanah: dataCipher1,
            //     phTanah: dataCipher2,
            // };

            const newData = await new TanahEnc(dataJson).save()

            const soilData = await TanahEnc.find({});

            const soilDataMap = soilData.map((soilDataMap, index) => {
                const soilCalender = new Date(soilDataMap.createdAt);
                const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decKelembapanTanah = dataDecipher1.update(soilDataMap.kelembapanTanah, 'hex', 'utf8');
                decKelembapanTanah += dataDecipher1.final('utf8');

                const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
                let decPhTanah = dataDecipher2.update(soilDataMap.phTanah, 'hex', 'utf8');
                decPhTanah += dataDecipher2.final('utf8');

                return {
                    no: index + 1,
                    id: soilDataMap.id,
                    kelembapanTanah: decKelembapanTanah,
                    phTanah: decPhTanah,
                    date:
                        soilCalender.getDate() +
                        " - " +
                        (soilCalender.getMonth() + 1) +
                        " - " +
                        soilCalender.getFullYear(),
                    time:
                        soilCalender.getHours() +
                        ":" +
                        soilCalender.getMinutes() +
                        ":" +
                        soilCalender.getSeconds(),
                };
            });
            socket.socketConnection.socket.emit("dataCardTanah", soilData)

            socket.socketConnection.socket.emit("dataGraphTanah", soilDataMap.slice(-4))


            // const newData = await new TanahEnc(payloadEnc).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataMessage: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
        
            const newData = await new Message(dataJson).save()

            socket.socketConnection.socket.emit("dataMessaage", dataJson)

        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
}