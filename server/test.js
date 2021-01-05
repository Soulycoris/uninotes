const request = require('request');

request(
  {
    url:
      'https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report-collect%2Fa',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
      Cookie:
        'sid=kblab9ht; CNZZDATA1275376637=511102533-1589612810-https%253A%252F%252Fgame.bilibili.com%252F%7C1605710911; _csrf=nO1VxpOZlX9EneNWZdHTMqYK; UM_distinctid=175dc0eeb518c-07f2481d90cb42-4c3f2678-240000-175dc0eeb52a18; session-api=kq5hukf2aunea08vco5dr058b7; DedeUserID=615201; DedeUserID__ckMd5=1f10c01581c95355; SESSDATA=9912b30f%2C1621267138%2Cbb53d*b1; bili_jct=f2ab46f12c43f5aa4a836ed28a59c7c4',
    },
  },
  (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      console.log(info);
    }
  }
);
