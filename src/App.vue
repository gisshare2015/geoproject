<template>
  <n-message-provider>
    <div class="header">
      <div class="logo">
        <img src="./assets/GISShare.png" onclick="window.open(window.location.origin, '_blank')"/>
      </div>
      <div class="desc">
        <p class="desc_text">1.按照数据格式输入坐标信息；</p>
        <p class="desc_text">2.选择空间参考（SRID）的相互转换方式。</p>
      </div>
    </div>
    <MainView />
    <div class="icp-info">
      GISShare
      <a href="https://beian.miit.gov.cn" target = '_blank'> {{CONST_ICPInfo}} </a>
    </div>
  </n-message-provider>
</template>

<script setup>
import { defineComponent, ref } from 'vue';
import { NMessageProvider } from 'naive-ui';
import MainView from './components/MainView.vue'

const CONST_ICPInfo = ref(window.location.host.indexOf('gisshare.com') >= 0 ? '皖ICP备15011632号-1' : '皖ICP备15011632号-2');

defineComponent({name: 'App'});

</script>

<style>
#app {
  position: relative;
  width: 100%;
  height: 100vh;
  color: #ffffff;
}
.header{
  width: 100%;
  height: 39px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: fixed;
  z-index: 10;
}
.logo {
  width: 180px;
  height:39px;
  margin-right: 15px;
}
.logo img{
  width: 100%;
  height: 100%;
}
.desc{
  line-height: 1;
  flex:1;
  color: #333;
  font-size: 12px;
}
.desc_text{
  margin: 3px 0;
}

.icp-info{
  color:black; 
  background: #eee;
  /* background-color: rgba(255, 255, 255, 0.701961);  */
  /* border: 1px solid #ccc;  */
  padding-left: 3px;
  padding-right: 3px; 
  font-size: 10px; 
  position: fixed; 
  bottom: 0px; 
  left: 0px;
  /* width: calc(100% - 9px); */
  width: 100%;
}
p, ul{
  margin: 0;
  padding: 0;
}
ul, ol{
  list-style: none;
}
</style>