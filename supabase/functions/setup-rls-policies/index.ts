
// Follow Deno runtime specifics
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Tables that need RLS policies
const healthTables = [
  'bmi_records',
  'calorie_records',
  'sleep_records',
  'exercise_records',
  'water_intake_records',
  'daily_progress'
];

async function setupRlsPolicies(supabase: any) {
  try {
    console.log("Setting up RLS policies for health-related tables");
    
    for (const table of healthTables) {
      // Enable RLS on the table
      await supabase.rpc('set_table_rls', { table_name: table, enable: true });
      console.log(`Enabled RLS on table: ${table}`);
      
      // Create SELECT policy
      const selectPolicyExists = await supabase.rpc('policy_exists', { 
        p_table: table,
        p_name: `Users can view their own ${table}`
      });
      
      if (!selectPolicyExists) {
        await supabase.rpc('create_select_policy', {
          p_table: table,
          p_name: `Users can view their own ${table}`,
          p_check: 'auth.uid() = user_id'
        });
        console.log(`Created SELECT policy for ${table}`);
      }
      
      // Create INSERT policy
      const insertPolicyExists = await supabase.rpc('policy_exists', {
        p_table: table,
        p_name: `Users can insert their own ${table}`
      });
      
      if (!insertPolicyExists) {
        await supabase.rpc('create_insert_policy', {
          p_table: table,
          p_name: `Users can insert their own ${table}`,
          p_check: 'auth.uid() = user_id'
        });
        console.log(`Created INSERT policy for ${table}`);
      }
      
      // Create UPDATE policy
      const updatePolicyExists = await supabase.rpc('policy_exists', {
        p_table: table,
        p_name: `Users can update their own ${table}`
      });
      
      if (!updatePolicyExists) {
        await supabase.rpc('create_update_policy', {
          p_table: table,
          p_name: `Users can update their own ${table}`,
          p_check: 'auth.uid() = user_id'
        });
        console.log(`Created UPDATE policy for ${table}`);
      }
      
      // Create DELETE policy
      const deletePolicyExists = await supabase.rpc('policy_exists', {
        p_table: table,
        p_name: `Users can delete their own ${table}`
      });
      
      if (!deletePolicyExists) {
        await supabase.rpc('create_delete_policy', {
          p_table: table,
          p_name: `Users can delete their own ${table}`,
          p_check: 'auth.uid() = user_id'
        });
        console.log(`Created DELETE policy for ${table}`);
      }
    }
    
    // Create public READ policies for meals, meal_categories, meal_subcategories
    const publicReadTables = ['meals', 'meal_categories', 'meal_subcategories', 'nutrition_facts', 'recipes', 'ingredients'];
    
    for (const table of publicReadTables) {
      // Enable RLS on the table
      await supabase.rpc('set_table_rls', { table_name: table, enable: true });
      console.log(`Enabled RLS on table: ${table}`);
      
      // Create public SELECT policy
      const selectPolicyExists = await supabase.rpc('policy_exists', { 
        p_table: table, 
        p_name: `Allow public read access for ${table}` 
      });
      
      if (!selectPolicyExists) {
        await supabase.rpc('create_select_policy', {
          p_table: table,
          p_name: `Allow public read access for ${table}`,
          p_check: 'true'  // Allow all users to read
        });
        console.log(`Created public SELECT policy for ${table}`);
      }
    }
    
    // Create RLS policies for meal_plans
    await supabase.rpc('set_table_rls', { table_name: 'meal_plans', enable: true });
    
    // SELECT policy for meal_plans
    const selectMealPlansExists = await supabase.rpc('policy_exists', { 
      p_table: 'meal_plans', 
      p_name: `Users can view their own meal_plans`
    });
    
    if (!selectMealPlansExists) {
      await supabase.rpc('create_select_policy', {
        p_table: 'meal_plans',
        p_name: `Users can view their own meal_plans`,
        p_check: 'auth.uid() = user_id'
      });
    }
    
    // INSERT policy for meal_plans
    const insertMealPlansExists = await supabase.rpc('policy_exists', {
      p_table: 'meal_plans',
      p_name: `Users can insert their own meal_plans`
    });
    
    if (!insertMealPlansExists) {
      await supabase.rpc('create_insert_policy', {
        p_table: 'meal_plans',
        p_name: `Users can insert their own meal_plans`,
        p_check: 'auth.uid() = user_id'
      });
    }
    
    // UPDATE and DELETE policies for meal_plans
    const updateMealPlansExists = await supabase.rpc('policy_exists', {
      p_table: 'meal_plans',
      p_name: `Users can update their own meal_plans`
    });
    
    if (!updateMealPlansExists) {
      await supabase.rpc('create_update_policy', {
        p_table: 'meal_plans',
        p_name: `Users can update their own meal_plans`,
        p_check: 'auth.uid() = user_id'
      });
    }
    
    const deleteMealPlansExists = await supabase.rpc('policy_exists', {
      p_table: 'meal_plans',
      p_name: `Users can delete their own meal_plans`
    });
    
    if (!deleteMealPlansExists) {
      await supabase.rpc('create_delete_policy', {
        p_table: 'meal_plans',
        p_name: `Users can delete their own meal_plans`,
        p_check: 'auth.uid() = user_id'
      });
    }
    
    // Create RLS policies for meal_plan_items
    await supabase.rpc('set_table_rls', { table_name: 'meal_plan_items', enable: true });
    
    // SELECT policy for meal_plan_items
    const selectMealPlanItemsExists = await supabase.rpc('policy_exists', { 
      p_table: 'meal_plan_items', 
      p_name: `Users can view their own meal_plan_items`
    });
    
    if (!selectMealPlanItemsExists) {
      await supabase.rpc('create_select_policy', {
        p_table: 'meal_plan_items',
        p_name: `Users can view their own meal_plan_items`,
        p_check: 'auth.uid() = (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)'
      });
    }
    
    // INSERT policy for meal_plan_items
    const insertMealPlanItemsExists = await supabase.rpc('policy_exists', {
      p_table: 'meal_plan_items',
      p_name: `Users can insert their own meal_plan_items`
    });
    
    if (!insertMealPlanItemsExists) {
      await supabase.rpc('create_insert_policy', {
        p_table: 'meal_plan_items',
        p_name: `Users can insert their own meal_plan_items`,
        p_check: 'auth.uid() = (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)'
      });
    }
    
    // UPDATE and DELETE policies for meal_plan_items
    const updateMealPlanItemsExists = await supabase.rpc('policy_exists', {
      p_table: 'meal_plan_items',
      p_name: `Users can update their own meal_plan_items`
    });
    
    if (!updateMealPlanItemsExists) {
      await supabase.rpc('create_update_policy', {
        p_table: 'meal_plan_items',
        p_name: `Users can update their own meal_plan_items`,
        p_check: 'auth.uid() = (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)'
      });
    }
    
    const deleteMealPlanItemsExists = await supabase.rpc('policy_exists', {
      p_table: 'meal_plan_items',
      p_name: `Users can delete their own meal_plan_items`
    });
    
    if (!deleteMealPlanItemsExists) {
      await supabase.rpc('create_delete_policy', {
        p_table: 'meal_plan_items',
        p_name: `Users can delete their own meal_plan_items`,
        p_check: 'auth.uid() = (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)'
      });
    }
    
    return { success: true, message: "Successfully set up RLS policies" };
  } catch (error) {
    console.error("Error setting up RLS policies:", error);
    return { success: false, error: error.message };
  }
}

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
    
    // First create helper functions for RLS
    await supabaseClient.rpc('create_rls_helpers');
    
    // Execute the setup function
    const result = await setupRlsPolicies(supabaseClient);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
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
