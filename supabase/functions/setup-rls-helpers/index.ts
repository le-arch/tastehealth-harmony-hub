
// Follow Deno runtime specifics
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper functions for managing RLS
const CREATE_RLS_HELPERS_SQL = `
-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(p_table text, p_name text) RETURNS boolean AS $$
DECLARE
  policy_count int;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = p_table AND policyname = p_name;
  
  RETURN policy_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enable/disable RLS on a table
CREATE OR REPLACE FUNCTION set_table_rls(table_name text, enable boolean) RETURNS void AS $$
BEGIN
  IF enable THEN
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
  ELSE
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a SELECT policy
CREATE OR REPLACE FUNCTION create_select_policy(p_table text, p_name text, p_check text) RETURNS void AS $$
BEGIN
  EXECUTE format(
    'CREATE POLICY %I ON %I FOR SELECT TO authenticated USING (%s)',
    p_name, p_table, p_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create an INSERT policy
CREATE OR REPLACE FUNCTION create_insert_policy(p_table text, p_name text, p_check text) RETURNS void AS $$
BEGIN
  EXECUTE format(
    'CREATE POLICY %I ON %I FOR INSERT TO authenticated WITH CHECK (%s)',
    p_name, p_table, p_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create an UPDATE policy
CREATE OR REPLACE FUNCTION create_update_policy(p_table text, p_name text, p_check text) RETURNS void AS $$
BEGIN
  EXECUTE format(
    'CREATE POLICY %I ON %I FOR UPDATE TO authenticated USING (%s)',
    p_name, p_table, p_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a DELETE policy
CREATE OR REPLACE FUNCTION create_delete_policy(p_table text, p_name text, p_check text) RETURNS void AS $$
BEGIN
  EXECUTE format(
    'CREATE POLICY %I ON %I FOR DELETE TO authenticated USING (%s)',
    p_name, p_table, p_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function wrapper to create all these functions
CREATE OR REPLACE FUNCTION create_rls_helpers() RETURNS void AS $$
BEGIN
  -- Functions are already created by running this SQL
  RETURN;
END;
$$ LANGUAGE plpgsql;
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with admin privileges
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Create the helper functions
    const { error } = await supabaseClient.rpc('create_query', { query: CREATE_RLS_HELPERS_SQL });
    
    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: "Successfully created RLS helper functions" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
