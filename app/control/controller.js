const Control = require("./model");
const mqtt = require('mqtt')


module.exports = {
  actionStatusControl: async (req, res) => {
    try {
      const { lamp1, lamp2, pump1, pump2, valve, blend, statusControl } = req.body;
      const host = 'tos.kirei.co.id';
      const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
      const connectUrl = `mqtt://${host}}`;
      const topicControl = 'intern-KIREI/IOT/Control';

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
          blend,
          statusControl
        },
        { new: true, useFindAndModify: false }
      );

      const payloadControl = {
        lamp1: controlData.lamp1,
        lamp2: controlData.lamp2,
        pump1: controlData.pump1,
        pump2: controlData.pump2,
        valve: controlData.valve,
        blend: controlData.blend,
        statusControl: controlData.statusControl
      }

      const dataJsonControl = await JSON.stringify(payloadControl)

      const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
      })

      client.on('connect', () => {
        client.subscribe([topicControl], () => {
          console.log(`Subscribe to topic '${topicControl}'`)
        })
        client.publish(topicControl, dataJsonControl, (error) => {
          if (error) {
            console.error(error)
          }
        })
      })

      res.status(200).json({ data: controlData });

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
