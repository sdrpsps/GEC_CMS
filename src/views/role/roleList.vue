<template>
  <div class="rolelist">
    <!-- 面包屑 -->
    <div class="breed">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 新增按钮 -->
    <el-button
      type="success"
      @click.native="
        addRole;
        addRoleFormVisible = true;
      "
      >新增角色</el-button
    >
    <!-- 表格 -->
    <div class="table">
      <el-table :data="roleList" border style="width: 100%">
        <!-- 用户权限 -->
        <el-table-column type="expand" prop="children" label="角色权限">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item>
                    <el-tag v-for="tag in scope.row.children" :key="tag.id">{{
                      tag.authName
                    }}</el-tag>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item>
                    <el-tag type="success"
                      v-for="tag in scope.row.children[0].children"
                      :key="tag.id"
                      >{{ tag.authName }}</el-tag
                    >
                  </el-breadcrumb-item>
                  <el-breadcrumb-item>
                    <el-tag
                    type="warning"
                      v-for="tag in scope.row.children[0].children[0].children"
                      :key="tag.id"
                      >{{ tag.authName }}</el-tag
                    >
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!-- ID -->
        <el-table-column prop="id" label="ID" width=""> </el-table-column>
        <!-- 角色名称 -->
        <el-table-column prop="roleName" label="角色名称" width="">
        </el-table-column>
        <!-- 角色描述 -->
        <el-table-column prop="roleDesc" label="角色描述" width="">
        </el-table-column>
        <!-- 操作按钮 -->
        <el-table-column prop="" label="操作" width="">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="
                updateHandler(scope);
                updateRoleFormVisible = true;
              "
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteHandler(scope)"
            ></el-button>
            <!-- 修改角色权限 -->
            <el-button
              type="warning"
              icon="el-icon-check"
              circle
              @click="
                changeRoleDialogVisible = true;
                getRoleID(scope);
                setChecked(scope);
              "
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增角色表单 -->
    <div class="addRole">
      <el-dialog title="新增角色" :visible.sync="addRoleFormVisible">
        <el-form :model="addRoleForm" :rules="addRoleFormRules">
          <el-form-item
            label="角色名称"
            :label-width="addRoleFormLabelWidth"
            prop="roleName"
          >
            <el-input
              v-model="addRoleForm.roleName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            :label-width="addRoleFormLabelWidth"
            prop="roleDesc"
          >
            <el-input
              v-model="addRoleForm.roleDesc"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRole(false)">取 消</el-button>
          <el-button type="primary" @click="addRole(true)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改角色表单 -->
    <div class="updateRole">
      <el-dialog title="修改角色" :visible.sync="updateRoleFormVisible">
        <el-form :model="updateRoleForm" :rules="updateRoleFormRules">
          <el-form-item
            label="角色名称"
            :label-width="updateRoleFormLabelWidth"
            prop="roleName"
          >
            <el-input
              v-model="updateRoleForm.roleName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            :label-width="updateRoleFormLabelWidth"
            prop="roleDesc"
          >
            <el-input
              v-model="updateRoleForm.roleDesc"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateRole(false)">取 消</el-button>
          <el-button type="primary" @click="updateRole(true)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 分配角色权限 -->
    <div class="changRole">
      <el-dialog
        title="修改角色权限"
        :visible.sync="changeRoleDialogVisible"
        width="30%"
      >
        <el-tree
          :data="permissionList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="permissionListProps"
        >
        </el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="changeRole(false)">取 消</el-button>
          <el-button type="primary" @click="changeRole(true)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getPermissionList,
  getRoleList,
  addRoleList,
  updateRoleList,
  delRoleList,
  changeRoleList,
  getRoleListByID,
} from "@/api/admin.js";
export default {
  data() {
    return {
      permissionList: [],
      // 定义获取权限列表的type
      getPermissionType: "tree",
      roleList: [],
      // 新增角色表单 start
      // 新增角色表单可见
      addRoleFormVisible: false,
      //   新增角色表单
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoleFormLabelWidth: "120px",
      // 新增用户对话框表单验证规则
      addRoleFormRules: {
        roleName: [{ required: true, message: "角色名不能为空" }],
      },
      // 新增角色表单 end
      // 修改角色表单 start
      updateRoleFormVisible: false,
      updateRoleForm: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      updateRoleFormLabelWidth: "120px",
      // 修改用户对话框表单验证规则
      updateRoleFormRules: {
        roleName: [{ required: true, message: "角色名不能为空" }],
        roleDesc: [{ required: true, message: "角色描述不能为空" }],
      },
      updateRoleFormLabelWidth: "120px",
      // 修改角色表单 end
      // 分配用户权限 start
      // 分配用户角色表单可视
      changeRoleDialogVisible: false,
      // 树形参数
      permissionListProps: {
        children: "children",
        label: "authName",
      },
      changeRoleFrom: {
        id: "",
        rid: "",
      },
      // 分配用户权限 end
    };
  },
  methods: {
    // 获取权限列表
    async getPermission() {
      let res = await getPermissionList(this.getPermissionType);
      // console.log("获取权限列表状态", res);
      this.permissionList = res.data;
    },
    // 获取角色列表
    async getRole() {
      let res = await getRoleList();
      // console.log("获取角色列表状态", res);
      this.roleList = res.data;
    },
    // 新增角色
    async addRole(isSubmit) {
      if (isSubmit) {
        let res = await addRoleList(this.addRoleForm);
        console.log(res);
        let { status, msg } = res.meta;
        if (status == 201) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      } else {
        this.$message.info("用户取消提交");
      }
      //   重新获取角色列表
      this.getRole();
      //   关闭新增角色对话框
      this.addRoleFormVisible = false;
    },
    // 获取被修改角色的属性并写到修改表单当中
    updateHandler(scope) {
      this.updateRoleForm.id = scope.row.id;
      this.updateRoleForm.roleName = scope.row.roleName;
      this.updateRoleForm.roleDesc = scope.row.roleDesc;
    },
    // 修改角色
    async updateRole(isSubmit) {
      if (isSubmit) {
        let res = await updateRoleList(this.updateRoleForm);
        let { status, msg } = res.meta;
        if (status == 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      } else {
        this.$message.info("用户取消提交");
      }
      //   重新获取角色列表
      this.getRole();
      //   关闭修改角色对话框
      this.updateRoleFormVisible = false;
    },
    // 删除角色
    deleteHandler(scope) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await delRoleList(scope.row.id);
          let { status, msg } = res.meta;
          if (status == 200) {
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
          // 重新获取角色列表
          this.getRole();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击分配用户权限按钮时，把用户ID写入form
    getRoleID(scope) {
      this.changeRoleFrom.id = scope.row.id;
    },
    // 修改角色权限
    async changeRole(isSubmit) {
      if (isSubmit) {
        console.log(this.$refs.tree.getCheckedKeys());
        // 获取当前选中的权限ID并写入到form中
        this.changeRoleFrom.rid = this.$refs.tree.getCheckedKeys();
        // 数组转为字符串提交
        this.changeRoleFrom.rid = this.changeRoleFrom.rid.toString();
        console.log("即将提交的数据", this.changeRoleFrom);
        // let res = await changeRoleList(this.changeRoleFrom);
        // let { status, msg } = res.meta;
        // if (status == 200) {
        //   this.$message.success(msg);
        // } else {
        //   this.$message.error(msg);
        // }
      } else {
        this.$message.info("用户取消提交");
      }
      //   重新获取角色列表
      this.getRole();
      this.changeRoleDialogVisible = false;
    },
    // 根据用户已有的权限便利到设置树形表单
    setChecked(scope) {
      // 创建空数组
      let arr = [];
      let fun = function (x) {
        x.forEach((item) => {
          // 如果item里没有children，就把id和authName写入到空数组里
          if (!item.children) {
            arr.push({ id: item.id, label: item.authName });
          } else {
            // 有的话就回调
            fun(item.children);
          }
        });
      };
      // 执行
      fun(scope.row.children);
      // 因为点击的时候树形还没渲染出来，所以此时调用this.$refs.tree.setCheckedNodes(arr)会输出undefined
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(arr);
        console.log("当前已勾选的", this.$refs.tree.getCheckedKeys());
      });
    },
  },
  created() {
    this.getPermission();
    this.getRole();
  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>