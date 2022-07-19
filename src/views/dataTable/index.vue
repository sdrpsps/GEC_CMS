<template>
  <div id="echarts_box" style="width: 600px; height: 400px"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import _ from "lodash";
import { getDataTable } from "@/api/goods.js";
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#262626",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  created() {},
  // DOM 渲染完成触发
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      // 1. 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("echarts_box"));
      // 2. 发起请求，获取数据
      let res = await getDataTable();
      console.log(res);
      let {
        meta: { status, msg },
      } = res;
      if (status == 200) {
        this.$message.success(msg);
      } else {
        this.$message.error("获取折线图数据失败！");
      }
      // 指定图标的配置项和数据(合并数据)
      const reRes = _.merge(res.data, this.options);
      // 3. 使用刚指定的配置项和数据，显示图表
      myChart.setOption(reRes);
    },
  },
};
</script>

<style>
</style>