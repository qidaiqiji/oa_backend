import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';

export async function reqList(params) {
  const data = {
    ...params,
  };
  if (data.status === undefined) {
    data.status = -1;
  }
  if (data.type === undefined) {
    data.status = -1;
  }
  return request(`/depot/sales-export-depot-order/list?${stringify(params)}`);
}

export async function reqStatus(params) {
  return request(`/depot/sales-export-depot-order/get-status-map?${stringify(params)}`, {
  });
}

export async function reqPush(params) {
  return request('/depot/sales-export-depot-order/push', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqRemove(params) {
  return request('/depot/sales-export-depot-order/rollback', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqCheck(params) {
  return request('/depot/sales-export-depot-order/director-check-pass', {
    method: 'POST',
    body: {
      id: params.currentPushOrderId,
    },
  });
}
export async function reqRollBack(params) {
  return request('/depot/sales-export-depot-order/depot-roll-back', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqFastPush(params) {
  return request(`/depot/sales-export-depot-order/batch-push?${stringify(params)}`);
}

