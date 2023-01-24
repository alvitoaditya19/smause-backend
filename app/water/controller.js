const Water = require("./model");
const { Parser } = require("json2csv");
const crypto = require('crypto');

const cryptoAlgorithm = 'aes-128-cbc';
const key = 'abcdefghijklmnop';
const iv = '1234567890123456';

module.exports = {
  getTemp: async (req, res, next) => {
    try {
      let { limit = "" } = req.query;
      let { page = "" } = req.query;
      if (!limit) {
        limit = Infinity;
      }
      if (!page) {
        page = 1;
      }
      const water = await Water.find({});

      const timeTemp = water.map((suhuDataMap, index) => {
        const suhuCalender = new Date(suhuDataMap.createdAt);

        const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm , key, iv);
        let decryptedData1 = dataDecipher1.update(suhuDataMap.ketinggianAir,  'hex', 'utf8');
        decryptedData1 += dataDecipher1.final('utf8');
  
        const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm , key, iv);
        let decryptedData2 = dataDecipher2.update(suhuDataMap.oksigen,  'hex', 'utf8');
        decryptedData2 += dataDecipher2.final('utf8');
        return {
          id: index + 1,
          ketinggianAir: decryptedData1,
          oksigen:decryptedData2,
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
      const totalTemp = water.length;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = timeTemp.slice(startIndex, endIndex);

      res.status(201).json({
        total: totalTemp,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  postSuhu: async (req, res, next) => {
    try {
      const { ketinggianAir, oksigen } = req.body;

      const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      let dataCipher1 = dataEncrypt1.update(ketinggianAir, 'utf8', 'hex');
      dataCipher1 += dataEncrypt1.final('hex');

      const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      let dataCipher2 = dataEncrypt2.update(oksigen, 'utf8', 'hex');
      dataCipher2 += dataEncrypt2.final('hex');

      const payload = {
        ketinggianAir: dataCipher1,
        oksigen: dataCipher2,
      };

      const dataSuhu = new Water(payload);
      await dataSuhu.save();

      
      res.status(200).json({data : dataSuhu});

    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  decryptData: async (req, res, next) => {
    try {
      const { ketinggianAir, oksigen } = req.body;

      const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm , key, iv);
      let decryptedData1 = dataDecipher1.update(ketinggianAir,  'hex', 'utf8');
      decryptedData1 += dataDecipher1.final('utf8');

      const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm , key, iv);
      let decryptedData2 = dataDecipher2.update(oksigen,  'hex', 'utf8');
      decryptedData2 += dataDecipher2.final('utf8');

      const payload = {
        ketinggianAir: decryptedData1,
        oksigen: decryptedData2,
      };

      
      res.status(200).json({data : payload});

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

      const customTemp = temperature.map((suhuDataMap, index) => {
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
