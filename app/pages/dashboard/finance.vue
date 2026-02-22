<script setup lang="ts">
import type { Transaction } from '~/types/dashboard'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

const dashboard = useDashboard()
const colorMode = useColorMode()
const { t } = useI18n()

const loading = ref(true)

// Mock transactions data (would come from API in production)
const transactions = ref<Transaction[]>([
  {
    id: 1,
    type: 'payment',
    amount: -150.00,
    currency: 'USD',
    status: 'completed',
    description: 'Website redesign service',
    counterparty: { name: 'Alex Designer', role: 'provider', avatar: null },
    service_title: 'Website Redesign',
    created_at: '2026-02-20T14:30:00Z'
  },
  {
    id: 2,
    type: 'deposit',
    amount: 500.00,
    currency: 'USD',
    status: 'completed',
    description: 'Wallet top-up via credit card',
    counterparty: { name: 'You', role: 'client', avatar: null },
    service_title: null,
    created_at: '2026-02-19T10:15:00Z'
  },
  {
    id: 3,
    type: 'payment',
    amount: -75.00,
    currency: 'USD',
    status: 'pending',
    description: 'Logo design consultation',
    counterparty: { name: 'Maria Studio', role: 'provider', avatar: null },
    service_title: 'Logo Design',
    created_at: '2026-02-18T09:00:00Z'
  },
  {
    id: 4,
    type: 'refund',
    amount: 45.00,
    currency: 'USD',
    status: 'completed',
    description: 'Service cancelled by provider',
    counterparty: { name: 'John Dev', role: 'provider', avatar: null },
    service_title: 'API Integration',
    created_at: '2026-02-17T16:45:00Z'
  },
  {
    id: 5,
    type: 'payment',
    amount: -200.00,
    currency: 'USD',
    status: 'completed',
    description: 'SEO optimization package',
    counterparty: { name: 'SEO Experts', role: 'provider', avatar: null },
    service_title: 'SEO Package',
    created_at: '2026-02-15T11:20:00Z'
  },
  {
    id: 6,
    type: 'deposit',
    amount: 1000.00,
    currency: 'USD',
    status: 'completed',
    description: 'Wallet top-up via bank transfer',
    counterparty: { name: 'You', role: 'client', avatar: null },
    service_title: null,
    created_at: '2026-02-14T08:00:00Z'
  },
  {
    id: 7,
    type: 'payment',
    amount: -320.00,
    currency: 'USD',
    status: 'completed',
    description: 'Mobile app development milestone',
    counterparty: { name: 'AppCraft Studio', role: 'provider', avatar: null },
    service_title: 'Mobile App Dev',
    created_at: '2026-02-12T13:30:00Z'
  },
  {
    id: 8,
    type: 'withdrawal',
    amount: -250.00,
    currency: 'USD',
    status: 'completed',
    description: 'Earnings withdrawal to bank account',
    counterparty: { name: 'You', role: 'provider', avatar: null },
    service_title: null,
    created_at: '2026-02-10T15:00:00Z'
  }
])

// Financial summary computed from dashboard data + transactions
const walletBalance = computed(() => {
  if (dashboard.data.value) {
    return dashboard.data.value.finance.total_earned - (dashboard.data.value.finance.pending_payout || 0)
  }
  return 1550.00
})

const monthlyIncome = computed(() => {
  if (dashboard.data.value) return dashboard.data.value.finance.this_month
  return 1500.00
})

const monthlyExpenses = computed(() => {
  return transactions.value
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
})

const pendingAmount = computed(() => {
  if (dashboard.data.value) return dashboard.data.value.finance.pending_payout
  return 75.00
})

onMounted(async () => {
  loading.value = true
  try {
    await dashboard.fetchData()
  } catch {
    // Use mock data on failure
  } finally {
    loading.value = false
  }
})

const isDark = computed(() => colorMode.value === 'dark')

// Revenue & Expenses Line Chart
const revenueExpensesChartOptions = computed<EChartsOption>(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  let revenueData = [4200, 5100, 4800, 6200, 5900, 7100, 6800]
  const expensesData = [2800, 3200, 2900, 3800, 3500, 4200, 3900]

  if (dashboard.data.value?.charts?.monthly_revenue) {
    const chartData = dashboard.data.value.charts.monthly_revenue
    if (chartData.length > 0) {
      revenueData = chartData.map(m => m.total)
    }
  }

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark.value ? '#374151' : '#e5e7eb',
      textStyle: { color: isDark.value ? '#f3f4f6' : '#1f2937' },
      formatter: (params: any) => {
        let result = `<strong>${params[0].name}</strong><br/>`
        params.forEach((p: any) => {
          result += `${p.marker} ${p.seriesName}: <strong>$${p.value.toLocaleString()}</strong><br/>`
        })
        return result
      }
    },
    legend: {
      data: [t('finance.revenue'), t('finance.expensesLabel')],
      bottom: '0%',
      textStyle: { color: isDark.value ? '#9ca3af' : '#6b7280' }
    },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: { lineStyle: { color: isDark.value ? '#374151' : '#e5e7eb' } },
      axisLabel: { color: isDark.value ? '#9ca3af' : '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: isDark.value ? '#374151' : '#f3f4f6' } },
      axisLabel: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`
      }
    },
    series: [
      {
        name: t('finance.revenue'),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: revenueData,
        lineStyle: {
          width: 3,
          color: '#8b5cf6'
        },
        itemStyle: { color: '#8b5cf6', borderWidth: 2, borderColor: isDark.value ? '#1f2937' : '#fff' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0.05)' }
            ]
          }
        }
      },
      {
        name: t('finance.expensesLabel'),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: expensesData,
        lineStyle: {
          width: 3,
          color: '#f59e0b'
        },
        itemStyle: { color: '#f59e0b', borderWidth: 2, borderColor: isDark.value ? '#1f2937' : '#fff' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.2)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.02)' }
            ]
          }
        }
      }
    ]
  }
})

// Spending Breakdown Donut Chart
const spendingChartOptions = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark.value ? '#374151' : '#e5e7eb',
    textStyle: { color: isDark.value ? '#f3f4f6' : '#1f2937' },
    formatter: (params: any) => `${params.name}<br/><strong>$${params.value.toLocaleString()}</strong> (${params.percent}%)`
  },
  legend: {
    bottom: '5%',
    left: 'center',
    textStyle: { color: isDark.value ? '#9ca3af' : '#6b7280' }
  },
  series: [
    {
      name: 'Spending',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '42%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: isDark.value ? '#1f2937' : '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: isDark.value ? '#f3f4f6' : '#1f2937'
        }
      },
      labelLine: { show: false },
      data: [
        { value: 450, name: 'Development', itemStyle: { color: '#8b5cf6' } },
        { value: 300, name: 'Design', itemStyle: { color: '#fbbf24' } },
        { value: 200, name: 'Marketing', itemStyle: { color: '#22c55e' } },
        { value: 150, name: 'Consulting', itemStyle: { color: '#3b82f6' } },
        { value: 100, name: 'Other', itemStyle: { color: '#ef4444' } }
      ]
    }
  ]
}))

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const transactionIcon = (type: string) => {
  switch (type) {
    case 'payment': return 'text-red-500'
    case 'deposit': return 'text-green-500'
    case 'withdrawal': return 'text-orange-500'
    case 'refund': return 'text-blue-500'
    default: return 'text-base-content/60'
  }
}

const statusBadge = (status: string) => {
  switch (status) {
    case 'completed': return 'badge-success'
    case 'pending': return 'badge-warning'
    case 'failed': return 'badge-error'
    default: return 'badge-ghost'
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">{{ $t('finance.title') }}</h1>
          <p class="text-base-content/60">{{ $t('finance.subtitle') }}</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-if="loading">
          <SkeletonsStatCardSkeleton v-for="i in 4" :key="i" />
        </template>
        <template v-else>
          <!-- Balance Card -->
          <div class="card bg-gradient-to-br from-purple-600 to-yellow-500 shadow-xl hover:shadow-2xl transition-all duration-300 text-white">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                  </svg>
                </div>
              </div>
              <div class="text-white/80 text-sm">{{ $t('finance.balance') }}</div>
              <div class="text-4xl font-bold">{{ formatCurrency(walletBalance) }}</div>
              <div class="text-xs text-white/70 mt-1">{{ $t('finance.thisMonth') }}</div>
            </div>
          </div>

          <!-- Income Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
                <div class="badge badge-success gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {{ dashboard.earningsGrowth.value || 12.5 }}%
                </div>
              </div>
              <div class="stat-title text-base-content/60 text-sm">{{ $t('finance.income') }}</div>
              <div class="stat-value text-3xl font-bold text-green-600">{{ formatCurrency(monthlyIncome) }}</div>
              <div class="text-xs text-base-content/50 mt-1">{{ $t('finance.vsLastMonth') }}</div>
            </div>
          </div>

          <!-- Expenses Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                <div class="badge badge-error gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  8.2%
                </div>
              </div>
              <div class="stat-title text-base-content/60 text-sm">{{ $t('finance.expenses') }}</div>
              <div class="stat-value text-3xl font-bold text-red-600">{{ formatCurrency(monthlyExpenses) }}</div>
              <div class="text-xs text-base-content/50 mt-1">{{ $t('finance.vsLastMonth') }}</div>
            </div>
          </div>

          <!-- Pending Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="stat-title text-base-content/60 text-sm">{{ $t('finance.pending') }}</div>
              <div class="stat-value text-3xl font-bold text-yellow-600">{{ formatCurrency(pendingAmount) }}</div>
              <div class="text-xs text-base-content/50 mt-1">{{ $t('finance.thisMonth') }}</div>
            </div>
          </div>
        </template>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <template v-if="loading">
          <SkeletonsChartSkeleton />
          <SkeletonsChartSkeleton />
        </template>
        <template v-else>
          <!-- Revenue & Expenses Chart -->
          <div class="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="card-title text-xl">{{ $t('finance.revenueExpenses') }}</h2>
                  <p class="text-sm text-base-content/60">{{ $t('finance.monthlyOverview') }}</p>
                </div>
              </div>
              <ClientOnly>
                <VChart
                  :option="revenueExpensesChartOptions"
                  class="h-72 w-full"
                  autoresize
                />
              </ClientOnly>
            </div>
          </div>

          <!-- Spending Breakdown -->
          <div class="card bg-base-100 shadow-xl border border-base-300">
            <div class="card-body">
              <div>
                <h2 class="card-title text-xl">{{ $t('finance.spendingBreakdown') }}</h2>
                <p class="text-sm text-base-content/60">{{ $t('finance.byCategory') }}</p>
              </div>
              <ClientOnly>
                <VChart
                  :option="spendingChartOptions"
                  class="h-72 w-full"
                  autoresize
                />
              </ClientOnly>
            </div>
          </div>
        </template>
      </div>

      <!-- Transactions Section -->
      <div class="card bg-base-100 shadow-xl border border-base-300">
        <div class="card-body">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="card-title text-xl">{{ $t('finance.recentTransactions') }}</h2>
              <p class="text-sm text-base-content/60">{{ $t('finance.allTransactions') }}</p>
            </div>
          </div>

          <template v-if="loading">
            <div class="space-y-4">
              <div v-for="i in 5" :key="i" class="flex items-center gap-4 p-4 bg-base-200 rounded-xl animate-pulse">
                <div class="w-12 h-12 rounded-full bg-base-300"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-base-300 rounded w-1/3"></div>
                  <div class="h-3 bg-base-300 rounded w-1/4"></div>
                </div>
                <div class="h-6 bg-base-300 rounded w-20"></div>
              </div>
            </div>
          </template>

          <template v-else>
            <div v-if="transactions.length === 0" class="flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              <p class="text-base-content/60 font-medium">{{ $t('finance.noTransactions') }}</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Counterparty</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th class="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-base-200 transition-colors">
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="{
                          'bg-red-100 dark:bg-red-900/30': tx.type === 'payment',
                          'bg-green-100 dark:bg-green-900/30': tx.type === 'deposit',
                          'bg-orange-100 dark:bg-orange-900/30': tx.type === 'withdrawal',
                          'bg-blue-100 dark:bg-blue-900/30': tx.type === 'refund'
                        }">
                          <!-- Payment icon -->
                          <svg v-if="tx.type === 'payment'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                          </svg>
                          <!-- Deposit icon -->
                          <svg v-else-if="tx.type === 'deposit'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                          <!-- Withdrawal icon -->
                          <svg v-else-if="tx.type === 'withdrawal'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" />
                          </svg>
                          <!-- Refund icon -->
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </div>
                        <div>
                          <p class="font-semibold text-sm">{{ $t(`finance.${tx.type}`) }}</p>
                          <p class="text-xs text-base-content/50">{{ tx.description }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="flex items-center gap-2">
                        <div class="avatar placeholder">
                          <div class="w-8 h-8 rounded-full bg-base-300 text-base-content/60">
                            <span class="text-xs">{{ tx.counterparty.name.charAt(0) }}</span>
                          </div>
                        </div>
                        <div>
                          <p class="text-sm font-medium">{{ tx.counterparty.name }}</p>
                          <p class="text-xs text-base-content/50 capitalize">{{ tx.counterparty.role }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span v-if="tx.service_title" class="text-sm">{{ tx.service_title }}</span>
                      <span v-else class="text-sm text-base-content/40">—</span>
                    </td>
                    <td>
                      <div class="text-sm">{{ formatDate(tx.created_at) }}</div>
                      <div class="text-xs text-base-content/50">{{ formatTime(tx.created_at) }}</div>
                    </td>
                    <td>
                      <div :class="['badge badge-sm', statusBadge(tx.status)]">
                        {{ $t(`finance.${tx.status === 'pending' ? 'pendingStatus' : tx.status}`) }}
                      </div>
                    </td>
                    <td class="text-right">
                      <span class="font-semibold" :class="tx.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ tx.amount >= 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
