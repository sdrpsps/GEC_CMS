<template>
  <div class="permission">
    <!-- 面包屑 -->
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="permissionList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <!-- :formatter="levelFormat"用途是格式化接口返回的数据并显示在表格上 -->
        <!-- 接口返回的level是0,1,2 不能直接显示0,1,2，所以要定义一个levelFormat函数来进行格式化 -->
        <el-table-column prop="level" label="层级" :formatter="levelFormat">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getPermissionList } from "@/api/admin.js";
export default {
  data() {
    return {
      // 定义请求权限列表的type，接口必须要有
      getPermissionType: "list",
      permissionList: [],
    };
  },
  methods: {
    async getPermission() {
      let res = await getPermissionList(this.getPermissionType);
      console.log("获取权限列表状态", res);
      this.permissionList = res.data;
    },
    // 格式化表格中层级列的显示内容
    // 可以接受row和column
    levelFormat(row, column) {
      if (row.level == 0) {
        return "一级";
      } else if (row.level == 1) {
        return "二级";
      } else if (row.level == 2) {
        return "三级";
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
  created() {
    this.getPermission();
  },
};
</script>

<style>
</style>