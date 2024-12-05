<template>
  <router-view></router-view>
</template>

<script>
export default {
  data(){
    return {
      windowWidth: window.innerWidth,
      currentYear: new Date().getFullYear(),
    }
  },
  methods: {
    sizeHandler(){
        window.onresize = () => {
            this.windowWidth = window.innerWidth
        }
    }
  },
  created(){
      window.addEventListener("resize", this.sizeHandler);
  },
  unMounted() {
      window.removeEventListener("resize", this.sizeHandler);
  },
  mounted(){
    // this.isLoading = true;
    window.onresize = () => {
        this.windowWidth = window.innerWidth
    }
    setTimeout(() => this.isLoading = false, 2000);
  }
}
</script>
