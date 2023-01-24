const User = require("./model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../../config");
const { update } = require("./model");

// Enkripsi Data
const crypto = require('crypto');

const cryptoAlgorithm = 'aes-128-cbc';
const key = 'abcdefghijklmnop';
const iv = '1234567890123456';

module.exports = {
  signin: (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          const checkPassword = bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            if (user.status == "admin") {
              const token = jwt.sign(
                {
                  user: {
                    id: user.id,
                    email: user.email,
                    nama: user.nama,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                    avatar: user.avatar,
                  },
                },
                config.jwtKey
              );
              res.status(200).json({
                data: { token },
              });
            } else {
              res.status(403).json({
                message: "Anda tidak diizinkan untuk mengakses sistem dashboard ini",
              });
            }
          } else {
            res.status(403).json({
              message: "password yang anda masukkan salah",
            });
          }
        } else {
          res.status(403).json({
            message: "email yang anda masukan belum terdaftar",
          });
        }
      })
      .catch((err) => {
        message: err.message || "Internal Server Error";
      });
  },
  actionCreate: async (req, res, next) => {
    try {
      const payload = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const user = new User({ ...payload, avatar: filename });

            await user.save();

            delete user._doc.password;

            res.status(201).json({ data: user });
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
        });
      } else {
        let user = new User(payload);

        await user.save();

        delete user._doc.password;

        res.status(201).json({ data: user });
      }
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
      const { name, username, password, status, avatar } = req.body;
      // const passo = bcrypt.hashSync(password)

      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const user = await User.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${user.thumbnial}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            const userDataJson = await User.findOneAndUpdate(
              {
                _id: id,
              },
              {
                name,
                username,
                password,
                status,
                avatar: filename,
              },
              { new: true, useFindAndModify: false }
            );

            // bcrypt.hashSync(userDataJson.password)

            res.status(200).json({ data: userDataJson });
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
        });
      } else {
        const userData = await User.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name,
            username,
            password,
            status,
          },

          { new: true, useFindAndModify: false }
        );

        res.status(200).json({ data: userData});
      }
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
      const user = await User.findOneAndRemove({
        _id: id,
      });

      let currentImage = `${config.rootPath}/public/uploads/${user.avatar}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }
      res.json({ message: "User have been removed!" });
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
  getUser: async (req, res) => {
    try {
      //  AWAL TO AKHIR
      // user.sort(function (a, b) {
      //     var keyA = new Date(a.updatedAt),
      //         keyB = new Date(b.updatedAt)
      //     // Compare the 2 dates
      //     if (keyA < keyB) return -1
      //     if (keyA > keyB) return 1
      //     return 0
      // })

      // AKHIR TO AWAL
      // user.sort(function(a, b) {
      //   var keyA = new Date(a.updatedAt),
      //     keyB = new Date(b.updatedAt);
      //   // Compare the 2 dates
      //   if (keyA < keyB) return 1;
      //   if (keyA > keyB) return -1;
      //   return 0;
      // });
      const { limit = "" } = req.query;
      const { status = "" } = req.query;

      let criteria = {  };

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }
      // let data = 'Halo semuanya. Ini adalah pesan yang ingin dikirimkan.'

      const dataCrypto = crypto.createCipheriv(cryptoAlgorithm, key, iv);
      // let dataCipher = dataCrypto.update(data, 'utf8', 'hex');
      // dataCipher += dataCrypto.final('hex');
      // res.status(200).json({ data: dataCipher });


      if (limit == 0) {
        let user = await User.find(criteria).select('name email username status phoneNumber avatar');
        
        res.status(200).json({ data: user.name });

      } else {
        let user = await User.find(criteria).select('name email username status phoneNumber avatar').limit(limit);
        
        res.status(200).json({ data: user.name });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message || `Internal Server Error`,
      });
    }
  },
  detailUser: async(req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findOne({_id : id});

      if(!user) return res.status(404).json({ message: 'User tidak ditemukan' })

      res.status(200).json({ data: user });
      
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal Server Error` });
      
    }
  },
};
