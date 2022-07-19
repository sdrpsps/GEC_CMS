<template>
  <div class="goodscat">
    <!-- 面包屑 -->
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 添加分类按钮 -->
    <div class="addBtn">
      <el-button type="success" @click="addGoodsCatForm.formVisible = true"
        >添加分类</el-button
      >
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="goodCatList"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="cat_name" label="分类名称" sortable>
        </el-table-column>
        <el-table-column
          prop="cat_level"
          label="级别"
          sortable
          :formatter="levelFormat"
        >
        </el-table-column>
        <el-table-column
          prop="cat_deleted"
          label="是否有效"
          :formatter="usefulFormat"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="
                updateHandler(scope);
                updateGoodsCatForm.formVisible = true;
              "
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteGoodCat(scope)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑商品分类表单 -->
    <div class="updateGoodsCat">
      <el-dialog
        title="编辑商品分类"
        :visible.sync="updateGoodsCatForm.formVisible"
      >
        <el-form
          :model="updateGoodsCatForm"
          :rules="updateGoodsCatForm.formRules"
        >
          <el-form-item
            label="分类名称"
            prop="cat_name"
            :label-width="updateGoodsCatForm.formLabelWidth"
          >
            <el-input
              v-model="updateGoodsCatForm.cat_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateGoodsCat(false)">取 消</el-button>
          <el-button type="primary" @click="updateGoodsCat(true)"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 添加商品分类表单 -->
    <div class="addGoodsCat">
      <el-dialog
        title="添加商品分类"
        :visible.sync="addGoodsCatForm.formVisible"
      >
        <el-form :model="addGoodsCatForm" :rules="addGoodsCatForm.formRules">
          <el-form-item
            label="分类名称"
            prop="cat_name"
            :label-width="addGoodsCatForm.formLabelWidth"
          >
            <el-input
              v-model="addGoodsCatForm.cat_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 商品分类下拉菜单 -->
          <el-form-item
            label="分类名称"
            prop="cat_pid"
            :label-width="addGoodsCatForm.formLabelWidth"
          >
            <!-- 多级选择器 -->
            <el-cascader
              ref="selected"
              :options="goodCatWithOutLv3List"
              :props="{
                expandTrigger: 'hover',
                checkStrictly: true,
                label: 'cat_name',
                value: 'cat_id',
              }"
              clearable
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addGoodsCat(false)">取 消</el-button>
          <el-button type="primary" @click="addGoodsCat(true)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getGoodsCatList,
  updateGoodsCat,
  deleteGoodsCat,
  addGoodsCatList,
} from "@/api/goods.js";

export default {
  data() {
    return {
      goodCatList: [],
      goodCatWithOutLv3List: [],
      // 新增分类表单
      addGoodsCatForm: {
        cat_name: "",
        cat_level: "",
        cat_id: "",
        formLabelWidth: "120px",
        formVisible: false,
        formRules: {
          cat_name: [{ required: true, message: "商品分类名不能为空" }],
          cat_id: [{ required: true, message: "商品分类不能为空" }],
        },
      },
      // 修改分类表单
      updateGoodsCatForm: {
        cat_id: "",
        cat_name: "",
        formLabelWidth: "120px",
        formVisible: false,
        formRules: {
          cat_name: [{ required: true, message: "商品分类名不能为空" }],
        },
      },
    };
  },
  methods: {
    // 获取商品分类列表
    async getGoodsCat() {
      // 总分类列表
      let res = await getGoodsCatList();
      // 没有第三级的分类列表
      let withOutLv3Res = await getGoodsCatList(2);
      console.log("获取商品分类", res);
      // 写入
      this.goodCatList = res.data;
      this.goodCatWithOutLv3List = withOutLv3Res.data;
    },
    // 添加分类
    async addGoodsCat(isSubmit) {
      if (isSubmit) {
        let res = await addGoodsCatList(this.addGoodsCatForm);
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
      this.getGoodsCat();
      this.addGoodsCatForm.formVisible = false;
    },
    // 格式化级别
    levelFormat(row, column) {
      if (row.cat_level == 0) {
        return "一级";
      } else if (row.cat_level == 1) {
        return "二级";
      } else if (row.cat_level == 2) {
        return "三级";
      }
    },
    // 格式化有效性
    usefulFormat(row, column) {
      if (row.cat_deleted == true) {
        return "有效";
      } else {
        return "有效";
      }
    },
    // 将分类ID写入到修改表单里
    updateHandler(scope) {
      console.log(scope);
      this.updateGoodsCatForm.cat_id = scope.row.cat_id;
      this.updateGoodsCatForm.cat_name = scope.row.cat_name;
    },
    // 修改商品分类名称
    async updateGoodsCat(isSubmit) {
      if (isSubmit) {
        let res = await updateGoodsCat(this.updateGoodsCatForm);
        console.log(res);
        let { status, msg } = res.meta;
        if (status == 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      } else {
        this.$message.info("用户取消提交");
      }
      // 重新渲染分类列表
      this.getGoodsCat();
      this.updateGoodsCatForm.formVisible = false;
    },
    // 删除商品分类
    deleteGoodCat(scope) {
      this.$confirm("此操作将永久删除该商品分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteGoodsCat(scope.row.cat_id);
          console.log(res);
          let { status, msg } = res.meta;
          if (status == 200) {
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
          // 重新渲染商品分类
          this.getGoodsCat();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // ！获取新增商品下拉菜单中已选择节点的其他信息和写入到表单当中
    handleChange() {
      // 获取已选择节点的其他的信息
      let nodeInfo = this.$refs["selected"].getCheckedNodes();
      console.log(nodeInfo[0].data)
      let { cat_id, cat_level } = nodeInfo[0].data;
      // 写入到新增商品分类表单中
      // 被选中的节点ID就是要新建分类的父ID
      this.addGoodsCatForm.cat_pid = cat_id
      // 要新加的分类级别是被选中节点的下一级
      this.addGoodsCatForm.cat_level = cat_level + 1;
      console.log(this.addGoodsCatForm)
    },
  },
  created() {
    this.getGoodsCat();
  },
};
</script>

<style>
</style>