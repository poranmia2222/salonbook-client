
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Check ImgBB API key
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      console.error("IMGBB_API_KEY is missing");

      return NextResponse.json(
        { message: "ImgBB API key is not configured" },
        { status: 500 }
      );
    }

    // 2. Get image from request
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    // 3. Validate image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // 4. Validate image size (5 MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image must be smaller than 5 MB" },
        { status: 400 }
      );
    }

    // 5. Prepare ImgBB upload
    const imgbbForm = new FormData();
    imgbbForm.append("image", image);

    // 6. Upload image to ImgBB
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imgbbForm,
      }
    );

    // 7. Read ImgBB response
    const result = await response.json();

    console.log("ImgBB status:", response.status);

    if (!response.ok || !result.success) {
      console.error("ImgBB response error:", result);

      return NextResponse.json(
        {
          message:
            result.error?.message || "ImgBB image upload failed",
        },
        { status: 502 }
      );
    }

    // 8. Return uploaded image URL
    return NextResponse.json({
      success: true,
      imageUrl: result.data.url,
      displayUrl: result.data.display_url,
    });

  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
