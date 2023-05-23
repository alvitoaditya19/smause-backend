const Temperature = require("./model");
const TemperatureEnc = require("./model-enc");

const { Parser } = require("json2csv");
const crypto = require('crypto');

const cryptoAlgorithm = 'aes-128-cbc';
const key = 'tugasakhir421654'; //16 karakter
const iv = '4567123212343219'; //16 karakter
// 1234567890123456

module.exports = {
  getDataTempEnc: async (req, res, next) => {
    try {
      const { id } = req.params;

      let { limit = "" } = req.query;
      let { page = "" } = req.query;
      if (!limit) {
        limit = Infinity;
      }
      if (!page) {
        page = 1;
      }
      const temperature = await TemperatureEnc.find({userId:id});

      const timeTemp = temperature.map((suhuDataMap, index) => {
        const suhuCalender = new Date(suhuDataMap.createdAt);
        return {
          no: index + 1,
          id: suhuDataMap.id,
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
      const totalTemp = temperature.length;

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
  getDataTempReal: async (req, res, next) => {
    try {
      let { limit = "" } = req.query;
      let { page = "" } = req.query;
      if (!limit) {
        limit = Infinity;
      }
      if (!page) {
        page = 1;
      }
      const temperature = await TemperatureEnc.find({});

      const timeTemp = temperature.map((suhuDataMap, index) => {
        const suhuCalender = new Date(suhuDataMap.createdAt);
        const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm , key, iv);
        let decCelcius = dataDecipher1.update(suhuDataMap.celcius,  'hex', 'utf8');
        decCelcius += dataDecipher1.final('utf8');
  
        const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm , key, iv);
        let decHumidty = dataDecipher2.update(suhuDataMap.humidity,  'hex', 'utf8');
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
      const totalTemp = temperature.length;

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
  postTemp: async (req, res, next) => {
    try {
      const { celcius, humidity } = req.body;

      const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      let dataCipher1 = dataEncrypt1.update(celcius, 'utf8', 'hex');
      dataCipher1 += dataEncrypt1.final('hex');

      const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      let dataCipher2 = dataEncrypt2.update(humidity, 'utf8', 'hex');
      dataCipher2 += dataEncrypt2.final('hex');

      const payloadEnc = {
        celcius: dataCipher1,
        humidity: dataCipher2,
      };

      const payloadReal = {
        celcius: celcius,
        humidity: humidity,
      };

      const tempReal = new Temperature(payloadReal);

      const tempEnc = new TemperatureEnc(payloadEnc);


      await tempReal.save();
      await tempEnc.save();

      res.status(200).json({ dataReal: tempReal, dataEncrypt:tempEnc });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  postTempReal: async (req, res, next) => {
    try {
      const { celcius, humidity } = req.body;

      const payload = {
        celcius: celcius,
        humidity: humidity,
      };

      const suhu = new Temperature(payload);
      await suhu.save();

      res.status(200).json({ data: suhu });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  postTempEnc: async (req, res, next) => {
    try {
      const { celcius, humidity } = req.body;

      // if(!celcius){
      //   const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      //   let dataCipher2 = dataEncrypt2.update(humidity, 'utf8', 'hex');
      //   dataCipher2 += dataEncrypt2.final('hex');

      //   const payload = {
      //     // celcius: dataCipher1,
      //     humidity: dataCipher2,
      //   };
  
      //   const suhu = new TemperatureEnc(payload);
      //   await suhu.save();
  
      //   res.status(200).json({ data: suhu });
      // }else if(!humidity){
      //   const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      //   let dataCipher1 = dataEncrypt1.update(celcius, 'utf8', 'hex');
      //   dataCipher1 += dataEncrypt1.final('hex');

      //   const payload = {
      //     celcius: dataCipher1,
      //     // humidity: dataCipher2,
      //   };
  
      //   const suhu = new TemperatureEnc(payload);
      //   await suhu.save();
  
      //   res.status(200).json({ data: suhu });
      // }else{
      //   const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      //   let dataCipher2 = dataEncrypt2.update(humidity, 'utf8', 'hex');
      //   dataCipher2 += dataEncrypt2.final('hex');

      //   const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm , key, iv);
      //   let dataCipher1 = dataEncrypt1.update(celcius, 'utf8', 'hex');
      //   dataCipher1 += dataEncrypt1.final('hex');

      //   const payload = {
      //     celcius: dataCipher1,
      //     humidity: dataCipher2,
      //   };
  
      //   const suhu = new TemperatureEnc(payload);
      //   await suhu.save();
  
      //   res.status(200).json({ data: suhu });
      // }

      const payload = {
        celcius: celcius,
        humidity: humidity,
      };

      const suhu = new TemperatureEnc(payload);
      await suhu.save();

      res.status(200).json({ data: suhu });
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
