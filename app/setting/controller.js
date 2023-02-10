const Settings = require("./model");

module.exports = {
  actionUp: async (req, res, next) => {
    try {

      res.status(200).json({ data: "welcoming everyone!!!!" });
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
  actionCreate: async (req, res, next) => {
    try {
      const payload = req.body;

      let setting = new Settings(payload);

      await setting.save();

      delete setting._doc.password;

      res.status(201).json({ data: setting });
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
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { nameVegetable, amountVegetable, amountHarvest } = req.body;

      const settingData = await Settings.findOneAndUpdate(
        {
          _id: id,
        },
        {
          nameVegetable,
          amountVegetable,
          amountHarvest,
        },

        { new: true, useFindAndModify: false }
      );

      res.status(200).json({ data: settingData });

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
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Settings.findOneAndRemove({
        _id: id,
      });


      res.json({ message: "Settings have been removed!" });
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
  getDataSetting: async (req, res) => {
    try {
      let { limit = "" } = req.query;
      let { page = "" } = req.query;
      let { status = "" } = req.query;

      if (!limit) {
        limit = Infinity;
      }
      if (!page) {
        page = 1;
      }

      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      let settingData = await Settings.find().select('nameVegetable amountVegetable amountHarvest');

      let settingAllData = settingData.map((item, index) => {
        return {
          _id: item.id,
          no: index + 1,
          nameVegetable: item.nameVegetable,
          amountVegetable: item.amountVegetable,
          amountHarvest: item.amountHarvest,
        }
      })

      const sumHarvest = settingAllData
        .map(item => item.amountHarvest)
        .reduce((prev, curr) => prev + curr, 0);

      const sumVegetable = settingAllData
        .map(item => item.amountVegetable)
        .reduce((prev, curr) => prev + curr, 0);

      const totalSettingData = settingAllData.length;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = settingAllData.slice(startIndex, endIndex);

      res.status(201).json({
        total: totalSettingData,
        totalVegetable: sumVegetable,
        totalHarvest: sumHarvest,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  getDetailSetting: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Settings.findOne({ _id: id });

      if (!user) return res.status(404).json({ message: 'Sayuran tidak ditemukan' })

      res.status(200).json({ data: user });

    } catch (err) {
      res.status(500).json({ message: err.message || `Internal Server Error` });

    }
  },
};
