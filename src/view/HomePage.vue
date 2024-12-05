<template>
    <div :style="this.$isLoading ? 'height: 100vh' : ''" class="container">
        <div class="row card">
            <div class="col-12 mt-4 d-flex justify-content-evenly">
                <h2 class="ui header">Sistem Informasi Akademik</h2>
            </div>
            <div class="col-12 p-4 d-flex justify-content-evenly">
                <MahasiswaTableComponent></MahasiswaTableComponent>
            </div>
        </div>
    </div>
</template>

<script>
// import FormComponent from '../components/FormComponent.vue'
import MahasiswaTableComponent from '../components/MahasiswaTableComponent.vue'
// import FormImage from '../assets/form.jpg'
export default {
  data(){
    return {
      windowWidth: window.innerWidth,
      currentYear: new Date().getFullYear(),
    }
  },
  components: {
    MahasiswaTableComponent
  },
  methods: {
    sizeHandler(){
        window.onresize = () => {
            this.windowWidth = window.innerWidth
        }
    }
  },
  mounted() {
    this.$isLoading = true
  }
}
</script>