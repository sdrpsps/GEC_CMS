<template>
  <div class="login-wrap">
    <!--ref 是vuejs提供的一个属性 -->
    <el-form
      :rules="loginRules"
      :model="loginForm"
      ref="loginForm"
      label-width="100px"
      class="loginForm"
    >
      <h2 class="title">雏鹰综合管理后台系统</h2>
      <!-- 用户名输入框 -->
      <el-form-item label="用户名" prop="username" class="item">
        <el-input
          type="username"
          v-model="loginForm.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item label="密码" prop="password" class="item">
        <el-input
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item class="btns">
        <el-button
          type="primary"
          @click="submitForm('loginForm')"
          class="submit"
          >提交</el-button
        >
        <el-button @click="resetForm('loginForm')" class="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/admin.js";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      // 表单验证规则
      loginRules: {
        username: [{ required: true, message: "用户名不能为空" }],
        password: [{ required: true, message: "密码不能为空" }],
      },
    };
  },
  methods: {
    //  登录按钮操作
    submitForm() {
      // this.$refs 在vue里面获取 dom元素的集合
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          // 如果数据格式验证通过
          console.log(this.loginForm);
          // 向接口发送请求，this.loginForm里面含有username和password，在调用login()的时候会进行解构
          let info = await login(this.loginForm);
          console.log(info);
          // 解构返回的info的meta的status和msg
          let {
            meta: { status, msg },
          } = info;
          console.log(status, msg);
          // 当接口返回成功数据后
          if (status == 200) {
            // 只有登录成功时，info才会返回data.token，解构token
            let {data: { token }} = info;
            // 设置cookie添加token
            localStorage.setItem("token", token);
            // 显示信息
            this.$message.success(msg + "，正在进入系统后台");
            // 路由到后台
            this.$router.push("/admin");
          } else {
            this.$message.error("登录失败 - " + msg);
          }
        } else {
          this.$message.error("请填写正确的用户信息！");
          return false;
        }
      });
    },
    // 重置按钮操作
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(0deg, #cc6c62, #b68383, #9697a6, #5faac9);
  .loginForm {
    width: 600px;
    background-color: #fff;
    border-radius: 10px;
    .title {
      text-align: center;
      padding: 20px 0;
    }
    .item {
      margin-right: 80px;
    }
  }
}
</style>
