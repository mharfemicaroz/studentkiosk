<script setup>
/* ───────── core ──────────────────────────────── */
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'

/* ───────── stores & services ─────────────────── */
import { useChartStore } from '@/stores/chartStore'
import {
    viewChart,
    viewCourseChart
} from '@/services/chartServices'

/* ───────── UI helpers ────────────────────────── */
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import LineChart from '@/components/Charts/LineChart.vue'
import BarChart from '@/components/Charts/BarChart.vue'
import DoughnutChart from '@/components/Charts/DoughnutChart.vue'
import ToasterComponent from '@/common/ToasterComponent.vue'

/* ───────── reactive state ────────────────────── */
const chartStore = useChartStore()
const selectedTab = ref('summary')            // summary | period | course
const courseView = ref('course')             // course | department
const showSidebar = ref(true)

/* loading flags */
const loadingSummary = ref(false)
const loadingPeriod = ref(false)
const loadingCourse = ref(false)
const uiLoading = ref(false)

/* shared filters */
const sy = ref('')
const sem = ref('')
const dateRange = ref([new Date('2024-01-01'), new Date()])   // [from,to]

/* period-specific filters */
const crs = ref('')
const mjr = ref('')
const granularity = ref('monthly')

/* ───────── course / major dropdown data ──────── */
const coursesList = ref([])       // [ { course:'BSIT', majors:['NA','SysDev'] }, … ]
const majorsForCourse = computed(() => {
    const found = coursesList.value.find(c => c.course === crs.value)
    return found ? found.majors : []
})

/* admin name */
const fullName = 'Admin'

/* ───────── helpers ───────────────────────────── */
function getDept(course) {
    if (/NC\s*II/i.test(course)) return 'TESDA'
    if (/SHS/i.test(course)) return 'Senior High'
    if (/JHS/i.test(course)) return 'Junior High'
    if (/ES/i.test(course)) return 'Elementary'
    if (/PS/i.test(course)) return 'Pre-School'
    return 'College'
}

/* peso-format */
const money = v =>
    v == null
        ? '₱0.00'
        : `₱${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const pctColor = p => p >= 0 ? 'text-green-600' : 'text-red-600'

/* ───────── API fetchers ───────────────────────── */
const fetchCourseList = async () => {
    /** grab wide-range course data just once for dropdowns */
    try {
        const rows = await viewCourseChart({
            from: '2000-01-01',
            to: dayjs().format('YYYY-MM-DD')
        })
        const bucket = {}
        rows.forEach(r => {
            if (!bucket[r.course]) bucket[r.course] = new Set()
            bucket[r.course].add(r.mjr)
        })
        coursesList.value = Object.entries(bucket).map(([course, majSet]) => ({
            course,
            majors: Array.from(majSet).filter(Boolean)
        }))
    } catch (e) { console.error('load course list', e) }
}

const fetchPeriodChart = async () => {
    loadingPeriod.value = true
    try {
        const payload = {
            sy: sy.value || null,
            sem: sem.value || null,
            crs: crs.value || null,
            mjr: mjr.value || null,
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

/* quick-summary */
const summaryData = ref({
    daily: null,
    weekly: null,
    quarterly: null,
    semi: null,
    monthly: null,
    yearly: null
})

async function getTotal(fromISO, toISO, gran = 'daily') {
    const rows = await viewChart({ from: fromISO, to: toISO, granularity: gran })
    return rows.reduce((s, r) => s + (r.totalCash || 0), 0)
}



const fetchSummary = async () => {
    loadingSummary.value = true
    try {
        const today = dayjs().format('YYYY-MM-DD')
        const yest = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        const mStart = dayjs().startOf('month').format('YYYY-MM-DD')
        const prevMEnd = dayjs().startOf('month').subtract(1, 'day')
        const prevMS = prevMEnd.startOf('month').format('YYYY-MM-DD')
        const prevME = prevMEnd.format('YYYY-MM-DD')
        const yStart = dayjs().startOf('year').format('YYYY-MM-DD')
        const prevY = dayjs().subtract(1, 'year')
        const prevYS = prevY.startOf('year').format('YYYY-MM-DD')
        const prevYE = prevY.endOf('year').format('YYYY-MM-DD')

        /* ---------- WEEK ------------ */
        const weekStart = dayjs().startOf('week')    // Monday
        const weekEnd = dayjs().endOf('week')
        const prevWEnd = weekStart.subtract(1, 'day')
        const prevWStart = prevWEnd.startOf('week')

        /* ---------- QUARTER --------- */
        const qStart = dayjs().startOf('quarter')
        const qEnd = dayjs().endOf('quarter')
        const prevQEnd = qStart.subtract(1, 'day')
        const prevQStart = prevQEnd.startOf('quarter')

        /* ------ SEMI-ANNUAL --------- */
        const semiStart = dayjs().month() < 6 ? dayjs().startOf('year')
            : dayjs().month(6).startOf('month') // Jul-01
        const semiEnd = dayjs().month() < 6 ? dayjs().month(5).endOf('month')    // Jun-30
            : dayjs().endOf('year')
        const prevSemiEnd = semiStart.subtract(1, 'day')
        const prevSemiStart = prevSemiEnd.month() < 6 ? prevSemiEnd.startOf('year')
            : prevSemiEnd.month(6).startOf('month')

        const [
            todayT, yestT,
            thisWTot, prevWTot,
            thisQTot, prevQTot,
            thisSTot, prevSTot,
            thisMT, prevMT,
            thisYT, prevYT
        ] = await Promise.all([
            getTotal(today, today, 'daily'),
            getTotal(yest, yest, 'daily'),
            getTotal(weekStart.format('YYYY-MM-DD'), weekEnd.format('YYYY-MM-DD'), 'weekly'),
            getTotal(prevWStart.format('YYYY-MM-DD'), prevWEnd.format('YYYY-MM-DD'), 'weekly'),
            getTotal(qStart.format('YYYY-MM-DD'), qEnd.format('YYYY-MM-DD'), 'monthly'),
            getTotal(prevQStart.format('YYYY-MM-DD'), prevQEnd.format('YYYY-MM-DD'), 'monthly'),
            getTotal(semiStart.format('YYYY-MM-DD'), semiEnd.format('YYYY-MM-DD'), 'monthly'),
            getTotal(prevSemiStart.format('YYYY-MM-DD'), prevSemiEnd.format('YYYY-MM-DD'), 'monthly'),
            getTotal(mStart, today, 'monthly'),
            getTotal(prevMS, prevME, 'monthly'),
            getTotal(yStart, today, 'yearly'),
            getTotal(prevYS, prevYE, 'yearly')
        ])

        const pct = (n, p) => p === 0 ? 0 : (((n - p) / p) * 100).toFixed(1)

        summaryData.value = {
            daily: { now: todayT, prev: yestT, pct: pct(todayT, yestT) },
            weekly: { now: thisWTot, prev: prevWTot, pct: pct(thisWTot, prevWTot) },
            quarterly: { now: thisQTot, prev: prevQTot, pct: pct(thisQTot, prevQTot) },
            semi: { now: thisSTot, prev: prevSTot, pct: pct(thisSTot, prevSTot) },
            monthly: { now: thisMT, prev: prevMT, pct: pct(thisMT, prevMT) },
            yearly: { now: thisYT, prev: prevYT, pct: pct(thisYT, prevYT) }
        }
    } catch (e) { console.error(e) }
    finally { loadingSummary.value = false }
}

/* ───────── auto-fetch / watchers ──────────────── */
onMounted(async () => {
    await fetchCourseList()      // dropdown data
    await fetchSummary()         // summary tab (default)
})

watch(selectedTab, tab => {
    if (tab === 'summary' && !summaryData.value.daily) fetchSummary()
    if (tab === 'period' && !chartStore.periodChartData.length) fetchPeriodChart()
    if (tab === 'course' && !chartStore.courseChartData.length) fetchCourseChart()
})

/* ───────── computed datasets ───────────────────── */
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

const courseLabels = computed(() => {
    const rows = chartStore.courseChartData
    if (courseView.value === 'course') return rows.map(r => r.mjr ? `${r.course} – ${r.mjr}` : r.course)
    const b = {}; rows.forEach(r => { const d = getDept(r.course); b[d] = (b[d] || 0) + r.totalCash })
    return Object.keys(b)
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

/* ───────── misc ui ─────────────────────────────── */
const toggleSidebar = () => (showSidebar.value = !showSidebar.value)
const logout = () => { uiLoading.value = true; window.location = '/' }
</script>

<template>
    <div id="wrapper" class="min-h-screen flex flex-col">

        <!-- LOGOUT SPINNER -->
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
                        <li v-for="tab in [
                            { id: 'summary', label: 'Quick Summary', icon: 'mdi-view-dashboard' },
                            { id: 'period', label: 'Period Chart', icon: 'mdi-chart-line' },
                            { id: 'course', label: 'Course Chart', icon: 'mdi-chart-bar' }]" :key="tab.id"
                            class="mb-2">
                            <a href="#" @click.prevent="selectedTab = tab.id" :class="['flex items-center p-2 rounded hover:bg-tertiary',
                                selectedTab === tab.id && 'bg-tertiary']">
                                <i :class="['mdi', tab.icon, 'mr-2', 'text-yellow-300']"></i>
                                <span v-text="tab.label"></span>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a href="#" @click.prevent="logout" class="flex items-center p-2 rounded hover:bg-tertiary">
                                <i class="mdi mdi-logout mr-2 text-yellow-300"></i><span>Log Out</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- MAIN -->
            <main class="flex-1 p-6 bg-white">

                <!-- MOBILE TABS -->
                <div class="md:hidden mb-4 flex space-x-2">
                    <button v-for="t in ['summary', 'period', 'course']" :key="t" @click="selectedTab = t" :class="['px-3 py-1 rounded',
                        selectedTab === t ? 'bg-primary text-white' : 'bg-gray-200']">
                        {{ t.charAt(0).toUpperCase() + t.slice(1) }}
                    </button>
                </div>

                <!-- FILTERS (hidden on summary) -->
                <template v-if="selectedTab !== 'summary'">
                    <div class="p-4 bg-gray-50 border border-gray-200 rounded shadow-sm mb-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">School Year</label>

                                <select v-model="sy" class="mt-1 block w-full rounded border-gray-300 shadow-sm">
                                    <option value="">All</option>
                                    <option value="2023-2024">2023-2024</option>
                                    <option value="2024-2025">2024-2025</option>
                                    <option value="2025-2026">2025-2026</option>
                                    <option value="2026-2027">2026-2027</option>
                                    <option value="2027-2028">2027-2028</option>
                                    <option value="2028-2029">2028-2029</option>
                                    <option value="2029-2030">2029-2030</option>
                                </select>
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

                            <!-- Course / Major dropdowns (period tab only) -->
                            <template v-if="selectedTab === 'period'">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Course</label>
                                    <select v-model="crs" class="mt-1 block w-full rounded border-gray-300 shadow-sm">
                                        <option value="">All Courses</option>
                                        <option v-for="c in coursesList" :key="c.course" :value="c.course">
                                            {{ c.course }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Major</label>
                                    <select v-model="mjr" class="mt-1 block w-full rounded border-gray-300 shadow-sm">
                                        <option value="">All Majors</option>
                                        <option v-for="m in majorsForCourse" :key="m" :value="m">
                                            {{ m }}
                                        </option>
                                    </select>
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
                                <label class="block text-sm font-medium text-gray-700">Date Range</label>
                                <Datepicker v-model="dateRange" range multi-calendars format="yyyy-MM-dd"
                                    input-class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
                            </div>
                        </div>

                        <!-- APPLY -->
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

                <!-- SUMMARY CARDS -->
                <div v-show="selectedTab === 'summary'">
                    <div v-if="loadingSummary" class="h-96 flex items-center justify-center">
                        <div class="border-4 border-gray-200 border-t-accent rounded-full w-16 h-16 animate-spin"></div>
                    </div>
                    <template v-else>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                            <!-- DAILY -->
                            <div class="p-6 rounded shadow bg-blue-50 border-t-4 border-blue-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-today text-3xl text-blue-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-blue-800">Daily</h3>
                                </div>
                                <p class="text-sm text-gray-600">Today: <span class="font-bold">{{
                                    money(summaryData.daily?.now) }}</span></p>
                                <p class="text-sm text-gray-600">Yesterday: {{ money(summaryData.daily?.prev) }}</p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.daily?.pct)]">
                                    {{ summaryData.daily?.pct }} %
                                </p>
                            </div>

                            <!-- WEEKLY -->
                            <div class="p-6 rounded shadow bg-purple-50 border-t-4 border-purple-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-week text-3xl text-purple-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-purple-800">Weekly</h3>
                                </div>
                                <p class="text-sm text-gray-600">
                                    This Week: <span class="font-bold">{{ money(summaryData.weekly?.now) }}</span>
                                </p>
                                <p class="text-sm text-gray-600">
                                    Prev Week: {{ money(summaryData.weekly?.prev) }}
                                </p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.weekly?.pct)]">
                                    {{ summaryData.weekly?.pct }} %
                                </p>
                            </div>

                            <!-- MONTHLY -->
                            <div class="p-6 rounded shadow bg-green-50 border-t-4 border-green-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-month text-3xl text-green-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-green-800">Monthly</h3>
                                </div>
                                <p class="text-sm text-gray-600">This&nbsp;Month: <span class="font-bold">{{
                                    money(summaryData.monthly?.now) }}</span></p>
                                <p class="text-sm text-gray-600">Prev&nbsp;Month: {{ money(summaryData.monthly?.prev) }}
                                </p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.monthly?.pct)]">
                                    {{ summaryData.monthly?.pct }} %
                                </p>
                            </div>

                            <!-- QUARTERLY -->
                            <div class="p-6 rounded shadow bg-indigo-50 border-t-4 border-indigo-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-quarter text-3xl text-indigo-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-indigo-800">Quarterly</h3>
                                </div>
                                <p class="text-sm text-gray-600">
                                    This Qtr: <span class="font-bold">{{ money(summaryData.quarterly?.now) }}</span>
                                </p>
                                <p class="text-sm text-gray-600">
                                    Prev Qtr: {{ money(summaryData.quarterly?.prev) }}
                                </p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.quarterly?.pct)]">
                                    {{ summaryData.quarterly?.pct }} %
                                </p>
                            </div>

                            <!-- SEMI-ANNUAL -->
                            <div class="p-6 rounded shadow bg-teal-50 border-t-4 border-teal-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-collapse-horizontal text-3xl text-teal-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-teal-800">Semi-Annual</h3>
                                </div>
                                <p class="text-sm text-gray-600">
                                    This Semi: <span class="font-bold">{{ money(summaryData.semi?.now) }}</span>
                                </p>
                                <p class="text-sm text-gray-600">
                                    Prev Semi: {{ money(summaryData.semi?.prev) }}
                                </p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.semi?.pct)]">
                                    {{ summaryData.semi?.pct }} %
                                </p>
                            </div>

                            <!-- YEARLY -->
                            <div class="p-6 rounded shadow bg-yellow-50 border-t-4 border-yellow-500">
                                <div class="flex items-center mb-2">
                                    <i class="mdi mdi-calendar-range text-3xl text-yellow-600 mr-2"></i>
                                    <h3 class="text-lg font-bold text-yellow-800">Yearly</h3>
                                </div>
                                <p class="text-sm text-gray-600">This&nbsp;Year: <span class="font-bold">{{
                                    money(summaryData.yearly?.now) }}</span></p>
                                <p class="text-sm text-gray-600">Prev&nbsp;Year: {{ money(summaryData.yearly?.prev) }}
                                </p>
                                <p :class="['text-sm font-bold', pctColor(+summaryData.yearly?.pct)]">
                                    {{ summaryData.yearly?.pct }} %
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
                <a href="https://www.facebook.com/mharfe.micaroz" target="_blank"
                    class="text-yellow-300 hover:underline">
                    Mharfe Micaroz
                </a>
            </p>
        </footer>

        <ToasterComponent ref="toast" />
    </div>
</template>

<style scoped>
/* all visual styles handled inline or by Tailwind */
</style>
