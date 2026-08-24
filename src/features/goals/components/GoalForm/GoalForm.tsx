import { useState } from "react";
import Card from "../../../../components/Card/Card";
import Button from "../../../../components/Button/Button";
import { useGoalStore } from "../../../../store/goalStore";
import { useFinanceStore } from "../../../../store/financeStore";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import Divider from "../../../../components/Divider/Divider";

export default function GoalForm() {
  const {
    mainGoal,
    targetMoney,
    deadline,
    setMainGoal,
    setTargetMoney,
    setDeadline,
  } = useGoalStore();

  const {
    bankBalance,
    monthlyIncome,
    setBankBalance,
    setMonthlyIncome,
  } = useFinanceStore();

  const [goal, setGoal] = useState(mainGoal);
  const [money, setMoney] = useState(targetMoney);
  const [date, setDate] = useState(deadline);
  const [bank, setBank] = useState(bankBalance);
  const [income, setIncome] = useState(monthlyIncome);

  function handleSave() {
    setMainGoal(goal);
    setTargetMoney(Number(money));
    setDeadline(date);

    setBankBalance(Number(bank));
    setMonthlyIncome(Number(income));

    alert("✅ Maglumatlar üstünlikli saklandy.");
  }

  return (
    <Card>
      <h2 className="text-3xl font-bold mb-8">
        🎯 Esasy Maglumatlar
      </h2>

      <div className="space-y-6">

        <div>
  <label className="mb-2 block text-sm font-semibold text-slate-200">
    Esasy Maksat
  </label>

  <textarea
    className="
      mt-2
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      px-5
      py-4
      text-white
      placeholder:text-slate-500
      outline-none
      transition-all
      focus:border-indigo-500
      focus:ring-4
      focus:ring-indigo-500/20
    "
    value={goal}
    onChange={(e) => setGoal(e.target.value)}
  />
</div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
  Maksat Pul
</label>

          <input
            type="number"
            className="mt-2 w-full rounded-xl bg-slate-800 p-4"
            value={money}
            onChange={(e) => setMoney(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
  Soňky Wagt
</label>

          <input
            type="date"
            className="mt-2 w-full rounded-xl bg-slate-800 p-4"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
  Bank Balansy
</label>

          <input
            type="number"
            className="mt-2 w-full rounded-xl bg-slate-800 p-4"
            value={bank}
            onChange={(e) => setBank(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
  Aýlyk Girdeji
</label>

          <input
            type="number"
            className="mt-2 w-full rounded-xl bg-slate-800 p-4"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </div>

        <Button onClick={handleSave}>
          Ýatda Sakla
        </Button>
         <SectionTitle>
        Esasy Maksat
    </SectionTitle>

    {/* Maksat Inputlary */}

    <Divider />

    <SectionTitle>
        Maliýe
    </SectionTitle>

    {/* Maliýe Inputlary */}

    <Divider />

    <SectionTitle>
        Goşmaça Maglumat
    </SectionTitle>

    {/* Işgär sany we ş.m */}

    <Button>
        Ýatda Sakla
    </Button>


      </div>
    </Card>
  );
}