import request from "@/utils/request.js";

// 获取商品列表
export const getGoodsList = (query, pagenum = 1, pagesize = 5) => {
  let url = "/goods";
  return request.get(url, { params: { query, pagenum, pagesize } });
};

// 修改商品
export const updateGoodsList = ({
  goods_id,
  goods_name,
  goods_price,
  goods_number,
  goods_weight,
}) => {
  let url = `/goods/${goods_id}`;
  return request.put(url, {
    goods_name,
    goods_price,
    goods_number,
    goods_weight,
  });
};

// 删除商品
export const deleteGoodsList = (id) => {
  let url = `/goods/${id}`;
  return request.delete(url);
};

// 获取商品分类
export const getGoodsCatList = (type = 3) => {
  let url = "/categories";
  return request.get(url, { params: { type } });
};

// 添加商品
export const addGoodsList = ({
  goods_name,
  goods_cat,
  goods_price,
  goods_number,
  goods_weight,
  goods_introduce,
}) => {
  let url = `/goods`;
  return request.post(url, {
    goods_name,
    goods_cat,
    goods_price,
    goods_number,
    goods_weight,
    goods_introduce,
  });
};

// 修改商品分类
export const updateGoodsCat = ({ cat_id, cat_name }) => {
  let url = `/categories/${cat_id}`;
  return request.put(url, { cat_name });
};

// 删除商品分类
export const deleteGoodsCat = (cat_id) => {
  let url = `/categories/${cat_id}`;
  return request.delete(url);
};

// 添加商品分类
export const addGoodsCatList = ({ cat_pid, cat_name, cat_level }) => {
  let url = `/categories`;
  return request.post(url, {
    cat_pid,
    cat_name,
    cat_level,
  });
};

// 获取商品分类参数
export const getGoodsCatAttributes = (id, sel) => {
  let url = `categories/${id}/attributes`;
  return request.get(url, { params: { sel } });
};

// 添加动态、静态参数，共用
export const addCatAttributesList = (
  cat_id,
  attr_name,
  attr_sel,
  attr_vals
) => {
  let url = `/categories/${cat_id}/attributes`;
  return request.post(url, {
    attr_name,
    attr_sel,
    attr_vals,
  });
};

// 删除参数，动态静态共用
export const deleteCatAttributesList = (cat_id, attr_id) => {
  let url = `/categories/${cat_id}/attributes/${attr_id}`;
  return request.delete(url);
};

// 修改参数，动态静态共用
export const updateCatAttributesList = ({
  cat_id,
  attr_id,
  attr_name,
  attr_sel,
  attr_vals,
}) => {
  let url = `/categories/${cat_id}/attributes/${attr_id}`;
  return request.put(url, { attr_id, attr_name, attr_sel, attr_vals });
};

// 获取报表
export const getDataTable = (type = 1) => {
  let url = `reports/type/${type}`;
  return request.get(url);
};
