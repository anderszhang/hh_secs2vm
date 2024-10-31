<template>
    <HotTable ref="tableRef"  :settings="hotSettings" :data="props.data">
        <!-- 从外部传入的props.data 对象数组中，解析出字段名，循环生成column -->
        <HotColumn v-for="colName in props.colNames" :title="colName" :data="colName" :key="colName" ></HotColumn>
    </HotTable>
</template>
<script lang="ts" setup>
import { computed, watch,reactive, ref } from 'vue';
import { HotTable, HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';


registerAllModules()

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    colNames: {
        type: Array,
        default: () => []
    },
    afterOnCellMouseDown: {
        type: Function,
        default: (row, col) => {}
    }
})

const emit = defineEmits<{
    afterOnCellMouseDown : [row: number, col: number]
}>()

const tableRef = ref()
const hotSettings = reactive(
    {
        width: '100%',
        colHeaders: true,
        rowHeaders: true,
        // height: 'auto',
        height: '400px',
        autoWrapRow: true,
        autoWrapCol: true,
        // colWidths: [150, 400],
        minRows: 30,  
        stretchH: 'all',
        contextMenu: true,
        licenseKey: 'non-commercial-and-evaluation',
        afterOnCellMouseDown: (event, coords, TD) => {
            console.log('单元格被点击了');
            console.log('行：', coords.row, '列：', coords.col);
            emit('afterOnCellMouseDown', coords.row,coords.col)
        }
    }
)

const getData = () => {
    return tableRef.value.hotInstance.getData()
}

defineExpose({
    getData
})

watch(() => props.data, (newVal) => {
    tableRef.value.hotInstance.loadData(newVal)
})

</script>