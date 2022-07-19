<template>
  <div class="dashboard">
    <el-container>
      <el-header>
        <div class="left">
          <h2>雏鹰综合管理后台系统</h2>
        </div>
        <div class="right">
          <div class="avatar">
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            ></el-avatar>
          </div>
          <div class="dropdown">
            <el-dropdown>
              <span class="el-dropdown-link">
                我的<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided @click.native="logOut"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container>
        <!-- 侧栏 start -->
        <!-- router启用vue路由功能 -->
        <el-aside width="200px">
          <el-menu
            default-active=""
            class="aside-menu"
            @open="handleOpen"
            @close="handleClose"
            router
          >
            <!-- 用户管理 -->
            <el-submenu index="a">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/admin/user/list">用户列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 权限管理 -->
            <el-submenu index="b">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/admin/role/roleList"
                  >角色列表</el-menu-item
                >
                <el-menu-item index="/admin/role/permissionList"
                  >权限列表</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <!-- 商品管理 -->
            <el-submenu index="c">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/admin/goods/goodsList"
                  >商品列表</el-menu-item
                >
                <el-menu-item index="/admin/goods/goodsParams"
                  >分类参数</el-menu-item
                >
                <el-menu-item index="/admin/goods/goodsClass"
                  >商品分类</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <!-- 订单管理  -->
            <el-submenu index="d">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/admin/orders/ordersList"
                  >订单列表</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <!-- 数据统计 -->
            <el-submenu index="e">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/admin/dataTable/data"
                  >数据报表</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 侧栏 end -->

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logOut() {
      this.$confirm("退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.removeItem("token");
          this.$message.success("你已退出后台~");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出登录",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.dashboard {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100px;
    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .dropdown {
      cursor: pointer;
    }
  }
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  // line-height: 160px;
}

.el-container {
  height: 100%;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>