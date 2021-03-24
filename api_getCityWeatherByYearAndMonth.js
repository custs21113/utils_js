let axios = require("axios")
let cheerio = require("cheerio")
let fs = require('fs')

let url = `http://tianqi.2345.com/wea_history/58457.htm`
let repos = [];

const storeData = (data, path) =>{
	try{
		fs.writeFileSync(path, JSON.stringify(data))
	} catch (err){
		console.log(err)
	}
}
let getCityWeatherByYearAndMonth = (provinceID,cityID,year,month) => {
	let filename = '\\'+[provinceID,cityID,year,month].join("_")+'.txt';
	axios.get(url).then(res =>{
	axios.get(`http://tianqi.2345.com/Pc/GetHistory?areaInfo%5BareaId%5D=${provinceID}&areaInfo%5BareaType%5D=${cityID}&date%5Byear%5D=${year}&date%5Bmonth%5D=${month}`)
		.then((res)=>{
			let $ = cheerio.load(res.data.data);
    		let trs = $(".history-table tr")
    		console.log(trs.length);
    		for(let i=1;i<trs.length;i++){
    			let tr = trs.eq(i); 
    			let repo = {
    				date:tr.find("td").eq(0).text().trim(),
    				highT:tr.find("td").eq(1).text().trim(),
    				lowT:tr.find("td").eq(2).text().trim(),
    				weather:tr.find("td").eq(3).text().trim(),
    				windLevel:tr.find("td").eq(4).text().trim(),
    				airQ:tr.find("td").eq(5).text().trim()
    			};
    			repos.push(repo);
    		};
			console.log(repos);
			storeData(repos,__dirname+filename);
		}).catch((err)=>{
			console.log(err);
		});
	}).catch((err)=>{
	console.log(err);
	})
}

getCityWeatherByYearAndMonth(58457,2,2020,9);
exports.getCityWeatherByYearAndMonth = getCityWeatherByYearAndMonth;