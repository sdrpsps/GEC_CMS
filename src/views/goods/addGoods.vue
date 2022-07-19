<template>
  <div class="addGoods">
    <!-- 面包屑 -->
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/goods/goodsList' }"
          >商品列表</el-breadcrumb-item
        >
        <el-breadcrumb-item>新增商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 警告栏 -->
    <div class="alert">
      <el-alert title="请按要求和顺序添加商品" type="info" center show-icon>
      </el-alert>
    </div>
    <!-- 步骤条 -->
    <div class="steps">
      <el-steps :active="setpsActive" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
    </div>
    <!-- 标签页 -->
    <div class="tabs">
      <el-tabs
        tab-position="left"
        style="height: 500px"
        @tab-click="changeStepsActive"
      >
        <el-tab-pane label="基本信息">
          <!-- 新增表单 -->
          <el-form
            label-position="right"
            label-width="80px"
            :model="addGoodsForm"
            :rules="addGoodsForm.formRules"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 多级菜单 -->
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="goodsCatList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数"></el-tab-pane>
        <el-tab-pane label="商品属性"></el-tab-pane>
        <el-tab-pane label="商品图片">
          <!-- 上传图片 -->
          <el-upload
            class="upload-demo"
            action="https://cmsapi.52kfw.cn/api/private/v1/uploads"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quill-editor
            ref="myQuillEditor"
            v-model="addGoodsForm.goods_introduce"
            class="editor"
            :options="editorOption"
          />
          <el-button
            type="success"
            @click.native="
              nextSetps();
              addGoods();
            "
            >提交</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 下一步按钮 -->
    <!-- <div class="nextBtn">
      <el-button style="margin-top: 12px" @click="nextSetps">下一步</el-button>
    </div> -->
  </div>
</template>

<script>
import { getGoodsCatList, addGoodsList } from "@/api/goods.js";

// 富文本工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ["clean"], // 清除文本格式
  // ['link', 'image', 'video'] // 链接、图片、视频
  ["link", "image", "video"], // 链接、图片
];

export default {
  data() {
    return {
      setpsActive: 0,
      //   新增商品表单
      addGoodsForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
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
          goods_cat: [{ required: true, message: "请选择商品分类" }],
        },
      },
      goodsCatList: [],
      fileList: [],

      editorOption: {
        // 编辑框操作事件
        theme: "snow", // or 'bubble'
        placeholder: "您想发布点什么？",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function (value) {
                // 上传图片
                if (value) {
                  document.querySelector(".avatar-uploader-img input").click(); // 触发input框选择文件
                } else {
                  this.quill.format("image", false);
                }
              },
              link: function (value) {
                // 添加链接
                if (value) {
                  var href = prompt("请输入url");
                  this.quill.format("link", href);
                } else {
                  this.quill.format("link", false);
                }
              },
              video: function (value) {
                // 上传视频
                if (value) {
                  document
                    .querySelector(".avatar-uploader-video input")
                    .click(); // 触发input框选择文件
                } else {
                  this.quill.format("video", false);
                }
              },
            },
          },
        },
      },
    };
  },

  methods: {
    // 下一步按钮，修改步骤条高亮
    nextSetps() {
      if (this.setpsActive++ > 4) this.setpsActive = 0;
    },
    // 点击tab，切换步骤条高亮
    changeStepsActive(tab) {
      this.setpsActive = Number(tab.index);
    },
    // 获取商品分类列表
    async getGoodsCat() {
      let res = await getGoodsCatList();
      console.log("商品分类", res);
      this.goodsCatList = res.data;
    },
    // 获取商品所选的分类
    handleChange(value) {
      console.log(value);
      this.addGoodsForm.goods_cat = value;
    },
    // 上传相关 start
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传相关 end
    // 新增商品
    async addGoods() {
      // 将商品类型ID从数组转为字符串，用于接口传参
      this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.toString();
      let res = await addGoodsList(this.addGoodsForm);
      console.log("新增商品状态",res);
      let { status, msg } = res.meta;
      if (status == 201) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
  },
  created() {
    this.getGoodsCat();
  },
};
</script>

<style lang="scss" scope>
.avatar-uploader-img {
  height: 0;
}
.avatar-uploader-video {
  height: 0;
}
::v-deep .ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
::v-deep .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}
::v-deep .ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label::before,
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-label::before,
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
::v-deep
  .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value="monospace"]::before,
::v-deep
  .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>