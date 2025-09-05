"use client"

import { useState } from "react";

export enum PeriodEnum {
  UPCOMING = "UPCOMING",
  PAST = "PAST",
  CANCELLED = "CANCELLED",
}

const useMeetingFilter = () => {
  // default olarak UPCOMING
  const [period, setPeriod] = useState<PeriodEnum>(PeriodEnum.UPCOMING);

  // period değerini güvenli bir şekilde set etmek için yardımcı fonksiyon
  const updatePeriod = (value: string) => {
    if (Object.values(PeriodEnum).includes(value as PeriodEnum)) {
      setPeriod(value as PeriodEnum);
    } else {
      setPeriod(PeriodEnum.UPCOMING);
    }
  };

  return { period, setPeriod: updatePeriod, PeriodEnum };
};

export default useMeetingFilter;
