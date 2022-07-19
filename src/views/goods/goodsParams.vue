<template>
  <div class="goodsParams">
    <!-- 面包屑 -->
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 警告条 -->
    <div class="alert">
      <el-alert
        show-icon
        center
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
      >
      </el-alert>
    </div>
    <!-- 级联选择器 -->
    <div class="cascader">
      <span>请选择商品分类：</span>
      <el-cascader
        ref="selected"
        v-model="goodsParamsForm.attr_id"
        :options="goodsList"
        :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' }"
        @change="handleChange"
      ></el-cascader>
    </div>
    <!-- tabs选项卡 -->
    <div class="tabs">
      <el-tabs v-model="tabActiveName" @tab-click="handleClick">
        <!-- 动态参数tabs -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="success"
            @click.native="addCatAttributesForm.manyFormVisible = true"
            >添加动态参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table
            :data="goodsCatManyAttributesList"
            style="width: 100%"
            @expand-change="rowAttrToForm"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-tag
                    :key="tag"
                    v-for="tag in props.row.attr_vals"
                    closable
                    @close="handleClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ New Tag</el-button
                  >
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" prop="attr_id"> </el-table-column>
            <el-table-column label="商品参数" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改动态参数 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click.native="
                    updateHandler(scope);
                    updateCatAttributesForm.manyUpdateFormVisible = true;
                  "
                ></el-button>
                <!-- 删除动态参数 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click.native="deleteHandler(scope)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数tabs -->
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="success"
            @click.native="addCatAttributesForm.onlyFormVisible = true"
            >添加静态参数</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="goodsCatOnlyAttributesList" style="width: 100%">
            <el-table-column label="#" prop="attr_id"> </el-table-column>
            <el-table-column label="商品参数" prop="attr_name">
            </el-table-column>
            <el-table-column label="属性值" prop="attr_vals"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改静态参数 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click.native="
                    updateHandler(scope);
                    updateCatAttributesForm.onlyUpdateFormVisible = true;
                  "
                ></el-button>
                <!-- 删除静态参数 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click.native="deleteHandler(scope)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加动态参数表单 -->
    <div class="addMany">
      <el-dialog
        title="添加动态参数"
        :visible.sync="addCatAttributesForm.manyFormVisible"
      >
        <el-form
          :model="addCatAttributesForm"
          :rules="addCatAttributesForm.formRules"
        >
          <el-form-item
            prop="attr_name"
            label="动态参数"
            :label-width="addCatAttributesForm.formLabelWidth"
          >
            <el-input
              v-model="addCatAttributesForm.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCatAttributes(false)">取 消</el-button>
          <el-button type="primary" @click="addCatAttributes(true)"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 添加静态参数表单 -->
    <div class="addOnly">
      <el-dialog
        title="添加静态参数"
        :visible.sync="addCatAttributesForm.onlyFormVisible"
      >
        <el-form
          :model="addCatAttributesForm"
          :rules="addCatAttributesForm.formRules"
        >
          <el-form-item
            prop="attr_name"
            label="静态参数"
            :label-width="addCatAttributesForm.formLabelWidth"
          >
            <el-input
              v-model="addCatAttributesForm.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="attr_vals"
            label="静态参数值"
            :label-width="addCatAttributesForm.formLabelWidth"
          >
            <el-input
              v-model="addCatAttributesForm.attr_vals"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCatAttributes(false)">取 消</el-button>
          <el-button type="primary" @click="addCatAttributes(true)"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 修改动态参数表单 -->
    <div class="updateMany">
      <el-dialog
        title="修改动态参数"
        :visible.sync="updateCatAttributesForm.manyUpdateFormVisible"
      >
        <el-form
          :model="updateCatAttributesForm"
          :rules="updateCatAttributesForm.formRules"
        >
          <el-form-item
            prop="attr_name"
            label="动态参数"
            :label-width="updateCatAttributesForm.formLabelWidth"
          >
            <el-input
              v-model="updateCatAttributesForm.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateCatAttributes(false)">取 消</el-button>
          <el-button type="primary" @click="updateCatAttributes(true)"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 修改静态参数表单 -->
    <div class="updateOnly">
      <el-dialog
        title="修改静态参数"
        :visible.sync="updateCatAttributesForm.onlyUpdateFormVisible"
      >
        <el-form
          :model="updateCatAttributesForm"
          :rules="updateCatAttributesForm.formRules"
        >
          <el-form-item
            prop="attr_name"
            label="静态参数"
            :label-width="updateCatAttributesForm.formLabelWidth"
          >
            <el-input
              v-model="updateCatAttributesForm.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="attr_vals"
            label="静态参数值"
            :label-width="updateCatAttributesForm.formLabelWidth"
          >
            <el-input
              v-model="updateCatAttributesForm.attr_vals"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateCatAttributes(false)">取 消</el-button>
          <el-button type="primary" @click="updateCatAttributes(true)"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getGoodsCatList,
  getGoodsCatAttributes,
  addCatAttributesList,
  deleteCatAttributesList,
  updateCatAttributesList,
} from "@/api/goods.js";

export default {
  data() {
    return {
      goodsList: [],
      checkedCatId: "",
      goodsParamsForm: {
        attr_id: "",
      },
      tabActiveName: "many",
      goodsCatManyAttributesList: [],
      goodsCatOnlyAttributesList: [],
      // 添加动态、静态参数时,cat_id使用checkedCatId，attr_sel使用tabActiveName
      addCatAttributesForm: {
        attr_name: "",
        attr_vals: "",
        // 动态参数表单
        manyFormVisible: false,
        // 静态参数表单
        onlyFormVisible: false,
        formRules: {
          attr_name: [{ required: true, message: "参数名不能为空" }],
          attr_vals: [{ required: true, message: "参数不能为空" }],
        },
        formLabelWidth: "120px",
      },
      updateCatAttributesForm: {
        cat_id: "",
        attr_id: "",
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
        // 动态参数表单
        manyUpdateFormVisible: false,
        // 静态参数表单
        onlyUpdateFormVisible: false,
        formRules: {
          attr_name: [{ required: true, message: "参数名不能为空" }],
          attr_vals: [{ required: true, message: "参数不能为空" }],
        },
        formLabelWidth: "120px",
      },
      inputVisible: false,
      inputValue: "",
      allTag: [],
    };
  },
  methods: {
    // 获取商品分类列表
    async getGoodsCat() {
      let res = await getGoodsCatList();
      this.goodsList = res.data;
      // this.goodsList.forEach((item)=>{
      //   console.log(item)
      // })
    },
    // 重新渲染表格
    async flushTable() {
      let renewRes = await getGoodsCatAttributes(
        this.checkedCatId,
        this.tabActiveName
      );
      // 判断是动态参数还是静态参数，分别写入不同的列表中
      if (this.tabActiveName == "many") {
        this.goodsCatManyAttributesList = renewRes.data;
        // 将每个对象的attr_vals转为数组，用于表格的tag渲染
        this.goodsCatManyAttributesList.forEach((item) => {
          if (item.attr_vals == "") {
            return "";
          } else {
            item.attr_vals = item.attr_vals.split(",");
          }
        });
      } else {
        this.goodsCatOnlyAttributesList = renewRes.data;
      }
    },
    // 下拉选择框改变时触发获取商品分类参数
    async handleChange() {
      // 获取当前选中节点的商品分类ID
      let nodeInfo = this.$refs["selected"].getCheckedNodes();
      this.checkedCatId = nodeInfo[0].data.cat_id;
      // 将商品分类ID传入，默认返回动态参数
      // 重新渲染表格
      this.flushTable();
    },
    // tabs切换，请求静态参数和动态参数
    async handleClick() {
      this.flushTable();
    },
    // 动态、静态参数表格编辑按钮
    // 将当前行的数据写入到修改表单中，TODO 优化写入方式
    updateHandler(scope) {
      console.log(scope);
      let { cat_id, attr_id, attr_name, attr_vals, attr_sel } = scope.row;
      // 将当前行的数据写入到修改表单中，TODO 优化写入方式
      this.updateCatAttributesForm.cat_id = cat_id;
      this.updateCatAttributesForm.attr_id = attr_id;
      this.updateCatAttributesForm.attr_name = attr_name;
      this.updateCatAttributesForm.attr_vals = attr_vals;
      this.updateCatAttributesForm.attr_sel = attr_sel;
    },
    // 动态、静态参数表格删除按钮
    deleteHandler(scope) {
      this.$confirm("此操作将永久删除该动态分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteCatAttributesList(
            scope.row.cat_id,
            scope.row.attr_id
          );
          console.log(res);
          let { status, msg } = res.meta;
          if (status == 200) {
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
          // 重新渲染表格
          this.flushTable();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 点击tag的关闭按钮时触发
    async handleClose(tag) {
      function delItem(item, list) {
        // 表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
        list.splice(list.indexOf(item), 1);
      }
      delItem(tag, this.updateCatAttributesForm.attr_vals);
      console.log("删除了一个元素", this.updateCatAttributesForm);
      this.updateCatAttributesForm.attr_vals =
        this.updateCatAttributesForm.attr_vals.toString();
      console.log("attr_vals转为字符串", this.updateCatAttributesForm);

      let res = await updateCatAttributesList(this.updateCatAttributesForm);
      let { status, msg } = res.meta;
      if (status == 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      // 重新渲染表格
      this.flushTable();
    },
    // 输入框失去焦点时触发更新
    async handleInputConfirm() {
      let inputValue = this.inputValue;
      // 将写入的数据放入到attr_vals
      if (this.updateCatAttributesForm.attr_vals == "") {
        this.updateCatAttributesForm.attr_vals = [inputValue];
      } else {
        this.updateCatAttributesForm.attr_vals.push(inputValue);
      }
      console.log("写入了一个新数据", this.updateCatAttributesForm);
      // attr_vals转为字符串
      this.updateCatAttributesForm.attr_vals =
        this.updateCatAttributesForm.attr_vals.toString();
      console.log("attr_vals转为字符串", this.updateCatAttributesForm);
      this.inputVisible = false;
      let res = await updateCatAttributesList(this.updateCatAttributesForm);
      let { status, msg } = res.meta;
      if (status == 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      // 清空已输入的值
      this.inputValue = "";
      // 重新渲染表格
      this.flushTable();
    },
    // 将当前行的attr_vals转成tag能识别的数组
    rowAttrToForm(row) {
      let { cat_id, attr_id, attr_name, attr_sel, attr_vals } = row;
      // 将当前行的数据写入到修改表单中，TODO 优化写入方式
      this.updateCatAttributesForm.cat_id = cat_id;
      this.updateCatAttributesForm.attr_id = attr_id;
      this.updateCatAttributesForm.attr_name = attr_name;
      this.updateCatAttributesForm.attr_vals = attr_vals;
      this.updateCatAttributesForm.attr_sel = attr_sel;
      console.log("row数据写入form", this.updateCatAttributesForm);
      console.log("本行信息", row);
    },
    // 添加动态、静态参数,动态静态公用
    async addCatAttributes(isSubmit) {
      if (isSubmit) {
        let { attr_name, attr_vals } = this.addCatAttributesForm;
        let res = await addCatAttributesList(
          this.checkedCatId,
          attr_name,
          this.tabActiveName,
          attr_vals
        );
        let { status, msg } = res.meta;
        if (status == "201") {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
        // 重新渲染表格
        this.flushTable();
      } else {
        this.$message.info("用户取消提交");
      }
      // 隐藏表单
      this.addCatAttributesForm.manyFormVisible = false;
      this.addCatAttributesForm.onlyFormVisible = false;
    },
    // 修改动态、静态参数,动态静态公用
    async updateCatAttributes(isSubmit) {
      if (isSubmit) {
        let res = await updateCatAttributesList(this.updateCatAttributesForm);
        let { status, msg } = res.meta;
        if (status == 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
        // 重新渲染表格
        this.flushTable();
      } else {
        this.$message.info("用户取消提交");
      }
      this.updateCatAttributesForm.manyUpdateFormVisible = false;
      this.updateCatAttributesForm.onlyUpdateFormVisible = false;
    },
  },
  created() {
    this.getGoodsCat();
  },
};
</script>

<style lang="less" scope>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>