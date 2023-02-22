const Control = require("../app/control/model");
const Air = require("../app/water/model");
const Tanah = require("../app/soil/model");
const Udara = require("../app/temperature/model");

const AirEnc = require("../app/water/model-enc");
const TanahEnc = require("../app/soil/model-enc");
const UdaraEnc = require("../app/temperature/model-enc");

const crypto = require('crypto');
const { encode } = require("js-base64");

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
            const newData = await Control.findOne().select('lamp1 lamp2 pump1 pump2 valve blend');
            console.log(newData)
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
            const newData = await new AirEnc(dataJson).save()
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

            const newData = await new UdaraEnc(dataJson).save()
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
    storeDataTanahEnc: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
            let dataCipher1 = dataEncrypt1.update(dataJson.kelembapanTanah, 'utf8', 'hex');
            dataCipher1 += dataEncrypt1.final('hex');
            
            const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
            let dataCipher2 = dataEncrypt2.update(dataJson.phTanah, 'utf8', 'hex');
            dataCipher2 += dataEncrypt2.final('hex');
            
            const payloadEnc = {
                kelembapanTanah: dataCipher1    ,
                phTanah: dataCipher2,
            };

            console.log("payload", payloadEnc)

            // const newData = await new TanahEnc(payloadEnc).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    // storeDataTanahEnc: async (payload) => {
    //     const rawData = payload.toString()
    //     try {
    //         const dataJson = await JSON.parse(rawData)

    //         console.log("dataauuuuuuuuuuuuu", rawData)
    //         const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
    //         let dataCipher1 = dataEncrypt1.update(dataJson.kelembapanTanah, 'utf8', 'hex');
    //         dataCipher1 += dataEncrypt1.final('hex');
      
    //         const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
    //         let dataCipher2 = dataEncrypt2.update(dataJson.phTanah, 'utf8', 'hex');
    //         dataCipher2 += dataEncrypt2.final('hex');
      
    //         const payloadEnc = {
    //           kelembapanTanah: dataCipher1,
    //           phTanah: dataCipher2,
    //         };
    //         const newData = await new TanahEnc(payloadEnc).save()
    //     } catch (error) {
    //         console.error(`Error ${error.message}`)
    //     }
    // },
}