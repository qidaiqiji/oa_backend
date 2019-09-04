import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetGoodsStatisticsListConfig() {
  return request('/sale/goods/config');
}

export async function reqGetGoodsStatisticsListGoodsList(params) {
  return request(`/sale/goods/order-goods-list?${stringify(params)}`);
}

// /goodsStatisticsList/export-goods-statistics-list
