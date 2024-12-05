<template>
    <Alert v-if="this.showAlert" :isSuccess="this.isSuccess" :message="this.message"></Alert>
    <form class="ui form">
      <div :class="this.isValidName ? 'field':'field error'">
        <label v-if="id != 0">Nama Baru</label>
        <label v-else>Nama Mahasiswa</label>
        <input v-model="form.nama"
          type="text" 
          name="nama" 
          :placeholder="id != 0 ? 'Nama Baru' : 'Nama Mahasiswa'"
          required
        >
      </div>
      <div :class="this.isValidDate ? 'field':'field error'">
        <label v-if="id != 0">Tanggal Lahir Baru</label>
        <label v-else>Tanggal Lahir</label>
        <input v-model="form.tgl_lahir"
          type="date"
          name="tgl_lahir"
          placeholder="Tanggal Lahir"
          :required="this.isRequired"
        >
      </div>
      <div class="two fields">
        <div :class="this.isValidGender ? 'field':'field error'">
          <label v-if="id != 0">Jenis Kelamin Baru</label>
          <label v-else>Jenis Kelamin</label>
          <select v-model="form.gender"
            name="gender"
            class="ui fluid dropdown"
            :required="this.isRequired"
          >
            <option value="" disabled>Jenis Kelamin</option>
            <option value="0">Laki-Laki</option>
            <option value="1">Perempuan</option>
          </select>
        </div>
        <div :class="this.isValidJurusan ? 'field':'field error'">
          <label v-if="id != 0">Jurusan Baru</label>
          <label v-else>Jurusan</label>
          <select v-model="form.id_jurusan"
            class="ui fluid dropdown"
            :required="this.isRequired"
          >
            <option value="" disabled>Jurusan</option>
            <option v-if="this.isLoading"><i class="loading spinner icon"></i></option>
            <option v-else-if="!this.isLoading && !this.jurusanData.length">Data tidak tersedia</option>
            <template v-else-if="!this.isLoading && this.jurusanData.length">
              <option v-for="item in this.jurusanData" :key="item.id" :value="item.id">{{ item.nama }}</option>
            </template>
          </select>
        </div>
      </div>
      <div class="field">
          <label v-if="id != 0">Hobi</label>
          <label v-else>Hobi</label>
          <select v-model="form.hobbies" class="ui fluid dropdown">
            <option value="" disabled>Hobi</option>
            <option v-if="this.isLoading"><i class="loading spinner icon"></i></option>
            <option v-else-if="!this.isLoading && !this.hobiData.length">Data tidak tersedia</option>
            <template v-else-if="!this.isLoading && this.hobiData.length">
              <option v-for="item in this.hobiData" :key="item.id" :value="item.id">{{ item.nama }}</option>
            </template>
          </select>
        </div>
    </form>
  </template>
  
  <script>
  import axios from 'axios'
  import Alert from './AlertComponent.vue'
  export default {
    name: 'FormComponent',
    props: {
      id: {
        type: Number,
        default: 0,
      },
      nama: {
        type: String,
      }
    },
    data() {
      return {
        isLoading: true,
        isValidName: this.id !== 0 ? true : false,
        isValidDate: this.id !== 0 ? true : false,
        isValidGender: this.id !== 0 ? true : false,
        isValidJurusan: this.id !== 0 ? true : false,
        isExecute: false,
        showAlert: false,
        message: '',
        isValid: false,
        jurusanData: [],
        hobiData: [],
        response: [],
        isSuccess: false,
        form: {
          nama: this.nama !== null ? this.nama : '',
          tgl_lahir: '',
          gender: '',
          id_jurusan: '',
          hobbies: ''
        }
      }
    },
    components: {
      Alert
    },
    methods: {
      async getJurusan() {
        this.jurusanData = [],
        this.isLoading = true
        try {
            await axios.get('jurusan')
            .then((response) => {
                Object.keys(response.data.data).forEach((item) => {
                    this.jurusanData.push(response.data.data[item]);
                });
                this.isSuccess = true
            })
            .catch((err) => {
                if(!err.response || err.response){
                    this.isSuccess = false;
                }
            });
        } catch (error) {
            this.isSuccess = false;
        }
        this.isLoading = false
      },
      async getHobi() {
        this.hobiData = [],
        this.isLoading = true
        try {
            await axios.get('hobi')
            .then((response) => {
                Object.keys(response.data.data).forEach((item) => {
                    this.hobiData.push(response.data.data[item]);
                });
                this.isSuccess = true
            })
            .catch((err) => {
                if(!err.response || err.response){
                    this.isSuccess = false;
                }
            });
        } catch (error) {
            this.isSuccess = false;
        }
        this.isLoading = false
      },
      async create() {
        if (this.isValid) {
          this.isExecute = true
          this.showAlert = false
          this.message = ''
          let param = {
            "nama": this.form.nama,
            "tgl_lahir": this.form.tgl_lahir,
            "gender": this.form.gender,
            "id_jurusan": this.form.id_jurusan
          }
          if(this.form.hobbies !== '') {param["hobbies"] = [this.form.hobbies] }
          try {
              await axios.post('mahasiswa', param)
              .then((response) => {
                  console.log(response)
                  console.log(response.data)
                  this.message = response.data.message
                  this.isSuccess = true
              })
              .catch((err) => {
                console.log(err)
                console.log("err")
                  if(!err.response || err.response){
                      this.message = err.response.message
                      this.isSuccess = false;
                  }
              });
          } catch (error) {
            console.log("error")
            console.log(error)
              this.message = error.statusCode + " " + error.message
              this.isSuccess = false;
          }
          this.isExecute = false
          this.showAlert = true
        }
      },
      async update() {
        if (this.isValid) {
          this.isExecute = true
          this.showAlert = false
          this.message = ''
          let param = {
            "id": this.id,
            "nama": this.form.nama
          }
  
          if(this.form.tgl_lahir !== '') { param["tgl_lahir"] = this.form.tgl_lahir }
          if(this.form.gender !== '') { param["gender"] = this.form.gender }
          if(this.form.id_jurusan !== '')  { param["id_jurusan"] = this.form.id_jurusan }
          if(this.form.hobbies !== '') {param["hobbies"] = [this.form.hobbies] }
  
          try {
              await axios.put('mahasiswa', param)
              .then((response) => {
                  // console.log(response.data)
                  this.message = response.data.message
                  this.isSuccess = true
              })
              .catch((err) => {
                console.log(err)
                console.log("err")
                if(!err.response || err.response){
                    this.message = err.response.message
                    this.isSuccess = false;
                }
              });
          } catch (error) {
            console.log(error)
            console.log("error")
            this.isSuccess = false;
          }
          this.isExecute = false
          this.showAlert = true
        }
      },
      validateForm(bool){
        let isValid = bool
        return isValid
      },
      setValidateName(bool) {
        this.isValidName = bool
      },
      setValidateDate(bool) {
        this.isValidDate = bool
      },
      setValidateGender(bool) {
        this.isValidGender = bool
      },
      setValidateJurusan(bool) {
        this.isValidJurusan = bool
      },
      getIsExecute() {
        return this.isExecute
      }
    },
    watch: {
      form: {
        handler: function (params) {

          let isValidName = params.nama.length > 3
          let isValidDate = params.tgl_lahir !== ''
          let isValidGender = params.gender !== ''
          let isValidJurusan = params.id_jurusan !== ''

          this.setValidateName(isValidName)
          if (this.id !== 0 && this.id !== null) {
            this.setValidateDate(true)
            this.setValidateJurusan(true)
            this.setValidateGender(true)
            console.log("test")
            const setValid = isValidName && this.id !== 0
            this.isValid = this.validateForm(setValid)
          } else {
            this.setValidateDate(isValidDate)
            this.setValidateGender(isValidGender)
            this.setValidateJurusan(isValidJurusan)
            const setValid = isValidName && isValidDate && isValidGender & isValidJurusan
            this.isValid = this.validateForm(setValid)
          }

        },
        deep: true,
      }
    },
    mounted() {
      this.getJurusan()
      this.getHobi()
    }
  };
  </script>
  