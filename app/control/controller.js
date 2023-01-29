const Control = require("./model");

module.exports = {
  actionStatusControl: async (req, res) => {
    try {
      const { lamp1, lamp2, pump1, pump2, valve, blend } = req.body;
      // let lampu1Status = lampu.lampu1 === "ON" ? "OFF" : "ON";

     const controlData = await Control.findOneAndUpdate(
        {
          _id: "63d1decc37a463ae302eeba3",
        },
        { 
          lamp1,
          lamp2,
          pump1,
          pump2,
          valve,
          blend
        },
        { new: true, useFindAndModify: false }
      );

      res.status(200).json({ data: controlData});
     
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
  getStatusControl: async (req, res) => {
    try {

        const control = await Control.findOne({});
        res.status(200).json({ data: control });

    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
};
