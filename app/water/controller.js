const Water = require("./model");
const User = require("../user/model");

const WaterEnc = require("./model-enc");
const socket = require('../../bin/www')

const { Parser } = require("json2csv");
const crypto = require('crypto');

const cryptoAlgorithm = 'aes-128-cbc';
const key = 'tugasakhir421654'; //16 karakter
const iv = '4567123212343219'; //16 karakter
// 1234567890123456

module.exports = {
  tesController: async (req, res, next) => {
    try {
      const { ketinggianAir, oksigen, kekeruhanAir, dataSocket } = req.body;
      const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
      let dataCipher1 = dataEncrypt1.update(ketinggianAir, 'utf8', 'hex');
      dataCipher1 += dataEncrypt1.final('hex');

      const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
      let dataCipher2 = dataEncrypt2.update(oksigen, 'utf8', 'hex');
      dataCipher2 += dataEncrypt2.final('hex');

      const dataEncrypt3 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
      let dataCipher3 = dataEncrypt3.update(kekeruhanAir, 'utf8', 'hex');
      dataCipher3 += dataEncrypt3.final('hex');

      const payloadEnc = {
        ketinggianAir: dataCipher1,
        oksigen: dataCipher2,
        kekeruhanAir: dataCipher3
      };

      const payloadReal = {
        ketinggianAir: ketinggianAir,
        oksigen: oksigen,
        kekeruhanAir: kekeruhanAir,

      };

      const waterReal = new Water(payloadReal);
      const waterEnc = new WaterEnc(payloadEnc);

      await waterReal.save();
      await waterEnc.save();

      const water = await Water.find({});

      const waterMap = water.map((waterDataMap, index) => {
        const waterCalender = new Date(waterDataMap.createdAt);

        return {
          no: index + 1,
          id: waterDataMap.id,

          ketinggianAir: waterDataMap.ketinggianAir,
          oksigen: waterDataMap.oksigen,
          kekeruhanAir: waterDataMap.kekeruhanAir,

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

      socket.socketConnection.socket.emit("message", "hello")

      socket.socketConnection.socket.emit("data", waterMap)



      res.status(201).json({
        data: "success",
        dataSocket,
        dataReal: waterReal,
        dataEncrypt: waterEnc,
        getData: water

      });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }

  },
  getAllDataWaterEnc: async (req, res, next) => {
    try {
      let { limit = "" } = req.query;
      let { page = "" } = req.query;
      if (!limit) {
        limit = Infinity;
      }
      if (!page) {
        page = 1;
      }
      
      const water = await WaterEnc.find({ userId: { $exists: true, $ne: null } });
      const userIds = water.map(waterData => waterData.userId); // Mengambil semua userId dari data water
  
      const users = await User.find({ _id: { $in: userIds } }); // Mencari pengguna berdasarkan userIds
  
      const waterMap = water.map((waterDataMap, index) => {
        const waterCalender = new Date(waterDataMap.createdAt);
  
        const user = users.find(user => user._id.toString() === waterDataMap.userId.toString()); // Mencari pengguna yang sesuai dengan userId
  
        return {
          no: index + 1,
          id: waterDataMap.id,
          name: user ? user.name : "", // Menambahkan data nama pengguna (jika ada)
          userId:waterDataMap.userId,
  
          ketinggianAir: waterDataMap.ketinggianAir,
          oksigen: waterDataMap.oksigen,
          kekeruhanAir: waterDataMap.kekeruhanAir,
  
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
      
      const totalWaterData = waterMap.length;
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = waterMap.slice(startIndex, endIndex);
  
      res.status(201).json({
        total: totalWaterData,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  getDataWaterEnc: async (req, res, next) => {
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
      // const user = await User.findOne({ _id: id });

      const water = await WaterEnc.find({userId:id});

      const waterMap = water.map((waterDataMap, index) => {
        const waterCalender = new Date(waterDataMap.createdAt);

        return {
          no: index + 1,
          id: waterDataMap.id,

          ketinggianAir: waterDataMap.ketinggianAir,
          oksigen: waterDataMap.oksigen,
          kekeruhanAir: waterDataMap.kekeruhanAir,

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
      const totalWaterData = waterMap.length;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = waterMap.slice(startIndex, endIndex);

      res.status(201).json({
        total: totalWaterData,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  getDataWaterReal: async (req, res, next) => {
    try {
      let { limit = "" } = req.query;
      let { page = "" } = req.query;
      if (!limit) {
        limit = Infinity;
      }
      if (!page) {
        page = 1;
      }
      const water = await WaterEnc.find({});

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
      const totalWaterData = water.length;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = waterMap.slice(startIndex, endIndex);

      res.status(201).json({
        total: totalWaterData,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  postWaterReal: async (req, res, next) => {
    try {
      const { ketinggianAir, oksigen, kekeruhanAir } = req.body;

      const payload = {
        ketinggianAir: ketinggianAir,
        oksigen: oksigen,
        kekeruhanAir: kekeruhanAir
      };

      const water = new Water(payload);
      await water.save();

      res.status(200).json({ data: water });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  postWaterEnc: async (req, res, next) => {
    try {
      const { ketinggianAir, oksigen, kekeruhanAir } = req.body;

      // const dataEncrypt1 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
      // let dataCipher1 = dataEncrypt1.update(ketinggianAir, 'utf8', 'hex');
      // dataCipher1 += dataEncrypt1.final('hex');

      // const dataEncrypt2 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
      // let dataCipher2 = dataEncrypt2.update(oksigen, 'utf8', 'hex');
      // dataCipher2 += dataEncrypt2.final('hex');

      // const dataEncrypt3 = crypto.createCipheriv(cryptoAlgorithm, key, iv);
      // let dataCipher3 = dataEncrypt3.update(kekeruhanAir, 'utf8', 'hex');
      // dataCipher3 += dataEncrypt3.final('hex');

      // const payloadEnc = {
      //   ketinggianAir: dataCipher1,
      //   oksigen: dataCipher2,
      //   kekeruhanAir: dataCipher3
      // };

      // // const payloadReal = {
      // //   ketinggianAir: ketinggianAir,
      // //   oksigen: oksigen,
      // //   kekeruhanAir: kekeruhanAir,

      // // };

      // // const waterReal = new Water(payloadReal);
      // // const waterEnc = new WaterEnc(payloadEnc);

      // // await waterReal.save();
      // // await waterEnc.save();

      // // res.status(200).json({ dataReal: waterReal, dataEncrypt: waterEnc });

      // const waterEnc = new WaterEnc(payloadEnc);

      // await waterEnc.save();

      // res.status(201).json({ data: waterEnc });

      const payload = {
        ketinggianAir: ketinggianAir,
        oksigen: oksigen,
        kekeruhanAir: kekeruhanAir
      };

      // contoh pesan yang akan diperiksa
      const message1 = payload.ketinggianAir;
      const message2 = payload.kekeruhanAir;
      const message3 = payload.oksigen;


      // panjang kunci AES-128 dalam bit (128 bit = 16 byte)
      const aes128KeyLength = 128;

      // konversi pesan ke bentuk byte array
      const messageBytes1 = new TextEncoder().encode(message1);
      const messageBytes2 = new TextEncoder().encode(message2);
      const messageBytes3 = new TextEncoder().encode(message3);


      // cek apakah panjang pesan merupakan kelipatan dari 16 byte
      if (messageBytes1.length % 16 !== 0 || messageBytes2.length % 16 !== 0 || messageBytes3.length % 16 !== 0) {
        // cek apakah panjang kunci yang digunakan adalah 128 bit
        throw new Error(JSON.stringify('Pesan tidak dienkripsi dengan AES-128'));
      }

      const water = new WaterEnc(payload);
      await water.save();

      res.status(200).json({ data: water });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  decryptData: async (req, res, next) => {
    try {
      const { ketinggianAir, oksigen } = req.body;

      const dataDecipher1 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
      let decryptedData1 = dataDecipher1.update(ketinggianAir, 'hex', 'utf8');
      decryptedData1 += dataDecipher1.final('utf8');

      const dataDecipher2 = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
      let decryptedData2 = dataDecipher2.update(oksigen, 'hex', 'utf8');
      decryptedData2 += dataDecipher2.final('utf8');

      const payload = {
        ketinggianAir: decryptedData1,
        oksigen: decryptedData2,
      };


      res.status(200).json({ data: payload });

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

      const customTemp = temperature.map((waterDataMap, index) => {
        const waterCalender = new Date(waterDataMap.createdAt);
        return {
          id: index + 1,
          celcius: waterDataMap.celcius,
          humidity: waterDataMap.humidity,
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
