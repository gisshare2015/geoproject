<template>
  <n-modal-provider>
    <n-message-provider>
      <MainView />
      <div class="icp-info">
        GISShare
        <a href="https://beian.miit.gov.cn" target = '_blank'> {{CONST_ICPInfo}} </a>
      </div>
    </n-message-provider>
  </n-modal-provider>
</template>

<script setup>
import { defineComponent, ref } from 'vue';
import { NMessageProvider, NModalProvider } from 'naive-ui';
import MainView from './components/MainView.vue'

const CONST_ICPInfo = ref(window.location.host.indexOf('gisshare.com') >= 0 ? '皖ICP备15011632号-1' : '皖ICP备15011632号-2');

defineComponent({name: 'App'});

window.addEventListener('resize', (event) => {
  if(screen.height === document.documentElement.clientHeight){
    // console.log('已进入全屏');
    document.getElementById('divHeader').style.display = 'none';
    document.getElementById('divMain').style.height = '100vh';
    document.getElementById('divMain').style.paddingTop = '0px';
  } else{
    // console.log('已退出全屏');
    document.getElementById('divHeader').style.display = '';
    document.getElementById('divMain').style.height = '';
    document.getElementById('divMain').style.paddingTop = '';
  }
});
</script>

<style>
#app {
  position: relative;
  width: 100%;
  height: 100vh;
  color: #ffffff;
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