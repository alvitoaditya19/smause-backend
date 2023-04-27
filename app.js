var createError = require("http-errors");
var express = require("express");
const socketIO = require("socket.io");

const AirModel = require("./app/water/model-enc");
const UdaraModel = require("./app/temperature/model-enc");
const TanahModel = require("./app/soil/model-enc");
const TanahKelemModel = require("./app/soil/modelKelem-enc");




var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
var cors = require('cors')
const mqtt = require("./mqtt")

var indexRouter = require('./routes/index');

// API
const usersRouter = require("./app/user/router");
const watersRouter = require("./app/water/router");
const controlsRouter = require("./app/control/router");
const settingsRouter = require("./app/setting/router");
const soilsRouter = require("./app/soil/router");

const temperaturesRouter = require("./app/temperature/router");
const { serverIO } = require("./bin/www");

var app = express();
const URL = `/api/v1`;
app.use(cors())

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
);

app.use('/', indexRouter);

// app.use('/users', usersRouter);

// API
app.use(`${URL}/users`, usersRouter);
app.use(`${URL}/waters`, watersRouter);
app.use(`${URL}/soils`, soilsRouter);

app.use(`${URL}/controls`, controlsRouter);
app.use(`${URL}/settings`, settingsRouter);
app.use(`${URL}/temperatures`, temperaturesRouter);

// app.get(`${URL}/testing`, async (req, res) => {
//   try {
//     // contoh pesan yang akan diperiksa
//     const message = '86da7c0603e94d1eb38e7cf8be02189f';

//     // panjang kunci AES-128 dalam bit (128 bit = 16 byte)
//     const aes128KeyLength = 128;

//     // konversi pesan ke bentuk byte array
//     const messageBytes = new TextEncoder().encode(message);

//     // cek apakah panjang pesan merupakan kelipatan dari 16 byte
//     if (messageBytes.length % 16 === 0) {
//       // cek apakah panjang kunci yang digunakan adalah 128 bit
//       if (aesKey.byteLength * 8 === aes128KeyLength) {
//         // console.log('Pesan telah dienkripsi dengan AES-128');
//         res.json({ message: "Pesan telah dienkripsi dengan AES-128" });

//       } else {
//         // console.log('Pesan tidak dienkripsi dengan AES-128');
//         res.json({ message: "Pesan tidak dienkripsi dengan AES-128" });

//       }
//     } else {
//       res.json({ message: "Pesan tidak dienkripsi dengan AES-128" });

//       // console.log('Pesan tidak dienkripsi dengan AES-128');
//     }
//     // await TanahModel.deleteMany({
//     //   'kelembapanTanah': null,
//     //   'phTanah': null,
//     // },

//     //   await TanahKelemModel.deleteMany({ "kelembapanTanah": { $exists: true, $expr: { $eq: [ { $strLenCP: "$kelembapanTanah" }, 4 ] } } }
//     // ) 
//     // && await TanahModel.deleteMany({
//     //   'phTanah': null,

//     // },

//     //   await AirModel.deleteMany({
//     //     'oksigen': null,
//     //     // 'kekeruhanAir': null,
//     //     // 'ketinggianAir': null,
//     //   },
//     // ) 

//     // && await TanahModel.deleteMany({
//     //   'kelembapanTanah': null,
//     // },

//     //   await AirModel.deleteMany({
//     //     // 'oksigen': null,
//     //     'kekeruhanAir': null,
//     //     // 'ketinggianAir': null,
//     //   },
//     // );
//     // res.json({ message: "Successfully" });
//   } catch (err) {
//     if (err && err.name === "ValidationError") {
//       return res.status(422).json({
//         error: 1,
//         message: err.message,
//         fields: err.errors,
//       });
//     }
//     next(err);
//   }
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
