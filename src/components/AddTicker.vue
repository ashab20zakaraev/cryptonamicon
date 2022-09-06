<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @input="errorDuplicateTicker = false"
            @keydown.enter="add(ticker)"
            type="text"
            name="wallet"
            id="wallet"
            class="
              block
              w-full
              pr-10
              border-gray-300
              text-gray-900
              focus:outline-none focus:ring-gray-500 focus:border-gray-500
              sm:text-sm
              rounded-md
            "
            placeholder="Например DOGE"
            autocomplete="off"
          />
        </div>

        <div
          v-if="ticker.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="(item, idx) in paginatedAutocompleted"
            :key="idx"
            @click="add(item)"
            class="
              inline-flex
              items-center
              px-2
              m-1
              rounded-md
              text-xs
              font-medium
              bg-gray-300
              text-gray-800
              cursor-pointer
            "
          >
            {{ item }}
          </span>
        </div>

        <div v-if="errorDuplicateTicker" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button @click="add(ticker)" :disabled="disabled" type="button" />
  </section>
</template>

<script>
import AddButton from "./AddButton"
export default {
  data() {
    return {
      ticker: "",
      errorDuplicateTicker: false,
    }
  },
  components: {
    AddButton,
  },
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    tickers: {
      type: Array,
      required: false,
      default: [],
    },
    allTickers: {
      type: Array,
      required: false,
      default: [],
    },
  },
  emits: {
    "add-ticker": {
      type: Boolean,
    },
  },
  methods: {
    add(ticker) {
      if (ticker.length === 0) {
        return
      }

      const duplicateTicker = this.tickers.some(
        (t) => t.name === ticker.toUpperCase()
      )

      if (duplicateTicker) {
        this.errorDuplicateTicker = duplicateTicker
        return
      }

      this.$emit("add-ticker", ticker)
      this.ticker = ""
      this.errorDuplicateTicker = false
    },
  },
  computed: {
    filterAutocompleted() {
      return this.allTickers.filter((item) =>
        item.includes(this.ticker.toUpperCase())
      )
    },
    paginatedAutocompleted() {
      return this.filterAutocompleted.slice(this.filterAutocompleted.length - 4)
    },
  },
}
</script>