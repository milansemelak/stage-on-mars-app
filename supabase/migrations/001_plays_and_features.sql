-- Play history (server-side storage)
CREATE TABLE public.plays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT 'personal',
  play_data JSONB NOT NULL,
  timestamp BIGINT NOT NULL,
  favorite BOOLEAN NOT NULL DEFAULT FALSE,
  rx_number TEXT,
  client_name TEXT,
  thread_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plays_user_timestamp ON public.plays(user_id, timestamp DESC);
CREATE UNIQUE INDEX idx_plays_user_ts_dedup ON public.plays(user_id, timestamp);

ALTER TABLE public.plays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own plays" ON public.plays
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plays" ON public.plays
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plays" ON public.plays
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own plays" ON public.plays
  FOR DELETE USING (auth.uid() = user_id);

-- Daily question cache
CREATE TABLE public.daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_date DATE NOT NULL DEFAULT CURRENT_DATE,
  generated_question TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_daily_q_user_date ON public.daily_questions(user_id, question_date);

ALTER TABLE public.daily_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily questions" ON public.daily_questions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily questions" ON public.daily_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Journal synthesis cache
CREATE TABLE public.journal_syntheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  synthesis TEXT NOT NULL,
  play_count INTEGER NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_synthesis_user ON public.journal_syntheses(user_id);

ALTER TABLE public.journal_syntheses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own synthesis" ON public.journal_syntheses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own synthesis" ON public.journal_syntheses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own synthesis" ON public.journal_syntheses
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
