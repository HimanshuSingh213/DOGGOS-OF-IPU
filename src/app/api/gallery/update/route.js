import { createClient } from '@/lib/supabase/server'

export async function PUT(req) {
  try {
    const supabase = await createClient()
    const { id, category, fact } = await req.json();

    const { error } = await supabase
      .from("gallery")
      .update({ category, fact })
      .eq("id", id);

    if (error) throw error;

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return new Response("Update failed", { status: 500 });
  }
}
