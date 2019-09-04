import { stringify } from 'qs';
import request from '../utils/request';

export async function saleOutInvFollowList(params) {
  return request(`/sale/out-inv-follow/list?${stringify(params)}`);
}
export async function salesInvoiceInvoiceConfig(params) {
  return request(`/finance/invoice-bill/config?${stringify(params)}`);
}

export async function salesRemark(params) {
  return request(`/sale/out-inv-follow/update-remark?${stringify(params)}`, {
    method: 'POST',
  });
}
