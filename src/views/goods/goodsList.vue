<template>
  <div class="goodlist">
    <!-- 面包屑 -->
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 搜索 -->
    <div class="serach">
      <el-input placeholder="请输要查找的商品" v-model="goodname">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="getGoods"
        ></el-button>
      </el-input>
      <el-button type="success" @click.native="goToAddGoods"
        >添加商品</el-button
      >
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column prop="goods_id" label="商品ID"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改商品信息 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click.native="
                updateHandler(scope);
                updateGoodsForm.formVisible = true;
              "
            ></el-button>
            <!-- 删除商品 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click.native="deleteGoods(scope)"
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
    <!-- 修改商品表单 -->
    <div class="updateGoods">
      <el-dialog title="修改商品" :visible.sync="updateGoodsForm.formVisible">
        <el-form :model="updateGoodsForm" :rules="updateGoodsForm.formRules">
          <el-form-item
            label="商品名称"
            prop="goods_name"
            :label-width="updateGoodsForm.formLabelWidth"
          >
            <el-input
              v-model="updateGoodsForm.goods_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="商品价格"
            prop="goods_price"
            :label-width="updateGoodsForm.formLabelWidth"
          >
            <el-input
              v-model.number="updateGoodsForm.goods_price"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="商品数量"
            prop="goods_number"
            :label-width="updateGoodsForm.formLabelWidth"
          >
            <el-input
              v-model.number="updateGoodsForm.goods_number"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="商品重量"
            prop="goods_weight"
            :label-width="updateGoodsForm.formLabelWidth"
          >
            <el-input
              v-model.number="updateGoodsForm.goods_weight"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateGoods(false)">取 消</el-button>
          <el-button type="primary" @click="updateGoods(true)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getGoodsList, updateGoodsList, deleteGoodsList } from "@/api/goods.js";

export default {
  data() {
    return {
      goodname: "",
      pagenum: 1,
      pagesize: 5,
      total: 0,
      goodsList: [],
      // 修改商品表单
      updateGoodsForm: {
        goods_id: "",
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: {},
        attrs: [],
        formVisible: false,
        formLabelWidth: "120px",
        formRules: {
          goods_name: [{ required: true, message: "请输入商品名称" }],
          goods_price: [
            { required: true, message: "请输入商品价格" },
            {
              type: "number",
              message: "请输入正确的商品价格",
            },
          ],
          goods_number: [
            { required: true, message: "请输入商品数量" },
            {
              type: "number",
              message: "请选择输入正确的商品数量",
            },
          ],
          goods_weight: [
            { required: true, message: "请输入商品重量" },
            {
              type: "number",
              message: "请选择输入正确的商品重量",
            },
          ],
        },
      },
    };
  },
  methods: {
    // 获取商品列表
    async getGoods() {
      let res = await getGoodsList(this.goodname, this.pagenum, this.pagesize);
      console.log("获取商品列表", res);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 切换页面商品显示数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getGoods();
    },
    // 切换商品页面当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getGoods();
    },
    dateFormat(row, column) {
      let moment = require("moment");
      let date = row[column.property];
      return moment(date).format("YYYY-MM-DD");
    },
    updateHandler(scope) {
      // 设置当前行的商品ID到表单中
      this.updateGoodsForm.goods_id = scope.row.goods_id;
    },
    // 修改商品
    async updateGoods(isSubmit) {
      if (isSubmit) {
        // console.log(this.updateGoodsForm);
        let res = await updateGoodsList(this.updateGoodsForm);
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
      this.updateGoodsForm.formVisible = false;
    },
    // 删除商品
    deleteGoods(scope) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(scope);
          let res = await deleteGoodsList(scope.row.goods_id);
          console.log(res);
          let { status, msg } = res.meta;
          if (status == 200) {
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
          // 重新渲染数据
          this.getGoods();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 跳转到新增商品页
    goToAddGoods() {
      this.$router.push("/admin/goods/goodsList/add");
    },
  },
  created() {
    this.getGoods();
  },
};
</script>

<style lang="less" scope>
.goodlist {
  .serach {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>