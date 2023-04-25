<template>
    <button :class="classe">{{ label }}</button>
</template>

<script>
export default {
  props: {
    label: String,
    classe: String
  }, 
};
</script>

<style scoped>

</style>