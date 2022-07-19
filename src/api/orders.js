import request from "@/utils/request.js";

// 获取订单列表
export const getOderdsList = (query, pagenum = 1, pagesize = 5) => {
    let url = "/orders";
    return request.get(url, { params: { query, pagenum, pagesize } });
};

// 修改订单
export const updateOrdersList = ({
    order_id,
    is_send,
    order_pay,
    order_price,
    order_number,
    pay_status
  }) => {
    let url = `/orders/${order_id}`;
    return request.put(url, {
        is_send,
        order_pay,
        order_price,
        order_number,
        pay_status
    });
  };