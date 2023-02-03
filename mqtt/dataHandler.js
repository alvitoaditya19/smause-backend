const Control = require("../app/control/model");
const Air = require("../app/air/model");
const Tanah = require("../app/tanah/model");
const Udara = require("../app/udara/model");

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
    storeDataKAir: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData = await new Air(dataJson).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataWaterUdara: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData = await new Tanah(dataJson).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
    storeDataWaterTanah: async (payload) => {
        const rawData = payload.toString()
        try {
            const dataJson = await JSON.parse(rawData)
            const newData = await new Udara(dataJson).save()
        } catch (error) {
            console.error(`Error ${error.message}`)
        }
    },
}