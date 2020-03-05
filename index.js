const express = require('express');
const app = express();
// const fs = require("fs");  //如果需要保存到文件
const superagent= require('superagent');
const cheerio = require('cheerio');


let server = app.listen(3003, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log('小五的爬虫正在运行', host, port);
});


//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


//开放接口
app.get('/', function (req, response) {

    let url = "https://www.daydaycook.com/daydaycook/hk/website/index.do";
    let bannerList = [];

/**
 * index.js
 * [description] - 使用superagent.get()方法来访问要爬的页面
 */
//要爬的页面
    superagent.get(url).end((err, res) => {
      if (err) {
        // 如果访问失败或者出错，会这行这里
        console.log(`爬虫失败 - ${err}`)
        response.json(`爬虫失败~"${err}`)
      } else {
       // 访问成功，请求的页面所返回的数据会包含在res
       bannerList = getBannerList(res.text);
       response.json(bannerList)

      }
    });

});


app.get('/data', function (req, response) {

    //根据id 爬到相应的页面，
    let id = req.query.id;
    let url = "https://www.daydaycook.com/daydaycook/hk/website/recipe/details.do?id="+id;
    let data = [];

/**
 * index.js
 * [description] - 使用superagent.get()方法来访问要爬的页面
 */
//要爬的页面
    superagent.get(url).end((err, res) => {
      if (err) {
        // 如果访问失败或者出错，会这行这里
        console.log(`爬虫失败 - ${err}`)
        response.json(`爬虫失败~"${err}`)
      } else {
       // 访问成功，请求的页面所返回的数据会包含在res
       data = getData(res.text);
       response.json(data)
      }
    });

});


//获取轮播图
let getBannerList = (res) => {
    let bannerList = [];
    let $ = cheerio.load(res);
    $("#banner .banner .item a .span-class").each((idx, ele)=>{
        bannerList.push({text:ele.children[0].data});
    });
    $("#banner .banner .item img").each((index, ele)=>{
        bannerList[index].imgUrl = ele.attribs["data-src"];
    });
    return bannerList;
}


//获取数据
let getData = (res) =>{
    let $ = cheerio.load(res)
    // data.title= $("#details .detailWood .title b").text();
    // data.date= $("#details .detailWood .time").text();
    let html = "";
    html += $.html('#details .detailWood');
    html += $.html('#details .detailFood');
    html += $.html('#details .detailStep');
    html += $.html('#details .userRecipe');
    // console.log(data);

    return {
        code:1,
        msg : "请求成功！",
        html,
    };
}


  // //写入文件的方法
// let writeFile = (content)=>{
//     fs.writeFile('./data/all.txt', content, function (err) {

//         if (err) {
//             console.log('写入失败', err);
//         } else {
//             console.log('页面写入成功,写入路径'+"./data/all.txt");
//         }
//     })
// }

// 创建文件
// fs.mkdir('./data', function (err) {
//     console.log("正在创建data文件夹");
//     if (!err) {

//     }else{
//         console.log("data文件夹已存在");
//     }
// })
// writeFile(res.text);
