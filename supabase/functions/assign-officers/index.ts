import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { areaId, crowdDensity, estimatedCount, areaName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Call Lovable AI to determine officer requirements
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant for crowd safety management. Analyze crowd data and recommend the optimal number of police officers needed. Respond with a JSON object containing: officers_required (number), priority (critical/high/medium/low), and reasoning (brief explanation).'
          },
          {
            role: 'user',
            content: `Analyze this crowd situation and recommend officer deployment:
Location: ${areaName}
Crowd Density: ${crowdDensity}%
Estimated Count: ${estimatedCount} people

Consider:
- Higher density requires more officers
- Larger crowds need more supervision
- Critical situations (>80% density or >500 people) need immediate response`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', await aiResponse.text());
      throw new Error('Failed to get AI recommendation');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse AI response
    let recommendation;
    try {
      // Extract JSON from response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      // Fallback to rule-based system
      recommendation = {
        officers_required: Math.ceil(estimatedCount / 100),
        priority: crowdDensity > 80 ? 'critical' : crowdDensity > 60 ? 'high' : 'medium',
        reasoning: 'Fallback calculation: 1 officer per 100 people'
      };
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create assignment record
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .insert({
        area_id: areaId,
        officers_required: recommendation.officers_required,
        officers_assigned: 0,
        ai_reasoning: recommendation.reasoning,
        assignment_priority: recommendation.priority,
        status: 'pending'
      })
      .select()
      .single();

    if (assignmentError) {
      throw assignmentError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        assignment,
        recommendation 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in assign-officers function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
