const express = require('express')
const router = express.Router()
const db = require('./db.js')
const Tools = require('../utils/index');
const multer = require('multer');//upload
const fs = require('fs')


//设置上传地址
const storage = multer.diskStorage({
  destination: `/jane-file/img/${Tools.getNowTimeStamp()}`,
  // destination: `/img/`,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let upload = multer({
  storage: storage
});

router.post('/upload', upload.single('logo'), (req, res, next)=> {
  let sql = `INSERT INTO file(filename,path,type,size) VALUES (${JSON.stringify(req.file.filename)},
  ${JSON.stringify(req.file.path)},${JSON.stringify(req.file.mimetype)},${JSON.stringify(req.file.size)})`;
  db.query(sql,(err,rows)=>{
    if(err){
      res.send(err)
    }else{
      let result = {
        code:0,
        message:'OK',
        data:rows,
        fileInfo:req.file,
        status:true
      };
      res.send(result);
    }
  });
});

//查看所有文件-图片
router.use('/getFileList',(req,res)=>{
  let sql = `SELECT * FROM file`;
  db.query(sql,(err,rows)=>{
    if(err){
      req.send(err)
    }else{
      let result = {
        code:0,
        message:'OK',
        data:rows,
        status:true
      }
      res.send(result);
    }
  })
});

router.use('/download',(req,res,next)=>{
  let file = `${req.body.path}`;
  // let file = `upload/${req.params.filename}`;
  res.download(file);
})

router.use('/deleteFile',(req,res,next)=>{
  //dev
  // let file = `upload/${req.body.filename}`;

  //pro
  let file = req.body.path;

  let sql = `DELETE FROM file WHERE id = ${req.body.id}`;
  db.query(sql,(err,rows)=>{
    if(err){
      req.send(err)
    }else{
      fs.unlinkSync(file);
      let result = {
        code:0,
        message:'OK',
        data:`delete id ${req.body.filename} success`,
        status:true
      };
      res.json(result);
    }
  })
})

module.exports = router;
