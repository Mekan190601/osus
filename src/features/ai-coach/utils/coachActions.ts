import type { CoachInsight } from "./coachInsights";

export type CoachAction = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
};

import type { GrowthStatus } from "../../analytics/utils/growthEngine";

export function generateCoachActions(
  insights: CoachInsight[],
  growthStatus?: GrowthStatus,
): CoachAction[] {
  const actions: CoachAction[] = [];
if (growthStatus === "behind") {
  actions.push({
    id: "growth-recovery",
    title: "Ösüş depginini dikelt",
    description:
      "Şu gün diňe iň möhüm bir işi tamamla we maliýe boýunça bir anyk ädim et.",
    priority: "high",
  });
}

if (growthStatus === "steady") {
  actions.push({
    id: "protect-progress",
    title: "Häzirki depgini güýçlendir",
    description:
      "Möhüm, ýöne gyssagly däl işleri öňünden meýilleşdirip, progress-i durnukly ýokarlandyr.",
    priority: "medium",
  });
}

if (growthStatus === "near-goal") {
  actions.push({
    id: "finish-goal",
    title: "Galany tamamla",
    description:
      "Täze işleri azalt we maksady tamamlamak üçin galan esasy işleri ileri tut.",
    priority: "high",
  });
}

if (growthStatus === "completed") {
  actions.push({
    id: "create-next-goal",
    title: "Täze maksat kesgitle",
    description:
      "Häzirki maksat tamamlandy. Indiki strategik maksady kesgitle we täze execution siklini başlat.",
    priority: "medium",
  });
}
  const insightIds = new Set(
    insights.map((insight) => insight.id),
  );

  if (insightIds.has("missing-goal")) {
    actions.push({
      id: "define-main-goal",
      title: "Esasy maksady kesgitle",
      description:
        "Maksatlar bölümine geçip esasy strategik maksadyňy, maksat puluny we deadline-y giriz.",
      priority: "high",
    });
  }

  if (insightIds.has("negative-cash-flow")) {
    actions.push({
      id: "reduce-expenses",
      title: "Çykdajylary gözden geçir",
      description:
        "Aýlyk çykdajylaryň içinden azaltmak mümkin bolan iň uly 3 çykdajyny tap.",
      priority: "high",
    });

    actions.push({
      id: "increase-income",
      title: "Arassa girdejini ýokarlandyr",
      description:
        "Maksada ýetmek üçin girdejini artdyrmagyň ýa-da goşmaça girdeji çeşmesiniň bir ýoluny kesgitle.",
      priority: "high",
    });
  }

  if (insightIds.has("too-many-urgent")) {
    actions.push({
      id: "reduce-urgent-tasks",
      title: "I-nji bölümi arassala",
      description:
        "Möhüm + gyssagly işleriň içinden şu gün ýerine ýetirilmeli iň möhüm 3 task-y saýla.",
      priority: "high",
    });

    actions.push({
      id: "schedule-important",
      title: "II-nji bölümi öňünden meýilleşdir",
      description:
        "Geljekde gyssagly ýagdaýa düşmez ýaly möhüm, ýöne gyssagly däl işleri öňünden senelere ýerleşdir.",
      priority: "medium",
    });
  }

  if (insightIds.has("low-completion")) {
    actions.push({
      id: "stop-task-overload",
      title: "Täze task sanyny wagtlaýyn azalt",
      description:
        "Häzirki işler tamamlanýança zerur däl täze task-lary goşmagy çäklendir.",
      priority: "medium",
    });

    actions.push({
      id: "complete-one-task",
      title: "Bir esasy işi tamamla",
      description:
        "Şu gün iň möhüm tamamlanmadyk işi saýla we ony doly gutarmagy esasy fokus et.",
      priority: "high",
    });
  }

  if (insightIds.has("deadline-close")) {
    actions.push({
      id: "deadline-review",
      title: "Deadline meýilnamasyny täzeden barla",
      description:
        "Deadline-a galan wagty, gerek serişdäni we aýlyk arassa girdejini deňeşdir.",
      priority: "high",
    });

    actions.push({
      id: "deadline-boost",
      title: "Maliýe depginini güýçlendir",
      description:
        "Deadline-a çenli ýetmek üçin aýlyk ýygnama mukdaryny ýokarlandyrmak mümkinçiligini barla.",
      priority: "high",
    });
  }

  if (insightIds.has("positive-saving")) {
    actions.push({
      id: "keep-saving",
      title: "Ýygnama depginini sakla",
      description:
        "Häzirki arassa girdeji pozitiw. Şol depgini dowam etdirip, girdejiniň belli bölegini maksada gönükdir.",
      priority: "medium",
    });
  }

  if (insightIds.has("good-eisenhower-balance")) {
    actions.push({
      id: "protect-quadrant-two",
      title: "II-nji bölümi gorap sakla",
      description:
        "Ösüş üçin möhüm bolan, ýöne heniz gyssagly däl işlere yzygiderli wagt böl.",
      priority: "low",
    });
  }

  if (insightIds.has("strong-completion")) {
    actions.push({
      id: "maintain-system",
      title: "Häzirki sistemaňy dowam etdir",
      description:
        "Planner completion ýokary. Häzirki iş ritmini bozman, täze prioritetleri ölçegli goş.",
      priority: "low",
    });
  }

  if (insightIds.has("financial-goal-complete")) {
    actions.push({
      id: "shift-to-execution",
      title: "Fokusy ýerine ýetirilişe geçir",
      description:
        "Maliýe maksady tamamlandy. Indi Planner hierarchy-däki aýlyk, hepdelik we günlük execution-a has köp üns ber.",
      priority: "medium",
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: "daily-review",
      title: "Gündelik review et",
      description:
        "Planner, maliýe we maksat maglumatlaryňy täze sakla we günüň ahyrynda ýerine ýetirilen işleri barla.",
      priority: "low",
    });
  }

  const priorityWeight = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return actions
    .sort(
      (a, b) =>
        priorityWeight[b.priority] -
        priorityWeight[a.priority],
    )
    .slice(0, 6);
}