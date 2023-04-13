const Soil = require("./model");
const SoilEnc = require("./model-enc");

const { Parser } = require("json2csv");
const crypto = require('crypto');

const cryptoAlgorithm = 'aes-128-cbc';
const key = 'tugasakhir421654'; //16 karakter
const iv = '4567123212343219'; //16 karakter
// 1234567890123456

module.exports = {
  getDataSoilEnc: async (req, res, next) => {
    try {
      let { limit = "" } = req.query;
      let { page = "" } = req.query;
      if (!limit) {
        limit = Infinity;
      }
      if (!page) {
        page = 1;
      }
      const soilData = await SoilEnc.find({});

      const soilDatMap = soilData.map((soilDataMap, index) => {
        const soilCalender = new Date(soilDataMap.createdAt);
        return {
          no: index + 1,
          id: soilDataMap.id,
          kelembapanTanah: soilDataMap.kelembapanTanah,
          phTanah: soilDataMap.phTanah,
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
      const totalSoil = soilDatMap.length;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = soilDatMap.slice(startIndex, endIndex);

      res.status(201).json({
        total: totalSoil,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  getDataSoilReal: async (req, res, next) => {
    try {
      let { limit = "" } = req.query;
      let { page = "" } = req.query;
      if (!limit) {
        limit = Infinity;
      }
      if (!page) {
        page = 1;
      }
      const soilData = await SoilEnc.find({});

      const soilDataMap = soilData.map((soilDataMap, index) => {
        const soilCalender = new Date(soilDataMap.createdAt);
        const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm , key, iv);
        let decCelcius = dataDecipher1.update(soilDataMap.kelembapanTanah,  'hex', 'utf8');
        decCelcius += dataDecipher1.final('utf8');
  
        const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm , key, iv);
        let decHumidty = dataDecipher2.update(soilDataMap.phTanah,  'hex', 'utf8');
        decHumidty += dataDecipher2.final('utf8');

        return {
          no: index + 1,
          id: soilDataMap.id,
          kelembapanTanah: decCelcius,
          phTanah: decHumidty,
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
      const totalSoil = soilDataMap.length;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = soilDataMap.slice(startIndex, endIndex);

      res.status(201).json({
        total: totalSoil,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  postSoil: async (req, res, next) => {
    try {
      const { kelembapanTanah, phTanah } = req.body;

      const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      let dataCipher1 = dataEncrypt1.update(kelembapanTanah, 'utf8', 'hex');
      dataCipher1 += dataEncrypt1.final('hex');

      const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      let dataCipher2 = dataEncrypt2.update(phTanah, 'utf8', 'hex');
      dataCipher2 += dataEncrypt2.final('hex');

      const payloadEnc = {
        kelembapanTanah: dataCipher1,
        phTanah: dataCipher2,
      };

      const payloadReal = {
        kelembapanTanah: kelembapanTanah,
        phTanah: phTanah,
      };

      const soilReal = new Soil(payloadReal);

      const soilEnc = new SoilEnc(payloadEnc);


      await soilReal.save();
      await soilEnc.save();

      res.status(200).json({ dataReal: soilReal, dataEncrypt:soilEnc });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  postTempReal: async (req, res, next) => {
    try {
      const { kelembapanTanah, phTanah } = req.body;

      const payload = {
        kelembapanTanah: kelembapanTanah,
        phTanah: phTanah,
      };

      const soil = new Soil(payload);
      await soil.save();

      res.status(200).json({ data: soil });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  postTempEnc: async (req, res, next) => {
    try {
      const { kelembapanTanah, phTanah } = req.body;

      const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      let dataCipher1 = dataEncrypt1.update(kelembapanTanah, 'utf8', 'hex');
      dataCipher1 += dataEncrypt1.final('hex');

      const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      let dataCipher2 = dataEncrypt2.update(phTanah, 'utf8', 'hex');
      dataCipher2 += dataEncrypt2.final('hex');

      const payload = {
        kelembapanTanah: dataCipher1,
        phTanah: dataCipher2,
      };

      const soil = new SoilEnc(payload);
      await soil.save();

      res.status(200).json({ data: soil });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  actionConvertCSV: async (req, res) => {
    try {
      const temperature = await Temperature.find().select(
        "id humidity humidity createdAt updatedAt"
      );

      const customTemp = temperature.map((soilDataMap, index) => {
        const suhuCalender = new Date(suhuDataMap.createdAt);
        return {
          id: index + 1,
          celcius: suhuDataMap.celcius,
          humidity: suhuDataMap.humidity,
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

      const fields = ["id", "celcius", "humidity", "date", "time"];

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(customTemp);

      console.log(csv);

      res.header("Content-Type", "text/csv");
      res.attachment("data-suhu.csv");
      return res.send(csv);
    } catch (err) {
      if (err && err.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  },
};
