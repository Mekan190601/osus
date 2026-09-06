import { supabase } from "./supabase";

export type GoalData = {
  goalId: string;
  mainGoal: string;
  targetMoney: number;
  currentMoney: number;
  deadline: string;

  updatedAt: string;
  deletedAt: string | null;
};

async function getUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "Ulanyjy hasaba girmedik.",
    );
  }

  return user.id;
}

export async function getGoal() {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("user_goals")
    .select(
      `
        goal_id,
        main_goal,
        target_money,
        current_money,
        deadline,
        updated_at,
        deleted_at
      `,
    )
    .eq("user_id", userId)
    .eq("goal_id", "primary-goal")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    goalId: data.goal_id,

    mainGoal:
      data.main_goal ?? "",

    targetMoney:
      Number(data.target_money ?? 0),

    currentMoney:
      Number(data.current_money ?? 0),

    deadline:
      data.deadline ?? "",

    updatedAt:
      data.updated_at ??
      new Date(0).toISOString(),

    deletedAt:
      data.deleted_at ?? null,
  } satisfies GoalData;
}

export async function saveGoal(
  goal: GoalData,
) {
  const userId = await getUserId();

  const { error } = await supabase
    .from("user_goals")
    .upsert(
      {
        user_id: userId,

        goal_id: goal.goalId,

        main_goal:
          goal.mainGoal.trim(),

        target_money:
          Math.max(
            0,
            goal.targetMoney,
          ),

        current_money:
          Math.max(
            0,
            goal.currentMoney,
          ),

        deadline:
          goal.deadline || null,

        updated_at:
          goal.updatedAt,

        deleted_at:
          goal.deletedAt,
      },
      {
        onConflict:
          "user_id,goal_id",
      },
    );

  if (error) {
    throw error;
  }
}

export async function deleteGoal(
  updatedAt: string,
) {
  const userId = await getUserId();

  const { error } = await supabase
    .from("user_goals")
    .update({
      deleted_at: updatedAt,
      updated_at: updatedAt,
    })
    .eq("user_id", userId)
    .eq(
      "goal_id",
      "primary-goal",
    );

  if (error) {
    throw error;
  }
}