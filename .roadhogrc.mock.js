import mockjs from "mockjs";
import { getRule, postRule } from "./mock/rule";
import { getActivities, getNotice, getFakeList } from "./mock/api";
import { getFakeChartData } from "./mock/chart";
import { imgMap } from "./mock/utils";
import { getProfileBasicData } from "./mock/profile";
import { getProfileAdvancedData } from "./mock/profile";
import { getNotices } from "./mock/notices";
import { format, delay } from "roadhog-api-doc";

import { common } from "./mock/common/index";

import {
  saleOrderReceive,
  afterSaleOrderPay,
  paymentRecord,
  purchaseOrderPay,
  purchaseAfterSaleOrderReceive,
  purchaseOrderPayDetail,
} from './mock/finance/index';

import {
  supplierList,
  supplierEditList,
  purchaseOrderList,
  commonPurchaseOrderAdd,
  commonPurchaseOrderDetail,
  supplyGoodsList,
  awaitSalePurchaseOrderList,
  salePurchaseOrderList,
  salePurchaseOrderDetail,
  purchaseAfterSaleOrderList,
  purchaseAfterSaleOrderEdit,
  purchaseAfterSaleOrderDetail,
  supplierFundList,
  supplierFundDetail,
} from "./mock/purchase/index";

import {
  saleAwaitOutStoreOrderList,
  salePushOrderList,
  outStoreAdd,
  saleOrderAdd,
  saleOrderList,
  saleOrderDetail,
  afterSaleOrderList,
  afterSaleOrderAdd,
  afterSaleOrderDetail,
  goodsStatisticsList,
  customerFundList,
  customerFundDetail
} from "./mock/sale/index";

import {
  goodsStockList,
  importInventoryList,
  inStoreList,
  inStoreAdd,
} from "./mock/warehouse/index"

import {
  goodsManage,
} from './mock/operation/index'

// 是否禁用代理
const noProxy = process.env.NO_PROXY === "true";
// 用户 --- 开始
const user = {
  "POST /erp-site/login": {
    $desc: "登录接口",
    $params: {
      username: {
        desc: "登录账号",
        exp: "13556215779"
      },
      password: {
        desc: "登录密码",
        exp: "abcdjxkkai1"
      }
    },
    $body: {
      code: 0,
      data: {
        nickname: "陈泽森",
        avatar: "头像地址",
        token: "xxjakljcldkj=123x|-21"
      }
    }
  },
  "POST /erp-site/check-token": {
    $desc: "自动登录认证接口",
    $body: {
      code: 0,
      data: {
        nickname: "陈泽森",
        avatar: "头像地址",
        token: "asdxjsjjxkkajxz123jjs=-"
      },
      msg: "成功"
    }
  }
};
// 用户 --- 结束

// 框架自带 业务无关 --- 开始
const other = {
  // 支持值为 Object 和 Array
  // GET POST 可省略
  "GET /api/currentUser": {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: "分页",
        exp: 2
      }
    },
    $body: {
      code: 0,
      data: {
        name: "Serati Ma",
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/eHBsAsOrrJcnvFlnzNTT.png",
        userid: "00000001",
        notifyCount: 12
      },
      msg: "请求成功"
    }
  },
  "GET /api/users": [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park"
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park"
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park"
    }
  ],
  "GET /api/project/notice": getNotice,
  "GET /api/activities": getActivities,
  "GET /api/rule": getRule,
  "POST /api/rule": {
    $params: {
      pageSize: {
        desc: "分页",
        exp: 2
      }
    },
    $body: postRule
  },
  "POST /api/forms": (req, res) => {
    res.send({ message: "Ok" });
  },
  "GET /api/tags": mockjs.mock({
    "list|100": [{ name: "@city", "value|1-100": 150, "type|0-2": 1 }]
  }),
  "GET /api/fake_list": getFakeList,
  "GET /api/fake_chart_data": getFakeChartData,
  "GET /api/profile/basic": getProfileBasicData,
  "GET /api/profile/advanced": getProfileAdvancedData,
  "POST /api/login/account": (req, res) => {
    const { password, userName } = req.body;
    res.send({
      status: password === "888888" && userName === "admin" ? "ok" : "error",
      type: "account"
    });
  },
  "POST /api/login/mobile": (req, res) => {
    res.send({ status: "ok", type: "mobile" });
  },
  "POST /api/register": (req, res) => {
    res.send({ status: "ok" });
  },
  "GET /api/notices": getNotices
};
// 框架自带 业务无关 --- 结束

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 财务管理 --- 销售单应收
  ...saleOrderReceive,
  // 财务管理 --- 售后单应收
  ...afterSaleOrderPay,
  // 财务管理 --- 账期审核
  ...paymentRecord,
  // 财务管理 --- 采购单应付
  ...purchaseOrderPay,
  // 财务管理 --- 采购售后单应收
  ...purchaseAfterSaleOrderReceive,
  // 财务管理 --- 采购应付详情
  ...purchaseOrderPayDetail,

  // 采购管理 --- 供应商列表
  ...supplierList,
  // 采购管理 --- 供应商详情/编辑/新增
  ...supplierEditList,
  // 采购管理 --- 采购单列表
  ...purchaseOrderList,
  // 采购管理 --- 新建常规采购单
  ...commonPurchaseOrderAdd,
  // 采购管理 --- 常规采购单详情
  ...commonPurchaseOrderDetail,
  // 采购管理 --- 供应商品列表
  ...supplyGoodsList,
  // 采购管理 --- 待销售采购订单列表
  ...awaitSalePurchaseOrderList,
  // 采购管理 --- 销售采购订单列表
  ...salePurchaseOrderList,
  // 采购管理 --- 销售采购订单详情
  ...salePurchaseOrderDetail,
  // 采购管理 --- 采购售后单列表
  ...purchaseAfterSaleOrderList,
  // 采购管理 --- 新增采购售后单
  ...purchaseAfterSaleOrderEdit,
  // 采购管理 --- 采购售后单详情
  ...purchaseAfterSaleOrderDetail,
  // 采购管理 --- 供应商资金管理
  ...supplierFundList,
  // 采购管理 --- 供应商资金明细
  ...supplierFundDetail,

  // 销售管理 --- 待出库订单
  ...saleAwaitOutStoreOrderList,
  // 销售管理 --- 出库订单列表
  ...salePushOrderList,
  // 销售管理 --- 新增出库单
  ...outStoreAdd,
  // 销售管理 --- 新建/修改订单列表
  ...saleOrderAdd,
  // 销售管理 --- 销售单列表
  ...saleOrderList,
  // 销售管理 --- 销售详情
  ...saleOrderDetail,
  // 销售管理 --- 售后单列表
  ...afterSaleOrderList,
  // 销售管理 --- 新建/修改售后单
  ...afterSaleOrderAdd,
  // 销售管理 --- 售后单详情
  ...afterSaleOrderDetail,
  // 销售管理 --- 商品统计列表
  ...goodsStatisticsList,
  // 销售管理 --- 用户资金列表
  ...customerFundList,
  // 销售管理 --- 用户资金详情
  ...customerFundDetail,

  // 仓库管理 --- 商品库存
  ...goodsStockList,
  // 仓库管理 --- 导入盘点单
  ...importInventoryList,
  // 仓库管理 --- 入库单列表
  ...inStoreList,
  // 仓库管理 --- 新增入库单
  ...inStoreAdd,

  // 运营模块
  ...goodsManage,
  // --- 用户
  ...user,
  // --- 业务无关
  ...other,
  // --- 通用接口
  ...common
};

// export default (noProxy ? {} : delay(proxy, 1000));
