// 封装一个登录操作
import request from "@/utils/request.js";

//后台登录接口
export const login = ({ username, password }) => {
  let url = "/login";
  return request.post(url, { username, password });
};

// 获取用户信息列表
export const getUserList = (query, pagenum = 1, pagesize = 5) => {
  let url = "/users";
  // 这里不用写header的原因是，封装的时候已经将token写入了
  return request.get(url, { params: { query, pagenum, pagesize } });
};

// 新增用户
export const addUserList = ({ username, password, email, mobile }) => {
  let url = "/users";
  return request.post(url, { username, password, email, mobile });
};

// 删除用户
export const delUserList = (id) => {
  let url = `/users/${id}`;
  return request.delete(url, { params: { id } });
};

// 修改用户
export const updateUserList = ({ id, email, mobile }) => {
  let url = `users/${id}`;
  return request.put(url, { email, mobile });
};

// 修改用户状态
export const switchUserStatus = (uid, type) => {
  let url = `/users/${uid}/state/${type}`;
  return request.put(url, { uid, type });
};

// 分配用户角色
export const changeRoleList = ({ id, rid }) => {
  let url = `/roles/${id}/rights`;
  return request.post(url, { rid });
};

// 获取权限列表
export const getPermissionList = (type) => {
  let url = `/rights/${type}`;
  return request.get(url, { params: { type } });
};

// 获取角色列表
export const getRoleList = () => {
  let url = `/roles/`;
  return request.get(url);
};

// 根据ID获取角色列表
export const getRoleListByID = (id) => {
  let url = `/roles/${id}`;
  return request.get(url);
};

// 新增角色
export const addRoleList = ({ roleName, roleDesc }) => {
  let url = "/roles";
  return request.post(url, { roleName, roleDesc });
};

// 修改角色
export const updateRoleList = ({ id, roleName, roleDesc }) => {
  let url = `roles/${id}`;
  return request.put(url, { roleName, roleDesc });
};

// 删除角色
export const delRoleList = (id) => {
  let url = `/roles/${id}`;
  return request.delete(url, { params: { id } });
};
