<template>
    <div v-if="isSuccess" class="ui success message" bis_skin_checked="1">
        <i class="close icon"></i>
        <div class="header" bis_skin_checked="1">
            {{ message }}
        </div>
        <p>Redirect to home...</p>
    </div>
    <div v-else class="ui negative message" bis_skin_checked="1">
        <div class="header" bis_skin_checked="1">
            {{ message }}
        </div>
        <p>Please try again later</p>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    message: {
        type: String
    },
    isSuccess: {
        type: Boolean
    }
  }
}

</script>