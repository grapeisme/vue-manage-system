<template>
    <div class="wrapper">
        <!--<v-head></v-head> -->
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
        },
        data: function() {
            document.title = document.title + "-网页标注";
        },
    }
</script>

<style scoped>
    .content {
        left: 0;
        top: 0px;
        padding: 0px;
    }
</style>
