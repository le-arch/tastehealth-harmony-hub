import{s as a}from"./SupabaseClient-C5AFRzKB.js";const y=async r=>{const{data:e,error:t}=await a.from("meal").select("image_url").eq("id",r).single();if(t||!(e!=null&&e.image_url))return console.error("Error fetching meal image_url:",t),null;const{data:o}=a.storage.from("tastehealth-store").getPublicUrl(e.image_url);return(o==null?void 0:o.publicUrl)??null},p=async()=>{const{data:r,error:e}=await a.from("meal_categories").select("*");if(e)throw console.error("Error fetching meal categories:",e),e;return r},b=async()=>{const{data:r,error:e}=await a.from("meal_subcategories").select("*");if(e)throw console.error("Error fetching meal subcategories:",e),e;return r},q=async r=>{let e=a.from("meals").select(`
      *,
      meal_categories(name),
      meal_subcategories(name)
    `);r&&(r.category_id&&(e=e.eq("category_id",r.category_id)),r.subcategory_id&&(e=e.eq("subcategory_id",r.subcategory_id)),r.search&&(e=e.ilike("meal_name",`%${r.search}%`)));const{data:t,error:o}=await e;if(o)throw console.error("Error fetching meals:",o),o;return t.map(i=>{var n,s;return{...i,category_name:(n=i.meal_categories)==null?void 0:n.name,subcategory_name:(s=i.meal_subcategories)==null?void 0:s.name}})},E=async r=>{var m,g;const{data:e,error:t}=await a.from("meals").select(`
      *,
      meal_categories(name),
      meal_subcategories(name)
    `).eq("id",r).single();if(t)throw console.error("Error fetching meal details:",t),t;const o={...e,category_name:(m=e.meal_categories)==null?void 0:m.name,subcategory_name:(g=e.meal_subcategories)==null?void 0:g.name},{data:i,error:n}=await a.from("recipes").select("*").eq("meal_id",r).single();let s=null;if(i&&!n){const{data:l,error:u}=await a.from("recipe_ingredients").select(`
        meal,
        quantity
      `).eq("recipe_id",i.id);u&&console.error("Error fetching recipe ingredients:",u),s={ingredients:(l==null?void 0:l.map(_=>({meal:_.meal||"",quantity:_.quantity})))||[],instructions:i.instructions||""}}const{data:d,error:c}=await a.from("nutrition_facts").select("*").eq("meal_id",r).maybeSingle(),f=d;return c&&c.code!=="PGRST116"&&console.error("Error fetching nutrition facts:",c),{meal:o,recipe:s,nutritionFacts:f||null}};async function M(r){const{data:{user:e}}=await a.auth.getUser();if(!e)throw new Error("Authentication required");const{data:t,error:o}=await a.from("meal_plans").select("*").eq("id",r).single();if(o)throw o;const{data:i,error:n}=await a.from("meal_plan_items").select(`
      id,
      meal_plan_id,
      meal_id,
      day_of_week,
      meal_time,
      meal:meals (
        id,
        meal_name,
        image_url,
        description,
        calories,
        protein,
        carbs,
        fat
      )
    `).eq("meal_plan_id",r);if(n)throw n;return{mealPlan:t,mealPlanItems:i||[]}}async function P(r){const{data:{user:e}}=await a.auth.getUser();if(!e)throw new Error("Authentication required");const{error:t}=await a.from("meal_plan_items").delete().eq("id",r);if(t)throw t;return!0}export{b as a,q as b,y as c,E as d,M as e,p as g,P as r};
