<template>
  <section class="flex max-h-16">
        <nav class="w-full p-4 text-white bg-gradient-to-r from-gray-800 to-gray-600">
        <span class="text-bold mx-4 text-xl">台灣安心旅遊通</span>
        
        <router-link 
        v-for="list in lists" 
        :key="list.to" 
        class="mx-4" 
        :to="list.to">
            {{list.title}}
        </router-link>
    </nav>
  </section>
</template>

<script>
export default {
    data(){
        return{
            lists: [
                {title: 'Home', to: '/'},
            ],
        }
    }
}
</script>
