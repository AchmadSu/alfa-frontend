<template>
    <div 
        v-if="this.message != ''"
        :class="this.isSuccess ? 
        'ui floating message green position-fixed ui message alert alert-dismissible fade show' :
        'ui floating message red position-fixed ui message alert alert-dismissible fade show'"
        role="alert"
        bis_skin_checked="1"
    >
        <i @click="setMessage('')" data-bs-dismiss="alert" class="close icon"></i>
        <div class="header" bis_skin_checked="1">
            {{this.message}}
        </div>
        <p v-if="this.isSuccess">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis possimus libero beatae laudantium!
        </p>
        <p v-else>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis possimus libero beatae laudantium!
        </p>
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <b>Tambah Data</b>
                </div>
            <div class="modal-body">
                <FormData ref="createRef"></FormData>
            </div>
            <div class="modal-footer">
                <div class="ui cancel red button" data-bs-dismiss="modal" :disabled="this.isExecute">Batal</div>
                <template v-if="this.isExecute">
                    <button disabled="true" class="ui cancel green button">
                        <i class="loading spinner icon"></i>
                    </button>
                </template>
                <template v-else>
                    <button @click="execute(null)" class="ui cancel green button">Tambah</button>
                </template>
            </div>
            </div>
        </div>
    </div>
    <template v-if="!this.isLoading && this.data.length">
        <template v-for="item in this.data" :key="item.id">
            <div class="modal fade" :id="'editModal'+ item.id" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <b>Update Data {{ item.nama }}</b>
                        </div>
                        <div class="modal-body">
                            <FormData ref="updateRef" id="{{item.id}}" :nama="item.nama"></FormData>
                        </div>
                        <div class="modal-footer">
                            <div class="ui cancel red button" data-bs-dismiss="modal" :disabled="this.isExecute">Batal</div>
                            <template v-if="this.isExecute">
                                <button disabled="true" class="ui cancel primary button">
                                    <i class="loading spinner icon"></i>
                                </button>
                            </template>
                            <template v-else>
                                <button @click="execute(item.id)" class="ui cancel primary button">Edit</button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </template>
    <table class="text-center ui orange striped table align-middle">
        <thead class="align-middle">
            <tr>
                <th class="ui header text-center" colspan="5">
                    Daftar Mahasiswa
                </th>
            </tr>
            <tr>
                <th>Nama</th>
                <th>Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
                <th>Jurusan</th>
                <th>
                    <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="ui inverted green button">
                        <i class="plus icon"></i>
                        &nbsp;
                        Tambah Data
                    </button>
                </th>
            </tr>
        </thead>
        <tbody style="overflow-y: scroll;" v-if="this.isLoading">
            <tr>
                <td colspan="5"><i class="loading spinner icon"></i></td>
            </tr>
        </tbody>
        <tbody v-else-if="!this.isLoading && !this.data.length">
            <tr>
                <td colspan="5" class="text-center">Data tidak tersedia</td>
            </tr>
        </tbody>
        <tbody class="overflow-auto" v-else-if="!this.isLoading && this.data.length">
            <tr v-for="(item, index) in this.data" :key="item.id">
                <td>{{item.nama}}</td>
                <td>{{dateFormat(item.tgl_lahir)}}</td>
                <td v-if="item.gender === 0">Laki-Laki</td>
                <td v-else-if="item.gender === 1">Perempuan</td>
                <td v-else>Undefined</td>
                <td>{{item.jurusan}}</td>
                <td>
                    <div class="ui buttons" bis_skin_checked="1">
                        <template v-if="this.indexClicked != index">
                            <button :disabled="this.isDelete" data-bs-toggle="modal" :data-bs-target="'#editModal' + item.id"
                                class="ui primary button"
                            >
                                <i class="edit outline icon"></i>
                                &nbsp;
                                Edit
                            </button>
                            <div class="or" bis_skin_checked="1"></div>
                        </template>
                        <template v-if="this.isDelete && index == this.indexClicked">
                            <button disabled class="ui loading red button">
                                &nbsp;
                                On Progress
                            </button>
                        </template>
                        <template v-else>
                            <button :disabled="this.isDelete" @click="destroy(item.id, index)" class="ui red button">
                                <i class="trash alternate outline icon"></i>
                                &nbsp;
                                Delete
                            </button>
                        </template>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>
  import axios from 'axios'
  import { useDateFormat } from '@vueuse/core'
  import FormData from './FormComponent.vue'
//   import { useRouter } from 'vue-router'
  export default {
    name: 'MahasiswaTableComponent',
    data() {
        return {
            isLoading: true,
            isExecute: false,
            isDelete: false,
            data: [],
            response: [],
            message: '',
            isSuccess: false,
            indexClicked: null
        }
    },
    components: {
        FormData
    },
    methods: {
        execute(id = null, index = null) {
            if (id === null || index == null) {
                console.log("create")
                this.$refs.createRef.create();
                this.isExecute = this.$refs.createRef.getIsExecute()
            } else {
                console.log("update")
                this.$refs.updateRef[index].update();
                this.isExecute = this.$refs.updateRef[index].getIsExecute()
            }
            setTimeout(() => this.isExecute = false, 5000)
            setTimeout(() => this.getData(), 3000);
        },
        async destroy(id, index) {
            this.indexClicked = index
            this.isDelete = true
            const param = {
                "ids": [id]
            }
            // console.log(params)
            try {
                await axios.delete('mahasiswa', {params: param})
                .then((response) => {
                    console.log(response)
                    this.message = response.data.message
                    this.isSuccess = response.data.isSuccess
                    this.getData()
                })
                .catch((err) => {
                    this.isSuccess = false;
                    this.message = err.response.data.message
                });
            } catch (error) {
                this.isSuccess = false;
                this.message = "Internal Server Error"
            }
            this.isDelete = false
            this.indexClicked = null
        },
        async getData() {
            this.data = [],
            this.$isLoading = true
            this.isLoading = true
            this.param = {
                "paginate": 10
            }
            try {
                await axios.get('mahasiswa', {param: this.param})
                .then((response) => {
                    Object.keys(response.data.data.data).forEach((item) => {
                        this.data.push(response.data.data.data[item]);
                    });
                    this.isSuccess = true
                    this.message = response.data.message
                })
                .catch((err) => {
                    if(!err.response || err.response){
                        this.isSuccess = false;
                        this.message = err.response.data.message
                    }
                });
            } catch (error) {
                this.isSuccess = false;
                this.message = "Internal Server Error"
            }
            this.$isLoading = false
            this.isLoading = false
        },
        dateFormat(e) {
            return useDateFormat(e, "dddd, DD MMMM YYYY", {locales:'id-ID'})
        },
        setMessage(message) {
            this.message = message
        }
    },
    mounted(){
        this.getData()
    }
  };
  </script>