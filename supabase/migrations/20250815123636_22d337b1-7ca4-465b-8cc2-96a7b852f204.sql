-- Create enum for progression stages if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'progression_stage') THEN
    CREATE TYPE progression_stage AS ENUM ('goals','game','points','challenges','level','complete');
  END IF;
END $$;

-- Create user_progression table to track the progressive flow
CREATE TABLE IF NOT EXISTS public.user_progression (
  user_id uuid PRIMARY KEY,
  stage progression_stage NOT NULL DEFAULT 'goals',
  completed_goal_wizard boolean NOT NULL DEFAULT false,
  played_nutrition_game boolean NOT NULL DEFAULT false,
  has_points boolean NOT NULL DEFAULT false,
  joined_challenge boolean NOT NULL DEFAULT false,
  viewed_level_benefits boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and add policies
ALTER TABLE public.user_progression ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progression"
ON public.user_progression FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progression"
ON public.user_progression FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progression"
ON public.user_progression FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger helper (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_progression_updated_at ON public.user_progression;
CREATE TRIGGER update_user_progression_updated_at
BEFORE UPDATE ON public.user_progression
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to advance progression in order based on discrete events
CREATE OR REPLACE FUNCTION public.advance_progression(p_user_id uuid, p_event text)
RETURNS public.user_progression
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec public.user_progression;
  new_stage progression_stage;
BEGIN
  -- Ensure row exists
  INSERT INTO public.user_progression (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO rec
  FROM public.user_progression
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Apply event flags
  IF p_event = 'goal_wizard_completed' THEN
    rec.completed_goal_wizard := true;
  ELSIF p_event = 'nutrition_game_played' THEN
    rec.played_nutrition_game := true;
  ELSIF p_event = 'points_earned' THEN
    rec.has_points := true;
  ELSIF p_event = 'challenge_joined' THEN
    rec.joined_challenge := true;
  ELSIF p_event = 'level_viewed' THEN
    rec.viewed_level_benefits := true;
  END IF;

  -- Determine next stage in fixed order
  new_stage := rec.stage;
  IF rec.stage = 'goals' AND rec.completed_goal_wizard THEN
    new_stage := 'game';
  END IF;
  IF new_stage = 'game' AND rec.played_nutrition_game THEN
    new_stage := 'points';
  END IF;
  IF new_stage = 'points' AND rec.has_points THEN
    new_stage := 'challenges';
  END IF;
  IF new_stage = 'challenges' AND rec.joined_challenge THEN
    new_stage := 'level';
  END IF;
  IF new_stage = 'level' AND rec.viewed_level_benefits THEN
    new_stage := 'complete';
  END IF;

  UPDATE public.user_progression
  SET 
    completed_goal_wizard = rec.completed_goal_wizard,
    played_nutrition_game = rec.played_nutrition_game,
    has_points = rec.has_points,
    joined_challenge = rec.joined_challenge,
    viewed_level_benefits = rec.viewed_level_benefits,
    stage = new_stage
  WHERE user_id = p_user_id
  RETURNING * INTO rec;

  RETURN rec;
END;
$$;

-- Auto-advance to 'points' once the user has any points transaction
CREATE OR REPLACE FUNCTION public.on_points_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_progression (user_id, has_points)
  VALUES (NEW.user_id, true)
  ON CONFLICT (user_id) DO UPDATE SET has_points = true, updated_at = NOW();

  PERFORM public.advance_progression(NEW.user_id, 'points_earned');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_points_txn_after_insert ON public.points_transactions;
CREATE TRIGGER trg_points_txn_after_insert
AFTER INSERT ON public.points_transactions
FOR EACH ROW
EXECUTE FUNCTION public.on_points_transaction();