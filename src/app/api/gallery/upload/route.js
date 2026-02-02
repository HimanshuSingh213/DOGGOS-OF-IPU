import { createClient } from '@/lib/supabase/server'

export async function POST(req) {
  try {
    const supabase = await createClient()
    const{
      data: { user },
    } = await supabase.auth.getUser()
    if(!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL){
      return new Response("Unauthorized", { status: 401 })
    }

    const { imageBase64, category, fact } = await req.json();

    if (!imageBase64 || !category) {
      return new Response("Missing data", { status: 400 })
    }

    const fileName = `${Date.now()}.png`

    // 🔹 Convert base64 to buffer
    const base64Data = imageBase64.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")

    /* ================= STORAGE UPLOAD ================= */

    const uploadRes = await supabase.storage
      .from("gallery-images")
      .upload(fileName, buffer, {
        contentType: "image/png",
      })

    if (uploadRes.error) {
      console.error("STORAGE ERROR:", uploadRes.error)
      throw uploadRes.error
    }

    /* ================= PUBLIC URL ================= */

    const { data: publicUrlData } = supabase.storage
      .from("gallery-images")
      .getPublicUrl(fileName)

    /* ================= DB INSERT ================= */

    const insertRes = await supabase.from("gallery").insert([
      {
        image_url: publicUrlData.publicUrl,
        image_path: fileName,
        category,
        fact,
        likes: 0
      }
    ])

    if (insertRes.error) {
      console.error("DB ERROR:", insertRes.error)
      throw insertRes.error
    }

    return Response.json({ success: true })

  } catch (err) {
    console.error("UPLOAD FAILED:", err)
    return new Response("Upload failed", { status: 500 })
  }
}
