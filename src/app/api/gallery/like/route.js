import { createClient } from '@/lib/supabase/server'


export async function POST(req) {
  try {
    const supabase = await createClient()

    const { id, change } = await req.json();

    // get current likes
    const { data } = await supabase
      .from("gallery")
      .select("likes")
      .eq("id", id)
      .single();

    const newLikes = data.likes + change;

    // update likes
    await supabase
      .from("gallery")
      .update({ likes: newLikes })
      .eq("id", id);

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return new Response("Like failed", { status: 500 });
  }
}
