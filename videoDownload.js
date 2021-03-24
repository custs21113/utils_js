// const _request = require('request');
const _fs = require('fs');
const _cheerio = require('cheerio');
const _puppeteer = require('puppeteer');
const _ffmpegStatic = require('ffmpeg-static');
const _axios = require('axios');
const _exec = require('child_process').exec;
const _ffmpeg = require('ffmpeg')
// const _path = require('path');

exports.videoDownload = async function (url) {
    console.log('dd')
    const browser = await _puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true
    })
    console.log('dd1')
    let page = await browser.newPage();
    await page.goto(url);

    let allHtml = await page.$eval('head', ele => ele.outerHTML);
    let $ = _cheerio.load(allHtml);


    let title = $('title').text().replace('\u005f\u54d4\u54e9\u54d4\u54e9\u0020\u0028\u309c\u002d\u309c\u0029\u3064\u30ed\u0020\u5e72\u676f\u007e\u002d\u0062\u0069\u006c\u0069\u0062\u0069\u006c\u0069','');
    title = title.replace(/ /igm,'_');
    title = title.trim();
    console.log(title);
    let stringHt = $.html();

    let url1 = stringHt.substr($.html().indexOf('"baseUrl"') + 11,
        $.html().indexOf('"base_url"') - $.html().indexOf('"baseUrl"') - 13);
    let url2 = stringHt.substr($.html().lastIndexOf('"baseUrl"') + 11,
        $.html().lastIndexOf('"base_url"') - $.html().lastIndexOf('"baseUrl"') - 13);

    let videoWriter = _fs.createWriteStream(`${__dirname}\\video.m4s`)
    await _axios({
        url: url1,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.50',
            'Accept': '*/*',
            'Accept-Encoding': 'identity',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Origin': 'https://www.bilibili.com',
            'Range': 'bytes=0-998685999999',
            'Referer': 'https://www.bilibili.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
        },
        responseType: 'stream'
    }).then((res) => {
        res.data.pipe(videoWriter);
        return new Promise((resolve, reject) => {
            videoWriter.on('finish', resolve)
            videoWriter.on('error', reject)
        });
    }).catch(err => {
        console.log(err);
    })

    let audioWriter = _fs.createWriteStream(`${__dirname}\\audio.m4s`);
    await _axios({
        url: url2,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.50',
            'Accept': '*/*',
            'Accept-Encoding': 'identity',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Origin': 'https://www.bilibili.com',
            'Range': 'bytes=0-998685999999',
            'Referer': 'https://www.bilibili.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
        },
        responseType: 'stream'
    }).then(res => {
        res.data.pipe(audioWriter);
        return new Promise((resolve, reject) => {
            audioWriter.on('finish', resolve)
            audioWriter.on('error', reject)
        });
    }).
    // then(async () => {
    //     _ffmpeg.video.execCommand(`ffmpeg -i ${__dirname}\\video.m4s -i ${__dirname}\\audio.m4s -codec copy result.mp4`,function(err, video){
    //       console.loe(err)

    //     })
        // let command = `${_ffmpegStatic} -i ${__dirname}\\video.m4s -i ${__dirname}\\audio.m4s -codec copy result.mp4`;
        //  _exec(command, function (err) {
        //     console.log(err);
        //     _fs.writeFile('log.txt', String(err),'utf8', (error)=>{
        //       console.log(error)
        //     })
        //     console.log('合成失败');
        // });
        // console.log('下载完成');
        // _fs.rename(`result.mp4`,`${title}.mp4`);
        // _fs.unlinkSync(`video.m4s`);
        // _fs.unlinkSync(`audio.m4s`);
        // process.exit();
    // }).
    catch(error=>{
      console.log(error)
    });


    // finally((resolve) => {
    //     let command = `${_ffmpegStatic} -i ${title}a.m4s -i ${title}b.m4s -codec copy ${title}.mp4`;
    //     command = `${_ffmpegStatic} -i a.m4s -i b.m4s -codec copy ab.mp4`;
    //     _exec(command, function (err) {
    //         console.log('下载完成');
    //         process.exit;
    //     });
    // },(reject)=>{
    //     console.log('失败');
    // });
    // url1 = `https://upos-sz-mirrorkodo.bilivideo.com/upgcxcode/11/47/190884711/190884711-1-30112.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1611739152&gen=playurl&os=kodobv&oi=3078672639&trid=6e2fd4c82f1540279dc6c20642289f53u&platform=pc&upsig=a922518e431e3dd55ab33eac4e2bf2b2&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=28755670&orderid=0,3&agrr=1&logo=80000000`;
    // _request({
    //     url: url1,
    //     method: 'GET',
    //     headers: {
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.50',
    //         'Accept': '*/*',
    //         'Accept-Encoding': 'identity',
    //         'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    //         'Origin': 'https://www.bilibili.com',
    //         'Range': 'bytes=0-998685999999',
    //         'Referer': 'https://www.bilibili.com/',
    //         'Sec-Fetch-Dest': 'empty',
    //         'Sec-Fetch-Mode': 'cors',
    //         'Sec-Fetch-Site': 'cross-site'
    //     }
    // }).pipe(stream).on("close", function (err) {
    //     let stream = _fs.createWriteStream(title + 'b.m4s');
    //     _request({

    //         url: url2,
    //         method: 'GET',
    //         headers: {
    //             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.50',
    //             'Accept': '*/*',
    //             'Accept-Encoding': 'identity',
    //             'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    //             'Origin': 'https://www.bilibili.com',
    //             'Range': 'bytes 0-998685999999',
    //             'Referer': 'https://www.bilibili.com/',
    //             'Sec-Fetch-Dest': 'empty',
    //             'Sec-Fetch-Mode': 'cors',
    //             'Sec-Fetch-Site': 'cross-site'
    //         }
    //     }).pipe(stream).on("close", function (err) {
    //         _exec(`${_ffmpegStatic} -i ${title}a.m4s -i ${title}b.m4s -codec copy ${title}.mp4`,
    //             function (err) {
    //                 console.log(title + '下载完成')
    //             })
    //     })
    // })
}
// downVideo(`https://www.bilibili.com/video/BV1Rh411y7kB`)