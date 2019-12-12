// /*
//  * @Author: jianghong.wei
//  * @Date: 2019-11-21 15:07:35
//  * @Last Modified by: jianghong.wei
//  * @Last Modified time: 2019-12-07 18:09:50
//  * mongodb管理
//  */
const mongoose = require('mongoose');
// import * as config from "./config";
// const mongoConf = config.get("mongo");
const mongoConf = {
  "host": process.env.mongo_host,
  "port": process.env.mongo_port,
  "user": process.env.mongo_user,
  "password": process.env.mongo_password
}
// // mongoose.connect('mongodb://用户名:密码@127.0.0.1:27017/数据库名称')
const DB_URL = (function() {
  if (mongoConf.user && mongoConf.password) {
    return `mongodb://${mongoConf.user}:${mongoConf.password}@${mongoConf.host}:${mongoConf.port}/admin`;
  } else {
    return `mongodb://${mongoConf.host}:${mongoConf.port}/admin`;
  }
})();

module.exports = {
  connect: function() {
    mongoose.connect(DB_URL, err => {
      if (err) {
        // this.isConnected = false;
        console.log("Mongoose 连接错误: " + err);
      } else {
        // this.isConnected = true;
        console.log("Mongoose 连接成功 " + DB_URL);
      }
    });
  },
  insert: function(collection, schema, value) {
    const Model = mongoose.model(collection, schema);
    //使用链式写法
    return new Model(value).save();
  }
}

// /**
//  * 连接断开
//  */
// mongoose.connection.on("disconnected", function() {
//   console.log("Mongoose 连接断开");
// });

// class Mongo {
//   constructor() {
//     /**
//      * 连接
//      */
//     mongoose.connect(DB_URL, err => {
//       if (err) {
//         this.isConnected = false;
//         console.log("Mongoose 连接错误: " + err);
//       } else {
//         this.isConnected = true;
//         console.log("Mongoose 连接成功 " + DB_URL);
//       }
//     });
//   }
//   // 条件查询或者查询所有
//   find(collection, schema, condition) {
//     const Model = mongoose.model(collection, schema);
//     if (condition) {
//       return Model.find(condition, {_id: 0, __v: 0});
//     } else {
//       return Model.find({}, {_id: 0, __v: 0});
//     }
//   }
//   // 插入一个
//   insert(collection, schema, value) {
//     const Model = mongoose.model(collection, schema);
//     //使用链式写法
//     return new Model(value).save();
//   }
//   // 更新一个
//   update(
//     collection,
//     schema,
//     condition,
//     value
//   ) {
//     const Model = mongoose.model(collection, schema);
//     return Model.updateOne(condition, value);
//   }
//   // 删除所有
//   del(collection, schema, condition) {
//     const Model = mongoose.model(collection, schema);
//     return Model.remove(condition);
//   }

//   getModal(collection, schema) {
//     const Modal = mongoose.model(collection,schema);
//     return Modal;
//   }

//   isConnected = false;
// }

// // export default new Mongo();
// const mongo = new Mongo();

// module.exports = mongo;


