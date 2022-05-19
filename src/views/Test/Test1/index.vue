<template>
  <div>
    测试1
    <el-button
      type="primary"
      v-show="$store.state.user.buttons.indexOf('btn.www1') != -1"
      >添加按钮1</el-button
    >
    <el-button
      type="primary"
      v-show="$store.state.user.buttons.indexOf('btn.eee') != -1"
      >添加按钮2</el-button
    >
  </div>
</template>

<script>
export default {
  name: "",
};
</script>

<style scoped></style>
