<template>
  <div class="component">
    <label>{{ label }}</label>
    <input required :type="type" v-model="value" :placeholder="placeholder" />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    type: String,
    placeholder: String,
    modelValue:String
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get(){
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
};
</script>

<style scoped>
.component {
  display: flex;
  flex-direction: column;
}
</style>