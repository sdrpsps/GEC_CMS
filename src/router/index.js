import Vue from "vue";
import VueRouter from "vue-router";
// 引入页面组件
import Login from "@/views/login/index.vue";
import Dashboard from "@/views/dashboard/index.vue";
import UserList from "@/views/user/list.vue";
import RoleList from "@/views/role/roleList.vue";
import PermissionList from "@/views/role/permissionList.vue";
import GoodsList from "@/views/goods/goodsList.vue";
import GoodsClass from "@/views/goods/goodsClass.vue";
import GoodsParams from "@/views/goods/goodsParams.vue";
import addGoods from "@/views/goods/addGoods.vue"
import ordersList from "@/views/orders/index.vue";
import dataTable from "@/views/dataTable/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Dashboard,
    meta: {
      title: "首页",
      needAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录",
      needAuth: false,
    },
  },
  {
    path: "/admin",
    name: "dashboard",
    component: Dashboard,
    meta: {
      title: "首页",
      needAuth: true,
    },
    children: [
      {
        path: "user/list",
        component: UserList,
        meta: {
          title: "用户列表",
          needAuth: true,
        },
      },
      {
        path: "role/roleList",
        component: RoleList,
        meta: {
          title: "角色列表",
          needAuth: true,
        },
      },
      {
        path: "role/permissionList",
        component: PermissionList,
        meta: {
          title: "权限列表",
          needAuth: true,
        },
      },
      {
        path: "goods/goodsList",
        component: GoodsList,
        meta: {
          title: "商品列表",
          needAuth: true,
        },
      },
      {
        path: "goods/goodsClass",
        component: GoodsClass,
        meta: {
          title: "商品分类",
          needAuth: true,
        },
      },
      {
        path: "goods/goodsParams",
        component: GoodsParams,
        meta: {
          title: "分类参数",
          needAuth: true,
        },
      },
      {
        path: "goods/goodsList/add",
        component: addGoods,
        meta: {
          title: "添加商品",
          needAuth: true,
        },
      },
      {
        path: "orders/ordersList",
        component: ordersList,
        meta: {
          title: "订单管理",
          needAuth: true,
        },
      },
      {
        path: "dataTable/data",
        component: dataTable,
        meta: {
          title: "数据报表",
          needAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});
// 前置守卫
router.beforeEach((to, from, next) => {
  let { title, needAuth } = to.meta;
  let token = localStorage.getItem("token");
  if (needAuth) {
    if (token) {
      next();
      document.title = title;
    } else {
      next("/login");
      this.$message.warning("请先登录！")
    }
  } else {
    next();
    document.title = title;
  }
});

export default router;
