import { createClient } from '@/lib/supabase/server'


export async function DELETE(req) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new Response("Unauthorized", { status: 401 })
    }
    const { id, image_path } = await req.json();

    // 1. delete from storage
    await supabase.storage
      .from("gallery-images")
      .remove([image_path]);

    // 2. delete from database
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return new Response("Delete failed", { status: 500 });
  }
}
