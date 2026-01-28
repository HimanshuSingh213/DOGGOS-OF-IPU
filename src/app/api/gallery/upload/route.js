import { createClient } from '@/lib/supabase/server'

export async function POST(req) {
  try {
    const supabase = await createClient()
    const { imageBase64, category, fact } = await req.json();


    const fileName = `${Date.now()}.png`;

    const base64Data = imageBase64.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const { error } = await supabase.storage
      .from("gallery-images")
      .upload(fileName, buffer, {
        contentType: "image/png",
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("gallery-images")
      .getPublicUrl(fileName);

    await supabase.from("gallery").insert([
      {
        image_url: data.publicUrl,
        image_path: fileName,
        category,
        fact,
        likes: 0
      }
    ]);


    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return new Response("Upload failed", { status: 500 });
  }
}
