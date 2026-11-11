<script setup lang="ts">
/** 日・月・年の 3 つの表。ViewTrigger（「2026年11月」）で上の段に切り替わる。@kohaku/react の DatePicker.Calendar と同じ */
import { DatePicker } from "@ark-ui/vue"
</script>

<template>
  <DatePicker.View view="day">
    <DatePicker.Context v-slot="api">
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger />
        <DatePicker.ViewTrigger><DatePicker.RangeText /></DatePicker.ViewTrigger>
        <DatePicker.NextTrigger />
      </DatePicker.ViewControl>
      <DatePicker.Table>
        <DatePicker.TableHead>
          <DatePicker.TableRow>
            <DatePicker.TableHeader v-for="(d, i) in api.weekDays" :key="i">{{ d.narrow }}</DatePicker.TableHeader>
          </DatePicker.TableRow>
        </DatePicker.TableHead>
        <DatePicker.TableBody>
          <DatePicker.TableRow v-for="(week, i) in api.weeks" :key="i">
            <DatePicker.TableCell v-for="(day, j) in week" :key="j" :value="day">
              <DatePicker.TableCellTrigger>{{ day.day }}</DatePicker.TableCellTrigger>
            </DatePicker.TableCell>
          </DatePicker.TableRow>
        </DatePicker.TableBody>
      </DatePicker.Table>
    </DatePicker.Context>
  </DatePicker.View>
  <DatePicker.View view="month">
    <DatePicker.Context v-slot="api">
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger />
        <DatePicker.ViewTrigger><DatePicker.RangeText /></DatePicker.ViewTrigger>
        <DatePicker.NextTrigger />
      </DatePicker.ViewControl>
      <DatePicker.Table>
        <DatePicker.TableBody>
          <DatePicker.TableRow v-for="(months, i) in api.getMonthsGrid({ columns: 4, format: 'short' })" :key="i">
            <DatePicker.TableCell v-for="(m, j) in months" :key="j" :value="m.value">
              <DatePicker.TableCellTrigger>{{ m.label }}</DatePicker.TableCellTrigger>
            </DatePicker.TableCell>
          </DatePicker.TableRow>
        </DatePicker.TableBody>
      </DatePicker.Table>
    </DatePicker.Context>
  </DatePicker.View>
  <DatePicker.View view="year">
    <DatePicker.Context v-slot="api">
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger />
        <DatePicker.ViewTrigger><DatePicker.RangeText /></DatePicker.ViewTrigger>
        <DatePicker.NextTrigger />
      </DatePicker.ViewControl>
      <DatePicker.Table>
        <DatePicker.TableBody>
          <DatePicker.TableRow v-for="(years, i) in api.getYearsGrid({ columns: 4 })" :key="i">
            <DatePicker.TableCell v-for="(y, j) in years" :key="j" :value="y.value">
              <DatePicker.TableCellTrigger>{{ y.label }}</DatePicker.TableCellTrigger>
            </DatePicker.TableCell>
          </DatePicker.TableRow>
        </DatePicker.TableBody>
      </DatePicker.Table>
    </DatePicker.Context>
  </DatePicker.View>
</template>
