const Koa = require("koa");
const router = require("koa-router")();
const response = require("koa2-response");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const mime = require("mime");
const request = require("request");
const fs = require("fs-extra");
const Path = require("path");
const app = new Koa();

const file = "redive_jp.db";
const rediveEstertionPath = "https://redive.estertion.win";
const SqliteDB = require("./database.js");

const db = new SqliteDB(file);
const DBHelper = require("./DBHelper.js");

/**
 * equipment_data           装备数据
 * skill_data               技能数据
 * unit_data                单位数据
 * unit_profile             单位概述
 * unit_promotion           单位rank装备
 * unit_promotion_status    单位rank数据
 * unit_rarity              单位星级数据
 * unit_skill_data          单位技能数据
 * actual_unit_background   现实人物数据
 */

// log request URL:
// app.use(async (ctx, next) => {
//   console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
//   await next();
// });

// add url-route:
router.get("/get/unit_data/list", async (ctx, next) => {
  const data = await db.queryData(DBHelper.getCharaList, {});
  ctx.body = data;
});

router.get("/get/unit_data/base/:unit_id", async (ctx, next) => {
  const charaBase = await db.queryData(DBHelper.getCharaBaseById, {
    $unit_id: ctx.params.unit_id,
  });

  const unitRarity = await db.queryData(DBHelper.getUnitRarity, {
    $unit_id: ctx.params.unit_id,
  });

  const charaPromotion = await db.queryData(DBHelper.getCharaPromotion, {
    $unit_id: ctx.params.unit_id,
  });

  let slots = [];
  for (const key in charaPromotion[0]) {
    if (charaPromotion[0].hasOwnProperty(key)) {
      if (/equip_slot_/.test(key) && charaPromotion[0][key] !== 999999) {
        slots.push(charaPromotion[0][key]);
      }
    }
  }
  const charaPromotionStatus = await db.queryData(DBHelper.getCharaPromotionStatus, {
    $unit_id: ctx.params.unit_id,
  });

  const equipments = await db.queryData(`${DBHelper.getEquipments} ( ${slots.map(() => "?").join(",")} )`, slots);

  // slots.splice(0,slots.length);
  // for (const item of charaPromotion) {
  //   for (const key in item) {
  //     if (item.hasOwnProperty(key)) {
  //       if (/equip_slot_/.test(key) && item[key] !== 999999) {
  //         slots.push(item[key]);
  //       }
  //     }
  //   }
  // }
  // const equipmentsPromotion = await db.queryData(
  //   `${DBHelper.getEquipments} ( ${slots.map(() => '?').join(',')} )`,
  //   slots
  // );

  const uniqueEquipment = await db.queryData(DBHelper.getUniqueEquipment, {
    $unit_id: ctx.params.unit_id,
  });

  const uniqueEquipmentEnhance = await db.queryData(DBHelper.getUniqueEquipmentEnhance, {
    $unit_id: ctx.params.unit_id,
  });

  const unitSkillData = await db.queryData(DBHelper.getUnitSkillData, {
    $unit_id: ctx.params.unit_id,
  });

  let skillArr = [];

  unitSkillData.forEach((element) => {
    for (const key in element) {
      if (/(skill_|union_)/.test(key) && element[key]) {
        skillArr.push(element[key]);
      }
    }
  });

  const skillData = await db.queryData(`${DBHelper.getSkillData} ( ${skillArr.map(() => "?").join(",")} )`, skillArr);

  let actionArr = [];

  skillData.forEach((element) => {
    for (const key in element) {
      if (/(action_)/.test(key) && element[key]) {
        actionArr.push(element[key]);
      }
    }
  });

  const skillAction = await db.queryData(`${DBHelper.getSkillAction} ( ${actionArr.map(() => "?").join(",")} )`, actionArr);

  const unitAttackPattern = await db.queryData(DBHelper.getUnitAttackPattern, {
    $unit_id: ctx.params.unit_id,
  });

  const charaStoryStatus = await db.queryData(DBHelper.getCharaStoryStatus, {
    $charaId: ctx.params.unit_id.slice(0, -2),
  });

  ctx.body = {
    charaBase,
    charaStoryStatus,
    unitRarity,
    charaPromotion,
    charaPromotionStatus,
    equipments,
    equipmentsPromotion,
    uniqueEquipment,
    uniqueEquipmentEnhance,
    unitSkillData,
    skillData,
    skillAction,
    unitAttackPattern,
  };
});

router.get("/get/unit_data/maxLevel", async (ctx, next) => {
  const level = await db.queryData(DBHelper.maxCharaLevel);
  ctx.body = level
});

router.get("/db/close", async (ctx, next) => {
  db.close();
  ctx.success({ success: true });
});

router.get("/redive/estertion/:type1/:type2/:id", async (ctx, next) => {
  const requestPath = `${ctx.params.type1}/${ctx.params.type2}/${ctx.params.id}.webp`;
  const resPath = `${rediveEstertionPath}/${requestPath}`;
  await rediveEstertion(ctx, resPath, `./img/${requestPath}`);
});

const rediveEstertion = async (ctx, resPath, requestPath) => {
  const { request, response } = ctx;
  const filePath = Path.resolve(__dirname, requestPath);

  const exist = fs.existsSync(filePath);
  if (!exist) {
    await getEstertionImg(resPath, filePath);
  }

  const ifModifiedSince = request.headers["if-modified-since"];
  const imageStatus = await fs.stat(filePath);
  const lastModified = imageStatus.mtime.toGMTString();
  if (ifModifiedSince === lastModified) {
    response.status = 304;
  } else {
    response.lastModified = lastModified;
    // responseFile(filePath, ctx);
    const fileContent = fs.readFileSync(filePath);
    ctx.type = mime.getType(filePath);
    ctx.body = fileContent;
  }
};

const getEstertionImg = async (url, filePath) => {
  return new Promise((resolve, reject) => {
    let stream = request(url).pipe(fs.createWriteStream(filePath));
    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
};

// const responseFile = (path, context, encoding) => {
//   const fileContent = fs.readFileSync(path, encoding);
//   context.type = mime.getType(path);
//   context.body = fileContent;
// };

// add middleware:
app.use(
  cors({
    origin: function(ctx) {
      //设置允许来自指定域名请求
      // if (ctx.url === '/test') {
      // return '*'; // 允许来自所有域名请求
      // }
      return "*";
      // return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);
app.use(response);
app.use(bodyParser());
app.use(router.routes());

app.listen(3000);

console.log("app started at port 3000...");
