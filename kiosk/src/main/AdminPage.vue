<script setup>
/* ── core ────────────────────────────────────────── */
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'

/* ── stores / services ───────────────────────────── */
import { useChartStore } from '@/stores/chartStore'
import { viewChart, viewCourseChart } from '@/services/chartServices'

/* ── UI helpers ──────────────────────────────────── */
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import LineChart from '@/components/Charts/LineChart.vue'
import BarChart from '@/components/Charts/BarChart.vue'
import DoughnutChart from '@/components/Charts/DoughnutChart.vue'
import ToasterComponent from '@/common/ToasterComponent.vue'

/* ── state ───────────────────────────────────────── */
const chartStore = useChartStore()

/* main tabs: summary | period | course */
const selectedTab = ref('summary')         // Summary is default

/* inside Course tab toggle */
const courseView = ref('course')          // 'course' | 'department'

/* loading flags */
const loadingSummary = ref(false)
const loadingPeriod = ref(false)
const loadingCourse = ref(false)
const uiLoading = ref(false)

/* sidebar */
const showSidebar = ref(true)

/* shared filters */
const sy = ref('')
const sem = ref('')
const dateRange = ref([new Date('2024-01-01'), new Date()])  // [from,to]

/* period-specific */
const crs = ref('')
const mjr = ref('')
const granularity = ref('monthly')

/* admin name */
const fullName = 'Admin'

/* classify course → department */
function getDept(course) {
    if (/NC\s*II/i.test(course)) return 'TESDA'
    if (/SHS/i.test(course)) return 'Senior High'
    if (/JHS/i.test(course)) return 'Junior High'
    if (/ES/i.test(course)) return 'Elementary'
    if (/PS/i.test(course)) return 'Pre-School'
    return 'College'
}

/* ── API helpers ─────────────────────────────────── */
const fetchPeriodChart = async () => {
    loadingPeriod.value = true
    try {
        const payload = {
            sy: sy.value || null, sem: sem.value || null,
            crs: crs.value || null, mjr: mjr.value || null,
            from: dayjs(dateRange.value[0]).format('YYYY-MM-DD'),
            to: dayjs(dateRange.value[1]).format('YYYY-MM-DD'),
            granularity: granularity.value
        }
        chartStore.setPeriodQueryParams(payload)
        chartStore.setPeriodChartData(await viewChart(payload))
    } finally { loadingPeriod.value = false }
}

const fetchCourseChart = async () => {
    loadingCourse.value = true
    try {
        const payload = {
            sy: sy.value || null,
            sem: sem.value || null,
            from: dayjs(dateRange.value[0]).format('YYYY-MM-DD'),
            to: dayjs(dateRange.value[1]).format('YYYY-MM-DD')
        }
        chartStore.setCourseQueryParams(payload)
        chartStore.setCourseChartData(await viewCourseChart(payload))
    } finally { loadingCourse.value = false }
}

/* getTotal helper used by summary */
async function getTotal(fromISO, toISO, gran = 'daily') {
    const rows = await viewChart({ from: fromISO, to: toISO, granularity: gran })
    return rows.reduce((s, r) => s + (r.totalCash || 0), 0)
}

const summaryData = ref({
    daily: null,
    monthly: null,
    yearly: null
})

const fetchSummary = async () => {
    loadingSummary.value = true
    try {
        const today = dayjs().format('YYYY-MM-DD')
        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

        const monthStart = dayjs().startOf('month').format('YYYY-MM-DD')
        const prevMEndDay = dayjs().startOf('month').subtract(1, 'day')
        const prevMStart = prevMEndDay.startOf('month').format('YYYY-MM-DD')
        const prevMEnd = prevMEndDay.format('YYYY-MM-DD')

        const yearStart = dayjs().startOf('year').format('YYYY-MM-DD')
        const prevYear = dayjs().subtract(1, 'year')
        const prevYStart = prevYear.startOf('year').format('YYYY-MM-DD')
        const prevYEnd = prevYear.endOf('year').format('YYYY-MM-DD')

        const [
            todayTot, yestTot,
            thisMTot, prevMTot,
            thisYTot, prevYTot
        ] = await Promise.all([
            getTotal(today, today, 'daily'),
            getTotal(yesterday, yesterday, 'daily'),
            getTotal(monthStart, today, 'monthly'),
            getTotal(prevMStart, prevMEnd, 'monthly'),
            getTotal(yearStart, today, 'yearly'),
            getTotal(prevYStart, prevYEnd, 'yearly')
        ])

        const pct = (now, prev) => prev === 0 ? 0 : (((now - prev) / prev) * 100).toFixed(1)

        summaryData.value = {
            daily: { now: todayTot, prev: yestTot, pct: pct(todayTot, yestTot) },
            monthly: { now: thisMTot, prev: prevMTot, pct: pct(thisMTot, prevMTot) },
            yearly: { now: thisYTot, prev: prevYTot, pct: pct(thisYTot, prevYTot) }
        }
    } catch (e) { console.error(e) }
    finally { loadingSummary.value = false }
}

/* auto-fetch on tab changes */
watch(selectedTab, t => {
    if (t === 'summary' && !summaryData.value.daily) fetchSummary()
    if (t === 'period' && !chartStore.periodChartData.length) fetchPeriodChart()
    if (t === 'course' && !chartStore.courseChartData.length) fetchCourseChart()
})

/* initial fetch (summary first) */
onMounted(fetchSummary)

/* ── computed datasets ───────────────────────────── */
/* period line chart */
const periodChartData = computed(() => {
    const rows = chartStore.periodChartData
    return {
        labels: rows.map(r => r.period),
        datasets: [
            { label: 'Tuition', data: rows.map(r => r.tuitionCash), borderColor: 'red', borderWidth: 2, tension: .4, fill: false },
            { label: 'Other', data: rows.map(r => r.otherCash), borderColor: 'blue', borderWidth: 2, tension: .4, fill: false },
            { label: 'Total', data: rows.map(r => r.totalCash), borderColor: 'green', borderDash: [5, 5], borderWidth: 2, tension: .4, fill: false }
        ]
    }
})

/* course & department datasets */
const courseLabels = computed(() => {
    const rows = chartStore.courseChartData
    if (courseView.value === 'course') return rows.map(r => r.mjr ? `${r.course} – ${r.mjr}` : r.course)
    const buckets = {}; rows.forEach(r => { const d = getDept(r.course); buckets[d] = (buckets[d] || 0) + r.totalCash })
    return Object.keys(buckets)
})
const courseValues = computed(() => {
    const rows = chartStore.courseChartData
    if (courseView.value === 'course') return rows.map(r => r.totalCash)
    const b = {}; rows.forEach(r => { const d = getDept(r.course); b[d] = (b[d] || 0) + r.totalCash })
    return Object.values(b)
})
const barChartData = computed(() => ({
    labels: courseLabels.value,
    datasets: [{
        label: 'Total Cash',
        data: courseValues.value,
        backgroundColor: courseLabels.value.map((_, i) => `hsl(${(i * 50) % 360} 70% 50%)`)
    }]
}))
const doughnutChartData = computed(() => ({
    labels: courseLabels.value,
    datasets: [{
        data: courseValues.value,
        backgroundColor: courseLabels.value.map((_, i) => `hsl(${(i * 50) % 360} 70% 50%)`)
    }]
}))

const pctColor = p => p >= 0 ? 'text-green-600' : 'text-red-600'

const money = (v) =>
    v === undefined || v === null
        ? '₱0.00'
        : `₱${Number(v).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;


/* misc ui */
const toggleSidebar = () => (showSidebar.value = !showSidebar.value)
const logout = () => { uiLoading.value = true; window.location = '/' }
</script>

<template>
    <div id="wrapper" class="min-h-screen flex flex-col">
        <!-- FULL-PAGE LOGOUT SPINNER -->
        <div v-if="uiLoading" class="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
            <div class="border-8 border-gray-200 border-t-accent rounded-full w-24 h-24 animate-spin"></div>
        </div>

        <!-- HEADER -->
        <header class="sticky top-0 z-10">
            <div class="flex justify-between items-center bg-primary p-4">
                <div class="flex items-center space-x-4">
                    <button class="md:hidden text-white text-2xl" @click="toggleSidebar"><i
                            class="mdi mdi-menu"></i></button>
                    <a class="flex items-center">
                        <img src="/images/logo-banner.png" class="hidden md:block" width="158" height="45" />
                        <img src="/images/logo-sm.png" class="md:hidden" width="45" height="45" />
                    </a>
                </div>
                <nav class="flex items-center space-x-4">
                    <span class="text-yellow-300 font-semibold">{{ fullName }}</span>
                    <a href="#" @click.prevent="logout" class="flex items-center text-yellow-300 hover:underline">
                        <i class="mdi mdi-logout mr-1 text-2xl"></i><span class="hidden md:inline">Log&nbsp;Out</span>
                    </a>
                </nav>
            </div>
        </header>

        <div class="flex flex-1">
            <!-- SIDEBAR -->
            <aside class="w-64 bg-secondary text-white p-4 hidden md:block">
                <nav>
                    <h2 class="text-lg font-bold mb-4 text-yellow-300">Reports</h2>
                    <ul>
                        <li class="mb-2">
                            <a href="#" @click.prevent="selectedTab = 'summary'" :class="['flex items-center p-2 rounded hover:bg-tertiary',
                                selectedTab === 'summary' && 'bg-tertiary']">
                                <i
                                    class="mdi mdi-view-dashboard mr-2 text-yellow-300"></i><span>Quick&nbsp;Summary</span>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a href="#" @click.prevent="selectedTab = 'period'" :class="['flex items-center p-2 rounded hover:bg-tertiary',
                                selectedTab === 'period' && 'bg-tertiary']">
                                <i class="mdi mdi-chart-line mr-2 text-yellow-300"></i><span>Period&nbsp;Chart</span>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a href="#" @click.prevent="selectedTab = 'course'" :class="['flex items-center p-2 rounded hover:bg-tertiary',
                                selectedTab === 'course' && 'bg-tertiary']">
                                <i class="mdi mdi-chart-bar mr-2 text-yellow-300"></i><span>Course&nbsp;Chart</span>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a href="#" @click.prevent="logout" class="flex items-center p-2 rounded hover:bg-tertiary">
                                <i class="mdi mdi-logout mr-2 text-yellow-300"></i><span>Log&nbsp;Out</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- MAIN -->
            <main class="flex-1 p-6 bg-white">

                <!-- MOBILE TAB BUTTONS -->
                <div class="md:hidden mb-4 flex space-x-2">
                    <button v-for="tab in ['summary', 'period', 'course']" :key="tab" @click="selectedTab = tab" :class="['px-3 py-1 rounded',
                        selectedTab === tab ? 'bg-primary text-white' : 'bg-gray-200']">
                        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                    </button>
                </div>

                <!-- FILTERS (hidden on summary) -->
                <template v-if="selectedTab !== 'summary'">
                    <!-- same filters block as earlier (unchanged) -->
                    <!-- ... filters markup identical; omitted for brevity ... -->
                    <!-- BEGIN FILTERS -->
                    <div class="p-4 bg-gray-50 border border-gray-200 rounded shadow-sm mb-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">School&nbsp;Year</label>
                                <input v-model="sy" type="text" placeholder="2024-2025"
                                    class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Semester</label>
                                <select v-model="sem" class="mt-1 block w-full rounded border-gray-300 shadow-sm">
                                    <option value="">All</option>
                                    <option value="1st">1st</option>
                                    <option value="2nd">2nd</option>
                                    <option value="Summer">Summer</option>
                                </select>
                            </div>
                            <!-- period-only inputs -->
                            <template v-if="selectedTab === 'period'">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Course</label>
                                    <input v-model="crs" type="text"
                                        class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Major</label>
                                    <input v-model="mjr" type="text"
                                        class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Granularity</label>
                                    <select v-model="granularity"
                                        class="mt-1 block w-full rounded border-gray-300 shadow-sm">
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </template>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Date&nbsp;Range</label>
                                <Datepicker v-model="dateRange" range multi-calendars format="yyyy-MM-dd"
                                    input-class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
                            </div>
                        </div>

                        <div class="mt-4 flex justify-end">
                            <button v-if="selectedTab === 'period'" @click="fetchPeriodChart"
                                class="inline-flex items-center px-4 py-2 bg-primary text-white rounded shadow">
                                Apply
                            </button>
                            <button v-if="selectedTab === 'course'" @click="fetchCourseChart"
                                class="inline-flex items-center px-4 py-2 bg-primary text-white rounded shadow">
                                Apply
                            </button>
                        </div>
                    </div>
                    <!-- END FILTERS -->
                </template>

                <!-- COURSE VIEW TOGGLE -->
                <div v-show="selectedTab === 'course'" class="mb-4 flex space-x-2">
                    <button @click="courseView = 'course'" :class="['px-3 py-1 rounded',
                        courseView === 'course' ? 'bg-secondary text-white' : 'bg-gray-200']">
                        By Course
                    </button>
                    <button @click="courseView = 'department'" :class="['px-3 py-1 rounded',
                        courseView === 'department' ? 'bg-secondary text-white' : 'bg-gray-200']">
                        By Department
                    </button>
                </div>

                <!-- SUMMARY CARD GRID -->
                <div v-show="selectedTab === 'summary'">
                    <div v-if="loadingSummary" class="h-96 flex items-center justify-center">
                        <div class="border-4 border-gray-200 border-t-accent rounded-full w-16 h-16 animate-spin"></div>
                    </div>
                    <template v-else>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <!-- DAILY -->
                            <div class="p-6 rounded shadow bg-blue-50 border-t-4 border-blue-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-today text-3xl text-blue-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-blue-800">Daily</h3>
                                </div>
                                <p class="text-sm text-gray-600">
                                    Today:
                                    <span class="font-bold">{{ money(summaryData.daily?.now) }}</span>
                                </p>
                                <p class="text-sm text-gray-600">
                                    Yesterday: {{ money(summaryData.daily?.prev) }}
                                </p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.daily?.pct)]">
                                    {{ summaryData.daily?.pct }} %
                                </p>
                            </div>

                            <!-- MONTHLY -->
                            <div class="p-6 rounded shadow bg-green-50 border-t-4 border-green-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-month text-3xl text-green-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-green-800">Monthly</h3>
                                </div>
                                <p class="text-sm text-gray-600">
                                    This&nbsp;Month:
                                    <span class="font-bold">{{ money(summaryData.monthly?.now) }}</span>
                                </p>
                                <p class="text-sm text-gray-600">
                                    Prev&nbsp;Month: {{ money(summaryData.monthly?.prev) }}
                                </p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.monthly?.pct)]">
                                    {{ summaryData.monthly?.pct }} %
                                </p>
                            </div>

                            <!-- YEARLY -->
                            <div class="p-6 rounded shadow bg-yellow-50 border-t-4 border-yellow-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-range text-3xl text-yellow-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-yellow-800">Yearly</h3>
                                </div>
                                <p class="text-sm text-gray-600">
                                    This&nbsp;Year:
                                    <span class="font-bold">{{ money(summaryData.yearly?.now) }}</span>
                                </p>
                                <p class="text-sm text-gray-600">
                                    Prev&nbsp;Year: {{ money(summaryData.yearly?.prev) }}
                                </p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.yearly?.pct)]">
                                    {{ summaryData.yearly?.pct }} %
                                </p>
                            </div>
                        </div>

                    </template>
                </div>

                <!-- PERIOD CHART -->
                <div v-show="selectedTab === 'period'" class="relative p-4 bg-white border rounded shadow">
                    <div v-if="loadingPeriod"
                        class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <div class="border-4 border-gray-200 border-t-accent rounded-full w-16 h-16 animate-spin"></div>
                    </div>
                    <LineChart :data="periodChartData" :loading="false" class="h-96" />
                </div>

                <!-- COURSE CHART -->
                <div v-show="selectedTab === 'course'" class="relative p-4 bg-white border rounded shadow">
                    <div v-if="loadingCourse"
                        class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <div class="border-4 border-gray-200 border-t-accent rounded-full w-16 h-16 animate-spin"></div>
                    </div>

                    <template v-if="courseView === 'course'">
                        <BarChart :data="barChartData" :loading="false" class="h-96" />
                    </template>

                    <template v-else>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BarChart :data="barChartData" :loading="false" class="h-96" />
                            <DoughnutChart :data="doughnutChartData" :loading="false" class="h-96" />
                        </div>
                    </template>
                </div>

            </main>
        </div>

        <!-- FOOTER -->
        <footer class="bg-primary p-4 text-center text-white">
            <p class="text-sm">
                2024 © Admin Dashboard by
                <a href="https://area51.ph" target="_blank" class="text-yellow-300 hover:underline">Area51 PH</a>
            </p>
        </footer>

        <ToasterComponent ref="toast" />
    </div>
</template>

<style scoped>
/* all colours handled inline / via Tailwind */
</style>
