import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jyjtphsqtfdqrcsjzzoh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5anRwaHNxdGZkcXJjc2p6em9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNzM1MTcsImV4cCI6MjA1OTk0OTUxN30.7Dn27JSl0nHAvxRi-9ElDlHCnXLfCG_cQ7I5l27uiuM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
