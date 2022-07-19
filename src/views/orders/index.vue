<template>
  <div class="orders">
    <!-- 面包屑 -->
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="ordersList" border style="width: 100%">
        <el-table-column prop="order_id" label="#" width="180">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag :type="formatPayStateTagType(scope.row.pay_status)">{{
              scope.row.pay_status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_pay" label="付款方式">
          <template slot-scope="scope">
            <el-tag :type="formatOrderPayTagType(scope.row.order_pay)">{{
              scope.row.order_pay
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改订单信息 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click.native="
                updateHandler(scope);
                updateOrdersForm.formVisible = true;
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
        :page-sizes="[2, 5, 10, 20, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 编辑订单表单 -->
    <div class="updateOrdersForm">
      <el-dialog title="修改订单" :visible.sync="updateOrdersForm.formVisible">
        <el-form :model="updateOrdersForm">
          <el-form-item
            label="是否发货"
            :label-width="updateOrdersForm.formLabelWidth"
          >
            <el-select v-model="updateOrdersForm.is_send" placeholder="请选择">
              <el-option label="是" value="1"> </el-option>
              <el-option label="否" value="0"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="支付方式"
            :label-width="updateOrdersForm.formLabelWidth"
          >
            <el-select
              v-model="updateOrdersForm.order_pay"
              placeholder="请选择"
            >
              <el-option label="支付宝" value="1"> </el-option>
              <el-option label="微信" value="2"> </el-option>
              <el-option label="银行卡" value="3"> </el-option>
              <el-option label="未支付" value="0"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="订单价格"
            :label-width="updateOrdersForm.formLabelWidth"
          >
            <el-input
              v-model="updateOrdersForm.order_price"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="支付状态"
            :label-width="updateOrdersForm.formLabelWidth"
          >
            <el-select
              v-model="updateOrdersForm.pay_status"
              placeholder="请选择"
            >
              <el-option label="已付款" value="1"> </el-option>
              <el-option label="未付款" value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateOrders(false)">取 消</el-button>
          <el-button type="primary" @click="updateOrders(true)"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getOderdsList, updateOrdersList } from "@/api/orders.js";
export default {
  data() {
    return {
      ordersList: [],
      orderid: "",
      pagenum: 1,
      pagesize: 5,
      total: 0,
      updateOrdersForm: {
        order_id: "",
        is_send: "",
        order_pay: "",
        order_price: "",
        order_number: "",
        pay_status: "",
        formVisible: false,
        formLabelWidth: "120px",
      },
    };
  },
  methods: {
    // 获取订单列表，并格式化支付状态和支付方式
    async getOrders() {
      let res = await getOderdsList(this.orderid, this.pagenum, this.pagesize);
      this.ordersList = res.data.goods;
      this.total = res.data.total;
      this.ordersList.forEach((item) => {
        // 格式化支付状态
        if (item.pay_status == "0") {
          item.pay_status = "未付款";
        } else if (item.pay_status == "1") {
          item.pay_status = "已付款";
        }
        // 格式化付款方式
        if (item.order_pay == "0") {
          item.order_pay = "未支付";
        } else if (item.order_pay == "1") {
          item.order_pay = "支付宝";
        } else if (item.order_pay == "2") {
          item.order_pay = "微信";
        } else if (item.order_pay == "3") {
          item.order_pay = "银行卡";
        }
      });
    },
    // 格式化日期
    dateFormat(row, column) {
      let moment = require("moment");
      let date = row[column.property];
      return moment(date).format("YYYY-MM-DD");
    },
    // 格式化支付状态tag的type
    formatPayStateTagType(pay_status) {
      if (pay_status == "已付款") {
        return "success";
      } else if (pay_status == "未付款") {
        return "danger";
      } else {
        return "danger";
      }
    },
    // 格式化支付方式tag的type
    formatOrderPayTagType(order_pay) {
      if (order_pay == "未支付") {
        return "danger";
      } else if (order_pay == "微信") {
        return "success";
      } else if (order_pay == "支付宝") {
        return "";
      } else if (order_pay == "银行卡") {
        return "warning";
      } else {
        return "danger";
      }
    },
    // 切换页面数量
    handleSizeChange(val) {
      this.pagesize = val;
      this.getOrders();
    },
    // 切换页码
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getOrders();
    },
    // 点击编辑按钮
    updateHandler(scope) {
      let {
        order_id,
        is_send,
        order_pay,
        order_price,
        order_number,
        pay_status,
      } = scope.row;
      this.updateOrdersForm.order_id = order_id;
      this.updateOrdersForm.is_send = is_send;
      this.updateOrdersForm.order_pay = order_pay;
      this.updateOrdersForm.order_price = order_price;
      this.updateOrdersForm.order_number = order_number;
      this.updateOrdersForm.pay_status = pay_status;
      console.log("写入状态", this.updateOrdersForm);
    },
    // 修改订单
    async updateOrders(isSubmit) {
      if (isSubmit) {
        this.ordersList.forEach((item) => {
          // 格式化支付状态
          if (item.pay_status == "未付款") {
            item.pay_status = "0";
          } else if (item.pay_status == "已付款") {
            item.pay_status = "1";
          }
          // 格式化付款方式
          if (item.order_pay == "未支付") {
            item.order_pay = "0";
          } else if (item.order_pay == "支付宝") {
            item.order_pay = "1";
          } else if (item.order_pay == "微信") {
            item.order_pay = "2";
          } else if (item.order_pay == "银行卡") {
            item.order_pay = "3";
          }
        });
        console.log("准备提交表单", this.updateOrdersForm);
        let res = await updateOrdersList(this.updateOrdersForm);
        console.log("修改结果", res);
        let { status, msg } = res.meta;
        if (status == 201) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
        // 重新渲染
        this.getOrders();
      } else {
        this.$message.info("用户取消提交");
      }
      this.updateOrdersForm.formVisible = false;
    },
  },
  created() {
    this.getOrders();
  },
};
</script>

<style>
</style>