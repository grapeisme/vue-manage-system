<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="content">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    export default {
        components:{
            vHead
        }
    }
</script>

<style scoped>
    .content {
        left: 0;
        padding: 10px;
    }
</style>
