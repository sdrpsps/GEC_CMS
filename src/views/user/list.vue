<template>
  <div class="userList">
    <!-- 面包屑导航 -->
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 搜索栏 -->
    <div class="search">
      <el-input
        placeholder="请输要查找的用户名"
        v-model="username"
        class="serachUserInput"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="searchUser"
        ></el-button>
      </el-input>
      <el-button type="success" @click="addUserFormVisible = true"
        >添加用户</el-button
      >
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column prop="id" label="id" width="180"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="手机号"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="" label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click.native="switchStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 插槽传递的数据，记录信息 -->
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="
                handleEdit(scope);
                updateUserFormVisible = true;
              "
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope)"
            ></el-button>
            <!-- 分配角色 -->
            <el-button
              type="warning"
              icon="el-icon-check"
              circle
              @click="
                handleChangeRole(scope);
                changeRoleFormVisible = true;
              "
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 5, 10, 20, 50, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 新增用户表单 -->
    <div class="addUserForm">
      <el-dialog title="新增用户" :visible.sync="addUserFormVisible">
        <el-form :model="addUserForm" :rules="addUserFormRules">
          <!-- 用户名 -->
          <el-form-item
            label="用户名"
            prop="username"
            :label-width="addUserFormLabelWidth"
          >
            <el-input
              type="username"
              v-model="addUserForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item
            label="密码"
            prop="password"
            :label-width="addUserFormLabelWidth"
          >
            <el-input
              type="password"
              v-model="addUserForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <!-- 邮箱 -->
          <el-form-item
            label="电子邮箱"
            prop="email"
            :label-width="addUserFormLabelWidth"
          >
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>

          <!-- 手机号 -->
          <el-form-item
            label="手机号"
            prop="mobile"
            :label-width="addUserFormLabelWidth"
          >
            <el-input
              v-model="addUserForm.mobile"
              type="mobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUser(false)">取 消</el-button>
          <el-button type="primary" @click="addUser(true)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改用户表单 -->
    <div class="updateUserForm">
      <el-dialog title="修改用户" :visible.sync="updateUserFormVisible">
        <el-form :model="updateUserForm" :rules="updateUserFormRules">
          <!-- 用户名 -->
          <el-form-item
            label="用户名"
            prop="username"
            :label-width="formLabelWidth"
            v-model="updateUserForm.username"
          >
            <el-input
              type="username"
              v-model="updateUserForm.username"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>

          <!-- 邮箱 -->
          <el-form-item
            label="电子邮箱"
            prop="email"
            :label-width="formLabelWidth"
          >
            <el-input v-model="updateUserForm.email"></el-input>
          </el-form-item>

          <!-- 手机号 -->
          <el-form-item
            label="手机号"
            prop="mobile"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="updateUserForm.mobile"
              type="mobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateUser(false)">取 消</el-button>
          <el-button type="primary" @click="updateUser(true)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 分配用户角色表单 -->
    <div class="changRoleForm">
      <el-dialog title="分配角色" :visible.sync="changeRoleFormVisible">
        <el-form :model="changeRoleForm">
          <el-form-item
            label="当前用户"
            :label-width="changeRoleFormLabelWidth"
          >
            <span>{{ changeRoleForm.username }}</span>
          </el-form-item>
          <el-form-item
            label="请选择角色"
            :label-width="changeRoleFormLabelWidth"
          >
            <el-select v-model="changeRoleForm.rid" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleName"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changRole(false)">取 消</el-button>
          <el-button type="primary" @click="changRole(true)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 引入函数
import {
  getUserList,
  addUserList,
  delUserList,
  updateUserList,
  switchUserStatus,
  getRoleList,
  changeRoleList,
} from "@/api/admin.js";

export default {
  data() {
    return {
      username: "",
      userList: [],
      // 默认显示第1页
      pagenum: 1,
      // 默认每页显示5个
      pagesize: 5,
      // 返回的用户总数量，默认为0
      total: 0,
      // 新增用户对话框表单 start
      // 新增用户对话框是否可见
      addUserFormVisible: false,
      // 新增用户表单
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 新增用户对话框表单验证规则
      addUserFormRules: {
        username: [{ required: true, message: "用户名不能为空" }],
        password: [{ required: true, message: "密码不能为空" }],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
          },
        ],
        mobile: [
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern:
              /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码",
          },
        ],
      },
      // 新增用户对话框宽度
      addUserFormLabelWidth: "120px",
      // 新增用户对话框表单 end
      // 修改用户对话框表单 start
      // 修改用户对话框是否可见
      updateUserFormVisible: false,
      // 修改用户表单
      updateUserForm: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      // 修改用户对话框表单验证规则
      updateUserFormRules: {
        username: [{ required: true, message: "用户名不能为空" }],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
          },
        ],
        mobile: [
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern:
              /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码",
          },
        ],
      },
      // 修改用户对话框宽度
      formLabelWidth: "120px",
      // 修改用户对话框表单 end

      // 修改用户角色对话框表单 start
      roleList : [],
      changeRoleFormVisible: false,
      changeRoleForm: {
        username:"",
        id: "",
        rid: "",
      },
      changeRoleFormLabelWidth: "120px",
      // 修改用户角色对话框表单 end
    };
  },
  methods: {
    // 获取用户列表
    async getUser() {
      let info = await getUserList(this.username, this.pagenum, this.pagesize);
      console.log("获取用户列表状态", info);
      // 用户列表结果写入userList
      this.userList = info.data.users;
      this.total = info.data.total;
    },
    // 修改用户，编辑按钮操作 TODO
    handleEdit(scope) {
      console.log(scope);
      // 获取当前的用户名，并填写到用户名输入框中，这个输入框是禁止输入的
      this.updateUserForm.username = scope.row.username;
      // 获取当前的ID，用于调用接口传参
      this.updateUserForm.id = scope.row.id;
      console.log("当前编辑的用户ID" + this.updateUserForm.id);
    },
    // 删除用户，删除按钮操作
    handleDelete(scoped) {
      console.log(scoped);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let info = await delUserList(scoped.row.id);
          console.log(info);
          // 解构info里面的meta，获取状态码和消息
          let {
            meta: { status, msg },
          } = info;
          // 当返回的状态码为200时，证明删除成功，返回一条消息
          if (status == 200) {
            this.$message.success("用户" + msg);
          } else {
            // 否则返回错误消息
            this.$message.error("删除失败" + msg);
          }
          // 重新获取用户列表
          this.getUser();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 修改每页显示用户数操作
    handleSizeChange(val) {
      this.pagesize = val;
      console.log(`每页 ${val} 条`);
      // 重新获取用户列表，渲染数据
      this.getUser();
    },
    // 修改当前显示页数
    handleCurrentChange(val) {
      this.pagenum = val;
      console.log(`当前页: ${val}`);
      // 重新获取用户列表，渲染数据
      this.getUser();
    },
    // 搜索按钮操作
    searchUser() {
      // 当按下搜索按钮时，重新渲染用户列表
      this.getUser();
      // 清除输入的用户名
      this.username = "";
    },
    // 新增用户
    async addUser(isSubmit) {
      // isSubmit为TRUE时，表明用户按的是提交按钮，FALSE时用户按的是取消按钮
      if (isSubmit) {
        // 用户点击提交按钮
        let addRes = await addUserList(this.addUserForm);
        console.log("新增用户状态", addRes);
        let { status, msg } = addRes.meta;
        // 如果回应的状态码是201，则创建成功，返回一则成功消息
        if (status == 201) {
          this.$message.success(msg);
        } else {
          // 如果状态码不是201，则返回失败详细信息
          this.$message.error("创建失败 - " + msg);
        }
      } else {
        // 用户点击取消按钮
        this.$message.warning("用户取消提交");
      }
      // 重新获取用户列表
      this.getUser();
      // 隐藏对话框
      this.addUserFormVisible = false;
    },
    // 修改用户
    async updateUser(isSubmit) {
      if (isSubmit) {
        // 用户点击提交按钮
        let updateRes = await updateUserList(this.updateUserForm);
        console.log("修改用户情况", updateRes);
        let { status, msg } = updateRes.meta;
        // 当返回的响应码为200时，用户修改成功，并返回一条消息
        if (status == 200) {
          this.$message.success(msg);
        } else {
          // 当不是200时，返回错误信息
          this.$message.error(msg);
        }
      } else {
        // 用户点击取消按钮
        this.$message.warning("用户取消提交");
      }
      // 重新获取用户列表
      this.getUser();
      // 隐藏对话框
      this.updateUserFormVisible = false;
    },
    // 修改用户状态
    async switchStatus(row) {
      let info = await switchUserStatus(row.id, row.mg_state);
      console.log(info);
      let { msg, status } = info.meta;
      // 当返回的响应码为200时，返回成功信息
      if (status == 200) {
        this.$message.success(msg);
      } else {
        // 否则返回错误信息
        this.$message.error(msg);
      }
    },
    // 获取角色列表
    async getRole(){
      let info = await getRoleList();
      console.log("获取角色列表",info);
      this.roleList = info.data;
    },
    handleChangeRole(scope){
      this.changeRoleForm.id = scope.row.id;
      this.changeRoleForm.username = scope.row.username;
      // this.changeRoleForm.id = scope.row.id;
    },
    // 分配用户角色
    async changRole(isSubmit) {
      if (isSubmit) {
        let res = await changeRoleList(this.changeRoleForm)
        console.log(res)
        let {status,msg} = res.meta;
        if(status == 200){
          this.$message.success(msg)
        }else{
          this.$message.error(msg)
        }
      } else {
        this.$message.info("用户取消提交")
      }
        this.changeRoleFormVisible = false;
      this.getUser()
    },
  },
  created() {
    // 调用获取用户列表
    this.getUser();
    // 获取角色列表
    this.getRole()
  },
};
</script>

<style lang="less" scoped>
.userList {
  margin: 0 auto;
  .search {
    display: flex;
  }
}
</style>