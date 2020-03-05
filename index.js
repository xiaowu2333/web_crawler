/*
 * @Descripttion: 小五的爬虫
 * @version: 1.1
 * @Author: xiaowu
 * @Date: 2020-03-05 10:51:49
 * @LastEditors: xiaowu
 * @LastEditTime: 2020-03-05 13:46:42
 */

//引入资源
const express = require('express');
const app = express();
const superagent= require('superagent');
const cheerio = require('cheerio');
// const fs = require("fs");  //如果需要保存到文件，请解开

//开启服务，监听端口3003
let server = app.listen(3003, function () {
  let host = server.address().address;
  let port = server.address().port;
  // 创建文件夹
  // myMkdir(); //如果需要保存到文件，请解开
  console.log('小五的爬虫已就绪，请浏览器访问:',"localhost:"+port);
});

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

//开放接口:访问路径 http://localhost:3003
app.get('/', function (req, response) {

    let url = "https://www.daydaycook.com/daydaycook/hk/website/index.do";
    let bannerList = [];

/**
 * [description] - 使用superagent.get()方法来访问要爬的页面
 *
 * 如果想要带上cookie，或者header
 * 写法：
 * let cookie = "这里是cookis"  //网页的cookie可以通过控制台 document.cookie获取
 * superagent.get(url).set("Cookie",cookies).end()
 */
//要爬的页面
    superagent.get(url).end((err, res) => {
      if (err) {
        // 如果访问失败或者出错，会这行这里
        console.log(`爬虫失败 - ${err}`)
        response.json(`爬虫失败~"${err}`)
      } else {
       // 访问成功，请求的页面所返回的数据会包含在res
       //去除换行
       let str = res.text.replace(/\r\n/g,"");
       bannerList = getBannerList(str);

      //  writeFile(JSON.stringify(bannerList),"./data/all.json");  //写入到文件  //如果需要保存到文件，请解开

       response.json(bannerList)

      }
    });

});

//开放接口:访问路径 http://localhost:3003/data?id=186900
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

       //去除换行
       let str = res.text.replace(/\r\n/g,"");
       data = getData(str);

      //  writeFile(JSON.stringify(data),"./data/data.json");  //写入到文件 //如果需要保存到文件，请解开

       //返回数据给接口
       response.json(data)
      }
    });

});


/**
 * @name: getBannerList
 * @test: test font
 * @msg: 获取轮播图,返回数组
 * @param {content:String} 传入html字符串
 * @return: Array
 */
let getBannerList = (content) => {
    let bannerList = [];
    let $ = cheerio.load(content);
    $("#banner .banner .item a .span-class").each((idx, ele)=>{
        bannerList.push({text:ele.children[0].data});
    });
    $("#banner .banner .item img").each((index, ele)=>{
        bannerList[index].imgUrl = ele.attribs["data-src"];
    });
    return bannerList;
}


/**
 * @name: getData
 * @test: test font
 * @msg:  获取数据
 * @param {content:String} 传入html字符串
 * @return: Object
 */
let getData = (content) =>{
    let $ = cheerio.load(content)
    // data.title= $("#details .detailWood .title b").text();
    // data.date= $("#details .detailWood .time").text();
    let html = "";
    html += $.html('#details .detailWood');
    html += $.html('#details .detailFood');
    html += $.html('#details .detailStep');
    html += $.html('#details .userRecipe');
    // console.log(data);
    html = html.replace(/\r\n/g,"");
    return {
        code:1,
        msg : "请求成功！",
        html,
    };
}


/**
 * @name: writeFile
 * @test: test font
 * @msg: 写入文件 //如果需要保存到文件，请解开
 * @param {content:String,path:pathString}
 * @return: void
 */
// let writeFile = (content,path="./data/all.txt")=>{
//     fs.writeFile(path, content, function (err) {
//         if (err) {
//             console.log('写入失败', err);
//         } else {
//             console.log('页面写入成功,写入路径'+path);
//         }
//     })
// }


/**
 * @name:myMkdir
 * @test: test font
 * @msg: 创建文件夹 //如果需要保存到文件，请解开
 * @param {path:String}
 * @return:void
 */

//  let myMkdir = (path="./data")=>{
//     fs.mkdir(path, function (err) {
//       if (!err) {
//         console.log("正在创建data文件夹");
//         }else{
//             console.log("data文件夹已存在,无需创建");
//         }
//     })
// }


