<template>
  <Teleport to="body">
    <Transition name="opt-modal">
      <div
        v-if="show && product"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
        @click.self="$emit('close')"
      >
        <div class="flex w-full max-w-md flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl max-h-[92vh]">

          <!-- Header -->
          <div class="flex items-start justify-between border-b border-slate-100 px-5 py-4 shrink-0">
            <div>
              <h2 class="text-base font-bold text-slate-800">{{ product.name }}</h2>
              <p class="mt-0.5 text-sm text-slate-400">ราคาเริ่มต้น {{ fmt.currency(product.price) }}</p>
            </div>
            <button
              class="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
              @click="$emit('close')"
            >
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>

          <!-- Options (scrollable) -->
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            <div v-for="group in product.options" :key="group.id">
              <div class="mb-3 flex items-center gap-2">
                <p class="text-sm font-semibold text-slate-700">{{ group.label }}</p>
                <span
                  v-if="group.required"
                  class="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500"
                >จำเป็น</span>
              </div>

              <!-- Radio group -->
              <div v-if="group.type === 'radio'" class="flex flex-wrap gap-2">
                <button
                  v-for="choice in group.choices"
                  :key="choice.id"
                  :class="[
                    'rounded-xl border px-4 py-2.5 text-sm font-medium transition active:scale-95',
                    radioSelections[group.id] === choice.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  ]"
                  @click="radioSelections[group.id] = choice.id"
                >
                  {{ choice.label }}
                  <span v-if="choice.priceExtra > 0" class="ml-1 text-xs opacity-60">
                    +{{ fmt.currency(choice.priceExtra) }}
                  </span>
                </button>
              </div>

              <!-- Checkbox group -->
              <div v-else class="flex flex-wrap gap-2">
                <button
                  v-for="choice in group.choices"
                  :key="choice.id"
                  :class="[
                    'rounded-xl border px-4 py-2.5 text-sm font-medium transition active:scale-95',
                    (checkboxSelections[group.id] ?? []).includes(choice.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  ]"
                  @click="toggleCheckbox(group.id, choice.id)"
                >
                  {{ choice.label }}
                  <span v-if="choice.priceExtra > 0" class="ml-1 text-xs opacity-60">
                    +{{ fmt.currency(choice.priceExtra) }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer: qty + price + confirm -->
          <div class="shrink-0 border-t border-slate-100 px-5 py-4 space-y-4">
            <!-- Quantity selector -->
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">จำนวน</span>
              <div class="flex items-center gap-3">
                <button
                  :disabled="localQty <= 1"
                  class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:scale-95 disabled:opacity-40"
                  @click="localQty--"
                >
                  <Icon name="heroicons:minus" class="h-4 w-4" />
                </button>
                <span class="w-8 text-center text-base font-bold text-slate-800">{{ localQty }}</span>
                <button
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 active:scale-95"
                  @click="localQty++"
                >
                  <Icon name="heroicons:plus" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Price summary -->
            <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span class="text-xs text-slate-500">{{ fmt.currency(unitPrice) }} × {{ localQty }}</span>
              <span class="text-xl font-bold text-blue-600">{{ fmt.currency(lineTotal) }}</span>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-2">
              <button
                class="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                @click="$emit('close')"
              >
                ยกเลิก
              </button>
              <button
                :disabled="!isValid"
                class="flex-[2] rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95 disabled:opacity-40"
                @click="confirm"
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import type { SelectedOption } from '~/types/cart'

const props = defineProps<{
  show: boolean
  product: Product | null
}>()

const emit = defineEmits<{
  close: []
  confirm: [selectedOptions: SelectedOption[], optionExtra: number, qty: number]
}>()

const fmt = useFormatter()
const localQty = ref(1)
const radioSelections = ref<Record<string, string>>({})
const checkboxSelections = ref<Record<string, string[]>>({})

// Reset state when modal opens
watch(
  () => props.show,
  (visible) => {
    if (visible) {
      localQty.value = 1
      radioSelections.value = {}
      checkboxSelections.value = {}
    }
  },
)

function toggleCheckbox(groupId: string, choiceId: string) {
  const current = checkboxSelections.value[groupId] ?? []
  checkboxSelections.value[groupId] = current.includes(choiceId)
    ? current.filter((id) => id !== choiceId)
    : [...current, choiceId]
}

const totalExtra = computed(() => {
  if (!props.product?.options) return 0
  let extra = 0
  for (const group of props.product.options) {
    if (group.type === 'radio') {
      const choice = group.choices.find((c) => c.id === radioSelections.value[group.id])
      if (choice) extra += choice.priceExtra
    } else {
      for (const choiceId of checkboxSelections.value[group.id] ?? []) {
        const choice = group.choices.find((c) => c.id === choiceId)
        if (choice) extra += choice.priceExtra
      }
    }
  }
  return extra
})

const unitPrice = computed(() => (props.product?.price ?? 0) + totalExtra.value)
const lineTotal = computed(() => unitPrice.value * localQty.value)

const isValid = computed(() => {
  if (!props.product?.options) return true
  return props.product.options
    .filter((g) => g.required && g.type === 'radio')
    .every((g) => !!radioSelections.value[g.id])
})

function confirm() {
  if (!isValid.value || !props.product?.options) return
  const selectedOptions: SelectedOption[] = []

  for (const group of props.product.options) {
    if (group.type === 'radio') {
      const choiceId = radioSelections.value[group.id]
      if (choiceId) {
        const choice = group.choices.find((c) => c.id === choiceId)!
        selectedOptions.push({
          groupId: group.id,
          groupLabel: group.label,
          choiceIds: [choiceId],
          choiceLabels: [choice.label],
          totalExtra: choice.priceExtra,
        })
      }
    } else {
      const choiceIds = checkboxSelections.value[group.id] ?? []
      if (choiceIds.length > 0) {
        const choices = group.choices.filter((c) => choiceIds.includes(c.id))
        selectedOptions.push({
          groupId: group.id,
          groupLabel: group.label,
          choiceIds,
          choiceLabels: choices.map((c) => c.label),
          totalExtra: choices.reduce((s, c) => s + c.priceExtra, 0),
        })
      }
    }
  }

  emit('confirm', selectedOptions, totalExtra.value, localQty.value)
}
</script>

<style scoped>
.opt-modal-enter-active,
.opt-modal-leave-active {
  transition: opacity 0.2s ease;
}
.opt-modal-enter-from,
.opt-modal-leave-to {
  opacity: 0;
}
</style>
